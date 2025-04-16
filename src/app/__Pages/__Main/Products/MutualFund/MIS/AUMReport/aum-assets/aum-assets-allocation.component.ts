import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { IAumFooterModel } from '../component/aum.model';
import { global } from 'src/app/__Utility/globalFunc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-aum-assets-allocation',
  templateUrl: './aum-assets-allocation.component.html',
  styleUrls: ['./aum-assets-allocation.component.css']
})
export class AumAssetsAllocationComponent implements OnInit {

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  __formDate:string;


    md_aum_assets_allocation = [];
  
    aum_assets_allocation_Column:column[] = AumAssetsAllocationColumn.column;
  
    aum_assets_allocation_sub_column:column[] = AumAssetsAllocationColumn.sub_column;
  
    /*** Table Footer Details */
    footerDT:Partial<IAumFooterModel>;
    /*** End */

  ngOnInit(): void {}



  getFormData = (ev) => {

     /***** FOR REAL WORLD  */
          this.footerDT = null;
          this.md_aum_assets_allocation = [];
          let originalDt = []; 
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
          this.dbIntr.api_call(1,'/clients/aumFundHouse',formdata)
          .pipe(pluck('data')).subscribe((res:any) =>{
            const total_aum = res.filter((el:any) => Number(el.curr_aum) > 0).map((ele:any) =>  Number(ele.curr_aum)).reduce((totSum, a) => totSum + a, 0)
              let originalDt = [];
              const groupByAMC = this.groupBy(res, 'subcat_name');
              Object.keys(groupByAMC).forEach((key,index) =>{
                      /***** CALUCLATION OF UPPER TABLE */
                          const totInvCost = groupByAMC[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                          const totIdcwPaid = groupByAMC[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                          const totIdcwReinv = groupByAMC[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                          const totAUM = groupByAMC[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                          // const totAbsRtn = groupByAMC[key].map(el => Number(el.abs_rtn)).reduce((totSum, a) => totSum + a, 0);
                          const totGainLoss = groupByAMC[key].map(el => Number(el.gain_loss)).reduce((totSum, a) => totSum + a, 0);
                          const totAbsRtn = Number(totInvCost) > 0 ? ((totGainLoss / totInvCost) * 100)?.toFixed(2) : 0;
                          const tot_contri_to_aum = (totAUM / total_aum) * 100;
                      /****** END */
                      console.log(totAbsRtn);
                      /**** DISPLAY AMOUNT CATEGORY WISE */
                        originalDt.push({
                          cat_name:groupByAMC[key][0].cat_name,
                          inv_cost:totInvCost,
                          Investment:totInvCost,
                          subcat_name:groupByAMC[key][0].subcat_name,
                          gain_loss:totGainLoss,
                          idcw_paid:totIdcwPaid,
                          IDCWP:totIdcwPaid,
                          idcw_reinv:totIdcwReinv,
                          "IDCW Reinv.":totIdcwReinv,
                          curr_aum:totAUM,
                          AUM:totAUM,
                          ret_abs:totAbsRtn,
                          "Abs. Return":totAbsRtn,
                          amc_weightage_in:0,
                          // schemes:groupByAMC[key],
                          schemes:groupByAMC[key].map(el => {
                            const encryptedTxt = this.utility.EncryptText(JSON.stringify({date:this.__formDate,pCode:el?.product_code}));
                            return {...el,routeUrl: encryptedTxt}
                          }),
                          contri_to_aum:tot_contri_to_aum.toFixed(2),
                          "Contri. To AUM":tot_contri_to_aum.toFixed(2),
                          total:{
                            inv_cost:totInvCost,
                            idcw_paid:totIdcwPaid,
                            idcw_reinv:totIdcwReinv,
                            curr_aum:totAUM,
                            abs_rtn:totAbsRtn,
                            scheme_name:"TOTAL"
                          }
                        })
                      /**** END */
              })  
              this.md_aum_assets_allocation = originalDt
              this.createParentFooter(originalDt);
          })

  }

  createParentFooter = (value) =>{
    const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
    const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
    // console.log((tot_gain_loss / tot_inv_cost) * 100);
    const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
    console.log(tot_ret_abs)
    let obj = {}
    const dt = value.map(({total,schemes,cat_name,amc_weightage_in,amc_name,amc_code,inv_cost,idcw_paid,idcw_reinv,gain_loss,
      curr_aum,ret_abs,subcat_name,contri_to_aum,...rest}) => {return {...rest}})
    for(let object of dt) {Object.assign(obj, object)}
    Object.keys(obj).forEach(el =>{
      // console.log( el + ":" + obj[el])
      this.footerDT = {
        ...this.footerDT,
        [el]:el == "Abs. Return" ? tot_ret_abs.toFixed(2) : el == 'Contri. To AUM' ? '100%' :  global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)),
      }
    })
    console.log(this.footerDT);
  }
  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

}

export class AumAssetsAllocationColumn{
  public static column:column[] = [
    {
      field:'subcat_name',
      header:'Asset Class',
      width:'24rem'
    },
    {
      field:'cat_name',
      header:'Asset Type',
      width:'10rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:'8rem'
    },
    {
      field:'idcw_paid',
      header:'IDCWP',
      width:'8rem'
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
      width:'6rem'
    },
    {
      field:'contri_to_aum',
      header:'Contri. To AUM',
      width:'8rem'
    }
  ];

  public static sub_column:column[]=[
    {
      field:'scheme_name',
      header:'Scheme',
      width:'28rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:'8rem'
    },
    {
      field:'idcw_paid',
      header:'IDCWP',
      width:'8rem'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'10rem'
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:'6rem'
    },
    {
      field:'abs_rtn',
      header:'Abs. Return',
      width:'6rem'
    }
  ];
}
