import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/Master/fdMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = menu;

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
   label:"Fixed Deposit",
   url:'/main/master/fixedeposit',
   hasQueryParams:true,
   queryParams:''
 }
]

  constructor(
    private __utility:UtiliService,
    private __actdt: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setBreadCrumbs();
  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__el){
    this.__utility.navigate(__el.url);
  }

}
