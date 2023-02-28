import { Component, OnInit } from '@angular/core';
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
        "flag":"Y",
        "url":"/main/master/productwisemenu/home"
    },
    {
        "id": 3,
        "menu_name":"Insurance",
        "flag":"Y",
        "url":"/main/master/productwisemenu/home"
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
    }
]


constructor(
  private __utility: UtiliService
) {
}

ngOnInit(){

}
navigate(__items){
  // this.__utility.navigate(__items.url,btoa(__items.id));
  if(__items.flag == 'Y'){
    this.__utility.navigatewithqueryparams(__items.url,{queryParams:{id:btoa(__items.id)}})
  }
  else{
    this.__utility.navigate(__items.url,null)
  }
}
}
