import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-core-pagination-with-itemper-page',
  templateUrl: './pagination-with-itemper-page.component.html',
  styleUrls: ['./pagination-with-itemper-page.component.css'],
})
export class PaginationWithItemperPageComponent implements OnInit {
  @Input() __paginate: any = [];
  @Output() sendPaginate = new EventEmitter<any>();
  @Output() sendVal = new EventEmitter<any>();
  constructor() {}
  ngOnInit(): void {}
  getval(items) {
    this.sendVal.emit(items);
  }
  getPaginate(listItem) {
    this.sendPaginate.emit(listItem);
  }
}
