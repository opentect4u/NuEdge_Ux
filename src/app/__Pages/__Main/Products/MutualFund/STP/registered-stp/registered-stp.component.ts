import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../stp-home/stp-home.component';
import { amc } from 'src/app/__Model/amc';
import { IliveStp } from '../live-stp/live_stp.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';

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

  register_sip:Partial<IliveStp>[] = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-2'));

  @ViewChild('primeTbl') primeTbl: Table;

  constructor() { }

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

    }

    filterGlobal = (ev) =>{
      let value = ev.target.value;
      this.primeTbl.filterGlobal(value, 'contains');
    }

    setTitle = (title:string) =>{
      this.__title = title;
    }
}
