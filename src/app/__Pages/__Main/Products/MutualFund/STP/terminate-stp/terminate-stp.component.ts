import { Component, Input, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveStp } from '../live-stp/live_stp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
@Component({
  selector: 'terminate-stp',
  templateUrl: './terminate-stp.component.html',
  styleUrls: ['./terminate-stp.component.css']
})
export class TerminateStpComponent implements OnInit {

  __title:string = 'Search Terminate STP Report';

  /**
 * Holding Transaction Type  Master Data
 */
@Input() trxnTypeMst: rntTrxnType[] = [];

/**
* For Holding AMC Master Data
*/
@Input() amc:amc[] = [];

/**
* For holding client those are  present only in transaction.
*/
@Input() client:any = [];

/**
   * Set Column for LIVE SIP REPORT
   */
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('TS-2'));

/**
 * Hold Sip Report result
 */
live_stp_rpt:Partial<IliveStp[]> = [];

constructor() { }

ngOnInit(): void {
}

/**
  * Get Stp Report result
  * @param ev
*/
searchSipReport = (ev) =>{
  console.log(ev);

 }

}
