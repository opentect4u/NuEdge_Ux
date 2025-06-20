import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from './live_swp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'live-swp',
  templateUrl: './live-swp.component.html',
  styleUrls: ['./live-swp.component.css']
})
export class LiveSwpComponent implements OnInit {
  state:string = displayMode[1];

  @ViewChild('primeTbl') primeTbl: Table;

  disclaimer:Partial<IDisclaimer> | undefined;

  @Input() swp_type:string;

  @Input() report_type:string;

  __title:string = 'Live SWP';
    /**
   * Holding Transaction Type  Master Data
   */
  @Input() trxnTypeMst: rntTrxnType[] = [];


  /**
   * Holding Live SWP Amount
   */
  total_live_swp_amt:number = 0;


 /**
  * For Holding AMC Master Data
  */
  @Input() amc:amc[] = [];

 /**
  * For holding client those are  present only in transaction.
  */
  @Input() client:any = [];
 /**
   * Set Column for LIVE SWP REPORT
   */
 column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-3'));

 /**
  * Hold Swp Report result
  */
 live_swp_rpt:Partial<IliveSwp[]> = [];


 @Input() sip_stp_swp_type_mst =[];

 constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

 ngOnInit(): void {
 }
 /**
  * 
  * @param formDt Form data to fetch the live SWP report
  * @description Fetches the live SWP report based on the provided form data and updates the component state.
  */
 LiveSwpReport = (formDt) =>{
  this.live_swp_rpt = [];
  let dt ={
    ...formDt,
    report_type:this.report_type
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',
  this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res:Partial<{data:IliveSwp[],disclaimer:Partial<IDisclaimer>}>) =>{
      this.disclaimer = res.disclaimer;
       this.live_swp_rpt = res.data;
       this.total_live_swp_amt = global.calculatAmt(res.data);
       this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];

  })
}

/**
   * Get Sip Report result
   * @param ev
   */
searchSwpReport = (ev) =>{
  // console.log(ev);
  this.LiveSwpReport({...ev,swp_type:this.swp_type});
 }
 /**
  * 
  * @param ev Event containing the value to filter the global search
  * @description This function filters the global search input for the live SWP report table.
  * It uses the value from the event to filter the table based on the 'contains' match mode.
  */
 filterGlobal = (ev):void =>{
  let value = ev.target.value;
  this.primeTbl.filterGlobal(value, 'contains');
 }
 /**
  * 
  * @param event Event containing the value to change the display state.
  * @description This function toggles the display state between 'expanded' and 'collapsed'.
  * It checks the current state and switches it to the opposite mode.
  */
 changeState = (event) =>{
  this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
}
/**
 * Exports the live SWP report data to an Excel file.
 * @description This function formats the live SWP report data and exports it to an Excel file.
 * It includes a disclaimer, column headers, and footer details for the exported file.
 */
exportExcel = () =>{
  const column = this.column.map(el => el.header);
  let dt = [];
  this.live_swp_rpt.forEach((el:any,index) =>{
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
    global.Total__Count(this.live_swp_rpt,(x:any)=> x.amount ? Number(x.amount) : 0),
    '',
    '',
    '',
    ''
  ]
  global.exportExcel(
    this.disclaimer,column,dt,'LIVE SWP','LIVE_SWP.xlsx',footerDetails
  )
}
}
