import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { AUTMTYPE } from '../component/aum-filter/aum-filter.component';

@Component({
  selector: 'app-fund-house',
  templateUrl: './fund-house.component.html',
  styleUrls: ['./fund-house.component.css']
})
export class FundHouseComponent implements OnInit {

  constructor(private dbIntr:DbIntrService) { }

  md_fundHouse = [];

  fund_House_Column:column[] = FundHouseColumn.column;

  fund_house_sub_column:column[] = FundHouseColumn.sub_column;

  aum_type:'Fund House' = AUTMTYPE['Fund House'];

  __formDate:string;

  ngOnInit(): void {
  }

  getFormData =(ev) =>{
      this.__formDate = ev.date;
      var formdata = new FormData();
      for(let key in ev){
        formdata.append(key,ev[key])
      }
      this.dbIntr.api_call(1,'/clients/aum',formdata).pipe(pluck('data')).subscribe((res:any) =>{
          this.md_fundHouse = res
      })

  }

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
      width:'8rem'
    },
    {
      field:'idcwp',
      header:'IDCW',
      width:'5rem'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'6rem'
    },
    {
      field:'aum',
      header:'AUM',
      width:'5rem'
    },
    {
      field:'ret_abs',
      header:'Abs. Return in(%)',
      width:'8rem'
    },
    {
      field:'amc_weightage',
      header:'AMC Weightage in (%)',
      width:'9rem'
    },
    {
      field:'equity',
      header:'Equity',
      width:''
    },
    {
      field:'debt',
      header:'Debt',
      width:''
    },
    {
      field:'hybrid',
      header:'Hybrid',
      width:''
    },
    {
      field:'sol_oriented',
      header:'Sol Oriented',
      width:''
    },
    {
      field:'others',
      header:'Others',
      width:''
    },
  ]

  public static sub_column:column[] = [
    {
      field:'scheme_name',
      header:'Scheme',
      width:'48rem'
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
      field:'aum',
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
