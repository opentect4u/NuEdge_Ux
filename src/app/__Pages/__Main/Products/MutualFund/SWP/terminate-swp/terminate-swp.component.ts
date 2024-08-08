import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';

@Component({
  selector: 'terminate-swp',
  templateUrl: './terminate-swp.component.html',
  styleUrls: ['./terminate-swp.component.css']
})
export class TerminateSwpComponent implements OnInit {

  state:string = displayMode[1];

  disclaimer:string | undefined = '';

  @Input() swp_type:string;

  @Input() report_type:string;

  __title:string = 'Terminate SWP';

  @ViewChild('primeTbl') primeTbl: Table;

  @Input()  sip_stp_swp_type_mst:any = [];


  /**
 * Holding Transaction Type  Master Data
 */
@Input() trxnTypeMst: rntTrxnType[] = [];

/**
* For Holding AMC Master Data
*/
@Input() amc:amc[] = [];

total_terminate_swp_amt:number = 0

/**
* For holding client those are  present only in transaction.
*/
@Input() client:any = [];
/**
   * Set Column for LIVE SIP REPORT
   */
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('TS-3'));

/**
 * Hold Sip Report result
 */
live_swp_rpt:Partial<IliveSwp[]> = [];

constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }


ngOnInit(): void {
  setTimeout(() => {
    console.log(this.report_type);
  }, 3000);
}

LiveSwpReport = (formDt) =>{
  this.live_swp_rpt = [];
    let dt ={
    ...formDt,
    report_type:this.report_type,
    swp_type:this.swp_type
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',
  this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res:Partial<{data:IliveSwp[],disclaimer:string}>) =>{
       this.live_swp_rpt = res.data;
       this.total_terminate_swp_amt = global.calculatAmt(res.data);
       this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
       this.disclaimer = res.disclaimer;
  })
}

/**
   * Get Sip Report result
   * @param ev
   */
searchSwpReport = (ev) =>{
  this.LiveSwpReport({...ev,swp_type:this.swp_type});
 }


 filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value, 'contains');
  }
changeState = (event) =>{
  this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
}
}
