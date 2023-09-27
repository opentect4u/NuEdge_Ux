import { Component, Input, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'terminate-swp',
  templateUrl: './terminate-swp.component.html',
  styleUrls: ['./terminate-swp.component.css']
})
export class TerminateSwpComponent implements OnInit {

  @Input() swp_type:string;

  @Input() report_type:string;

  __title:string = 'Terminate SWP Report';

  /**
 * Holding Transaction Type  Master Data
 */
@Input() trxnTypeMst: rntTrxnType[] = [];

/**
* For Holding AMC Master Data
*/
@Input() amc:amc[] = [];

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
  })
}

/**
   * Get Sip Report result
   * @param ev
   */
searchSwpReport = (ev) =>{
  this.LiveSwpReport({...ev,swp_type:this.swp_type});
 }
}
