import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'shared-tbl',
  templateUrl: './shared-tbl.component.html',
  styleUrls: ['./shared-tbl.component.css']
})
export class SharedTblComponent implements OnInit {

  @Input() table_min_width:string | undefined = '50rem';

  @Input() flag:string | null;

  @Input() is_btn_show:boolean | undefined = true;

  @ViewChild('primeTbl') primeTbl :Table

  @Input() data;

  @Input()  SelectedData: any | any[];

  @Input() column:column[] = [];

  @Output() sendSelectedData = new EventEmitter();

  @Input() is_selectable:boolean | undefined = true;

  @Output() view_dtls = new EventEmitter();

  @Output() onCheckboxSelection = new EventEmitter();

  @Input() parent_id:string | null;

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
    console.log(this.parent_id);
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

  clear = (table: Table) =>{
    // console.log(table);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  Next = () =>{
    // console.log(this.SelectedData.toArray())
    this.sendSelectedData.emit(this.SelectedData);
  }


  view_details = (dtls) =>{
    this.view_dtls.emit(dtls);
  }
  checkedDt= (ev)=>{
    // console.log(ev);
    this.onCheckboxSelection.emit(this.SelectedData);
  }
}
