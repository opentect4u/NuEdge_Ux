import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  trnsType:any[] = [];
  trans_type_id:any;
  constructor(private utility: UtiliService,private dbIntr:DbIntrService) {
  }

  ngOnInit(): void {
    this.fetchTransactionType();
  }
  fetchTransactionType = () =>{
    this.dbIntr.api_call(0,'/transctiontype?product_id=1',null)
    .pipe(pluck("data"))
    .subscribe((res:any) =>{
        if(res.length > 0){
          this.trans_type_id = res[0].id
          this.trnsType = res.map(({id,product_id,trns_type}) =>
            ({id,tab_name:trns_type,product_id,img_src:''}));
        }
       
      })
  }
  TabDetails = (ev) =>{
      console.log(ev);
      this.trans_type_id = ev.tabDtls.id;
  }
}
