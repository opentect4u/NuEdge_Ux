import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { global } from 'src/app/__Utility/globalFunc';


export enum AUTMTYPE{
    "Fund House" = 'Fund House',
    Families = 'Families',
    Clients = 'Clients',
    Schemes = 'Schemes'
}

@Component({
  selector: 'aum-filter',
  templateUrl: './aum-filter.component.html',
  styleUrls: ['./aum-filter.component.css']
})
export class AumFilterComponent implements OnInit {


 aum_type: 'Fund House' | 'Families' | 'Clients' = 'Fund House';

 aum_report_filter_frm = new FormGroup({
    date: new FormControl(''),
    arn_no: new FormControl(''),
    folio_type: new FormControl('C'),
    export_type: new FormControl('W')
 })

 md_arn:string[]= [];

 date_range:string[] = [];

 @Output() onPress:EventEmitter<FormGroup> = new EventEmitter();

 constructor(private RouteData:ActivatedRoute,private dbIntr:DbIntrService) {
  RouteData.data.subscribe(res =>{
    switch(res?.type){
      case AUTMTYPE['Fund House']: this.aum_type = AUTMTYPE['Fund House'];break;
      case AUTMTYPE.Families: this.aum_type = AUTMTYPE.Families;break;
      default: break;
    }
  })
 }


  ngOnInit(): void {
    this.callARN_api();
    this.getDates();
  }

  getDates(){
    global.getLastDate(11,5).then((res:string[]) =>{
      try{
        this.date_range = res;
        this.aum_report_filter_frm.get('date').setValue(res.length > 0 ? res[0] : '');
      }
      catch(err){

      }
    })
  }

  /* Call API For Getting ARN NUMBER */
  callARN_api = () =>{
        this.dbIntr.api_call(0,'/employee',null).pipe(pluck('data')).subscribe((res:any) =>{
          this.md_arn = res.map(el => el.arn_no)
        })
  }
  /* END */

  clickToSend = () =>{
      console.log(this.aum_report_filter_frm.value);
      this.onPress.emit(this.aum_report_filter_frm.value)
  }

}
