import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from './live_sip.interface';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';
import { DatePipe } from '@angular/common';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
@Component({
  selector: 'live-sip',
  templateUrl: './live-sip.component.html',
  styleUrls: ['./live-sip.component.css']
})
export class LiveSIPComponent implements OnInit {


  state:string = displayMode[1];

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

  disclaimer:Partial<IDisclaimer> | undefined;

  /**
   * Hold Sip Report result
   */
  live_sip_rpt: Partial<IliveSip[]> = [];


  constructor(private dbIntr: DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {}


   ngAfterViewInit(){
    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
      this.changeWheelSpeed(el, 0.99);
   }

   changeWheelSpeed(container, speedY) {
    var scrollY = 0;
    var handleScrollReset = function() {
        scrollY = container.scrollTop;
    };
    var handleMouseWheel = function(e) {
        e.preventDefault();
        scrollY += speedY * e.deltaY
        if (scrollY < 0) {
            scrollY = 0;
        } else {
            var limitY = container.scrollHeight - container.clientHeight;
            if (scrollY > limitY) {
                scrollY = limitY;
            }
        }
        container.scrollTop = scrollY;
    };

    var removed = false;
    container.addEventListener('mouseup', handleScrollReset, false);
    container.addEventListener('mousedown', handleScrollReset, false);
    container.addEventListener('mousewheel', handleMouseWheel, false);

    return function() {
        if (removed) {
            return;
        }
        container.removeEventListener('mouseup', handleScrollReset, false);
        container.removeEventListener('mousedown', handleScrollReset, false);
        container.removeEventListener('mousewheel', handleMouseWheel, false);
        removed = true;
    };
}

  LiveSipReport = (formDt) =>{
    this.live_sip_rpt = [];
       let dt ={
        ...formDt,
        report_type:this.report_type
       }
        this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
        .pipe(pluck('data'))
        .subscribe((res:Partial<{data:IliveSip[],disclaimer:Partial<IDisclaimer>}>) =>{
            this.disclaimer = res.disclaimer;
             this.live_sip_rpt = res.data;
             this.total_live_sip_amt = global.calculatAmt(res.data);
             this.pause_sip_count = res.data.filter(item => item.pause_end_date && item.pause_start_date).length;
             this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
            //  this.exportExcel();
            });


  }

  exportExcel = () =>{
    const column = this.column.map(el => el.header);
    let dt = [];
    this.live_sip_rpt.forEach((el,index) =>{
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
          el.from_date  ? this.datePipe.transform(el.from_date,'dd-MM-YYYY') : '',
          el.to_date  ? this.datePipe.transform(el.to_date,'dd-MM-YYYY') : '',
          el.sip_date,
          el.amount,
          el.freq,
          el.duration,
          el.bank_name,
          el.acc_no,
          el.reg_mode,
          el.remarks
      ])
    });
    const footerDetails = [
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
     global.Total__Count(this.live_sip_rpt,(x:any)=> x.amount ? Number(x.amount) : 0),
     '',
     '',
     '',
     '',
     '',
     ''
    ];
    global.exportExcel(
      this.disclaimer,column,dt,'LIVE SIP','LIVE_SIP.xlsx',footerDetails
    )
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
    }

  /**
   * Get Sip Report result
   * @param ev
   */
  searchSipReport = (ev) =>{
   this.LiveSipReport({...ev,sip_type:this.sipType});
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };

  changeState = (event) =>{
    this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
  }
}
