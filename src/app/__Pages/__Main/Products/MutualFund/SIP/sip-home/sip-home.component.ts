import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
export interface ITab{
  tab_name:string,
  id:number,
  img_src:string,
  flag:string
}

@Component({
  selector: 'app-sip-home',
  templateUrl: './sip-home.component.html',
  styleUrls: ['./sip-home.component.css']
})

export class SipHomeComponent implements OnInit {
  /**
  * holding Amc master data
  */
   amcMst:amc[] = [];

   /**
   * For holding client those are  present only in transaction.
   */
   clientMst:any=[];

  sub_tab_menu:ITab[] = [];

  /**
   * Holding Active Tab Index number
   */
  tabindex:number = 0;

  /**
   * getting Particular Tab Details For SIP Report
   */
  TabMenu:Partial<ITab[]> = (menu.filter(item => item.id == 3)[0].sub_menu)
  .map((item) => ({tab_name:item.title,img_src:('../../../../../assets/images/'+item.img),id:item.id,flag:item.flag}))

  constructor(private dbIntr:DbIntrService) {}

  ngOnInit(): void {this.getAmcMst();this.getClientMst();}

  /**
   * Event fired at the time of change tab
   * @param tabDtls
   */
  TabDetails = <T extends {index:number,tabDtls:{tab_name:string,id:number,img_src:string,flag:string}}>(data:T) : void => {
    this.tabindex =data.index;
    this.getSubTab(data.tabDtls.flag);
  }

  /**
   * get Sub Tab Inside Registered SIP / Matured SIP
   * @param flag
   */
  getSubTab = (flag:string) =>{
    let dt = menu.filter(item => item.id == 3)[0].sub_menu;
    this.sub_tab_menu = (dt as any[]).filter(item => item.flag == flag)[0].sub_menu
    .map((item) => ({tab_name:item.title,img_src:('../../../../../assets/images/'+item.img),id:item.id,flag:item.flag}));
  }

  /**
   * Get AMC Master Data from Backend API
   */
  getAmcMst = () => {
    this.dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.amcMst = res;
      });
  };

   /**
   * Get Client Master Data
   */
   getClientMst = () =>{
    this.dbIntr.api_call(0,'/searchClient',null).pipe(pluck("data")).subscribe(res =>{
     this.clientMst = res;
    })
   }
}
