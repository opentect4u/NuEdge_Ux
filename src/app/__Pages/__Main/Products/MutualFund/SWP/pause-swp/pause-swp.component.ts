import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'pause-swp',
  templateUrl: './pause-swp.component.html',
  styleUrls: ['./pause-swp.component.css']
})
export class PauseSwpComponent implements OnInit {

  __title:string = 'Pause SWP';

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() amc:amc[] = []

  @Input() swp_type:string;

  @Input() report_type:string;

  @Input() sip_stp_swp_type_mst = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P3'));

  pause_swp:Partial<IliveSwp>[] = [];

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
  }

  searchSwpReport = (ev):void =>{
   this.PauseSwpReport(ev);
  }


  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };

  PauseSwpReport = (formDt) =>{
    console.log(formDt)
    let dt ={
      ...formDt,
      report_type:this.report_type,
      swp_type:this.swp_type
    }
    this.dbIntr.api_call(1,'/showSipStpDetails',
    this.utility.convertFormData(dt))
    .pipe(pluck('data'))
    .subscribe((res: Partial<IliveSwp>[]) =>{
      console.log(res);
         this.pause_swp = res;
    })
  }
}
