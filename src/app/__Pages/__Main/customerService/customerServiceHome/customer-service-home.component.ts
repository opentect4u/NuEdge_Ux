import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { UtiliService } from 'src/app/__Services/utils.service';
import  menu from '../../../../../assets/json/menu.json';
@Component({
  selector: 'app-customer-service-home',
  templateUrl: './customer-service-home.component.html',
  styleUrls: ['./customer-service-home.component.css']
})
export class CustomerServiceHomeComponent implements OnInit {
  __menu:any = [];
  constructor(private __utility:UtiliService,private __actdt: ActivatedRoute) {
    this.__menu = menu.filter((x: menuBodyList) => x.id == 3)[0].sub_menu;
 }

  ngOnInit(): void {
  }

  getItems(item){
      console.log(item)
      this.__utility.navigate(item.url);
  }

}
