import { Component, OnInit } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import tabs from '../../../../../assets/json/MailBack/mailbackMismatchTab.json';
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
   * Holding Tab Menu
   */
  TabMenu:{id:number,tab_name:string,img_src:string,flag:string}[] = tabs;

  constructor(private dbIntr: DbIntrService) {}

  ngOnInit(): void {
    this.getTrxnRpt();
  }

  /**
   *  get Transaction Report Master Data
   *  need to show those transaction which has no scheme
   */
  getTrxnRpt = () => {
    this.dbIntr
      .api_call(0, '/showTransDetails', 'trans_type=[]&trans_sub_type=[]')
      .pipe(
        pluck('data'),
        map((item: TrxnRpt[]) => {
          return item.filter(
            (x: TrxnRpt) => x.scheme_name == '' || x.scheme_name == null
          );
        })
      )
      .subscribe((res: TrxnRpt[]) => {
        this.trxnTypeRpt = res;
      });
  };

  /**
   * Change Event Trigger After Tab Changes
   * @param TabDtls
   */

  TabDetails = <T extends {index:number,tabDtls:{id:number,tab_name:string,img_src:string,flag:string}}>(TabDtls:T) => {
     this.index = TabDtls.index;
  }
}
