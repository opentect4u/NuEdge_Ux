import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../sip-home/sip-home.component';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { IliveSip } from '../live-sip/live_sip.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';

@Component({
  selector: 'matured-sip',
  templateUrl: './matured-sip.component.html',
  styleUrls: ['./matured-sip.component.css']
})
export class MaturedSIPComponent implements OnInit {
  state:string = displayMode[1];
  @ViewChild('primeTbl') primeTbl: Table;

  @Input() sub_tab:ITab[] = [];

  sub_type:string = 'MM';

  __title:string = ''

  @Input() sip_stp_swp_type_mst:any = [];

  /**
 * For Holding AMC Master Data
 */
  @Input() amc: amc[] = [];

  /**
   *
   */
  @Input() sipType: string;

  /**
   *
   */
  @Input() report_type:string;

  reset_data:string = 'N';

  index:number = 0;

  mature_sip:Partial<IliveSip>[] = [];

  total_mature_sip_amt:number = 0;

    /**
   * Set Column for LIVE SIP REPORT
   */
    column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));


  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    this.setTitle(this.sub_tab[0].tab_name);
    // const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    //     this.changeWheelSpeed(el, 0.99);
  }

  searchSipReport(ev){
    this.getSipMasterData(ev);
  }


   /**
   * Event fired at the time of change tab
   * @param tabDtls
   */
    TabDetails  = <T extends {index:number,tabDtls:{tab_name:string,id:number,img_src:string,flag:string}}>(data:T) : void => {
          this.sub_type = data.tabDtls.flag;
          this.setTitle(data.tabDtls.tab_name);
          this.reset_data = 'Y';
    }

    setTitle = (title:string) =>{
      this.__title = title;
    }

    getSipMasterData(form_data){
      this.reset_data = 'N';
      let dt = {
        ...form_data,
        sub_type:this.sub_type,
        report_type:this.report_type,
        sip_type:this.sipType
      }
      this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res:Partial<IliveSip>[]) =>{
        this.mature_sip = res;
        this.total_mature_sip_amt = global.calculatAmt(res);
        this.state =  res.length > 0 ? displayMode[0] : displayMode[1];
      })
    }

    filterGlobal = ($event) => {
      let value = $event.target.value;
      this.primeTbl.filterGlobal(value, 'contains');
    };

    changeState = (event) =>{
      this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
    }

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
