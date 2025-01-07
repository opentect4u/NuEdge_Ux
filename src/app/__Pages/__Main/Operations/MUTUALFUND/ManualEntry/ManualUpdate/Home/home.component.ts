import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../../assets/json/product_type.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menu = menu.filter((x: any) => x.id.toString() == '1')[0].sub_menu;
  constructor(private __utility: UtiliService,private __dbIntr:DbIntrService) {}
  __product_id:number = 1;
  __transType: any = [];
  index:number = 0;
  trnsType:any[] = [];
    amcMst:amc[] = [];
  
  trans_type_id:any;
  ngOnInit() {
    this.getAMCMst();
    this.fetchTransactionType();
  }
  // getItems(event) {
  //   switch (event.flag) {
  //     case 'F':
  //       this.__utility.navigate(
  //         '/main/operations/dashboard/manualEntr/manualupdate/financial'
  //       );
  //       break;

  //     case 'N':
  //       this.__utility.navigate(
  //         '/main/operations/dashboard/manualEntr/manualupdate/nonfinancial'
  //       );
  //       break;
  //     case 'O':
  //       this.__utility.navigate(
  //         '/main/operations/dashboard/manualEntr/manualupdate/nfo'
  //       );
  //       break;
  //   }
  // }


  fetchTransactionType = () =>{
      this.__dbIntr.api_call(0,'/transctiontype?product_id=1',null)
      .pipe(pluck("data"))
      .subscribe((res:any) =>{
          console.log(res);
          if(res.length > 0){
            this.trans_type_id = res[0].id
            this.trnsType = res.filter(el => el.id != 2).map(({id,product_id,trns_type}) =>
              ({id,tab_name:trns_type,product_id,img_src:''}));
            
          }
         
        })
    }
    TabDetails = (ev) =>{
      this.__transType = [];
      this.trans_type_id = ev.tabDtls.id;
      // this.getTransactionType(ev.tabDtls.id);
    }
      getAMCMst(){
        this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
          this.amcMst = res;
        })
      }
}
