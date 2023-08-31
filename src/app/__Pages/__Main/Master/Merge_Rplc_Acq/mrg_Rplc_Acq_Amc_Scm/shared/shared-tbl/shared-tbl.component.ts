import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'shared-tbl',
  templateUrl: './shared-tbl.component.html',
  styleUrls: ['./shared-tbl.component.css']
})
export class SharedTblComponent implements OnInit {


  @Input() is_btn_show:boolean | undefined = true;

  @ViewChild('primeTbl') primeTbl :Table

  @Input() data;

  @Input() SelectedData = [];

  @Input() column:column[] = [];

  @Output() sendSelectedData = new EventEmitter();

  @Input() is_selectable:boolean | undefined = true;

  @Output() view_dtls = new EventEmitter();

  @Output() onCheckboxSelection = new EventEmitter();

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

  clear = (table: Table) =>{
    console.log(table);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  Next = () =>{
    this.sendSelectedData.emit(this.SelectedData);
  }

  // Previous = () =>{
  //   this.sendSelectedData.emit({item:this.SelectedData,flag:'P'});
  // }
  view_details = (dtls) =>{
    this.view_dtls.emit(dtls);
  }
  checkedDt= (ev)=>{
    this.onCheckboxSelection.emit(this.SelectedData);
  }
  // ngOnDestroy(){
  //    console.log('asdasd');
  // }
}
