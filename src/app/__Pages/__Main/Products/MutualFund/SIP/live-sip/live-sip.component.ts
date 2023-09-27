import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from './live_sip.interface';
import { amc } from 'src/app/__Model/amc';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'live-sip',
  templateUrl: './live-sip.component.html',
  styleUrls: ['./live-sip.component.css']
})
export class LiveSIPComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

 __title:string = 'Live SIP Report';

   @Input() report_type:string;

   @Input() sipType:string;

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
  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

  /**
   * Hold Sip Report result
   */
  live_sip_rpt: Partial<IliveSip[]> = [];

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {}


  LiveSipReport = (formDt) =>{
       let dt ={
        ...formDt,
        report_type:this.report_type
       }
        this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
        .pipe(pluck('data'))
        .subscribe((res: IliveSip[]) =>{
          console.log(res);
             this.live_sip_rpt = res;
        })
  }

  /**
   * Get Sip Report result
   * @param ev
   */
  searchSipReport = (ev) =>{
   console.log(ev);
   this.LiveSipReport({...ev,sip_type:this.sipType});
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };

}
