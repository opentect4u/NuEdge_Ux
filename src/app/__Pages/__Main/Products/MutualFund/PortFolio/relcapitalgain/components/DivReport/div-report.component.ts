import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'div-report',
  templateUrl: './div-report.component.html',
  styleUrls: ['./div-report.component.css']
})
export class DivReportComponent implements OnInit {

  constructor(private utility:UtiliService) { }

  @ViewChild('primeTbl') primaryTbl:Table

  @Input() idcwRpt = [];

  @Input() total_idcw_summary;

  @Input() column:column[] = [];

  ngOnInit(): void {
  }

  getColumns(){
    return this.utility.getColumns(this.column)
  }

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }

}
