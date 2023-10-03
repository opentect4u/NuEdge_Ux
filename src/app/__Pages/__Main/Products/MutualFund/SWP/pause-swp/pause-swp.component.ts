import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { amc } from 'src/app/__Model/amc';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';

@Component({
  selector: 'pause-swp',
  templateUrl: './pause-swp.component.html',
  styleUrls: ['./pause-swp.component.css']
})
export class PauseSwpComponent implements OnInit {

  __title:string = 'Pause SWP';

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() amc:amc[] = []

  @Input() swp_type:string = '';

  @Input() report_type:string = '';

  @Input() sip_stp_swp_type_mst = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P3'));

  pause_swp:any = [];

  constructor() { }

  ngOnInit(): void {
  }

  searchSwpReport = (ev):void =>{
   console.log(ev);
  }


  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
}
