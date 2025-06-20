import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { documentLockerClmns } from 'src/app/__Utility/Master/Company/documentLocket';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-locker-dtls-rpt',
  templateUrl: './document-locker-dtls-rpt.component.html',
  styleUrls: ['./document-locker-dtls-rpt.component.css']
})
export class DocumentLockerDtlsRPTComponent implements OnInit {
  url:string = `${environment.company_logo_url + 'document/'}`
  @Input() docDtls: any=[];
  columns = documentLockerClmns.columns;
     /* send data after click on edit button
  & send the corrosponding row data & active manual Entry Tab by default*/
  @Output() selectIndex: EventEmitter<any> = new  EventEmitter<any>();
  /** End */
  constructor() { }

  ngOnInit(): void {
  }
  /** * This function is used to populate the data table with the selected document details.
 * It emits an event with the selected document details.
 * @param {any} document - The document details to be populated in the data table.
 * @returns {void}
 */
  populateDT(document){
    console.log(document);
    this.selectIndex.emit(document);
  }
}
