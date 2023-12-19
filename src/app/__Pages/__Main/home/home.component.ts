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
  // __topValues:any = [
  //   {title:"Live SIP",value:999,class_name:"bg-gradient-dark",monthly_trend:-.20},
  //   {title:"Live STP",value:9999,class_name:"bg-gradient-pink",monthly_trend: 50.0},
  //   {title:"Live SWP",value:9999,class_name:"bg-gradient-success",monthly_trend:-.20},
  //   {title:"NAV",value:9999,class_name:"bg-gradient-info",monthly_trend:-.20}
  // ]
  /*** End */


    /*** For Showing Top Card Value */
    __topValues:any = [
      {title:"Current AUM",value:257380192,class_name:"seeGreen_Gredient"},
      {title:"Live SIP",value:12344567,class_name:"blue_Gredient"},
      {title:"Monthly MIS",value:99999999,class_name:"red_Gredient"},
      {title:"Title-4",value:9999,class_name:"yellow_Gredient"}
    ]
    /*** End */
  constructor() {}
  ngOnInit() {}

}
