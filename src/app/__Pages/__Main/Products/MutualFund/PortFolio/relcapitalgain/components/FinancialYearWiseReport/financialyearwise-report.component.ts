import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'financialyearwise-report',
  templateUrl: './financialyearwise-report.component.html',
  styleUrls: ['./financialyearwise-report.component.css']
})
export class FinancialyearwiseReportComponent implements OnInit {

  constructor(private utility:UtiliService) { }

  @ViewChild('dt') PrimeTable:Table;

  @Input() financial_year_wise_report = [];

  @Input() tab_type:string = 'LS';

  long_summary_column:column[] = FinancialYearWiseReportColumn.long_summary;

  view_complete_details:column[] = FinancialYearWiseReportColumn.view_complete_details;

  ngOnInit(): void {
  }

  getColumns(){
     return this.utility.getColumns(this.long_summary_column)
  }

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.PrimeTable.filterGlobal(value,'contains')
  }

}

export class FinancialYearWiseReportColumn{
    public static long_summary:column[] = [
      {
        field:'scheme_name',
        header:'Fund Name',
        width:'25rem'
      },
      {
        field:'folio_no',
        header:'Folio',
        width:'6rem'
      },
      {
        field:'inflow',
        header:'Inflow (Pur. + Switch In + Tran.In)',
        width:'15rem'
      },
      {
        field:'outflow',
        header:'Out Flow (Red. + Switch Out + Tran. Out)',
        width:'15rem'
      },
      {
        field:'div_sweep_in',
        header:'IDCW Sweep In',
        width:'6rem'
      },
      {
        field:'div_sweep_out',
        header:'IDCW Sweep Out',
        width:'6rem'
      },
      {
        field:'div_reinv',
        header:'IDCW Reinv.',
        width:'5rem'
      },
      {
        field:'idcwp',
        header:'IDCWP',
        width:'5rem'
      }
    ]

    public static view_complete_details:column[] = [
      {
        field:'sl_no',
        header:'Sl No.',
        width:'5rem'
      },
      {
        field:'transaction_type',
        header:'Transaction Type',
        width:''
      },
      {
        field:'trans_date',
        header:'Date',
        width:''
      },
      {
        field:'inv_cose',
        header:'Investment Cost',
        width:''
      },
      {
        field:'curr_val',
        header:'Current Value',
        width:''
      },
      {
        field:'pur_price',
        header:'Nav',
        width:''
      },
      {
        field:'tot_units',
        header:'Units',
        width:''
      },
      {
        field:'bal_units',
        header:'Balance Units',
        width:''
      }
    ]
}
