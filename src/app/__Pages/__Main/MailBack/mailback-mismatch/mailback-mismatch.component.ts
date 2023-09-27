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
  'S' = 'mailbackMismatchSipStp',
  'F' = 'mailbackMismatchFolio'
}

@Component({
  selector: 'app-mailback-mismatch',
  templateUrl: './mailback-mismatch.component.html',
  styleUrls: ['./mailback-mismatch.component.css'],
})
export class MailbackMismatchComponent implements OnInit {

  @ViewChild('countModal') mismatchCount:Dialog;
  isvisible:boolean = true;

  mismatch_flag:string = 'A';

  tblWidth:string | undefined;

  TrxnClm:column[] = trxnClm.column.filter(item=> !['option_name','plan_name','scheme_link','isin_link','plan_opt','divident_opt','lock_trxn'].includes(item.field));

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
  TabMenu:Partial<ITab>[] = tabs.map(({id, tab_name, flag,img_src,sub_menu}) => ({tab_name:tab_name,img_src:('../../../../../assets/images/'+img_src),id,flag,sub_menu}));

  /**
   * Holding Sub Tab Menu
   */
  subTab:IsubTab[] = tabs[0].sub_menu;

  constructor(private dbIntr: DbIntrService) {}

  ngOnInit(): void {
    this.getTrxnRpt('A','T'); //default Transaction File will be called
  }

  /**
   * @param flag
   *  get Transaction Report Master Data
   *  need to show those transaction which has no scheme /AMC/Plan/Option/Bussiness Type
   */
  getTrxnRpt = (flag:string,file_flag:string) => {
    console.log(flag);
    console.log(file_flag);

    this.mismatch_flag = flag;
    this.dbIntr
      .api_call(0, `/${API[file_flag]}`, 'mismatch_flag='+flag)
      .pipe(
        pluck('data'))
      .subscribe((res: TrxnRpt[]) => {
        console.log(res);
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
    console.log(TabDtls.tabDtls);
    switch(mode){
      case 'P':
        this.index = TabDtls.index;
        this.sub_index = 0;
        // this.getTrxnRpt(this.TabMenu[TabDtls.index].sub_menu[0].flag,(TabDtls.tabDtls as ITab).flag);
        __mode = this.TabMenu[TabDtls.index].sub_menu[0].flag;
        // this.getTrxnRpt(this.TabMenu[(this.index + 1)].sub_menu[0].flag);
        // __mode = this.TabMenu[(this.index + 1)].sub_menu[0].flag;
        this.subTab = this.TabMenu[TabDtls.index].sub_menu;
        // this.getTrxnRpt(this.TabMenu[this.index].sub_menu[0].flag,this.TabMenu[this.index].flag);
        flag = this.TabMenu[this.index].sub_menu[0].flag;
        file_flag = this.TabMenu[this.index].flag;
        break;
      case 'C':
        this.sub_index = TabDtls.index;
        // this.getTrxnRpt(TabDtls.tabDtls.flag,this.TabMenu[this.index].flag);
        __mode = TabDtls.tabDtls.flag;
        flag = TabDtls.tabDtls.flag;
        file_flag = this.TabMenu[this.index].flag;
        break;
      default:break;
    }
    this.getTrxnRpt(flag,file_flag);
    this.tblWidth = this.index == 0 ? '350rem' : '150rem';
    this.column_manage(__mode);
  }

  column_manage = (flag:string) =>{
    console.log(flag);
    const clm_divident:string[] = ['amc_link','scheme_link','isin_link','plan_opt'];
    const clm:string[] = ['divident_opt','scheme_link','isin_link','option_name','plan_name','plan_opt','lock_trxn'];
    const scm_clm:string[] = ['amc_link','scheme_link','isin_link','divident_opt','lock_trxn'];
    const opt_clm:string[] = ['amc_link','option_name','plan_name','plan_opt','divident_opt','lock_trxn'];
    switch(flag){
      case 'A':
      case 'B': this.TrxnClm = this.index == 0 ? trxnClm.column.filter(item => !clm.includes(item.field))
      :  (this.index == 1
      ?  [...NavFinderColumns.column,...NavMismatchColumnForAMCLink.column]
      :  (this.index == 3
      ? [...FolioColumn.column,...NavMismatchColumnForAMCLink.column]
      : [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')),...NavMismatchColumnForAMCLink.column]
      ));
      break;
      case 'S': this.TrxnClm = this.index == 0 ?
       this.TrxnClm = trxnClm.column.filter(item => !opt_clm.includes(item.field))
       :  (this.index == 1
       ? [...NavFinderColumns.column,...NavMismatchColumnForSchemeLink.column]
       :  (this.index == 3 ? [...FolioColumn.column,...NavMismatchColumnForSchemeLink.column]
        : [...live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')),...NavMismatchColumnForSchemeLink.column]
        ));
       break;
      case 'D': this.TrxnClm = trxnClm.column.filter(item => !clm_divident.includes(item.field));break;
      default : this.TrxnClm = trxnClm.column.filter(item => !scm_clm.includes(item.field));break;
    }

  }
  setTrxnFromChild = (el) =>{
    console.log(el);
    this.trxnTypeRpt = el;
  }

}

export class NavMismatchColumnForAMCLink{
 static column:column[] = [{field:'amc_link',header:'AMC Link',width: '20rem'}]
}

export class NavMismatchColumnForSchemeLink{
  static column:column[] = [{field:'scheme_link',header:'Scheme Link',width: '20rem'},{field:'isin_link',header:'ISIN Link',width: '20rem'}]
 }
