import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'div-report',
  templateUrl: './div-report.component.html',
  styleUrls: ['./div-report.component.css']
})
export class DivReportComponent implements OnInit,AfterViewInit {

  constructor(private utility:UtiliService) { }

  @ViewChild('primeTbl') primaryTbl:Table

  @Input() idcwRpt = [];

  @Input() total_idcw_summary;

  @Input() column:column[] = [];

  ngOnInit(): void {
  }
  /**
   * 
   * @returns {Array} An array of columns formatted for the table.
   * @description This function is used to get the columns for the dividend report table.
   * It uses the utility service to get the columns based on the input column array.
   */
  getColumns(){
    return this.utility.getColumns(this.column)
  }
  /**
   * 
   * @param $event This function filters the global search input for the dividend report table.
   * It takes the event object as a parameter and retrieves the value from the input field.
   * The table is then filtered based on the value using the 'contains' filter match mode.
   * @description This function filters the global search input for the dividend report table.
   */
  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  ngAfterViewInit(): void{
    const table = this.primaryTbl?.el.nativeElement.querySelector('table');
    table.setAttribute('id', 'dividend_table');
  }
 
}
