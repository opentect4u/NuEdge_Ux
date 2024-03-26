/***
 *   Index [0] ==> Transaction File
 *   Index [1] ==> NAV File
 *   Index [2] ==> SIP/STP/SWP File
 *   Index [3] ==> Folio Master
 *   Index [3] ==> Broker Change
 */



import { Component, OnInit, ViewChild } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import tabs from '../../../../../assets/json/MailBack/mailbackMismatchTab.json';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { NavFinderColumns } from '../../Products/MutualFund/Research/nav-finder/nav-finder.component';
import { Column } from 'src/app/__Model/column';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';
import { FolioColumn } from '../../Products/MutualFund/PortFolio/Folio/folio.component';
import { Dialog } from 'primeng/dialog';

export interface ITab{
    id:number,
    tab_name:string,
    img_src:string,
    flag:string,
    sub_menu: IsubTab[]
  }

export interface IsubTab{
  id:number,
  tab_name:string,
  img_src:string,
  flag:string
}


enum API{
  'T' =  'mailbackMismatch', // For Transaction File Mismatch
  'N' = 'mailbackMismatchNAV', // For NAV File Mismatch
  'S' = 'mailbackMismatchSipStp', // For SIP STP Mismatch
  'F' = 'mailbackMismatchFolio', // For Folio Mismatch
  'B' = 'mailbackMismatchBroker' // For Broker Change Mismatch
}

@Component({
  selector: 'app-mailback-mismatch',
  templateUrl: './mailback-mismatch.component.html',
  styleUrls: ['./mailback-mismatch.component.css'],
})
export class MailbackMismatchComponent implements OnInit {

  @ViewChild('countModal') mismatchCount:Dialog;

  isvisible: boolean = false;


  count_tab_index: number = 0; /** For Holding the number of active tab in modal   */

  // form_type: string | undefined = '';

  /**
   * Holding count for each file type
   */
  misMatchCountFile:IMismatchCountFile[] = [];

  mismatch_flag:string = 'A';

  parent_mismatch_type:string;

  tblWidth:string | undefined;

  TrxnClm:column[] = trxnClm.column.filter(item=> !['option_name','plan_name','scheme_link','isin_link','plan_opt','divident_opt','lock_trxn'].includes(item.field)).filter((el) => el.isVisible.includes('T'));

  /**
   * Holding Transaction Report which has empty scheme
   */
  trxnTypeRpt: TrxnRpt[] = [];

  /**
   * hold the index number for currenctly active Tab
   * By Default index set to 0 as we need to show the content of currently active Tab
   */
  index: number = 0;

   /**
   * hold the index number for currenctly active Sub Tab
   * By Default index set to 0 as we need to show the content of currently active Tab
   */
   sub_index: number = 0;

  /**
   * Holding Tab Menu
   */
  TabMenu: Partial<ITab>[] = tabs.map(({ id, tab_name, flag, img_src, sub_menu }) => ({ tab_name: tab_name, img_src: ('../../../../../assets/images/' + img_src), id, flag, sub_menu }));


  /**
   * Holding Sub Tab Menu
   */
  subTab:IsubTab[] = tabs[0].sub_menu;

  constructor(private dbIntr: DbIntrService) {}

  ngOnInit(): void {
    this.getTrxnRpt('A','T'); //default Transaction File will be called
    // this.getmismatchFileCount();
  }

  /**
   * @param flag
   *  get Transaction Report Master Data
   *  need to show those transaction which has no scheme /AMC/Plan/Option/Bussiness Type
   */
  getTrxnRpt = (flag:string,file_flag:string) => {
    this.parent_mismatch_type = file_flag;
    this.mismatch_flag = flag;
    this.dbIntr
      .api_call(0, `/${API[file_flag]}`, 'mismatch_flag='+flag)
      .pipe(
        pluck('data'))
      .subscribe((res: TrxnRpt[]) => {
        // console.log(res);
        this.trxnTypeRpt = res;
      });
  };

  /**
   * Change Event Trigger After Tab Changes
   * @param TabDtls
   * @param mode
   */

  changeTabDtls = <T extends {index:number,tabDtls:IsubTab | ITab}>(TabDtls:T,mode:string) => {
    this.trxnTypeRpt = [];
    let __mode = '';
    let flag = '';
    let file_flag = '';
    switch(mode){
      case 'P':
        this.index = TabDtls.index;
        __mode = this.TabMenu[TabDtls.index].sub_menu[0].flag;
        this.subTab = this.TabMenu[TabDtls.index].sub_menu;
        flag = this.TabMenu[this.index].sub_menu[0].flag;
        file_flag = this.TabMenu[this.index].flag;
        break;
      case 'C':
        this.sub_index = TabDtls.index;
        __mode = TabDtls.tabDtls.flag;
        flag = TabDtls.tabDtls.flag;
        file_flag = this.TabMenu[this.index].flag;
        break;
      default:break;
    }

    this.tblWidth = this.index == 0 ? '350rem' : '150rem';
    this.column_manage(__mode);
    if(mode == 'P' && this.sub_index > 0){
      /** condition for checking whether the api is not called twice at same time
        * as the parent & child tabs are changed at same time.
        * */
        this.sub_index = 0;
        return;
    }
    else{
      this.getTrxnRpt(flag,file_flag);
    }
  }

