import { Component, Input, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from './live_sip.interface';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'live-sip',
  templateUrl: './live-sip.component.html',
  styleUrls: ['./live-sip.component.css']
})
export class LiveSIPComponent implements OnInit {


 __title:string = 'Search Live SIP Report';

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
  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

  /**
   * Hold Sip Report result
   */
  live_sip_rpt:Partial<IliveSip[]> = [];

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Get Sip Report result
   */
  searchSipReport = () =>{

  }

}
