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

@Component({
  selector: 'live-stp',
  templateUrl: './live-stp.component.html',
  styleUrls: ['./live-stp.component.css']
})
export class LiveStpComponent implements OnInit {

  state:string = displayMode[1];

  @ViewChild('primeTbl') primeTbl: Table;
  @Input() stpType:string;

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

constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }


ngOnInit(): void {
}

LiveStpReport = (formDt) =>{
  let dt ={
    ...formDt,
    report_type:this.report_type,
    stp_type:this.stpType
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res: IliveStp[]) =>{
       this.live_stp_rpt = res;
       this.total_live_stp_report = global.calculatAmt(res);
       this.state =  res.length > 0 ? displayMode[0] : displayMode[1];
  })
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
