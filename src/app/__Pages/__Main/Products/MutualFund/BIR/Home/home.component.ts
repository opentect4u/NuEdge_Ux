import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import brdCrmbs from '../../../../../../../assets/json/BreadCrumbs/Products/MF/businessInsideRPTHome.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = Menus.filter(x => x.id == 9)[0].sub_menu;
  constructor(private utility: UtiliService) { }
  ngOnInit(): void {this.setBreadCrumbs();}
  setBreadCrumbs(){this.utility.getBreadCrumb(brdCrmbs);}

}
