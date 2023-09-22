import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { IliveSip } from '../live-sip/live_sip.interface';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { Table } from 'primeng/table';

@Component({
  selector: 'terminate-sip',
  templateUrl: './terminate-sip.component.html',
  styleUrls: ['./terminate-sip.component.css'],
})
export class TerminateSIPComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;
  __title: string = 'Search Terminate SIP Report';

  @Input() sipType: string;

  /**
   * Holding Transaction Type  Master Data
   */
  @Input() trxnTypeMst: rntTrxnType[] = [];

  /**
   * For Holding AMC Master Data
   */
  @Input() amc: amc[] = [];

  /**
   * For holding client those are  present only in transaction.
   */
  @Input() client: any = [];
  /**
   * Set Column for Terminate SIP REPORT
   */
  column = live_sip_stp_swp_rpt.columns.filter((item) =>
    item.isVisible.includes('TS-1')
  );

  /**
   * Hold Sip Report result
   */
  live_sip_rpt: Partial<IliveSip[]> = [];

  constructor(private dbIntr: DbIntrService, private utility: UtiliService) {}

  ngOnInit(): void {}

  LiveSipReport = (formDt) => {
    this.dbIntr
      .api_call(1, '/showSipStpDetails', this.utility.convertFormData(formDt))
      .pipe(pluck('data'))
      .subscribe((res: IliveSip[]) => {
        console.log(res);
        this.live_sip_rpt = res;
      });
  };

  /**
   * Get Sip Report result
   * @param ev
   */
  searchSipReport = (ev) => {
    this.LiveSipReport({ ...ev, sip_type: this.sipType });
  };

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
}
