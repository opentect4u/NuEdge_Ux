
import { Component, OnInit, ViewChild } from '@angular/core';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import mis_tab from '../../../../../../../../assets/json/Product/MF/MIS/monthly_MIS_Trend.json';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { TrxnType } from '../../TransactionReport/trxn-rpt/trxn-rpt.component';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck} from 'rxjs/operators';

declare type MisFlag = "I" | "O";

@Component({
  selector: 'app-monthly-mis',
  templateUrl: './monthly-mis.component.html',
  styleUrls: ['./monthly-mis.component.css']
})
export class MonthlyMisComponent implements OnInit {


  form__data:any;

  @ViewChild('MISTABLE') __MisTbleComponent;

  mis_tab: { id: number, tab_name: string, img_src: string, flag: string }[] = [];

  /**
   * Hold column for transaction table
   */
  __monthly__MIS_Column: column[] = trxnClm.column.filter((item: column) => (item.field != 'amc_link' && item.field != 'scheme_link' && item.field != 'isin_link' && item.field != 'plan_name' && item.field != 'option_name' && item.field != 'plan_opt' && item.field != 'divident_opt' && item.field != 'lock_trxn'));

  /**
   * Holding Monthly MIS Master Data
   */
  __monthly_mis_trxn: Partial<TrxnRpt[]> = []

  transType: string = 'Total';

  trxn_count: TrxnType;

  flag:MisFlag = "I";

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    this.mis_tab = mis_tab.monthly_mis.map((item) => ({ ...item, img_src: ('../../../../../assets/images/monthlyMIS/' + item.img_src) }))
  }


  getMisReport = (filter__criteria):void =>{
    console.log({...filter__criteria,flag:this.flag});

      // this.dbIntr.api_call(1,'/showTransDetails',this.utility.convertFormData(filter__criteria))
      // .pipe(pluck('data'))
      // .subscribe((res:Partial<TrxnRpt[]>) =>{
      //   this.__monthly_mis_trxn = res;
      // })
  }

  // changeWheelSpeed(container, speedY) {
  //   var scrollY = 0;
  //   var handleScrollReset = function () {
  //     scrollY = container.scrollTop;
  //   };
  //   var handleMouseWheel = function (e) {
  //     e.preventDefault();
  //     scrollY += speedY * e.deltaY
  //     if (scrollY < 0) {
  //       scrollY = 0;
  //     } else {
  //       var limitY = container.scrollHeight - container.clientHeight;
  //       if (scrollY > limitY) {
  //         scrollY = limitY;
  //       }
  //     }
  //     container.scrollTop = scrollY;
  //   };

  //   var removed = false;
  //   container.addEventListener('mouseup', handleScrollReset, false);
  //   container.addEventListener('mousedown', handleScrollReset, false);
  //   container.addEventListener('mousewheel', handleMouseWheel, false);

  //   return function () {
  //     if (removed) {
  //       return;
  //     }
  //     container.removeEventListener('mouseup', handleScrollReset, false);
  //     container.removeEventListener('mousedown', handleScrollReset, false);
  //     container.removeEventListener('mousewheel', handleMouseWheel, false);
  //     removed = true;
  //   };
  // }

  ngAfterViewInit() {
    // const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    // this.changeWheelSpeed(el, 0.99);
  }

  /***** SEARCH MONTHLY MIS REPORT*/
  searchFilter = (ev) => {
    this.form__data = ev;
    this.getMisReport(ev)
  }
  /*******END */

  TabDetails = (ev) => {
    this.flag = ev?.tabDtls?.flag;
    this.getMisReport(this.form__data)
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.__MisTbleComponent.primeTbl.filterGlobal(value, 'contains')
  }
}