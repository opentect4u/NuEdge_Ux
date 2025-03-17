import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { IAumFooterModel } from '../component/aum.model';
import { global } from 'src/app/__Utility/globalFunc';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-aum-client',
  templateUrl: './aum-client.component.html',
  styleUrls: ['./aum-client.component.css']
})
export class AumClientComponent implements OnInit {

  constructor(private dbIntr:DbIntrService,
    private routeData: ActivatedRoute,
    private utility:UtiliService,
    private router:Router
  ) { }

  md_aum_client = [];

  hasParams:boolean | undefined = true;

  __formDate:string;

  aum_client_Column:column[] = AumClientColumn.column;

  aum_client_sub_column:column[] = AumClientColumn.sub_column;

  /*** Table Footer Details */
  footerDT:Partial<IAumFooterModel>;
  /*** End */

  ngOnInit(): void {
    this.routeData.queryParams.subscribe(res =>{
      console.log(res)
      if(res && Object.keys(res).length > 0){
        const family_head_id = this.utility.DcryptText(res?.q);
        const date = this.utility.DcryptText(res?.v);
        this.getFundHoseByQueryParameter(family_head_id,date);
        if(!family_head_id || !date){
              this.router.navigate(['not-found'])
        }
      }
      this.hasParams  = res && Object.keys(res).length > 0 ? true : false;
    })
  }

  getFundHoseByQueryParameter = (family_head_id,date) =>{
    this.footerDT = null;
    // this.md_fundHouse = [];
    this.__formDate = date;
    var formdata = new FormData();
    formdata.append('family_head_id',family_head_id.toString());
    formdata.append('date',date);
    // this.populateFuncHouse(formdata)
    this.populateDataByFamilyHeadIdInParams(formdata);

  }

  getFormData = (ev) => {
        this.footerDT = null;
        this.md_aum_client = [];
        let originalDt = []; 
        this.__formDate = ev.date;
        var formdata = new FormData();
        for(let key in ev){
          if(Array.isArray(ev[key])){
            formdata.append(key,JSON.stringify(ev[key]))
          }
          else{
            formdata.append(key,ev[key])
          }
        }
        this.populateDataByFamilyHeadIdInParams(formdata);
        // this.dbIntr.api_call(1,'/clients/aumClient',formdata)
        // .pipe(pluck('data')).subscribe((res:any) =>{
        //   let obj = {};
        //   const groupByClientPan =  this.groupBy(res.filter(el => !el.first_client_pan), 'first_client_pan');
        //   const groupByClientName =  this.groupBy(res.filter(el => el.first_client_pan), 'first_client_name');
        //   Object.keys(groupByClientPan).forEach(el =>{
        //     obj =  this.groupBy(groupByClientPan[el], 'first_client_name');
        //   })
        //   const mergedObj = Object.assign({}, groupByClientName, obj);
        //   this.md_aum_client = this.populateDt(mergedObj);
        //   this.createParentFooter(this.md_aum_client);
        // })
  }

  populateDataByFamilyHeadIdInParams = (formdata) =>{
    this.dbIntr.api_call(1,'/clients/aumClient',formdata)
    .pipe(pluck('data')).subscribe((res:any) =>{
      // console.log(res[0]);
      let obj = {};
      const groupByClientPan =  this.groupBy(res.filter(el => !el.first_client_pan), 'first_client_pan');
      const groupByClientName =  this.groupBy(res.filter(el => el.first_client_pan), 'first_client_name');
      Object.keys(groupByClientPan).forEach(el =>{
        obj =  this.groupBy(groupByClientPan[el], 'first_client_name');
      })
      const mergedObj = Object.assign({}, groupByClientName, obj);
      this.md_aum_client = this.populateDt(mergedObj);
      this.createParentFooter(this.md_aum_client);
    })
  }

