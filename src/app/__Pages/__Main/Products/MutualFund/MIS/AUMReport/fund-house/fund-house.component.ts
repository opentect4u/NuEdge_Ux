import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { AUTMTYPE } from '../component/aum-filter/aum-filter.component';
import { category } from 'src/app/__Model/__category';
import { IAumFooterModel } from '../component/aum.model';
import { global } from 'src/app/__Utility/globalFunc';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund-house',
  templateUrl: './fund-house.component.html',
  styleUrls: ['./fund-house.component.css']
})
export class FundHouseComponent implements OnInit {

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,
    private routeData: ActivatedRoute) { }

  md_fundHouse = [];

  fund_House_Column:column[] = FundHouseColumn.column;

  fund_house_sub_column:column[] = FundHouseColumn.sub_column;

  aum_type:'Fund House' = AUTMTYPE['Fund House'];

  __formDate:string;

  hasParams:boolean | undefined = true;

  
  /*** Table Footer Details */
    footerDT:Partial<IAumFooterModel>;
  /*** End */

  md_category:category[] = [];

  ngOnInit(): void {
      this.getCategory();
      this.routeData.queryParams.subscribe(res =>{
        console.log(res)
        if(res && Object.keys(res).length > 0){
          const rnt_id = this.utility.DcryptText(res?.rnt_id);
          const date = this.utility.DcryptText(res?.date);
          this.getFundHoseByQueryParameter(rnt_id,date);
        }
        this.hasParams  = res && Object.keys(res).length > 0 ? true : false;
      })
  }

  getFundHoseByQueryParameter = (rnt_id,date) =>{
    this.footerDT = null;
    this.md_fundHouse = [];
    this.__formDate = date;
    var formdata = new FormData();
    formdata.append('rnt_id',rnt_id.toString());
    formdata.append('date',date);
    this.populateFuncHouse(formdata)
  }


  getCategory = () =>{
      this.dbIntr.api_call(0,'/category',null)
      .pipe(pluck('data'))
      .subscribe((res:category[]) =>{
            this.md_category = res;
            const catColumn = res.map(el => {return {field:el.cat_name,header:el.cat_name,width:''}})
            this.fund_House_Column = [...this.fund_House_Column,...catColumn.sort((a,b) => a.field.localeCompare(b.field))]
      })
  }

   populateFuncHouse = (formdata) =>{
    let originalDt = []; 

    this.dbIntr.api_call(1,'/clients/aumFundHouse',formdata).pipe(pluck('data')).subscribe((res:any) =>{
      const groupByAMC = this.groupBy(res.filter(el => Number(el.inv_cost) > 0), 'amc_code');
      Object.keys(groupByAMC).forEach((key,index) =>{
              /***** CALUCLATION OF UPPER TABLE */
                  const totInvCost = groupByAMC[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                  const totIdcwPaid = groupByAMC[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                  const totIdcwReinv = groupByAMC[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                  const totAUM = groupByAMC[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                  const totGainLoss = groupByAMC[key].map(el => Number(el.gain_loss)).reduce((totSum, a) => totSum + a, 0);
                  const totAbsRtn = (totGainLoss / totInvCost)*100;
                  console.log(groupByAMC[key].map(el => Number(el.curr_aum)))
                  console.log(totAUM);
              /****** END */
              /**** DISPLAY AMOUNT CATEGORY WISE */
                let categories = this.md_category.map((el:category) => el.cat_name);
                let mdCategoryKeys = null;
                let groupByCategory = this.groupBy(groupByAMC[key], 'cat_name');
                categories.forEach((catKeys) =>{
                  const totCategoryWiseAUM = groupByCategory[catKeys]?.map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0)
                  mdCategoryKeys = {
                    ...mdCategoryKeys,
                    [catKeys]: catKeys in groupByCategory ? totCategoryWiseAUM : 0
                  }
                })
                originalDt.push({
                  amc_name:groupByAMC[key][0].amc_name,
                  amc_code:groupByAMC[key][0].amc_code,
                  cat_name:groupByAMC[key][0].cat_name,
                  inv_cost:totInvCost,
                  Investment:totInvCost,
                  gain_loss:totGainLoss,
                  idcw_paid:totIdcwPaid,
                  IDCWP:totIdcwPaid,
                  idcw_reinv:totIdcwReinv,
                  "IDCW Reinv.":totIdcwReinv,
                  curr_aum:totAUM,
                  AUM:totAUM,
                  ret_abs:totAbsRtn.toFixed(2),
                  "Abs. Return":totAbsRtn.toFixed(2),
                  amc_weightage_in:0,
                  ...mdCategoryKeys,
                  schemes:groupByAMC[key].map(el => {
                    const encryptedTxt = this.utility.EncryptText(JSON.stringify({date:this.__formDate,pCode:el?.product_code}));
                    return {...el,routeUrl: encryptedTxt}
                  }),
                  total:{
                    inv_cost:totInvCost,
                    idcw_paid:totIdcwPaid,
                    curr_aum:totAUM,
                    abs_rtn:totAbsRtn.toFixed(2),
                    scheme_name:"TOTAL"
                  }
                })
              /**** END */
      })

      this.md_fundHouse = originalDt.sort((a, b) => a.amc_name.localeCompare(b.amc_name));
      this.createParentFooter(originalDt);
    })
   }

  getFormData =(ev) =>{
      /***** FOR REAL WORLD  */
      this.footerDT = null;
      this.md_fundHouse = [];
      this.__formDate = ev.date;
      // console.log()
      var formdata = new FormData();
      for(let key in ev){
        if(Array.isArray(ev[key])){
          formdata.append(key,JSON.stringify(ev[key]))
        }
        else{
          formdata.append(key,ev[key])
        }
      }
    
      this.populateFuncHouse(formdata)
      /***** END */
  }

  createParentFooter = (value) =>{
      const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
      const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
      // console.log((tot_gain_loss / tot_inv_cost) * 100);
      const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
      let obj = {}
      const dt = value.map(({total,schemes,cat_name,amc_weightage_in,amc_name,amc_code,inv_cost,idcw_paid,idcw_reinv,curr_aum,ret_abs,gain_loss,...rest}) => {return {...rest}})
      for(let object of dt) {Object.assign(obj, object)}
      Object.keys(obj).forEach(el =>{
        console.log(el);
        this.footerDT = {
          ...this.footerDT,
          [el]:el == 'Abs. Return' ? tot_ret_abs.toFixed(2) : global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)).toFixed(2),
        }
      })

  }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

}

