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

@Component({
  selector: 'registered-stp',
  templateUrl: './registered-stp.component.html',
  styleUrls: ['./registered-stp.component.css']
})
export class RegisteredStpComponent implements OnInit {

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

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

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
      this.reset_data = 'N';
      let dt = {
        ...form_data,
        sub_type:this.sub_type,
        report_type:this.report_type,
       stp_type:this.stpType

      }
      this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res:Partial<IliveStp>[]) =>{
        this.register_stp = res;
        this.total_resgistered_stp_amt = global.calculatAmt(res);
      })
    }
}