  populateDt = (grpObj) =>{
        let dt = [];
        Object.keys(grpObj).forEach((el:any) =>{
              // console.log(grpObj[el]);
              // console.log(`*******${el}********`);
              // console.log(grpObj[el].all_amount_arr);
              // console.log(JSON.parse(grpObj[el].all_date_arr));
              
              const inv_cost = global.Total__Count(grpObj[el],(x:any) => x?.total_inv_cost ? Number(x?.total_inv_cost) : 0);
              const idcw_paid = global.Total__Count(grpObj[el],(x:any) => x?.idcw_paid ? Number(x?.idcw_paid) : 0);
              const idcw_reinv = global.Total__Count(grpObj[el],(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0);
              const curr_aum = global.Total__Count(grpObj[el],(x:any) => x?.curr_aum ? Number(x?.curr_aum) : 0);
              const totGainLoss = global.Total__Count(grpObj[el],(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
              const tot_ret_abs = Number(inv_cost) > 0 ? ((totGainLoss / inv_cost) * 100)?.toFixed(2) : 0;
              const xirr = 0;
              dt.push({
                    id:grpObj[el][0]?.id,
                   client_name:el,
                   pan:grpObj[el].length > 0 ? grpObj[el][0].first_client_pan : '',
                   inv_cost:inv_cost,
                   idcw_paid:idcw_paid,
                   idcw_reinv:idcw_reinv,
                   curr_aum:curr_aum,
                   gain_loss:totGainLoss,
                   Investment:inv_cost,
                   AUM:curr_aum,
                   "IDCW Reinv.":idcw_reinv,
                   "IDCWP":idcw_paid,
                   "Abs. Return":tot_ret_abs,
                   xirr:xirr,
                    ret_abs:tot_ret_abs,
                    schemes:grpObj[el].map(el => {
                      const encryptedTxt = this.utility.EncryptText(JSON.stringify({date:this.__formDate,pCode:el?.product_code}));
                      const xirr_amt_arr = [...el.all_amount_arr,Number(el.curr_nav)];
                      const xirr_date_arr = [...JSON.parse(el.all_amount_arr),Number(el.curr_nav)];
                      const xirr = global.XIRR(xirr_amt_arr,xirr_date_arr,0);
                      el.xirr = xirr;
                      return {...el,routeUrl: encryptedTxt}
                    }),
                    total:{
                      inv_cost:inv_cost,
                      idcw_paid:idcw_paid,
                      idcw_reinv:idcw_paid,
                      curr_aum:curr_aum,
                      abs_rtn:tot_ret_abs,
                      scheme_name:"TOTAL",
                      xirr:0
                    }
              })
        });
        console.log(dt[0]);
        return dt.sort((a, b) => a.client_name.localeCompare(b.client_name));
  }



  groupByMultipleProps = (res) =>{
    const groupedData = res.reduce((acc, item) => {
        console.log(acc)
      // Check if the category exists in the accumulator
      const skuPAN = item.first_client_pan || "NO_PAN";
      if (!acc[skuPAN]) {
        acc[skuPAN] = {};
      }
      
      // Check if the type exists in the specific category
      if (!acc[skuPAN][item.first_client_pan]) {
        // acc[item.first_client_pan][item.first_client_name] = [];
        acc[skuPAN][item.first_client_name] = []
      }
      // Add the item to the corresponding group
      acc[skuPAN][item.first_client_name].push(item);
      
      return acc;
    }, {});
    return groupedData;
  }

  createParentFooter = (value) =>{
    const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
    const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
    // console.log((tot_gain_loss / tot_inv_cost) * 100);
    const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
    let obj = {}
    const dt = value.map(({id,total,schemes,cat_name,amc_weightage_in,amc_name,gain_loss,amc_code,inv_cost,idcw_paid,idcw_reinv,
      curr_aum,ret_abs,client_code,client_name,pan,...rest}) => {return {...rest}})
    for(let object of dt) {Object.assign(obj, object)}
    Object.keys(obj).forEach(el =>{
      this.footerDT = {
        ...this.footerDT,
        [el]:el == 'Abs. Return' ? tot_ret_abs.toFixed(2) : global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)).toFixed(2),
      }
    })
    console.log(  this.footerDT )
  }
  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key] || 'NO_PAN'] = rv[x[key]  || 'NO_PAN'] || []).push(x);
      return rv;
    }, {});
  };
}




export class AumClientColumn{
  public static column:column[] = [
    {
      field:'client_name',
      header:'Client',
      width:'24rem'
    },
    {
      field:'pan',
      header:'PAN',
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
      width:'10rem'
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:'6rem'
    },
    {
      field:'ret_abs',
      header:'Abs. Return',
      width:'6rem'
    },
    {
      field:'xirr',
      header:'XIRR(%)',
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
      field:'folio_no',
      header:'Folio',
      width:'8rem'
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
    },
    {
      field:'xirr',
      header:'XIRR(%)',
      width:'8rem'
    }
  ];
}