import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';

@Component({
  selector: 'app-live-mf-port-folio',
  templateUrl: './live-mf-port-folio.component.html',
  styleUrls: ['./live-mf-port-folio.component.css']
})
export class LiveMfPortFolioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export class LiveMFPortFolioColumn{

  public static column:column[] = [
    {
      field:'scheme_name',
      header:'Scheme'
    },
    {
      field:'isin_no',
      header:'ISIN'
    },
    {
      field:'folio_no',
      header:'Folio'
    },
    {
      field:'inv',
      header:'Inv. Since'
    },
    {
      field:'sen_sex',
      header:'SENSEX'
    },
    {
      field:'sen_sex',
      header:'SENSEX'
    },
    {
      field:'nifty_fifty',
      header:'NIFTY50'
    },
    {
      field:'inv_cost',
      header:'Inv. Cost'
    },
    {
      field:'idcwr',
      header:'IDCWR'
    },
    {
      field:'pur_nav',
      header:'PUR. NAV'
    },
    {
      field:'units',
      header:'Units'
    },
    {
      field:'curr_nav',
      header:'Curr. NAV'
    },
    {
      field:'curr_value',
      header:'Curr. Value'
    },
    {
      field:'idcw_reinv',
      header:'IDCWReinv.'
    },
    {
      field:'idcwp',
      header:'IDCWP'
    },
    {
      field:'gain_loss',
      header:'Gain/Loss'
    },
    {
      field:'ret_abs',
      header:'Ret.ABS'
    },
    {
      field:'ret_abs',
      header:'Ret.ABS'
    },
    {
      field:'ret_cagr',
      header:'Ret.CAGR'
    },
    {
      field:'xirr',
      header:'XIRR'
    },
    {
      field:'tran_mode',
      header:'Tran. Mode'
    }
  ]

  // public static sub_column:column[] = [
  //   {
  //     field:"scheme_name",

  //   }
  // ]


}
