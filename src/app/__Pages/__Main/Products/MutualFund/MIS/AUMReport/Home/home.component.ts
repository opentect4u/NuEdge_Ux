import { Component, OnInit } from '@angular/core';
import brdCrmbs from '../../../../../../../../assets/json/BreadCrumbs/Products/MF/aumHome.json';
import Menus from '../../../../../../../../assets/json/Product/MF/MIS/misMenu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  brdCrmbs = brdCrmbs;
  menus = Menus.filter(x => x.id == 3)[0].has_submenu;
  constructor(
    private utility: UtiliService
  ) {this.setBreadCrumbs();}

  ngOnInit(): void {}
  setBreadCrumbs(){this.utility.getBreadCrumb(this.brdCrmbs);}

}
