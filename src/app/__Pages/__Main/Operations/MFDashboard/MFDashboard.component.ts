import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-MFDashboard',
  templateUrl: './MFDashboard.component.html',
  styleUrls: ['./MFDashboard.component.css']
})
export class MFDashboardComponent implements OnInit {
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
      label:atob(this.__rtDt.snapshot.params['id']) == '1' ? "Mutual Fund" : "others",
      url:'/main/operations/mfdashboard' + '/' + this.__rtDt.snapshot.params['id'],
      hasQueryParams:false,
      queryParams:''
    }
]
  __menus = []

  constructor(private __rtDt: ActivatedRoute,private __utility: UtiliService) {
   }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__url){
        this.__utility.navigatewithqueryparams(__url,{queryParams:{product_id:this.__rtDt.snapshot.params['id']}})
  }
}
