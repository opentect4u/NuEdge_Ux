import { Component, OnInit } from '@angular/core';
import brdCrmbs from '../../../../../../../assets/json/BreadCrumbs/Products/MF/portfolioHome.json';
import Menus from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = Menus.filter((x) => x.id == 2)[0].sub_menu;
  constructor(private utility: UtiliService) {this.setBrdCrmbs();}
  ngOnInit(): void {}
  setBrdCrmbs(){this.utility.getBreadCrumb(brdCrmbs)}
}
