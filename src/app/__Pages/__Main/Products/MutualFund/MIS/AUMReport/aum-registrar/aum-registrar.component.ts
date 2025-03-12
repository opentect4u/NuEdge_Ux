import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { AUTMTYPE } from '../component/aum-filter/aum-filter.component';
import { IAumFooterModel } from '../component/aum.model';
import { global } from 'src/app/__Utility/globalFunc';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-aum-registrar',
  templateUrl: './aum-registrar.component.html',
  styleUrls: ['./aum-registrar.component.css']
})
export class AumRegistrarComponent implements OnInit {


  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  aum_registrar_Column:column[] = AumRegistrarColumn.column;
  md_aum_registrar = [];
  aum_type:'Registrar' = AUTMTYPE['Registrar'];
  __formDate:string;

  /*** Table Footer Details */
    footerDT:Partial<IAumFooterModel>;
  /*** End */

  ngOnInit(): void {
  }

  getFormData =(ev) =>{
    // this.md_aum_scheme = ev;
  //  const dt = [
  //     {
  //       "registrar_name":"KARVY",
  //       "amc_name": "Bajaj Finserv Mutual Fund",
  //       "amc_code": "189",
  //       "product_code": "189FXRG",
  //       "scheme_name": "Bajaj Finserv Flexi Cap Fund",
  //       "cat_name": "Equity",
  //       "subcat_name": "Flexi Cap",
  //       "plan_name": "Regular ",
  //       "option_name": "Growth",
  //       "new": {
  //         "product_code": "189FXRG",
  //         "isin_no": "INF0QA701383",
  //         "nav_date": "2025-01-08",
  //         "nav": "13.911"
  //       },
  //       "curr_nav": "13.911",
  //       "nav_date": "2025-01-08",
  //       "calculate_mydata": {
  //         "inv_cost": 24998.75,
  //         "tot_units": "2499.8750",
  //         "idcw_reinv": 0,
  //         "idcw_paid": 0
  //       },
  //       "inv_cost": 24998.75,
  //       "tot_units": "2499.8750",
  //       "idcw_reinv": 0,
  //       "idcw_paid": 0,
  //       "idcwr": 0,
  //       "curr_aum": "34775.76",
  //       "gain_loss": "9777.01",
  //       "abs_rtn": "39.11"
  //     },
  //     {
  //       "registrar_name":"CAMS",
  //       "amc_name": "360 ONE Mutual Fund",
  //       "amc_code": "IF",
  //       "product_code": "IFIGRG",
  //       "scheme_name": "360 ONE Focused Equity Fund",
  //       "cat_name": "Equity",
  //       "subcat_name": "Focused",
  //       "plan_name": "Regular ",
  //       "option_name": "Growth",
  //       "new": {
  //         "product_code": "IFIGRG",
  //         "isin_no": "INF579M01878",
  //         "nav_date": "2025-01-08",
  //         "nav": "44.9181"
  //       },
  //       "curr_nav": "44.9181",
  //       "nav_date": "2025-01-08",
  //       "calculate_mydata": {
  //         "inv_cost": 91205.38,
  //         "tot_units": "2072.6280",
  //         "idcw_reinv": 0,
  //         "idcw_paid": 0
  //       },
  //       "inv_cost": 91205.38,
  //       "tot_units": "2072.6280",
  //       "idcw_reinv": 0,
  //       "idcw_paid": 0,
  //       "idcwr": 0,
  //       "curr_aum": "93098.51",
  //       "gain_loss": "1893.13",
  //       "abs_rtn": "2.08"
  //     },
  //     {
  //       "registrar_name":"CAMS",
  //       "amc_name": "360 ONE Mutual Fund",
  //       "amc_code": "IF",
  //       "product_code": "IFIQRG",
  //       "scheme_name": "360 ONE Quant Fund",
  //       "cat_name": "Equity",
  //       "subcat_name": "Sectoral/Thematic",
  //       "plan_name": "Regular ",
  //       "option_name": "Growth",
  //       "new": {
  //         "product_code": "IFIQRG",
  //         "isin_no": "INF579M01AF8",
  //         "nav_date": "2025-01-08",
  //         "nav": "18.1827"
  //       },
  //       "curr_nav": "18.1827",
  //       "nav_date": "2025-01-08",
  //       "calculate_mydata": {
  //         "inv_cost": 2619369.0799999996,
  //         "tot_units": "138239.6480",
  //         "idcw_reinv": 0,
  //         "idcw_paid": 0
  //       },
  //       "inv_cost": 2619369.0799999996,
  //       "tot_units": "138239.6480",
  //       "idcw_reinv": 0,
  //       "idcw_paid": 0,
  //       "idcwr": 0,
  //       "curr_aum": "2513570.05",
  //       "gain_loss": "-105799.03",
  //       "abs_rtn": "-4.04"
  //     }
  //   ];

  /***** FOR REAL WORLD  */
            this.footerDT = null;
            this.md_aum_registrar = [];
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
              let originalDt = [];
              const groupByAMC = this.groupBy(res, 'rnt_id');
              const totalInv = global.Total__Count(res, (x:any) => x?.inv_cost ? Number(x.inv_cost) : 0);
              console.log(totalInv);
              Object.keys(groupByAMC).forEach((key,index) =>{
                      /***** CALUCLATION OF UPPER TABLE */
                          const totInvCost = groupByAMC[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                          const totIdcwPaid = groupByAMC[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                          const totIdcwReinv = groupByAMC[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                          const totAUM = groupByAMC[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                          // const totAbsRtn = groupByAMC[key].map(el => Number(el.abs_rtn)).reduce((totSum, a) => totSum + a, 0);
                          const totGainLoss = groupByAMC[key].map(el => Number(el.gain_loss)).reduce((totSum, a) => totSum + a, 0);
                          const totAbsRtn = (totGainLoss / totInvCost)*100;
                          const tot_amc_weightage = (totInvCost / totalInv) * 100;
                      /****** END */
          
                      /**** DISPLAY AMOUNT CATEGORY WISE */
                        originalDt.push({
                          registrar_name:groupByAMC[key][0].rnt_name,
                          rnt_id:this.utility.EncryptText(groupByAMC[key][0].rnt_id.toString()),
                          date:this.utility.EncryptText(ev.date),
                          rnt_name:groupByAMC[key][0].rnt_name,
                          amc_name:groupByAMC[key][0].amc_name,
                          amc_code:groupByAMC[key][0].amc_code,
                          cat_name:groupByAMC[key][0].cat_name,
                          inv_cost:totInvCost,
                          Investment:totInvCost,
                          idcw_paid:totIdcwPaid,
                          IDCWP:totIdcwPaid,
                          idcw_reinv:totIdcwReinv,
                          "IDCW Reinv.":totIdcwReinv,
                          gain_loss:totGainLoss,
                          curr_aum:totAUM,
                          AUM:totAUM,
                          ret_abs:totAbsRtn.toFixed(2),
                          "Abs. Return":totAbsRtn,
                          "AMC Weightage in (%)":tot_amc_weightage.toFixed(2),
                          amc_weightage_in:tot_amc_weightage.toFixed(2),
                          schemes:groupByAMC[key],
                          total:{
                            inv_cost:totInvCost,
                            idcw_paid:totIdcwPaid,
                            curr_aum:totAUM,
                            abs_rtn:totAbsRtn,
                            registrar_name:"TOTAL"
                          }
                        })
                      /**** END */
              })
              this.md_aum_registrar = originalDt;
              this.createParentFooter(originalDt);
              // this.footerDT = {
              //     Investment: global.Total__Count(this.md_aum_registrar,((item) => item.inv_cost ? Number(item.inv_cost) : 0)),
              //     IDCW: global.Total__Count(this.md_aum_registrar,((item) => item.idcw_paid ? Number(item.idcw_paid) : 0)),
              //     "IDCW Reinv": global.Total__Count(this.md_aum_registrar,((item) => item.idcw_reinv ? Number(item.idcw_reinv) : 0)),
              //     "Abs. Return": global.Total__Count(this.md_aum_registrar,((item) => item.ret_abs ? Number(item.ret_abs) : 0)),
              //     "AMC Weightage in (%)":global.Total__Count(this.md_aum_registrar,((item) => item.amc_weightage_in ? Number(item.amc_weightage_in) : 0))
              //   }
            })

   
  }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  createParentFooter = (value) =>{
    const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
    const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
    // console.log((tot_gain_loss / tot_inv_cost) * 100);
    const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
    console.log(tot_ret_abs)
    let obj = {}
    const dt = value.map(({total,schemes,cat_name,amc_weightage_in,amc_name,amc_code,inv_cost,idcw_paid,idcw_reinv,gain_loss,rnt_id,
      registrar_name,rnt_name,curr_aum,ret_abs,subcat_name,contri_to_aum,date,...rest}) => {return {...rest}})
    for(let object of dt) {Object.assign(obj, object)}
    Object.keys(obj).forEach(el =>{
      // console.log( el + ":" + obj[el])
      this.footerDT = {
        ...this.footerDT,
        [el]:el == "Abs. Return" ? tot_ret_abs.toFixed(2) : global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)),
      }
    })
    console.log(this.footerDT);
  }
  

}


export class AumRegistrarColumn{
  public static column:column[] = [
    {
      field:'rnt_name',
      header:'Registrar Name',
      width:'32rem'
    },
    {
      field:'inv_cost',
      header:'Investment',
      width:''
    },
    {
      field:'idcwp',
      header:'IDCWP',
      width:''
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:''
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:''
    },
    {
      field:'ret_abs',
      header:'Abs. Return',
      width:''
    },
    {
      field:'amc_weightage_in',
      header:'AMC Weightage in (%)',
      width:'9rem'
    },
  ]
}