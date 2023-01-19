import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { mutualFund } from 'src/app/__Model/__MutualFund';

@Component({
  selector: 'mf-common-MasterTbl',
  templateUrl: './MasterTbl.component.html',
  styleUrls: ['./MasterTbl.component.css']
})
export class MasterTblComponent implements OnInit {
  __columns = ["sl_no", 'tin_id', 'edit', 'delete'];
  @Output() __selectedItems: EventEmitter<mutualFund> = new EventEmitter(null);
  @Input() __MstDT = new MatTableDataSource<mutualFund>([]);
  @ViewChild(MatPaginator) __paginator: MatPaginator;
  constructor() {
    console.log("Masterblcomp Loaded");

  }

  ngOnInit() {
  }
  populateDT(__elements: mutualFund) {
    this.__selectedItems.emit(__elements);
  }
  ngOnChanges(__ev) {
    console.log(__ev.__MstDT.currentValue.data.length);
    this.__MstDT.paginator = this.__paginator;
  }


}
