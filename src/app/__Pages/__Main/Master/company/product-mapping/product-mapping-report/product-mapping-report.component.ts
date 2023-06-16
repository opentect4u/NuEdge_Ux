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
  populateDT(ev){
    console.log(ev);

     this.setFrmDt.emit({index:0,data:ev})
  }
}
