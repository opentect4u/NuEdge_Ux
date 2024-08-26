import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { amc } from 'src/app/__Model/amc';
import { IliveSip } from '../live-sip/live_sip.interface';
import { Table } from 'primeng/table';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import { displayMode } from '../../../../../../Enum/displayMode';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
@Component({
  selector: 'pause-sip',
  templateUrl: './pause-sip.component.html',
  styleUrls: ['./pause-sip.component.css'],
})
export class PauseSIPComponent implements OnInit {
  state: string = displayMode[1];
  __title: string = 'Pause SIP';

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() sip_stp_swp_type_mst: any = [];

  /**
   * For Holding AMC Master Data
   */
  @Input() amc: amc[] = [];

  /**
   * hold Total Pause SIP Amount
   */
  total_pause_sip_amt: number = 0;
  /**
   *
   */
  @Input() sipType: string;

  /**
   *
   */
  @Input() report_type: string;

  disclaimer:Partial<IDisclaimer> | undefined;

  // column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

  column = live_sip_stp_swp_rpt.columns.filter((item) =>
    item.isVisible.includes('P')
  );

  pause_sip: Partial<IliveSip>[] = [];

  constructor(private dbIntr: DbIntrService, private utility: UtiliService,private datePipe:DatePipe) {}

  ngOnInit(): void {
  }

  searchSipReport(ev) {
    this.PauseSipReport(ev);
  }
  PauseSipReport = (formDt) => {
    this.pause_sip = [];
    let dt = {
      ...formDt,
      report_type: this.report_type,
      sip_type: this.sipType,
    };
    this.dbIntr
      .api_call(1, '/showSipStpDetails', this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res:Partial<{data:Partial<IliveSip>[],disclaimer:Partial<IDisclaimer>}>) => {
        this.pause_sip = res.data;
        this.disclaimer = res.disclaimer;
        this.total_pause_sip_amt = global.calculatAmt(res.data);
        this.state = res.data.length > 0 ? displayMode[0] : displayMode[1];
      });
  };

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
  changeState = (event) => {
    this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
  };

  ngAfterViewInit(){
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
      this.changeWheelSpeed(el, 0.99);
    }, 500);
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
exportExcel = () =>{
  const column = this.column.map(el => el.header);
  let dt = [];
  this.pause_sip.forEach((el,index) =>{
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
          "Pause Start Date":el.pause_start_date ? this.datePipe.transform(el.pause_start_date,'dd-MM-YYYY') : '',
          "Pause End Date":el.pause_end_date ? this.datePipe.transform(el.pause_end_date,'dd-MM-YYYY') : '',
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
  XLSX.utils.book_append_sheet(wb, ws, 'PAUSESIP');
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary'
  });
  const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PAUSESIPREPORT.xlsx');
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
}
