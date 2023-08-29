import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private __utility:UtiliService,private __actdt: ActivatedRoute) {
      this.__menu = menu.filter((x: menuBodyList) => x.id == 4);
   }
  ngOnInit() {}
  navigate(__items){
        console.log(__items);
       switch(__items.id){
        case 46:
        case 47:
        case 48:
        this.__utility.navigate(__items.url,btoa(__items.id));
        break;
        default:
          this.__utility.navigate(__items.url);
          break;
       }
        // this.__utility.navigate(__items.url);
        // this.__utility.navigatewithqueryparams(__items.url,{queryParams:{product_id:this.__actdt.snapshot.queryParamMap.get('id')}})
  }
}
