import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { amc } from 'src/app/__Model/amc';
import { IliveSip } from '../live-sip/live_sip.interface';
import { Table } from 'primeng/table';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';

@Component({
  selector: 'pause-sip',
  templateUrl: './pause-sip.component.html',
  styleUrls: ['./pause-sip.component.css']
})
export class PauseSIPComponent implements OnInit {

  __title: string = 'Pause SIP';

  @ViewChild('primeTbl') primeTbl: Table;



    @Input() sip_stp_swp_type_mst:any = [];

    /**
   * For Holding AMC Master Data
   */
    @Input() amc: amc[] = [];

    /**
     *
     */
    @Input() sipType: string;

    /**
     *
     */
    @Input() report_type:string;

    // column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

    column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P'));

    pause_sip:Partial<IliveSip>[] = []

  constructor() { }

  ngOnInit(): void {
    console.log(this.sipType);
    console.log(this.report_type);

  }


  searchSipReport(ev){
    console.log(ev);

  }


  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
}
