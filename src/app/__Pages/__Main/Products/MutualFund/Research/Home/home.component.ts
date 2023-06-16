import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import brdCrmbs from '../../../../../../../assets/json/BreadCrumbs/Products/MF/researchHome.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = menu.filter(x => x.id == 10)[0].sub_menu;
  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
    this.setBrdCrmbs();
  }
  setBrdCrmbs(){
    this.utility.getBreadCrumb(brdCrmbs)
  }
}
