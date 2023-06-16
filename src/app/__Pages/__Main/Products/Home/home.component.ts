import { Component, OnInit } from '@angular/core';
import prdType from '../../../../../assets/json/Product/prdType.json';
import brdcrmb from '../../../../../assets/json/BreadCrumbs/Products/home.json';

import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = prdType;
  brdCrmb = brdcrmb;
  constructor(
    private utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.setBreadCrumb();
  }
  setBreadCrumb(){
    this.utility.getBreadCrumb(this.brdCrmb)
  }

}
