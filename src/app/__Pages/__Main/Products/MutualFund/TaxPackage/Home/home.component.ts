import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import Menus from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import brdCrmbs from '../../../../../../../assets/json/BreadCrumbs/Products/MF/taxHome.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus  = Menus.filter(x => x.id == 6)[0].sub_menu;
  constructor(private utility: UtiliService) { this.setBreadCrumbs();}
  ngOnInit(): void {}
  setBreadCrumbs(){this.utility.getBreadCrumb(brdCrmbs)}

}
