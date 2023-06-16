import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../assets/json/Product/MF/MIS/misMenu.json';
import brdCrmbs  from '../../../../../../../assets/json/BreadCrumbs/Products/MF/MIS.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = Menus;
  brdCrmbs = brdCrmbs;
  constructor(private utility: UtiliService) { }
  ngOnInit(): void {this.setBredCrumbs()}
  setBredCrumbs(){this.utility.getBreadCrumb(this.brdCrmbs)}
}
