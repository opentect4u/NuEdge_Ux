import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../assets/json/Product/MF/homeMenus.json';
import brdCrmbs from '../../../../../../../assets/json/BreadCrumbs/Products/MF/analytical.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = Menus.filter(x => x.id == 12)[0].sub_menu;
  constructor(
    private utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.setBreadCrumb();
  }
  setBreadCrumb(){
    this.utility.getBreadCrumb(brdCrmbs);
  }

}
