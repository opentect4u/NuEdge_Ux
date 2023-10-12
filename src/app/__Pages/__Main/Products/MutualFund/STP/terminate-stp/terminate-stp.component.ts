import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveStp } from '../live-stp/live_stp.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'terminate-stp',
  templateUrl: './terminate-stp.component.html',
  styleUrls: ['./terminate-stp.component.css']
})
export class TerminateStpComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;


  @Input() stpType:string;

  @Input() report_type:string;


  __title:string = 'Terminate STP';

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

@Input()  sip_stp_swp_type_mst:any = [];

total_terminate_stp_amt:number = 0;

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
terminateStpReport = (formDt) =>{
  let dt ={
    ...formDt,
    report_type:this.report_type,
    stp_type:this.stpType
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res: IliveStp[]) =>{
       this.live_stp_rpt = res;
       this.total_terminate_stp_amt = global.calculatAmt(res);
  })
}

/**
* Get Sip Report result
* @param ev
*/
searchSipReport = (ev) =>{
this.terminateStpReport(ev);
}

filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value, 'contains');
};

}
