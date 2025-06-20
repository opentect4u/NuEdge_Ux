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
  /**
   * @description This component is used to display client details and export options
   * It emits an event when the export button is clicked with the selected mode and export type.
   */
  @Output() export:EventEmitter<{mode:string,export_type:'Pdf' | 'Print' | 'xlsx'}> = new EventEmitter();

  export__type:'Pdf' | 'Print' | 'xlsx';;

  /**
   * @description This input property is used to set the client details
   * It is of type Partial<client> to allow partial updates to the client details.
   * The client details can be set from the parent component.
   */
  @Input()
  get clientDtls(){
      return this._clientDtls;
  }
  /**
   * @description This setter is used to set the client details
   * It accepts a Partial<client> object to allow partial updates to the client details.
   * The setter is used to update the _clientDtls property with the provided values.
   */
  set clientDtls(values:Partial<client>){
    this._clientDtls = values
  }

  @Input() ScheduleType:string | undefined = ScheduleType.VALUATION

  @Input() date: any;

  @Input() isDateRange:boolean | undefined = false;

  constructor(private dbIntr:DbIntrService) { }

  ngOnInit() {

}
    /**
     * @description This function is used to set the export type
     */
    itemClick(Mode:string){
          this.export.emit({
            mode:Mode,
            export_type:this.export__type
          })
    } 


}
