import { Component, OnInit } from '@angular/core';
import  brdCrmb from '../../../../../../assets/json/BreadCrumbs/Products/MF/dashboard.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import Menus from '../../../../../../assets/json/Product/MF/homeMenus.json';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menus = Menus;
  brdCrmbs = brdCrmb;
  constructor(
    private utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.setBrdCrumbs();
  }
  setBrdCrumbs(){
     this.utility.getBreadCrumb(this.brdCrmbs);
  }

}
