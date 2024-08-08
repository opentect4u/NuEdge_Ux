import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'financialyearwise-report',
  templateUrl: './financialyearwise-report.component.html',
  styleUrls: ['./financialyearwise-report.component.css']
})
export class FinancialyearwiseReportComponent implements OnInit,AfterViewInit {

  constructor(private utility:UtiliService) { }

  @ViewChild('dt') PrimeTable:Table;

  @ViewChild('financial__details_year')  financial__details_yearTable:Table;

  @Input() financial_year_wise_report = [];

  @Input() total_financial_wise_report;

  @Input() tab_type:string = 'LS';

  @Input() financial_year_wise_detail_report = [];

  @Input() final_footer_for__financial_year_wise_detail;

  long_summary_column:column[] = FinancialYearWiseReportColumn.long_summary;

  view_complete_details_column:column[] = FinancialYearWiseReportColumn.view_complete_details;

  ngOnInit(): void {
  }

  getColumns(){
     return this.utility.getColumns(this.long_summary_column)
  }

  getColumns_for_details_financial_year(){
    return this.utility.getColumns(this.view_complete_details_column)
  }

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.PrimeTable.filterGlobal(value,'contains')
  }

  filterGlobal_details_financial_year = ($event) =>{
    let value = $event.target.value;
    this.financial__details_yearTable.filterGlobal(value,'contains')
  }
  ngAfterViewInit(): void {

    const fin_year_Summary_table = this.PrimeTable?.el.nativeElement.querySelector('table');
    fin_year_Summary_table?.setAttribute('id', 'fin_year_summary_table');
  }



  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      const table = this.financial__details_yearTable?.el.nativeElement.querySelector('table');
      table?.setAttribute('id', 'fin_year_details_table');
    }, 500);

  }

}

export class FinancialYearWiseReportColumn{
    public static long_summary:column[] = [
      {
        field:'scheme_name',
        header:'Scheme',
        width:'25rem'
      },
      {
        field:'isin_no',
        header:'ISIN',
        width:'6rem'
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
      // {
      //   field:'div_sweep_in',
      //   header:'IDCW Sweep In',
      //   width:'6rem'
      // },
      // {
      //   field:'div_sweep_out',
      //   header:'IDCW Sweep Out',
      //   width:'6rem'
      // },
      {
        field:'idcw_reinv',
        header:'IDCW Reinv.',
        width:'5rem'
      },
      {
        field:'idcwp',
        header:'IDCWP',
        width:'5rem'
      },
      {
        field:'net_flow',
        header:'Net Flow',
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
        field:'tot_gross_amount',
        header:'Gross Amt',
        width:''
      },
      {
        field:'tot_stamp_duty',
        header:'S. Duty',
        width:''
      },
      {
        field:'tot_tds',
        header:'TDS',
        width:''
      },
      {
        field:'tot_amount',
        header:'Net Amt.',
        width:''
      },
      // {
      //   field:'pur_price',
      //   header:'Nav',
      //   width:''
      // },
      {
        field:'tot_units',
        header:'Units',
        width:''
      },
      {
        field:'pur_price',
        header:'NAV',
        width:''
      },
      {
        field:'bank_name',
        header:'Bank',
        width:''
      },
      {
        field:'account_no',
        header:'Acc. No',
        width:''
      },
      {
        field:'stt',
        header:'STT',
        width:''
      },
      {
        field:'cur_val',
        header:'Current Value',
        width:''
      }
    ]
}
