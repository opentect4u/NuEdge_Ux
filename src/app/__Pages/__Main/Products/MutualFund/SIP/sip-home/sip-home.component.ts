import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
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


  sip_type:string = 'L';

  report_type:string = 'P';

  /**
   * Holding Transaction Type  Master Data
   */
    // trxnTypeMst: rntTrxnType[] = [];
  /**
  * holding Amc master data
  */
   amcMst:amc[] = [];

   /**
    *  get SIP Type Master data
    */
   sip_stp_swp_type_mst:any = [];

   /**
   * For holding client those are  present only in transaction.
   */
  //  clientMst:any=[];

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

  ngOnInit(): void {
    this.getAmcMst();
    // this.getClientMst();
    // this.getTrxnTypeMst();
    this.getSIPType();
  }


  /**
   * Event for getting sip type master data
   */
  getSIPType(){
    this.dbIntr.api_call(0,'/sipType',null).pipe(pluck('data')).subscribe(res =>{
      this.sip_stp_swp_type_mst = res;
    })
  }

  /**
   * Event fired at the time of change tab
   * @param tabDtls
   */
  TabDetails = <T extends {index:number,tabDtls:{tab_name:string,id:number,img_src:string,flag:string}}>(data:T) : void => {
    console.log(data.tabDtls);
    this.tabindex =data.index;
    this.getSubTab(data.tabDtls.flag);
    this.sip_type = data.tabDtls.flag;
  }

  /**
   * get Sub Tab Inside Registered SIP / Matured SIP
   * @param flag
   */
  getSubTab = (flag:string) =>{
    console.log(flag);
    let dt = menu.filter(item => item.id == 3)[0].sub_menu;
    console.log(dt);
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
  //  getClientMst = () =>{
  //   this.dbIntr.api_call(0,'/searchClient',null).pipe(pluck("data")).subscribe(res =>{
  //    this.clientMst = res;
  //   })
  //  }

   /**
   * Cal API for getting Transaction Type Master Data
   */
  // getTrxnTypeMst = () => {
  //   this.dbIntr
  //     .api_call(0, '/rntTransTypeSubtypeShow', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res: rntTrxnType[]) => {
  //       this.trxnTypeMst = res;
  //     });
  // };
}
