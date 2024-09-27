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
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'terminate-swp',
  templateUrl: './terminate-swp.component.html',
  styleUrls: ['./terminate-swp.component.css']
})
export class TerminateSwpComponent implements OnInit {

  state:string = displayMode[1];

  disclaimer:Partial<IDisclaimer> | undefined;

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

constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }


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
  .subscribe((res:Partial<{data:IliveSwp[],disclaimer:Partial<IDisclaimer>}>) =>{
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

exportExcel = () =>{
  const column = this.column.map(el => el.header);
    let dt = [];
    this.live_swp_rpt.forEach((el:any,index) =>{
        dt.push([
          (index + 1),
          el.bu_type,
            el.branch_name,
          el.rm_name,
          (!el.sub_brk_cd.toLowerCase().includes('not') && el.sub_brk_cd && el.sub_brk_cd?.toString() != '0') ? el.sub_brk_cd : '',
          el.euin_no,
          el.first_client_name,
          el.first_client_pan,
          this.datePipe.transform(el.reg_date,'dd-MM-YYYY'),
          el.reg_no,
          el.amc_short_name,
          el.cat_name,
          el.subcat_name,
          `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
          el.folio_no,
          el.trans_type,
          el.trans_sub_type,
          this.datePipe.transform(el.from_date,'dd-MM-YYYY'),
          this.datePipe.transform(el.to_date,'dd-MM-YYYY'),
          el.swp_date,
          el.amount,
          el.freq,
          el.duration,
          el.terminated_date ? this.datePipe.transform(el.terminated_date,'dd-MM-YYYY') : '',
          el.reg_mode,
          el.remarks
      ])
    });
    let footerDetails = [
      'GRAND TOTAL',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      global.Total__Count(this.live_swp_rpt,(x:any)=> x.amount ? Number(x.amount) : 0),
      '',
      '',
      '',
      '',
      ''
    ]
    global.exportExcel(
      this.disclaimer,column,dt,'TERMINATE SWP','TERMINATE_SWP.xlsx',footerDetails
    )
}
}
