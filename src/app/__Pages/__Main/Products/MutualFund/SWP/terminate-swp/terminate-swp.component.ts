import { Component, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from '../live-swp/live_swp.interface';

@Component({
  selector: 'terminate-swp',
  templateUrl: './terminate-swp.component.html',
  styleUrls: ['./terminate-swp.component.css']
})
export class TerminateSwpComponent implements OnInit {
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
 * Get Sip Report result
 */
searchSipReport = () =>{

}
}
