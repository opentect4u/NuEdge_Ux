import {Input, Component,Output, OnInit ,ViewChild, EventEmitter} from '@angular/core';
import { Table } from 'primeng/table';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'file-help-tbl',
  templateUrl: './file-help-tbl.component.html',
  styleUrls: ['./file-help-tbl.component.css']
})
export class FileHelpTblComponent implements OnInit {

  @Input() column;
  @Input() trxnTypeMst;

  @Input() title;

  @Output() sendSelectedRow = new EventEmitter();

  @ViewChild('pTableRef') pTableRef: Table;
  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
  }
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.pTableRef.filterGlobal(value,'contains')
  }

  populateTrxnTypeinForm = (file) =>{
    this.sendSelectedRow.emit(file);
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }
}
