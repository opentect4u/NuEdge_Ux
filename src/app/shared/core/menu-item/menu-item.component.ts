import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items = [];
  @Output() sendItem :EventEmitter<any>= new EventEmitter();
  constructor() { }

  ngOnInit(): void {}

  openModalOrNavigate(item){
   this.sendItem.emit(item);
  }

}
