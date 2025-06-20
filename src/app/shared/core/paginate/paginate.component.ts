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
  /**
   * @description This function is used to handle the selection of items per page
   * It emits the selected value to the parent component using the itemPerpageShow event emitter.
   * @param ev - The event object containing the selected value.
   * @returns {void}
   */
  onselectItem(ev){
   this.itemPerpageShow.emit(this.__pageNumber.value)
  }
  /**
   * 
   * @param __paginate - This function is used to handle pagination
   * It emits the pagination value to the parent component using the PaginateFn event emitter.
   * @returns {void}
   */
  getPaginate(__paginate){
     this.PaginateFn.emit(__paginate)
  }
}
