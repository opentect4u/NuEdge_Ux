import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { pertnerShipDtls } from 'src/app/__Utility/Master/Company/pertnerDtls';

@Component({
  selector: 'pertner-dtls-rpt',
  templateUrl: './pertner-dtls-rpt.component.html',
  styleUrls: ['./pertner-dtls-rpt.component.css']
})
export class PertnerDtlsRPTComponent implements OnInit {
  @Input() pertnershipMstDtls = [];
  columns:column[] = pertnerShipDtls.columns;
  @Output() setPertnerDormDtls:EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  ngOnInit(): void {}
  /** * This function is used to populate the data table with the partner details.
   * It emits an event with the index and data of the selected partner details.
   * @param {any} pertnerDtls - The partner details to be populated in the data table.
   * @returns {void}
   */
  populateDT(pertnerDtls){
   this.setPertnerDormDtls.emit({index:0,data:pertnerDtls})
  }
}
