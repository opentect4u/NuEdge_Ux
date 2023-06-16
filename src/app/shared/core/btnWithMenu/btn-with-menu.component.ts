import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatMenuListItem } from 'src/app/__Model/metMenu';

@Component({
  selector: 'core-btn-with-menu',
  templateUrl: './btn-with-menu.component.html',
  styleUrls: ['./btn-with-menu.component.css']
})
export class BtnWithMenuComponent implements OnInit {
    /*For Holding the menus comming from parent i.e for client Minor, PAN Or NON PAN */
  @Input() menuListItem: MatMenuListItem[];
  /****************************** End ******************************************************/
  @Input() BtnTitle: string; /***** Button Title */
  @Output() sendItem = new EventEmitter<any>(); /* send item after click on particular menu */
  @Input() hasMenu:boolean = false; /* Whether matMenu available or not */
  @Output() btnItem = new EventEmitter<any>();/* click on btn without Menu */
  @Input() flag: string;
  constructor() { }

  ngOnInit(): void {
  }

  getItems(item){
   this.sendItem.emit(item)
  }
  sendEvent(){
    this.btnItem.emit(this.flag);
  }
}
