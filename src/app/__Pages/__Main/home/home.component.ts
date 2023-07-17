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

  /*** Holding left card menus i.e: Human resources,Admin etc */
  __menu:menuBodyList[] = menu;
  /*** End */
  /** For Holding data of Quick view In home page */
  __quickView:view[] = QuickView;
  /*** End */
  /** For Holding data of Employee scores in home Page */
  __employeeScores:view[] = EmployeeScores;
  /*** End */

  /*** For Showing Top Card Value */
  __topValues:any = [
    {title:"Title-1",value:999,class_name:"blue_Gredient"},
    {title:"Title-2",value:9999,class_name:"seeGreen_Gredient"},
    {title:"Title-3",value:9999,class_name:"red_Gredient"},
    {title:"Title-3",value:9999,class_name:"yellow_Gredient"}
  ]
  /*** End */
  constructor() {}
  ngOnInit() {}

}
