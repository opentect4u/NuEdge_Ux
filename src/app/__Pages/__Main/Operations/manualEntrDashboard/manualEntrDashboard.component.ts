import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-manualEntrDashboard',
  templateUrl: './manualEntrDashboard.component.html',
  styleUrls: ['./manualEntrDashboard.component.css']
})
export class ManualEntrDashboardComponent implements OnInit {
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
    }
]
  constructor(
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute
  ) {
    console.log(this.__rtDt.snapshot.queryParamMap.get('product_id'));
  }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__url){
      this.__utility.navigatewithqueryparams(__url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}})
  }
}
