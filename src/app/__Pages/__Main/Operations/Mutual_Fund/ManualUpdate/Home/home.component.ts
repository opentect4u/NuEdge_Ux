import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    // main/operations/MfTrax
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
        label:"Mutual Fund",
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
        label:"Manual Update",
        url:'/main/operations/manualupdate',
        hasQueryParams:true,
        queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
      }
  ]
  __menu: submenu[] = [
    {
      id: 1,
      menu_name: "Financial",
      has_submenu: "N",
      url: "/main/operations/manualupdate/financial"
  },
  {
      id: 3,
      menu_name: "Non-Financial",
      has_submenu: "N",
      url: "/main/operations/manualupdate/nonfinancial"
  },
  {
      id: 4,
      menu_name: "NFO",
      has_submenu: "N",
      url: "/main/operations/manualupdate/nfo"
  }
  ]
  constructor(
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute) { }

  ngOnInit() {
    // console.log(this.__rtDt.snapshot.queryParamMap.get('product_id'));
    this.__utility.getBreadCrumb(this.__brdCrmbs);

  }
  navigate(__items){
    this.__utility.navigatewithqueryparams(__items.url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}})
  }

}
