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
  populateDT(pertnerDtls){
   this.setPertnerDormDtls.emit({index:0,data:pertnerDtls})
  }
}
