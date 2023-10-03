import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { amc } from 'src/app/__Model/amc';
import { IliveStp } from '../live-stp/live_stp.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';

@Component({
  selector: 'pause-stp',
  templateUrl: './pause-stp.component.html',
  styleUrls: ['./pause-stp.component.css']
})
export class PauseStpComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() stpType:string;

  @Input() report_type:string;

  __title:string = 'Pause STP';

  @Input() amc:amc [] = [];

  @Input() sip_stp_swp_type_mst:any = [];

  pause_stp:Partial<IliveStp>[] = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P2'));
  constructor() { }

  ngOnInit(): void {
  }


  searchStpReport =(ev):void =>{

  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
}
