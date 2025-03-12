import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { IAumFooterModel } from '../component/aum.model';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-aum-family',
  templateUrl: './aum-family.component.html',
  styleUrls: ['./aum-family.component.css']
})
export class AumFamilyComponent implements OnInit {

  constructor(private dbIntr:DbIntrService) { }

  md_aum_client = [];

  __formDate:string;

  aum_client_Column:column[] = AumFamilyColumn.column;

  /*** Table Footer Details */
  footerDT:Partial<IAumFooterModel>;
  /*** End */

  ngOnInit(): void {}

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
        this.dbIntr.api_call(1,'/clients/aumFamily',formdata)
        .pipe(pluck('data')).subscribe((res:any) =>{
          let obj = {};
            const groupByFamily =  this.groupBy(res.filter(el => el.family_head_group_id), 'family_head_group_id');
            console.log(groupByFamily);
            this.md_aum_client = this.populateDt(groupByFamily);
            this.createParentFooter(this.md_aum_client)
        })
  }

  populateDt = (grpObj) =>{
        let dt = [];
        Object.keys(grpObj).forEach(el =>{
              // console.log(`*******${el}********`);
              const inv_cost = global.Total__Count(grpObj[el],(x:any) => x?.total_inv_cost ? Number(x?.total_inv_cost) : 0);
              const idcw_paid = global.Total__Count(grpObj[el],(x:any) => x?.idcw_paid ? Number(x?.idcw_paid) : 0);
              const idcw_reinv = global.Total__Count(grpObj[el],(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0);
              const curr_aum = global.Total__Count(grpObj[el],(x:any) => x?.curr_aum ? Number(x?.curr_aum) : 0);
              const totGainLoss = global.Total__Count(grpObj[el],(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
              const tot_ret_abs = Number(inv_cost) > 0 ? ((totGainLoss / inv_cost) * 100)?.toFixed(2) : 0;
              const xirr = 0;
              const family_head_name = grpObj[el].filter(el => el.family_head_type == 'H');
              dt.push({
                    id:grpObj[el][0]?.id,
                   family_head_name:family_head_name.length > 0 ? `${family_head_name[0]?.first_client_name} [${family_head_name[0]?.first_client_pan}]` : '',
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
                    schemes:grpObj[el],
                    total:{
                      inv_cost:inv_cost,
                      idcw_paid:idcw_paid,
                      idcw_reinv:idcw_paid,
                      curr_aum:curr_aum,
                      abs_rtn:tot_ret_abs,
                      family_head_name:"TOTAL",
                      xirr:0
                    }
              })
        });
        // console.log(dt);
        return dt.sort((a, b) => a.family_head_name.localeCompare(b.family_head_name));
  }


  createParentFooter = (value) =>{
    const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
    const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
    // console.log((tot_gain_loss / tot_inv_cost) * 100);
    const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
    let obj = {}
    const dt = value.map(({id,total,schemes,cat_name,amc_weightage_in,amc_name,gain_loss,amc_code,inv_cost,idcw_paid,idcw_reinv,family_head_name,broker_name,
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




export class AumFamilyColumn{
  public static column:column[] = [
    {
      field:'family_head_name',
      header:'Family Head / Individual',
      width:'24rem'
    },
    {
      field:'broker_name',
      header:'Broker Name',
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
      field:'ret_abs',
      header:'Abs. Return',
      width:'6rem'
    }
  ];
}