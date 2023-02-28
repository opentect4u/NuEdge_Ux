import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-mstOpDashboard',
  templateUrl: './mstOpDashboard.component.html',
  styleUrls: ['./mstOpDashboard.component.css']
})
export class MstOpDashboardComponent implements OnInit {

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
 }
]
  constructor(private __utility:UtiliService) {}
 ngOnInit() {this.__utility.getBreadCrumb(this.__brdCrmbs);}

}
