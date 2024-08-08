import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { amc } from 'src/app/__Model/amc';
import { IliveStp } from '../live-stp/live_stp.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';
@Component({
  selector: 'pause-stp',
  templateUrl: './pause-stp.component.html',
  styleUrls: ['./pause-stp.component.css']
})
export class PauseStpComponent implements OnInit {
  state:string = displayMode[1];

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() stpType:string;

  @Input() report_type:string;

  __title:string = 'Pause STP';

  @Input() amc:amc [] = [];

  @Input() sip_stp_swp_type_mst:any = [];

  pause_stp:Partial<IliveStp>[] = [];

  total_pause_stp_amt:number = 0;
  
  disclaimer:string | undefined = '';
  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P2'));
  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
  }


  searchStpReport =(ev):void =>{
    this.PauseStpReport(ev);
  }

  PauseStpReport = (formDt) =>{
    this.pause_stp = [];
    let dt ={
      ...formDt,
      report_type:this.report_type,
      stp_type:this.stpType
    }
    this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
    .pipe(pluck('data'))
    .subscribe((res: Partial<{data:Partial<IliveStp>[],disclaimer:string}>) =>{
         this.pause_stp = res.data;
         this.total_pause_stp_amt = global.calculatAmt(res.data);
         this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
         this.disclaimer =res.disclaimer;
    })
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
  changeState = (event) =>{
    this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
  }
}
