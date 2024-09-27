import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../stp-home/stp-home.component';
import { amc } from 'src/app/__Model/amc';
import { IliveStp } from '../live-stp/live_stp.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import {displayMode} from '../../../../../../Enum/displayMode';
import { IDisclaimer } from '../../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'registered-stp',
  templateUrl: './registered-stp.component.html',
  styleUrls: ['./registered-stp.component.css']
})
export class RegisteredStpComponent implements OnInit {

  state:string = displayMode[1];
  @Input() sub_tab:ITab[] = [];

  __title:string = ''

  sub_type:string = 'RR';


  @Input() sip_stp_swp_type_mst:any = [];

  /**
 * For Holding AMC Master Data
 */
  @Input() amc: amc[] = [];

  /**
   *
   */
  @Input() stpType: string;

  disclaimer:Partial<IDisclaimer> | undefined;

  /**
   *
   */
  @Input() report_type:string;

  reset_data:string = 'N';

  index:number = 0;

  register_stp:Partial<IliveStp>[] = [];

  total_resgistered_stp_amt:number = 0;

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-2'));

  @ViewChild('primeTbl') primeTbl: Table;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.setTitle(this.sub_tab[0].tab_name);
  }


   /**
   * Event fired at the time of change tab
   * @param tabDtls
   */
    TabDetails  = <T extends {index:number,tabDtls:{tab_name:string,id:number,img_src:string,flag:string}}>(data:T) : void => {
      this.sub_type = data.tabDtls.flag;
      this.setTitle(data.tabDtls.tab_name);
      this.reset_data = 'Y';
      this.column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes(this.sub_type == 'RR' ? 'LS-2' : 'U1'));
    }

    searchStpReport = (ev):void =>{
         this.registertStpMasterData(ev);
    }

    filterGlobal = (ev) =>{
      let value = ev.target.value;
      this.primeTbl.filterGlobal(value, 'contains');
    }

    setTitle = (title:string) =>{
      this.__title = title;
    }

    registertStpMasterData(form_data){
      this.register_stp = [];
      this.reset_data = 'N';
      let dt = {
        ...form_data,
        sub_type:this.sub_type,
        report_type:this.report_type,
       stp_type:this.stpType

      }
      this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res: Partial<{data:Partial<IliveStp>[],disclaimer:Partial<IDisclaimer>}>) =>{
        this.register_stp = res.data;
        this.total_resgistered_stp_amt = global.calculatAmt(res.data);
       this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
       this.disclaimer = res.disclaimer;

      })
    }

    changeState = (event) =>{
      this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
    }

    exportExcel = () =>{
      const column = this.column.map(el => el.header);
      let dt = [];
      this.register_stp.forEach((el:any,index) =>{
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
            el.to_cat_name,
            el.to_subcat_name,
            `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
            `${el.to_scheme_name}-${el.to_plan_name}-${el.to_option_name}`,
            el.folio_no,
            el.trans_type,
            el.trans_sub_type,
            this.datePipe.transform(el.from_date,'dd-MM-YYYY'),
            this.datePipe.transform(el.to_date,'dd-MM-YYYY'),
            this.report_type == 'P' ? el.sip_date: (this.report_type == 'R' ? el.swp_date : el.stp_date),
            el.amount,
            el.freq,
            el.duration,
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
            el.to_cat_name,
            el.to_subcat_name,
            `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
            `${el.to_scheme_name}-${el.to_plan_name}-${el.to_option_name}`,
            el.folio_no,
            el.trans_type,
            el.trans_sub_type,
            this.datePipe.transform(el.from_date,'dd-MM-YYYY'),
            this.datePipe.transform(el.to_date,'dd-MM-YYYY'),
            this.report_type == 'P' ? el.sip_date: (this.report_type == 'R' ? el.swp_date : el.stp_date),
            el.amount,
            el.freq,
            el.duration,
            el.terminated_date ? this.datePipe.transform(el.terminated_date,'dd-MM-YYYY') : '',
            el.reg_mode,
            el.remarks
        ])
        }
      });
        let footerDetails = [];
       if(this.sub_type == 'RR'){
        footerDetails=[
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
          '',
          global.Total__Count(this.register_stp,(x:any)=> x.amount ? Number(x.amount) : 0),
          '',
          '',
          '',
          ''
        ]
       }
       else{
        footerDetails=[
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
          '',
          global.Total__Count(this.register_stp,(x:any)=> x.amount ? Number(x.amount) : 0),
          '',
          '',
          '',
          '',
          ''
        ]
       }
      global.exportExcel(
        this.disclaimer,column,dt,this.sub_type != 'RR' ? 'UNREGISTER STP' : 'TO BE REGISTERED',this.sub_type != 'RR' ? 'UNREGISTER_STP.xlsx' : 'TOBEREGISTERED_STP.xlsx',footerDetails
      )
    }
}
