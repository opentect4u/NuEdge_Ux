import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  selector: 'pause-stp',
  templateUrl: './pause-stp.component.html',
  styleUrls: ['./pause-stp.component.css']
})
export class PauseStpComponent implements OnInit {
  state:string = displayMode[1];

  @ViewChild('primeTbl') primeTbl: Table;

  @Input() stpType:string;

  @Input() report_type:string;

  __title:string = 'Pause STP';

  @Input() amc:amc [] = [];

  @Input() sip_stp_swp_type_mst:any = [];

  pause_stp:Partial<IliveStp>[] = [];

  total_pause_stp_amt:number = 0;
  
  disclaimer:Partial<IDisclaimer> | undefined ;
  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('P2'));
  constructor(private dbIntr:DbIntrService,private utility:UtiliService,private datePipe:DatePipe) { }

  ngOnInit(): void {
  }


  searchStpReport =(ev):void =>{
    this.PauseStpReport(ev);
  }

  PauseStpReport = (formDt) =>{
    this.pause_stp = [];
    let dt ={
      ...formDt,
      report_type:this.report_type,
      stp_type:this.stpType
    }
    this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
    .pipe(pluck('data'))
    .subscribe((res: Partial<{data:Partial<IliveStp>[],disclaimer:Partial<IDisclaimer>}>) =>{
         this.pause_stp = res.data;
         this.total_pause_stp_amt = global.calculatAmt(res.data);
         this.state =  res.data.length > 0 ? displayMode[0] : displayMode[1];
         this.disclaimer =res.disclaimer;
    })
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };
  changeState = (event) =>{
    this.state = event == displayMode[0] ? displayMode[1] : displayMode[0];
  }

  exportExcel = () =>{
    const column = this.column.map(el => el.header);
    let dt = [];
    this.pause_stp.forEach((el:any,index) =>{
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
            el.pause_start_date ? this.datePipe.transform(el.pause_start_date,'dd-MM-YYYY') : '',
            el.pause_end_date ? this.datePipe.transform(el.pause_end_date,'dd-MM-YYYY') : '',
            this.report_type == 'P' ? el.sip_date: (this.report_type == 'R' ? el.swp_date : el.stp_date),
            el.amount,
            el.freq,
            el.duration,
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
      '',
      '',
      '',
      global.Total__Count(this.pause_stp,(x:any)=> x.amount ? Number(x.amount) : 0),
      '',
      '',
      '',
      ''
      ]
    global.exportExcel(
      this.disclaimer,column,dt,'PAUSE STP','PAUSE_STP.xlsx',footerDetails
    )
  }
}
