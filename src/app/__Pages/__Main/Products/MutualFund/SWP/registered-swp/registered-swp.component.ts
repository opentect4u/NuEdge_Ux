import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../swp-home/swp-home.component';
import { amc } from 'src/app/__Model/amc';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';

@Component({
  selector: 'registered-swp',
  templateUrl: './registered-swp.component.html',
  styleUrls: ['./registered-swp.component.css']
})
export class RegisteredSwpComponent implements OnInit {

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
  @Input() swp_type: string;

  /**
   *
   */
  @Input() report_type:string;

  reset_data:string = 'N';

  index:number = 0;

  register_swp:Partial<IliveSwp>[] = [];

  column = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-3'));

  @ViewChild('primeTbl') primeTbl: Table;

  ngOnInit(): void {
    this.setTitle(this.sub_tab[0].tab_name);
  }

  searchSwpReport = (ev) =>{

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

    filterGlobal = ($event) => {
      let value = $event.target.value;
      this.primeTbl.filterGlobal(value, 'contains');
    };
}