export class FundHouseColumn{
  public static column:column[] = [
    {
      field:'amc_name',
      header:'AMC Name',
      width:'18rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:'10rem'
    },
    {
      field:'idcw_paid',
      header:'IDCW',
      width:'5rem'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'6rem'
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:'10rem'
    },
    {
      field:'ret_abs',
      header:'Abs. Return',
      width:'8rem'
    },
    {
      field:'amc_weightage',
      header:'AMC Weightage in (%)',
      width:'6rem'
    },
    // {
    //   field:'equity',
    //   header:'Equity',
    //   width:''
    // },
    // {
    //   field:'debt',
    //   header:'Debt',
    //   width:''
    // },
    // {
    //   field:'hybrid',
    //   header:'Hybrid',
    //   width:''
    // },
    // {
    //   field:'sol_oriented',
    //   header:'Sol Oriented',
    //   width:''
    // },
    // {
    //   field:'others',
    //   header:'Others',
    //   width:''
    // },
  ]

  public static sub_column:column[] = [
    {
      field:'scheme_name',
      header:'Scheme',
      width:'36rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:''
    },
    {
      field:'idcw_paid',
      header:'IDCWP',
      width:''
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:''
    },
    {
      field:'abs_rtn',
      header:'Abs. Return',
      width:''
    }
  ]
}
