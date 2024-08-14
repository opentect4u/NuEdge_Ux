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
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
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

  disclaimer:string | undefined = '';

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
        .subscribe((res:Partial<{data:IliveSip[],disclaimer:string}>) =>{
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
        dt.push({
            "Sl No":(index + 1),
            "Business Type":el.bu_type,
            "Branch" : el.branch,
            "RM":el.rm_name,
            "Sub Broker Code":el.sub_brk_cd,
            "EUIN":el.euin_no,
            "Investor Name":el.first_client_name,
            "PAN":el.first_client_pan,
            "Reg. Date":  this.datePipe.transform(el.reg_date,'dd-MM-YYYY'),
           "Reg. No": el.reg_no,
            "AMC":el.amc_short_name,
            "Scheme":`${el.scheme_name}-${el.plan_name}-${el.option_name}`,
            "Category":el.cat_name,
            "Sub Category":el.subcat_name,
            "Folio":el.folio_no,
            "Transaction Type":el.transaction_type,
            "Transaction Sub Type":el.transaction_subtype,
            "Start Date":el.from_date,
            "End Date":el.to_date,
            "SIP Date":el.sip_date,
            "Amount":el.amount,
            "Frequency":el.frequency,
            "Duration (Monthly)":el.duration,
            "Bank":el.bank_name,
            "Account No":el.acc_no,
            "Reg. Mode":el.reg_mode,
            "Remarks":el.remarks
        })
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dt, { header:column});
    XLSX.utils.book_append_sheet(wb, ws, 'LIVESIP');
    var wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });
    const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'LIVESIPREPORT.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
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
