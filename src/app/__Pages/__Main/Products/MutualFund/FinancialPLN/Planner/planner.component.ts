import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Product/MF/MIS/FinPLN/planner.json';
import brdCrmbs from '../../../../../../../assets/json/BreadCrumbs/Products/MF/planner.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  menus = menu;
  constructor(
    private utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.getBreadCrumb();
  }
  getBreadCrumb(){
    this.utility.getBreadCrumb(brdCrmbs)
  }
}
