import { Component, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from '../live-sip/live_sip.interface';

@Component({
  selector: 'terminate-sip',
  templateUrl: './terminate-sip.component.html',
  styleUrls: ['./terminate-sip.component.css']
})
export class TerminateSIPComponent implements OnInit {
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
 */
searchSipReport = () =>{

}

}
