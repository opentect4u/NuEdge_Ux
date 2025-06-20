import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../assets/json/Master/menu.json';
@Component({
selector: 'master-prd_type',
templateUrl: './PrdTypeMstDashboard.component.html',
styleUrls: ['./PrdTypeMstDashboard.component.css']
})
export class PrdtypemstdashboardComponent implements OnInit {
  __menu = menu;

constructor(
  private __utility: UtiliService
) {
}

ngOnInit(){
  console.log(this.__menu)
}
/**
 * * * This function is used to navigate to a specific URL based on the provided items.
 * * * It uses the utility service to perform the navigation.
 * @param {any} __items - The items containing the URL to navigate to.
 */
getItems = (__items) => {
  // if(__items.flag == 'Y'){
  //   this.__utility.navigatewithqueryparams(__items.url,{queryParams:{id:btoa(__items.id)}})
  // }
  // else{
    this.__utility.navigate(__items.url,null)
  // }
}
}
