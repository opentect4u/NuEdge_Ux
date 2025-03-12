import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { IAumFooterModel } from '../component/aum.model';
import { global } from 'src/app/__Utility/globalFunc';
import { AUTMTYPE } from '../component/aum-filter/aum-filter.component';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-aum-scheme',
  templateUrl: './aum-scheme.component.html',
  styleUrls: ['./aum-scheme.component.css']
})
export class AumSchemeComponent implements OnInit {

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }
  __formDate:string;

  aum_scheme_Column:column[] = AumSchemeColumn.column;
  md_aum_scheme:any = [];
  aum_type:'Scheme' = AUTMTYPE['Scheme'];
  /*** Table Footer Details */
    footerDT:Partial<IAumFooterModel>;
  /*** End */

  ngOnInit(): void {
  }

  getFormData =(ev) =>{
    // this.md_aum_scheme = ev;
    // this.md_aum_scheme = [
    //   {
    //     "amc_name": "Bajaj Finserv Mutual Fund",
    //     "amc_code": "189",
    //     "product_code": "189FXRG",
    //     "scheme_name": "Bajaj Finserv Flexi Cap Fund",
    //     "cat_name": "Equity",
    //     "subcat_name": "Flexi Cap",
    //     "plan_name": "Regular ",
    //     "option_name": "Growth",
    //     "new": {
    //       "product_code": "189FXRG",
    //       "isin_no": "INF0QA701383",
    //       "nav_date": "2025-01-08",
    //       "nav": "13.911"
    //     },
    //     "curr_nav": "13.911",
    //     "nav_date": "2025-01-08",
    //     "calculate_mydata": {
    //       "inv_cost": 24998.75,
    //       "tot_units": "2499.8750",
    //       "idcw_reinv": 0,
    //       "idcw_paid": 0
    //     },
    //     "inv_cost": 24998.75,
    //     "tot_units": "2499.8750",
    //     "idcw_reinv": 0,
    //     "idcw_paid": 0,
    //     "idcwr": 0,
    //     "curr_aum": "34775.76",
    //     "gain_loss": "9777.01",
    //     "abs_rtn": "39.11"
    //   },
    //   {
    //     "amc_name": "360 ONE Mutual Fund",
    //     "amc_code": "IF",
    //     "product_code": "IFIGRG",
    //     "scheme_name": "360 ONE Focused Equity Fund",
    //     "cat_name": "Equity",
    //     "subcat_name": "Focused",
    //     "plan_name": "Regular ",
    //     "option_name": "Growth",
    //     "new": {
    //       "product_code": "IFIGRG",
    //       "isin_no": "INF579M01878",
    //       "nav_date": "2025-01-08",
    //       "nav": "44.9181"
    //     },
    //     "curr_nav": "44.9181",
    //     "nav_date": "2025-01-08",
    //     "calculate_mydata": {
    //       "inv_cost": 91205.38,
    //       "tot_units": "2072.6280",
    //       "idcw_reinv": 0,
    //       "idcw_paid": 0
    //     },
    //     "inv_cost": 91205.38,
    //     "tot_units": "2072.6280",
    //     "idcw_reinv": 0,
    //     "idcw_paid": 0,
    //     "idcwr": 0,
    //     "curr_aum": "93098.51",
    //     "gain_loss": "1893.13",
    //     "abs_rtn": "2.08"
    //   },
    //   {
    //     "amc_name": "360 ONE Mutual Fund",
    //     "amc_code": "IF",
    //     "product_code": "IFIQRG",
    //     "scheme_name": "360 ONE Quant Fund",
    //     "cat_name": "Equity",
    //     "subcat_name": "Sectoral/Thematic",
    //     "plan_name": "Regular ",
    //     "option_name": "Growth",
    //     "new": {
    //       "product_code": "IFIQRG",
    //       "isin_no": "INF579M01AF8",
    //       "nav_date": "2025-01-08",
    //       "nav": "18.1827"
    //     },
    //     "curr_nav": "18.1827",
    //     "nav_date": "2025-01-08",
    //     "calculate_mydata": {
    //       "inv_cost": 2619369.0799999996,
    //       "tot_units": "138239.6480",
    //       "idcw_reinv": 0,
    //       "idcw_paid": 0
    //     },
    //     "inv_cost": 2619369.0799999996,
    //     "tot_units": "138239.6480",
    //     "idcw_reinv": 0,
    //     "idcw_paid": 0,
    //     "idcwr": 0,
    //     "curr_aum": "2513570.05",
    //     "gain_loss": "-105799.03",
    //     "abs_rtn": "-4.04"
    //   }
    // ];
    // this.footerDT = {
    //     Investment: global.Total__Count(this.md_aum_scheme,((item) => item.inv_cost ? Number(item.inv_cost) : 0)),
    //     IDCW: global.Total__Count(this.md_aum_scheme,((item) => item.idcw_paid ? Number(item.idcw_paid) : 0)),
    //     "IDCW Reinv": global.Total__Count(this.md_aum_scheme,((item) => item.idcw_reinv ? Number(item.idcw_reinv) : 0)),
    //     "Abs. Return": global.Total__Count(this.md_aum_scheme,((item) => item.inv_cost ? Number(item.inv_cost) : 0))
    // }


    this.footerDT = null;
    this.md_aum_scheme = [];
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
    this.dbIntr.api_call(1,'/clients/aumFundHouse',formdata).pipe(pluck('data')).subscribe((res:any) =>{
      this.md_aum_scheme = res.sort((a, b) => a.amc_name.localeCompare(b.amc_name)).map(el => {
          const encryptedTxt = this.utility.EncryptText(JSON.stringify({date:this.__formDate,pCode:el?.product_code}));
         el.ret_abs = el.abs_rtn;
         el.routeUrl = encryptedTxt;
         return el;
      });
      this.createParentFooter(this.md_aum_scheme);
    })
  }

  createParentFooter = (value) =>{
            const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
            const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
            const tot_curr_aum = global.Total__Count(value,(x:any) => x?.curr_aum ? Number(x?.curr_aum) : 0);

            const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
            this.footerDT = {
                Investment: tot_inv_cost,
                AUM:tot_curr_aum,
                IDCW: global.Total__Count(value,((item:any) => item.idcwp ? Number(item.idcwp) : 0)),
                "IDCW Reinv": global.Total__Count(value,((item:any) => item.idcw_reinv ? Number(item.idcw_reinv) : 0)),
                "Abs. Return": tot_ret_abs.toFixed(2)
              }
  }
  

}

export class AumSchemeColumn{
  public static column:column[] = [
    {
      field:'scheme_name',
      header:'Scheme',
      width:'32rem'
    },
    {
      field:'3mth',
      header:'3Mth',
      width:'5rem'
    },
    {
      field:'6mth',
      header:'6Mth',
      width:'5rem'
    },
    {
      field:'1yr',
      header:'1Yr',
      width:'5rem'
    },
    {
      field:'3yr',
      header:'3Yr',
      width:'5rem'
    },
    {
      field:'5yr',
      header:'5Yr',
      width:'6rem'
    },
    {
      field:'si',
      header:'SI',
      width:'5rem'
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
    }
  ]
}