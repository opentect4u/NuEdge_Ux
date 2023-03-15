import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { UtiliService } from 'src/app/__Services/utils.service';
import  menu from '../../../../../../assets/json/Master/InsMst.json';

@Component({
  selector: 'app-ins-home',
  templateUrl: './ins-home.component.html',
  styleUrls: ['./ins-home.component.css']
})
export class InsHomeComponent implements OnInit {
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
   label:atob(this.__actdt.snapshot.queryParamMap.get('id')) == '3' ? "Insurance" : "Others",
   url:'/main/master/insurance',
   hasQueryParams:true,
   queryParams:{id:this.__actdt.snapshot.queryParamMap.get('id')}
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
    this.__utility.navigatewithqueryparams(__el.url,{queryParams:{product_id:this.__actdt.snapshot.queryParamMap.get('id')}})
  }
}
