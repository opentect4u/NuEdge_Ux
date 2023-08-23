import { Component, OnInit } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import tabs from '../../../../../assets/json/MailBack/mailbackMismatchTab.json';

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
    // this.getTrxnRpt('A');
  }

  /**
   * @param flag
   *  get Transaction Report Master Data
   *  need to show those transaction which has no scheme /AMC/Plan/Option/Bussiness Type
   */
  getTrxnRpt = (flag:string) => {
    console.log(flag);
    // this.dbIntr
    //   .api_call(0, '/showTransDetails', 'mismatch_flag='+flag)
    //   .pipe(
    //     pluck('data'),
    //     map((item: TrxnRpt[]) => {
    //       return item.filter(
    //         (x: TrxnRpt) => x.scheme_name == '' || x.scheme_name == null
    //       );
    //     })
    //   )
    //   .subscribe((res: TrxnRpt[]) => {
    //     this.trxnTypeRpt = res;
    //   });
  };

  /**
   * Change Event Trigger After Tab Changes
   * @param TabDtls
   * @param mode
   */

  changeTabDtls = <T extends {index:number,tabDtls:IsubTab}>(TabDtls:T,mode:string) => {
    switch(mode){
      case 'P':
        this.index = TabDtls.index;
        this.getTrxnRpt(this.TabMenu[(this.index + 1)].sub_menu[0].flag);
        break;
      case 'C':
        this.sub_index = TabDtls.index;
        this.getTrxnRpt(TabDtls.tabDtls.flag);
        break;
      default:break;
    }
  }

}
