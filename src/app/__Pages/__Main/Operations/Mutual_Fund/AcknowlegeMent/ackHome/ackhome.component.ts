import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
selector: 'ackhome-component',
templateUrl: './ackhome.component.html',
styleUrls: ['./ackhome.component.css']
})
export class AckhomeComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1' ? "Mutual Fund" : "others",
      url:'/main/operations/mfdashboard' + '/' + this.__rtDt.snapshot.queryParamMap.get('product_id'),
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Manual Entry",
      url:'/main/operations/manualEntr',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Acknowledgement Trax",
      url:'/main/operations/acknowledgement',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')
      }
    }
];
  __menu: submenu[] = [
    {
      id: 1,
      menu_name: "Financial",
      has_submenu: "N",
      url: "/main/operations/acknowledgement/ackEntry"
  },
  {
      id: 3,
      menu_name: "Non-Financial",
      has_submenu: "N",
      url: "/main/operations/mfTraxEntry/nonfin"
  },
  {
      id: 4,
      menu_name: "NFO",
      has_submenu: "N",
      url: "/main/operations/acknowledgement/ackEntry"
  }
  ]
  constructor(
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute) { }
ngOnInit(){
  this.__utility.getBreadCrumb(this.__brdCrmbs);
}
navigate(__items){
  this.__utility.navigatewithqueryparams(__items.url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'),trans_type_id:btoa(__items.id.toString())}})
}
}
