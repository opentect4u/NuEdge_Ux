import { Component, Input, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from '../live-sip/live_sip.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'terminate-sip',
  templateUrl: './terminate-sip.component.html',
  styleUrls: ['./terminate-sip.component.css']
})
export class TerminateSIPComponent implements OnInit {

  __title:string = 'Search Terminate SIP Report';

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
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('TS-1'));

/**
 * Hold Sip Report result
 */
live_sip_rpt:Partial<IliveSip[]> = [];

constructor() { }

ngOnInit(): void {
}

/**
  * Get Sip Report result
  * @param ev
*/
searchSipReport = (ev) =>{
  console.log(ev);

 }

}
