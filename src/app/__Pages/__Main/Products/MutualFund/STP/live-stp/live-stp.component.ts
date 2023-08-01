import { Component, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveStp } from './live_stp.interface';

@Component({
  selector: 'live-stp',
  templateUrl: './live-stp.component.html',
  styleUrls: ['./live-stp.component.css']
})
export class LiveStpComponent implements OnInit {
/**
   * Set Column for LIVE STP REPORT
   */
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-2'));

/**
 * Hold Stp Report result
 */
live_stp_rpt:Partial<IliveStp[]> = [];

constructor() { }

ngOnInit(): void {
}

/**
 * Get Stp Report result
 */
searchSipReport = () =>{

}


}
