import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import prd_type from '../../../../../../assets/json/product_type.json';
@Component({
  selector: 'app-rcvDashboard',
  templateUrl: './rcvDashboard.component.html',
  styleUrls: ['./rcvDashboard.component.css']
})
export class RcvDashboardComponent implements OnInit {
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
      label:"Form Receivable",
      url:'/main/rcvDashboard',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
  __menu: any=[];
  constructor(private __rtDt: ActivatedRoute,private __utility: UtiliService) {
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')));
    this.__menu = prd_type.filter((x: any) => x.id.toString() == atob(this.__rtDt.snapshot.queryParamMap.get('product_id')))[0].sub_menu;
    console.log(this.__menu);

  }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__items){
    this.__utility.navigatewithqueryparams('/main/rcvForm',{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'),type_id:btoa(__items.id)}})

  }
}
