import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../sip-home/sip-home.component';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { IliveSip } from '../live-sip/live_sip.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';

@Component({
  selector: 'registered-sip',
  templateUrl: './registered-sip.component.html',
  styleUrls: ['./registered-sip.component.css']
})
export class RegisteredSIPComponent implements OnInit {

  @Input() sub_tab:ITab[] = [];

  sub_type:string = 'RR';

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

  register_sip:Partial<IliveSip>[] = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'));

  @ViewChild('primeTbl') primeTbl: Table;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    this.setTitle(this.sub_tab[0].tab_name);
  }

  searchSipReport(ev){
    console.log(ev);
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
        this.register_sip = res;
      })
    }

    filterGlobal = ($event) => {
      let value = $event.target.value;
      this.primeTbl.filterGlobal(value, 'contains');
    };
}
