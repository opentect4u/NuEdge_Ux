import { Component, OnInit } from '@angular/core';
import { menuBodyList } from 'src/app/__Model/menuBody';
import  menu from '../../../../../assets/json/menu.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu:menuBodyList[];
  constructor() {
      this.__menu = menu.filter((x: menuBodyList) => x.id == 13);
      console.log(this.__menu);
   }

  ngOnInit() {}

}
