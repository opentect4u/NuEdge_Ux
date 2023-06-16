import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
selector: 'master-prd_type',
templateUrl: './PrdTypeMstDashboard.component.html',
styleUrls: ['./PrdTypeMstDashboard.component.css']
})
export class PrdtypemstdashboardComponent implements OnInit {
  __menu = [
    {
        "id": 1,
        "menu_name":"Mutual Fund",
        "flag":"Y",
        "url":"/main/master/productwisemenu/home"
    },
    {
        "id": 2,
        "menu_name":"Fixed Deposit",
        "flag":"N",
        "url":"/main/master/fixedeposit"
    },
    {
        "id": 3,
        "menu_name":"Insurance",
        "flag":"Y",
        "url":"/main/master/insurance"
    },

    {
      "id": 25,
      "menu_name": "Bank",
      "flag": "N",
      "url": "/main/master/bank",
      "icon": "new_releases"
    },
    {
      "id": 9,
      "menu_name": "Document Type",
      "flag": "N",
      "url": "/main/master/docType",
      "icon": "stars"
    },
    {
      "id": 10,
      "menu_name": "Operations",
      "flag": "N",
      "url": "/main/master/mstOperations",
      "icon": "history"
    },
    {
      "id":11,
      "menu_name":"Email Template",
      "flag":'N',
      "url":"/main/master/emailTemplate",
      "icon":"mail"
    },
    {
      "id":12,
      "menu_name":"Geographical Master",
      "flag":'N',
      "url":"/main/master/geographic",
      "icon":"mail"
    },
    {
      "id":13,
      "menu_name":"Company",
      "flag":'N',
      "url":"/main/master/company",
      "icon":"mail"
    }
]


constructor(
  private __utility: UtiliService
) {
}

ngOnInit(){
}
navigate(__items){
  // if(__items.flag == 'Y'){
  //   this.__utility.navigatewithqueryparams(__items.url,{queryParams:{id:btoa(__items.id)}})
  // }
  // else{
    this.__utility.navigate(__items.url,null)
  // }
}
}
