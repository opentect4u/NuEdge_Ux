import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/__Model/column';

@Component({
  selector: 'reports-common-cmnTble',
  templateUrl: './cmnTble.component.html',
  styleUrls: ['./cmnTble.component.css']
})
export class CmnTbleComponent<T> implements OnInit {
  @Input()
  tableColumns: Array<Column> = [];
  @Input()
  tableData: Array<T> = [];
  @Output() __isExportasPdf: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    // this.dataSource = new MatTableDataSource(this.tableData);
    console.log(this.displayedColumns);
    // console.log(this.tableData);

    
  }
  exportasPDF(){
    this.__isExportasPdf.emit(true);
  }
  ngOnChanges(changes: SimpleChanges){    
    console.log(changes.tableData.currentValue);
    this.dataSource = new MatTableDataSource(changes.tableData.currentValue);

  }
}
