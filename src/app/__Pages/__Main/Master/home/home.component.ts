import { Component, OnInit } from '@angular/core';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { UtiliService } from 'src/app/__Services/utils.service';
import  menu from '../../../../../assets/json/menu.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu:menuBodyList[];
  constructor(private __utility:UtiliService) {
    console.log(menu);
    
      this.__menu = menu.filter((x: menuBodyList) => x.id == 4);
      console.log(this.__menu);
   }

  ngOnInit() {}
  navigate(__items){
        this.__utility.navigate(__items.url);
  }
}
