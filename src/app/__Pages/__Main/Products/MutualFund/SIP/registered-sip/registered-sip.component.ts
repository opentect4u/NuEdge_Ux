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
import { displayMode } from '../../../../../../Enum/displayMode';
import { DatePipe } from '@angular/common';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
@Component({
  selector: 'registered-sip',
  templateUrl: './registered-sip.component.html',
  styleUrls: ['./registered-sip.component.css']
})
export class RegisteredSIPComponent implements OnInit {

  state: string = displayMode[1];

  @Input() sub_tab:ITab[] = [];

  disclaimer:Partial<IDisclaimer> | undefined;

  sub_type:string = 'RR';

  __title:string = ''

  @Input() sip_stp_swp_type_mst:any = [];

  total_register_sip_amt:number=0;

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

  register_sip:Partial<IliveSip>[] = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

  @ViewChild('primeTbl') primeTbl: Table;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.setTitle(this.sub_tab[0].tab_name);
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
          this.column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes(this.sub_type == 'RR' ? 'LS-1' : 'U'));

    }

    setTitle = (title:string) =>{
      this.__title = title;
    }

    getSipMasterData(form_data){
      this.register_sip = [];
      this.reset_data = 'N';
      let dt = {
        ...form_data,
        sub_type:this.sub_type,
        report_type:this.report_type,
        sip_type:this.sipType
      }
      this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res:Partial<{data:Partial<IliveSip>[],disclaimer:Partial<IDisclaimer>}>) =>{
        this.register_sip = res.data;
        this.disclaimer = res.disclaimer;
        this.total_register_sip_amt = global.calculatAmt(res.data);
        this.state = res.data.length > 0 ? displayMode[0] : displayMode[1];
      })
    }

    exportExcel = () =>{
      const column = this.column.map(el => el.header);
      let dt = [];
      let footerDetails = []
      this.register_sip.forEach((el,index) =>{
        if(this.sub_type == 'RR'){
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
        }
        else{
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
            el.terminated_date ? this.datePipe.transform(el.terminated_date,'dd-MM-YYYY') : '',
            el.reg_mode,
            el.remarks
        ])
        }
      });

      if(this.sub_type == 'RR'){
        footerDetails = [
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
          global.Total__Count(this.register_sip,(x:any)=> x.amount ? Number(x.amount) : 0),
          '',
          '',
          '',
          '',
          '',
          ''
        ]
      }
      else{
        footerDetails = [
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
            global.Total__Count(this.register_sip,(x:any)=> x.amount ? Number(x.amount) : 0),
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        ]
      }
     
      global.exportExcel(
        this.disclaimer,column,dt,this.sub_type != 'RR' ? 'UNREGISTER SIP' : 'TO BE REGISTERED',this.sub_type != 'RR' ? 'UNREGISTER_SIP.xlsx' : 'TOBEREGISTERED_SIP.xlsx',footerDetails
      )
    }
  
    s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
      }

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
