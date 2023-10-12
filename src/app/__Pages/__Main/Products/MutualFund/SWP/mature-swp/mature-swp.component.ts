import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../swp-home/swp-home.component';
import { amc } from 'src/app/__Model/amc';
import { IliveSwp } from '../live-swp/live_swp.interface';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { Table } from 'primeng/table';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'matured-swp',
  templateUrl: './mature-swp.component.html',
  styleUrls: ['./mature-swp.component.css']
})
export class MatureSwpComponent implements OnInit {
/**
   * Sub Tab Details
   */
@Input() sub_tab: ITab[] = [];

sub_type: string = 'MM';

__title: string = '';

@Input() sip_stp_swp_type_mst: any = [];

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
@Input() report_type: string;

reset_data: string = 'N';

index: number = 0;

total_matured_swp_amt:number = 0;


mature_swp: Partial<IliveSwp>[] = [];

column = live_sip_stp_swp_rpt.columns.filter((item) =>
  item.isVisible.includes('LS-3')
);

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
  console.log(this.sub_type);
  this.setTitle(data.tabDtls.tab_name);
  this.reset_data = 'Y';
}

searchSwpReport = (ev) =>{
  this.getMaturedSwpMasterData(ev);
}
setTitle = (title:string) =>{
  this.__title = title;
}
filterGlobal = (ev) =>{
  let value = ev.target.value;
  this.primeTbl.filterGlobal(value, 'contains');
}

getMaturedSwpMasterData(form_data){
  this.reset_data = 'N';
  let dt = {
    ...form_data,
    sub_type:this.sub_type,
    report_type:this.report_type
  }
  this.dbIntr.api_call(1,'/showSipStpDetails',this.utility.convertFormData(dt))
  .pipe(pluck('data'))
  .subscribe((res:Partial<IliveSwp>[]) =>{
    this.mature_swp = res;
    this.total_matured_swp_amt = global.calculatAmt(res);
  })
}

}
