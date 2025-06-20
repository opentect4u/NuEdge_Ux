import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { productMappingClmns } from 'src/app/__Utility/Master/Company/productMapping';

@Component({
  selector: 'product-mapping-report',
  templateUrl: './product-mapping-report.component.html',
  styleUrls: ['./product-mapping-report.component.css']
})
export class ProductMappingReportComponent implements OnInit {
  @Input() productMstDtls = [];
  columns:column[]=productMappingClmns.columns;
  @Output() setFrmDt = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  /** 
   * * This function is used to populate the data table with the selected product mapping details.
   * * It emits an event with the index and data of the selected product mapping details.
   * * @param {any} ev - The event containing the product mapping details to be populated in the data table.
   * * @returns {void}
   */
  populateDT(ev){
    console.log(ev);

     this.setFrmDt.emit({index:0,data:ev})
  }
}
