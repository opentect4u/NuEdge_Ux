import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'pause-swp',
  templateUrl: './pause-swp.component.html',
  styleUrls: ['./pause-swp.component.css']
})
export class PauseSwpComponent implements OnInit {


  state:string = displayMode[1];

  __title:string = 'Pause SWP';

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() amc:amc[] = []

  @Input() swp_type:string;

  @Input() report_type:string;

  @Input() sip_stp_swp_type_mst = [];

  disclaimer:Partial<IDisclaimer> |undefined;

  total_pause_swp_amt:number = 0;

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P3'));

  pause_swp:Partial<IliveSwp>[] = [];

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
  }
  /**
   * @returns {Array} An array of columns formatted for the pause SWP report table.
   * This method filters the columns from the `live_sip_stp_swp_rpt` configuration
   */
  searchSwpReport = (ev):void =>{
   this.PauseSwpReport(ev);
  }

  /**
   *  Fetches and displays the pause SWP report based on the provided form data.
   * @param $event 
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
  /**
   * 
   * @param formDt - The form data containing the parameters for the report.
   * This method retrieves the pause SWP report data from the server and updates the component state.
   * It constructs a request object with the form data, report type, and SWP type,
   * then calls the API to fetch the report details.
   * The response is processed to update the `pause_swp` array and calculate the total amount.
   */
  PauseSwpReport = (formDt) =>{
    this.pause_swp = [];
    console.log(formDt)
    let dt ={
      ...formDt,
      report_type:this.report_type,
      swp_type:this.swp_type
    }
    this.dbIntr.api_call(1,'/showSipStpDetails',
    this.utility.convertFormData(dt))
    .pipe(pluck('data'))
    .subscribe((res:Partial<{data:IliveSwp[],disclaimer:Partial<IDisclaimer>}>) =>{
         this.pause_swp = res.data;
         this.total_pause_swp_amt = global.calculatAmt(res.data);
         this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
         this.disclaimer = res.disclaimer;
    })
  }
  /**
   * 
   * @param event - The event containing the value to change the display state.
   * This method toggles the display state of the component between two modes:
   * 'expanded' and 'collapsed'. It checks the current state and switches to the opposite mode.
   * If the current state is 'expanded', it changes to 'collapsed', and vice versa.
   */
  changeState = (event) =>{
    this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
  }
  /**
   * Exports the pause SWP report data to an Excel file.
   * @description This method formats the pause SWP report data into an array and exports it to an Excel file.
   * It constructs the column headers and data rows, including formatting dates and calculating totals.
   * The resulting data is then passed to a utility function to generate the Excel file.
   */
  exportExcel = () =>{
    const column = this.column.map(el => el.header);
      let dt = [];
      this.pause_swp.forEach((el:any,index) =>{
          dt.push([
            (index + 1),
            el.bu_type,
            el.branch_name,
            el.rm_name,
            (!el.sub_brk_cd.toLowerCase().includes('not') && el.sub_brk_cd && el.sub_brk_cd?.toString() != '0') ? el.sub_brk_cd : '',
            el.euin_no,
            el.first_client_name,
            el.first_client_pan,
            this.datePipe.transform(el.reg_date,'dd-MM-yyyy'),
            el.reg_no,
            el.amc_short_name,
            el.cat_name,
            el.subcat_name,
            `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
            el.folio_no,
            el.trans_type,
            el.trans_sub_type,
            this.datePipe.transform(el.from_date,'dd-MM-yyyy'),
            this.datePipe.transform(el.to_date,'dd-MM-yyyy'),
            el.pause_start_date ? this.datePipe.transform(el.pause_start_date,'dd-MM-yyyy') : '',
            el.pause_end_date ? this.datePipe.transform(el.pause_end_date,'dd-MM-yyyy') : '',
            el.swp_date,
            el.amount,
            el.freq,
            el.duration,
            el.reg_mode,
            el.remarks
        ])
      });

      let footerDetails = [
        'GRAND TOTAL',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        global.Total__Count(this.pause_swp,(x:any)=> x.amount ? Number(x.amount) : 0),
        '',
        '',
        '',
        ''
      ]
      global.exportExcel(
        this.disclaimer,column,dt,'PAUSE SWP','PAUSE_SWP.xlsx',footerDetails
      )
  }
}
