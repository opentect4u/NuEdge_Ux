import { Component, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveStp } from '../live-stp/live_stp.interface';

@Component({
  selector: 'terminate-stp',
  templateUrl: './terminate-stp.component.html',
  styleUrls: ['./terminate-stp.component.css']
})
export class TerminateStpComponent implements OnInit {

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
 * Get Sip Report result
 */
searchSipReport = () =>{

}

}
