import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

export enum ScheduleType{
  VALUATION = 'Valuation',
  REPORT = 'Report'
}
@Component({
  selector: 'client-dtls',
  templateUrl: './client-dtls.component.html',
  styleUrls: ['./client-dtls.component.css']
})
export class ClientDtlsComponent implements OnInit {

  private _clientDtls:Partial<client>;

  @Output() export:EventEmitter<{mode:string,export_type:'Pdf' | 'Print' | 'xlsx'}> = new EventEmitter();

  export__type:'Pdf' | 'Print' | 'xlsx';;


  @Input()
  get clientDtls(){
      return this._clientDtls;
  }

  set clientDtls(values:Partial<client>){
    this._clientDtls = values
  }

  @Input() ScheduleType:string | undefined = ScheduleType.VALUATION

  @Input() date: any;

  @Input() isDateRange:boolean | undefined = false;

  constructor(private dbIntr:DbIntrService) { }

  ngOnInit() {

}

    itemClick(Mode:string){
          this.export.emit({
            mode:Mode,
            export_type:this.export__type
          })
    } 


}
