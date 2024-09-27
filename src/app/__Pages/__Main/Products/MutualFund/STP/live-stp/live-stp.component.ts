import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveStp } from './live_stp.interface';
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
  selector: 'live-stp',
  templateUrl: './live-stp.component.html',
  styleUrls: ['./live-stp.component.css']
})
export class LiveStpComponent implements OnInit {

  state:string = displayMode[1];

  @ViewChild('primeTbl') primeTbl: Table;
  @Input() stpType:string;

  disclaimer:Partial<IDisclaimer> | undefined;

  @Input() report_type:string;

  __title:string = 'Live STP';

  @Input() sip_stp_swp_type_mst:any = [];

    /**
   * Holding Transaction Type  Master Data
   */
  @Input() trxnTypeMst: rntTrxnType[] = [];

 /**
  * For Holding AMC Master Data
  */
  @Input() amc:amc[] = [];

  total_live_stp_report:number =0 ;

 /**
  * For holding client those are  present only in transaction.
  */
  @Input() client:any = [];
/**
   * Set Column for LIVE STP REPORT
   */
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-2'));

/**
 * Hold Stp Report result
 */
live_stp_rpt:Partial<IliveStp[]> = [];

constructor(private dbIntr: DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }


ngOnInit(): void {
}

LiveStpReport = (formDt) =>{
  this.live_stp_rpt = [];
  let dt ={
    ...formDt,
    report_type:this.report_type,
    stp_type:this.stpType
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res: Partial<{data:IliveStp[],disclaimer:Partial<IDisclaimer>}>) =>{
       this.live_stp_rpt = res.data;
       this.disclaimer = res.disclaimer;
       this.total_live_stp_report = global.calculatAmt(res.data);
       this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
  })
}

exportExcel = () =>{
  const column = this.column.map(el => el.header);
  let dt = [];
  this.live_stp_rpt.forEach((el:any,index) =>{
      dt.push([
        (index + 1),
        el.bu_type,
         el.branch_name,
        el.rm_name,
        (!el.sub_brk_cd.toLowerCase().includes('not') && el.sub_brk_cd && el.sub_brk_cd?.toString() != '0') ? el.sub_brk_cd : '',
        el.euin_no,
        el.first_client_name,
        el.first_client_pan,
        this.datePipe.transform(el.reg_date,'dd-MM-YYYY'),
        el.reg_no,
        el.amc_short_name,
        el.to_cat_name,
         el.to_subcat_name,
        `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
        `${el.to_scheme_name}-${el.to_plan_name}-${el.to_option_name}`,
        el.folio_no,
        el.trans_type,
        el.trans_sub_type,
        this.datePipe.transform(el.from_date,'dd-MM-YYYY'),
        this.datePipe.transform(el.to_date,'dd-MM-YYYY'),
        el.stp_date,
        el.amount,
        el.freq,
        el.duration,
        el.reg_mode,
        el.remarks
    ])
  });
  const footerDetails = [
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
   global.Total__Count(this.live_stp_rpt,(x:any)=> x.amount ? Number(x.amount) : 0),
   '',
   '',
   '',
   ''
  ];
  global.exportExcel(
    this.disclaimer,column,dt,'LIVE STP','LIVE_STP.xlsx',footerDetails
  )
}

/**
* Get Sip Report result
* @param ev
*/
searchStpReport = (ev) =>{
this.LiveStpReport(ev);
}

filterGlobal = (ev) =>{
  let value = ev.target.value;
  this.primeTbl.filterGlobal(value, 'contains');
}
changeState = (event) =>{
  this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
}
}
