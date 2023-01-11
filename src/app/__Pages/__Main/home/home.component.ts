import { Component, OnInit } from '@angular/core';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { view } from 'src/app/__Model/view';
import  menu from '../../../../assets/json/menu.json';
import QuickView from '../../../../assets/json/quickView.json';
import EmployeeScores from '../../../../assets/json/EmployeeScores.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu:menuBodyList[] = menu;
  __quickView:view[] = QuickView;
  __employeeScores:view[] = EmployeeScores;
  __topValues:any = [
    {title:"title-1",value:999,class_name:"blue_Gredient"},
    {title:"title-2",value:9999,class_name:"seeGreen_Gredient"},
    {title:"title-3",value:9999,class_name:"red_Gredient"},
    {title:"title-3",value:9999,class_name:"yellow_Gredient"}
  ]
  constructor() { }

  ngOnInit() {
  }

}
