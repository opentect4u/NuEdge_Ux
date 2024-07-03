import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';

@Component({
  selector: 'app-aum-scheme',
  templateUrl: './aum-scheme.component.html',
  styleUrls: ['./aum-scheme.component.css']
})
export class AumSchemeComponent implements OnInit {

  constructor() { }

  aum_scheme_Column:column[] = AumSchemeColumn.column;
  md_aum_scheme = [];

  ngOnInit(): void {
  }

  getFormData =(ev) =>{
    this.md_aum_scheme = ev;
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