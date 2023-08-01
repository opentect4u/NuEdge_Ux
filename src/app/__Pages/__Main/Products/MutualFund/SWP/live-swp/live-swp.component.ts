import { Component, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from './live_swp.interface';

@Component({
  selector: 'live-swp',
  templateUrl: './live-swp.component.html',
  styleUrls: ['./live-swp.component.css']
})
export class LiveSwpComponent implements OnInit {
 /**
   * Set Column for LIVE SWP REPORT
   */
 column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-3'));

 /**
  * Hold Swp Report result
  */
 live_swp_rpt:Partial<IliveSwp[]> = [];

 constructor() { }

 ngOnInit(): void {
 }

 /**
  * Get Swp Report result
  */
 searchSipReport = () =>{

 }
}
