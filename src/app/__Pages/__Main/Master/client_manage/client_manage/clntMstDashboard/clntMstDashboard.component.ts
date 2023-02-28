import { Component, OnInit } from '@angular/core';
import { submenu } from 'src/app/__Model/submenu';
import menu from '../../../../../../assets/json/clientMstDashMenu.json';
@Component({
  selector: 'app-clntMstDashboard',
  templateUrl: './clntMstDashboard.component.html',
  styleUrls: ['./clntMstDashboard.component.css']
})
export class ClntMstDashboardComponent implements OnInit {
  __menu:submenu[] = menu;
  constructor() { }

  ngOnInit() {
  }

}
