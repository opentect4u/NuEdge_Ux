import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { IAumFooterModel } from '../component/aum.model';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-aum-assets-allocation',
  templateUrl: './aum-assets-allocation.component.html',
  styleUrls: ['./aum-assets-allocation.component.css']
})
export class AumAssetsAllocationComponent implements OnInit {

  constructor() { }

    md_aum_assets_allocation = [];
  
    aum_assets_allocation_Column:column[] = AumAssetsAllocationColumn.column;
  
    aum_assets_allocation_sub_column:column[] = AumAssetsAllocationColumn.sub_column;
  
    /*** Table Footer Details */
    footerDT:Partial<IAumFooterModel>;
    /*** End */

  ngOnInit(): void {}



  getFormData = (ev) => {
    const dt = [
      {
        "amc_name": "Bajaj Finserv Mutual Fund",
        "amc_code": "189",
        "product_code": "189FXRG",
        "scheme_name": "Bajaj Finserv Flexi Cap Fund",
        "cat_name": "Equity",
        "subcat_name": "Flexi Cap",
        "plan_name": "Regular ",
        "option_name": "Growth",
        "new": {
          "product_code": "189FXRG",
          "isin_no": "INF0QA701383",
          "nav_date": "2025-01-08",
          "nav": "13.911"
        },
        "curr_nav": "13.911",
        "nav_date": "2025-01-08",
        "calculate_mydata": {
          "inv_cost": 24998.75,
          "tot_units": "2499.8750",
          "idcw_reinv": 0,
          "idcw_paid": 0
        },
        "inv_cost": 24998.75,
        "tot_units": "2499.8750",
        "idcw_reinv": 0,
        "idcw_paid": 0,
        "idcwr": 0,
        "curr_aum": "34775.76",
        "gain_loss": "9777.01",
        "abs_rtn": "39.11"
      },
      {
        "amc_name": "360 ONE Mutual Fund",
        "amc_code": "IF",
        "product_code": "IFIGRG",
        "scheme_name": "360 ONE Focused Equity Fund",
        "cat_name": "Equity",
        "subcat_name": "Focused",
        "plan_name": "Regular ",
        "option_name": "Growth",
        "new": {
          "product_code": "IFIGRG",
          "isin_no": "INF579M01878",
          "nav_date": "2025-01-08",
          "nav": "44.9181"
        },
        "curr_nav": "44.9181",
        "nav_date": "2025-01-08",
        "calculate_mydata": {
          "inv_cost": 91205.38,
          "tot_units": "2072.6280",
          "idcw_reinv": 0,
          "idcw_paid": 0
        },
        "inv_cost": 91205.38,
        "tot_units": "2072.6280",
        "idcw_reinv": 0,
        "idcw_paid": 0,
        "idcwr": 0,
        "curr_aum": "93098.51",
        "gain_loss": "1893.13",
        "abs_rtn": "2.08"
      },
      {
        "amc_name": "360 ONE Mutual Fund",
        "amc_code": "IF",
        "product_code": "IFIQRG",
        "scheme_name": "360 ONE Quant Fund",
        "cat_name": "Equity",
        "subcat_name": "Sectoral/Thematic",
        "plan_name": "Regular ",
        "option_name": "Growth",
        "new": {
          "product_code": "IFIQRG",
          "isin_no": "INF579M01AF8",
          "nav_date": "2025-01-08",
          "nav": "18.1827"
        },
        "curr_nav": "18.1827",
        "nav_date": "2025-01-08",
        "calculate_mydata": {
          "inv_cost": 2619369.0799999996,
          "tot_units": "138239.6480",
          "idcw_reinv": 0,
          "idcw_paid": 0
        },
        "inv_cost": 2619369.0799999996,
        "tot_units": "138239.6480",
        "idcw_reinv": 0,
        "idcw_paid": 0,
        "idcwr": 0,
        "curr_aum": "2513570.05",
        "gain_loss": "-105799.03",
        "abs_rtn": "-4.04"
      }
    ];
    let originalDt = [];
    const groupByAMC = this.groupBy(dt, 'subcat_name');
    Object.keys(groupByAMC).forEach((key,index) =>{
            /***** CALUCLATION OF UPPER TABLE */
                const totInvCost = groupByAMC[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                const totIdcwPaid = groupByAMC[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                const totIdcwReinv = groupByAMC[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                const totAUM = groupByAMC[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                const totAbsRtn = groupByAMC[key].map(el => Number(el.abs_rtn)).reduce((totSum, a) => totSum + a, 0);
            /****** END */
            console.log(totAbsRtn);
            /**** DISPLAY AMOUNT CATEGORY WISE */
              originalDt.push({
                cat_name:groupByAMC[key][0].cat_name,
                inv_cost:totInvCost,
                Investment:totInvCost,
                subcat_name:groupByAMC[key][0].subcat_name,
                idcw_paid:totIdcwPaid,
                IDCWP:totIdcwPaid,
                idcw_reinv:totIdcwReinv,
                "IDCW Reinv.":totIdcwReinv,
                curr_aum:totAUM,
                AUM:totAUM,
                ret_abs:totAbsRtn,
                "Abs. Return":totAbsRtn,
                amc_weightage_in:0,
                schemes:groupByAMC[key],
                contri_to_aum:0,
                "Contri. To AUM":0,
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
    this.md_aum_assets_allocation = originalDt;
    this.createParentFooter(originalDt);
  }

  createParentFooter = (value) =>{
    let obj = {}
    const dt = value.map(({total,schemes,cat_name,amc_weightage_in,amc_name,amc_code,inv_cost,idcw_paid,idcw_reinv,
      curr_aum,ret_abs,subcat_name,contri_to_aum,...rest}) => {return {...rest}})
    for(let object of dt) {Object.assign(obj, object)}
    Object.keys(obj).forEach(el =>{
      console.log( el + ":" + obj[el])
      this.footerDT = {
        ...this.footerDT,
        [el]:global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)),
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
