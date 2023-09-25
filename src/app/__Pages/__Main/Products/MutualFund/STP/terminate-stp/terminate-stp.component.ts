import { Component, Input, OnInit } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveStp } from '../live-stp/live_stp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'terminate-stp',
  templateUrl: './terminate-stp.component.html',
  styleUrls: ['./terminate-stp.component.css']
})
export class TerminateStpComponent implements OnInit {


  @Input() stpType:string;

  __title:string = 'Terminate STP Report';

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
column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('TS-2'));

/**
 * Hold Sip Report result
 */
live_stp_rpt:Partial<IliveStp[]> = [];

constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

ngOnInit(): void {}
LiveStpReport = (formDt) =>{
  this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(formDt))
  .pipe(pluck('data'))
  .subscribe((res: IliveStp[]) =>{
    console.log(res);
       this.live_stp_rpt = res;
  })
}

/**
* Get Sip Report result
* @param ev
*/
searchSipReport = (ev) =>{
this.LiveStpReport({...ev,stp_type:this.stpType});
}

}
