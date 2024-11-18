import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import prd_type from '../../../../../../../../assets/json/product_type.json';
import { amc } from 'src/app/__Model/amc';
@Component({
  selector: 'ackhome-component',
  templateUrl: './ackhome.component.html',
  styleUrls: ['./ackhome.component.css'],
})
export class AckhomeComponent implements OnInit {
  menu = prd_type.filter((x: any) => x.id.toString() == '1')[0].sub_menu;
  __transType: any = [];
  __product_id:number = 1;
  trnsType:any[] = [];
  trans_type_id:any;
  index:number = 0;
  subIndex:number = 0;
  amcMst:amc[] = [];
  transaction_id:any;

  constructor(
    private __utility: UtiliService,
    private __dbIntr:DbIntrService
  ) {}
  ngOnInit() {
    this.getAMCMst();
    // console.log(this.menu)
    this.fetchTransactionType();
  }
  // getItems(event) {
  //   switch (event.flag) {
  //     case 'O':
  //     case 'F':
  //       this.__utility.navigate(
  //         '/main/operations/dashboard/manualEntr/acknowldgement/ackEntry',
  //         btoa(event.id)
  //       );
  //       break;
  //     case 'N':
  //       this.__utility.navigate(
  //         '/main/operations/dashboard/manualEntr/acknowldgement/ackNonFin',
  //         btoa(event.id)
  //       );
  //       break;
  //   }
  // }

  getTransactionType(trans_type_id:number) {

    this.__dbIntr
      .api_call(0, '/transction', ('product_id=' +this.__product_id +'&trans_type_id=' + trans_type_id))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
  }
  getAMCMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
      this.amcMst = res;
    })
  }

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

  SubTabDetails = (ev) =>{
    if(ev.index >= 0){
      this.transaction_id = ev.tabDtls.id;
    }
  }

}