  column_manage = (flag:string) =>{
    const clm_divident:string[] = ['amc_link','scheme_link','isin_link','plan_opt'];
    const clm: string[] = ['divident_opt', 'scheme_link', 'isin_link', 'option_name', 'plan_name', 'plan_opt', 'lock_trxn'];
    const scm_clm:string[] = ['amc_link','scheme_link','isin_link','divident_opt','lock_trxn'];
    const opt_clm:string[] = ['amc_link','option_name','plan_name','plan_opt','divident_opt','lock_trxn'];
    const bu_clm_toRemove:string[] = ['amc_link','scheme_link','isin_link','divident_opt','lock_trxn','option_name','plan_name','plan_opt'];
    switch(flag){
      case 'A': this.TrxnClm = (this.index == 0 || this.index == 4) ? trxnClm.column.filter(item => !clm.includes(item.field) && item.isVisible.includes(this.index > 0 ? 'B' : 'T' ))
        : (this.index == 1
          ? [...NavFinderColumns.column, ...NavMismatchColumnForAMCLink.column.filter(items => items.isVisible.includes(this.index))]
          : (this.index == 3
            ? [...FolioColumn.column, ...NavMismatchColumnForAMCLink.column.filter(items => items.isVisible.includes(this.index))]
            : [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')), ...NavMismatchColumnForAMCLink.column.filter(items => items.isVisible.includes(this.index))]
          ));
        break;
      case 'B': this.TrxnClm = (this.index == 0 || this.index == 4) ? [...trxnClm.column.filter(item => !bu_clm_toRemove.includes(item.field) && item.isVisible.includes(this.index > 0 ? 'B' : 'T' )), ...MailBackMismatchCommonColumn.column.filter((item: column) => item.isVisible.includes(flag))]
            :
            (this.index == 3 ? [...FolioColumn.column,...MailBackMismatchCommonColumn.column.filter((item: column) => item.isVisible.includes(flag))]
            : [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')),...MailBackMismatchCommonColumn.column.filter((item: column) => item.isVisible.includes(flag))]);
      break;
      case 'S': this.TrxnClm = (this.index == 0 || this.index == 4) ?
       this.TrxnClm = trxnClm.column.filter(item => !opt_clm.includes(item.field) && item.isVisible.includes(this.index > 0 ? 'B' : 'T' ))
       :  (this.index == 1
       ? [...NavFinderColumns.column,...NavMismatchColumnForSchemeLink.column]
       :  (this.index == 3 ? [...FolioColumn.column,...NavMismatchColumnForSchemeLink.column]
        : [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')),...NavMismatchColumnForSchemeLink.column]
        ));
       break;
      case 'D': this.TrxnClm = trxnClm.column.filter(item => !clm_divident.includes(item.field) && item.isVisible.includes(this.index > 0 ? 'B' : 'T' )); break;
      case 'F': this.TrxnClm = [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')), ...MailBackMismatchCommonColumn.column.filter((item: column) => item.isVisible.includes(flag))]; break;
      case 'P/O': this.TrxnClm = (this.index == 0 || this.index == 4) ?
      trxnClm.column.filter(item => !scm_clm.includes(item.field) && item.isVisible.includes(this.index > 0 ? 'B' : 'T' ))
      : (this.index == 2 ?
        [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')),
        ...MailBackMismatchCommonColumn.column.filter((item: column) => item.isVisible.includes(flag)),
         ...MailbackMismatchPlanOptionColumnForSIPSTPSWP.column]
        : (this.index == 3 ? [...FolioColumn.column,
          ...MailBackMismatchCommonColumn.column.filter((item: column) => item.isVisible.includes(flag)),
          ...MailbackMismatchPlanOptionColumnForSIPSTPSWP.column
        ] : [])) ;break;
      default : this.TrxnClm = trxnClm.column.filter(item => !scm_clm.includes(item.field) && item.isVisible.includes(this.index > 0 ? 'B' : 'T' ));break;
    }
    // console.log(this.TrxnClm.length);

  }
  setTrxnFromChild = (el) =>{
    // console.log(el);
    this.trxnTypeRpt = el;
  }


  /**
   * for displaying mailback mismatch File Count
   */
  getmismatchFileCount = () =>{
      this.dbIntr.api_call(0,'/mailbackMismatchAll',null)
      .pipe(pluck('data'))
      .subscribe((res:IMismatchCountFile[]) =>{
        this.misMatchCountFile = res;
      })

  }

  changeTabDtls_forMismatch_count = (ev) =>{
    this.count_tab_index = ev.index;
  }



}

export class NavMismatchColumnForAMCLink{
 static column:column[] = [
  {
    field:'amc_link',
    header:'AMC Link',
    width: '20rem',
    isVisible:[1,2,3]
  },
  {
    field:'delete',
    header:'Delete',
    width: '7rem',
    isVisible:[1]
  }
]
}

export class NavMismatchColumnForSchemeLink{
  static column:column[] = [{
    field:'scheme_link',
    header:'Scheme Link',
    width: '20rem',
    isVisible:[1,2,3]
   },
   {
    field:'isin_link',
    header:'ISIN Link',
    width: '20rem',
    isVisible:[1,2,3]
    },
    {
      field:'delete',
      header:'Delete',
      width: '7rem',
      isVisible:[1]
    }
  ]
}

export class MailBackMismatchCommonColumn {
  static column: column[] = [
    { field: 'bu_type_link', header: 'Business Type Link', width: '20rem', isVisible: ['B'] },
    { field: 'freq_link', header: 'Frequency Link', width: '20rem', isVisible: ['F'] },
    {field:'plan_opt',header:'Plan Option Link',width:"16rem", isVisible: ['P/O'] },
  ]
}

export class MailbackMismatchPlanOptionColumnForSIPSTPSWP{
  static column: column[] = [
    {field:'plan_opt_map',header:'Plan Option Map',width:"16rem", isVisible: ['P/O'] },
  ]
}

 export interface IMismatchCountFile{
       id:number;
       tab_name:string;
       file_type:IFileTypeCount[]
 }

 export interface IFileTypeCount{
       name:string;
       count:number;
 }
