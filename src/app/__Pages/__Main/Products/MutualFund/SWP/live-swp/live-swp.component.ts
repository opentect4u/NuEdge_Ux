import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from './live_swp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'live-swp',
  templateUrl: './live-swp.component.html',
  styleUrls: ['./live-swp.component.css']
})
export class LiveSwpComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() swp_type:string;

  @Input() report_type:string;

  __title:string = 'Live SWP';
    /**
   * Holding Transaction Type  Master Data
   */
  @Input() trxnTypeMst: rntTrxnType[] = [];


  /**
   * Holding Live SWP Amount
   */
  total_live_swp_amt:number = 0;


 /**
  * For Holding AMC Master Data
  */
  @Input() amc:amc[] = [];

 /**
  * For holding client those are  present only in transaction.
  */
  @Input() client:any = [];
 /**
   * Set Column for LIVE SWP REPORT
   */
 column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-3'));

 /**
  * Hold Swp Report result
  */
 live_swp_rpt:Partial<IliveSwp[]> = [];


 @Input() sip_stp_swp_type_mst =[];

 constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

 ngOnInit(): void {
 }

 LiveSwpReport = (formDt) =>{
  let dt ={
    ...formDt,
    report_type:this.report_type
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',
  this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res: IliveSwp[]) =>{
    console.log(res);
       this.live_swp_rpt = res;
       this.total_live_swp_amt = global.calculatAmt(res);
  })
}

/**
   * Get Sip Report result
   * @param ev
   */
searchSwpReport = (ev) =>{
  // console.log(ev);
  this.LiveSwpReport({...ev,swp_type:this.swp_type});
 }

 filterGlobal = (ev):void =>{
  let value = ev.target.value;
  this.primeTbl.filterGlobal(value, 'contains');
 }
}
