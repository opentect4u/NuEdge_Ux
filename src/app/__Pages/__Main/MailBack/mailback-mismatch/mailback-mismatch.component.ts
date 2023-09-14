import { Component, OnInit } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import tabs from '../../../../../assets/json/MailBack/mailbackMismatchTab.json';
import { column } from 'src/app/__Model/tblClmns';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';

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


@Component({
  selector: 'app-mailback-mismatch',
  templateUrl: './mailback-mismatch.component.html',
  styleUrls: ['./mailback-mismatch.component.css'],
})
export class MailbackMismatchComponent implements OnInit {

  mismatch_flag:string = 'A';



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
  TabMenu:Partial<ITab>[] = tabs.map(({id, tab_name, flag,img_src}) => ({tab_name:tab_name,img_src:('../../../../../assets/images/'+img_src),id,flag}));

  /**
   * Holding Sub Tab Menu
   */
  subTab:IsubTab[] = tabs[0].sub_menu;

  constructor(private dbIntr: DbIntrService) {}

  ngOnInit(): void {
    this.getTrxnRpt('A');
  }

  /**
   * @param flag
   *  get Transaction Report Master Data
   *  need to show those transaction which has no scheme /AMC/Plan/Option/Bussiness Type
   */
  getTrxnRpt = (flag:string) => {
    this.mismatch_flag = flag;
    this.dbIntr
      .api_call(0, '/mailbackMismatch', 'mismatch_flag='+flag)
      .pipe(
        pluck('data'),
        // map((item: TrxnRpt[]) => {
        //   return item.filter(
        //     (x: TrxnRpt) => x.scheme_name == '' || x.scheme_name == null
        //   );
        // })
      )
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

  changeTabDtls = <T extends {index:number,tabDtls:IsubTab}>(TabDtls:T,mode:string) => {
    this.trxnTypeRpt = [];
    let __mode = '';
    switch(mode){
      case 'P':
        this.index = TabDtls.index;
        this.getTrxnRpt(this.TabMenu[(this.index + 1)].sub_menu[0].flag);
        __mode = this.TabMenu[(this.index + 1)].sub_menu[0].flag;
        break;
      case 'C':
        this.sub_index = TabDtls.index;
        this.getTrxnRpt(TabDtls.tabDtls.flag);
        __mode = TabDtls.tabDtls.flag;
        break;
      default:break;
    }
    this.column_manage(__mode);
  }

  column_manage = (flag:string) =>{
    const clm_divident:string[] = ['scheme_link','isin_link','plan_opt'];
    const clm:string[] = ['divident_opt','scheme_link','isin_link','option_name','plan_name','plan_opt','lock_trxn'];
    const scm_clm:string[] = ['scheme_link','isin_link','divident_opt','lock_trxn'];
    const opt_clm:string[] = ['option_name','plan_name','plan_opt','divident_opt','lock_trxn']
    switch(flag){
      case 'A':
      case 'B': this.TrxnClm = trxnClm.column.filter(item => !clm.includes(item.field));break;
      case 'S': this.TrxnClm = trxnClm.column.filter(item => !opt_clm.includes(item.field));break;
      case 'D': this.TrxnClm = trxnClm.column.filter(item => !clm_divident.includes(item.field));break;
      default : this.TrxnClm = trxnClm.column.filter(item => !scm_clm.includes(item.field));break;
    }
  }
  setTrxnFromChild = (el) =>{
    console.log(el);
    this.trxnTypeRpt = el;
  }

}
