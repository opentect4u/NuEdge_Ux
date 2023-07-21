import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import ItemsPerPage from '../../../../assets/json/itemsPerPage.json';
@Component({
  selector: 'shared-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.css']
})
export class PaginateComponent implements OnInit {
  itemsPerPage = ItemsPerPage;
  @Input() __paginate:any = [];
  @Input() set btn_type(value){
    console.log(value);

    if(value == 'R'){
       this.__pageNumber.setValue('10');
    }

  }
  __pageNumber = new FormControl('10');
  @Output() itemPerpageShow = new EventEmitter();
  @Output() PaginateFn = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  onselectItem(ev){
   this.itemPerpageShow.emit(this.__pageNumber.value)
  }
  getPaginate(__paginate){
     this.PaginateFn.emit(__paginate)
  }
}
