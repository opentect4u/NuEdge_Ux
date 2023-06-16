import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../assets/json/clientMstDashMenu.json';
@Component({
  selector: 'app-clntMstDashboard',
  templateUrl: './clntMstDashboard.component.html',
  styleUrls: ['./clntMstDashboard.component.css']
})
export class ClntMstDashboardComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
 },
 {
   label:"Master",
    url:'/main/master/products',
    hasQueryParams:false,
    queryParams:''
 },
 {
  label:"Operations",
  url:'/main/master/mstOperations',
  hasQueryParams:false,
  queryParams:''
 },
 {
  label:"Client Master",
  url:'/main/master/clntMstHome',
  hasQueryParams:false,
  queryParams:''
 }
]
  // __menu:submenu[] = menu;
  constructor(private __utility: UtiliService) { }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }

}
