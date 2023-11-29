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

  // column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

  column = live_sip_stp_swp_rpt.columns.filter((item) =>
    item.isVisible.includes('P')
  );

  pause_sip: Partial<IliveSip>[] = [];

  constructor(private dbIntr: DbIntrService, private utility: UtiliService) {}

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
      .subscribe((res: Partial<IliveSip>[]) => {
        this.pause_sip = res;
        this.total_pause_sip_amt = global.calculatAmt(res);
        this.state = res.length > 0 ? displayMode[0] : displayMode[1];
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
}
