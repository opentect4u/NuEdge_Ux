import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items = [];
  @Input() colSize:string;
  @Output() sendItem :EventEmitter<any>= new EventEmitter();
  constructor() { }

  ngOnInit(): void {}
  /**
   * @description This function is used to open a modal or navigate to a different page
   * It emits the selected item to the parent component using the sendItem event emitter.
   * @param item - The item to be sent to the parent component.
   * @returns {void}
   */
  openModalOrNavigate(item){
   this.sendItem.emit(item);
  }

}
