import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from './live_sip.interface';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'live-sip',
  templateUrl: './live-sip.component.html',
  styleUrls: ['./live-sip.component.css']
})
export class LiveSIPComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

 __title:string = 'Live SIP';

 pause_sip_count:number = 0;

   @Input() report_type:string;

   @Input() sipType:string;

   @Input() sip_stp_swp_type_mst:any = [];

   total_live_sip_amt:number = 0;



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

  ngOnInit(): void {console.log('Report Type:' + this.sipType);}



  LiveSipReport = (formDt) =>{
       let dt ={
        ...formDt,
        report_type:this.report_type
       }
        this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
        .pipe(pluck('data'))
        .subscribe((res: IliveSip[]) =>{
             this.live_sip_rpt = res;
             this.total_live_sip_amt = global.calculatAmt(res);
             console.log(
              res.filter(item => item.pause_end_date && item.pause_start_date).length
             );
             this.pause_sip_count = res.filter(item => item.pause_end_date && item.pause_start_date).length;
        })
  }

  /**
   * Get Sip Report result
   * @param ev
   */
  searchSipReport = (ev) =>{
   console.log(ev);
  //  this.LiveSipReport({...ev,sip_type:this.sipType});
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };




}
