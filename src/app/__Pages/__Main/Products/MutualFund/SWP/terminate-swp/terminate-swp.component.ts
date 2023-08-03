import { Component, Input, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'terminate-swp',
  templateUrl: './terminate-swp.component.html',
  styleUrls: ['./terminate-swp.component.css']
})
export class TerminateSwpComponent implements OnInit {
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
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('TS-3'));

/**
 * Hold Sip Report result
 */
live_swp_rpt:Partial<IliveSwp[]> = [];

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
