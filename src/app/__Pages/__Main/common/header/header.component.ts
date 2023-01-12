import { Component, OnInit } from '@angular/core';
import { menuList } from 'src/app/__Model/menuList';
import { UtiliService } from 'src/app/__Services/utils.service';
import rightHeaderMenu from '../../../../../assets/json/headerRightMenu.json';
import topmenu from '../../../../../assets/json/topNavigationmenu.json';
@Component({
  selector: 'common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  __rtDt: any;
  __rightHeaderMenu: menuList[] = rightHeaderMenu;
  __top_menu: any[] = topmenu;
  constructor(private __utility:UtiliService) {
    this.__utility.__route$.subscribe(res =>{
      if(res){
        console.log(res);
        
        this.__rtDt = res;
      }
    })
  }

  ngOnInit() {
  }
  navigate(__items){
    console.log(__items);
    if(__items.url){
      this.__utility.navigate(__items.url);
    }
  }
}
