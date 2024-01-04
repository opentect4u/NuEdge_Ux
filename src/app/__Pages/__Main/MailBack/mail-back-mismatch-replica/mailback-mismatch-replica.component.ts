import { Component, OnInit, ViewChild } from '@angular/core';
import { ITab, IsubTab } from '../mailback-mismatch/mailback-mismatch.component';
import tabs from '../../../../../assets/json/MailBack/mailbackMismatchTab.json';
import { Table } from 'primeng/table';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { column } from 'src/app/__Model/tblClmns';
import { NavFinderColumns } from '../../Products/MutualFund/Research/nav-finder/nav-finder.component';
import { FolioColumn } from '../../Products/MutualFund/PortFolio/Folio/folio.component';
import { live_sip_stp_swp_rpt } from 'src/app/__Utility/Product/live_sip_stp_swp_rptClmns';

declare type SubFileType = 'A' | 'S' | 'P/O' | 'D';

declare type ParentFileType = 'T' | 'N' | 'S' | 'F';

enum API{
  'T' =  'mailbackMismatch', // For Transaction File Mismatch
  'N' = 'mailbackMismatchNAV', // For NAV File Mismatch
  'S' = 'mailbackMismatchSipStp',
  'F' = 'mailbackMismatchFolio'
}

@Component({
  selector: 'mailback-mismatch-replical',
  templateUrl: './mailback-mismatch-replica.component.html',
  styleUrls: ['./mailback-mismatch-replica.component.css']
})


export class MailbackMismatchReplicaComponent implements OnInit {

  /**** For Holding Report master data for each file */
  reportMstDt = [];

  tab_dt:Partial<ITab>[] = tabs.map(({ id, tab_name, flag, img_src, sub_menu }) => ({ tab_name: tab_name, img_src: ('../../../../../assets/images/' + img_src), id, flag, sub_menu }));

  subTab:IsubTab[] = tabs[0].sub_menu;

  TrxnClm:column[] = trxnClm.column.filter(item=> !['option_name','plan_name','scheme_link','isin_link','plan_opt','divident_opt','lock_trxn','amc_link'].includes(item.field));
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

  sub_file_type: SubFileType = 'A';

  file_type:ParentFileType = 'T'

  @ViewChild('primeTbl') primeTbl :Table;

  tblminWidth = '350rem';

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    console.log(this.tab_dt);
    this.getTrxnRpt("A","T");
  }

  changeTabDtls = <T extends {index:number,tabDtls:IsubTab | ITab}>(TabDtls:T,mode:string) => {

      this.tblminWidth = TabDtls.index == 0 ? '350rem' : '150rem'

      this.reportMstDt = [];
      let __mode = '';
      let flag:SubFileType;
      let file_flag:ParentFileType;
      switch(mode){
        case 'P':
          this.index = TabDtls.index;
          this.sub_index = 0;
          __mode = this.tab_dt[TabDtls.index].sub_menu[0].flag;
          this.subTab = this.tab_dt[TabDtls.index].sub_menu;
          flag = this.tab_dt[this.index].sub_menu[0].flag as SubFileType;
          file_flag = this.tab_dt[this.index].flag as ParentFileType;
          break;
        case 'C':
          console.log(TabDtls);
          this.sub_index = TabDtls.index;
          // this.getTrxnRpt(TabDtls.tabDtls.flag,this.tab_dt[this.index].flag);
          __mode = TabDtls.tabDtls.flag;
          flag = TabDtls.tabDtls.flag as SubFileType;
          file_flag = this.tab_dt[this.index].flag as ParentFileType;
          break;
        default:break;
      }
      console.log(`SUB FILE TYPE : ${flag}`);
      console.log(`PARENT FILE TYPE : ${file_flag}`);
      this.getTrxnRpt(flag,file_flag);
      this.tblminWidth = this.index == 0 ? '350rem' : '150rem';
      this.column_manage(__mode);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  /**
   * @param flag
   *  get Transaction Report Master Data
   *  need to show those transaction which has no scheme /AMC/Plan/Option/Bussiness Type
   */
  getTrxnRpt = (sub_flag:SubFileType,parent_flag:ParentFileType) => {
    this.sub_file_type = sub_flag;
    this.file_type = parent_flag
    // this.dbIntr
    //   .api_call(0, `/${API[parent_flag]}`, 'mismatch_flag='+ sub_flag)
    //   .pipe(
    //     pluck('data'))
    //   .subscribe((res: TrxnRpt[]) => {
    //     this.reportMstDt = res;
    //   });
  };

  getColumns =() =>{
    return this.utility.getColumns(this.TrxnClm);
  }

  column_manage = (flag:string) =>{
    console.log(this.index);
    console.log(flag);
    const clm_divident:string[] = ['amc_link','scheme_link','isin_link','plan_opt','lock_trxn'];
    const clm: string[] = ['divident_opt', 'scheme_link', 'isin_link', 'option_name', 'plan_name', 'plan_opt', 'lock_trxn','amc_link'];
    const scm_clm:string[] = ['amc_link','scheme_link','isin_link','divident_opt','lock_trxn','plan_opt'];
    const opt_clm:string[] = ['amc_link','option_name','plan_name','plan_opt','divident_opt','lock_trxn','scheme_link','isin_link'];
    const bu_clm_toRemove:string[] = ['amc_link','scheme_link','isin_link','divident_opt','lock_trxn','option_name','plan_name','plan_opt'];
    switch(flag){
      case 'A': this.TrxnClm = this.index == 0 ? trxnClm.column.filter(item => !clm.includes(item.field))
        : (this.index == 1
          ? NavFinderColumns.column
          : (this.index == 3
            ? FolioColumn.column
            : live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'))
          ));
        break;
      case 'B': this.TrxnClm = this.index == 0 ? trxnClm.column.filter(item => !bu_clm_toRemove.includes(item.field)) : live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'))
      break;
      case 'S': this.TrxnClm = this.index == 0 ?
       trxnClm.column.filter(item => !opt_clm.includes(item.field))
       :  (this.index == 1 ? NavFinderColumns.column :  (this.index == 3 ? FolioColumn.column: live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'))
        ));
       break;
      case 'D': this.TrxnClm = trxnClm.column.filter(item => !clm_divident.includes(item.field)); break;
      case 'F': this.TrxnClm = live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1')); break;
      case 'P/O': this.TrxnClm = this.index == 0 ?
      trxnClm.column.filter(item => !scm_clm.includes(item.field))
      : (this.index == 2 ?
        live_sip_stp_swp_rpt.columns.filter(item => item.isVisible.includes('LS-1'))
        : (this.index == 3 ?FolioColumn.column : [])) ;break;
      default : this.TrxnClm = trxnClm.column.filter(item => !scm_clm.includes(item.field));break;
    }

  }
}
