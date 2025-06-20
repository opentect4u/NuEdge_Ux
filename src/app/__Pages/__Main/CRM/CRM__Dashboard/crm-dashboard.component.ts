import { Component, OnInit } from '@angular/core';
import menu from '../../../../../assets/json/menu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.css']
})
export class CRMDashboardComponent implements OnInit {
  __menu;
  constructor(private utility:UtiliService) {
    this.__menu = menu.filter(item => item.id == 15)[0].sub_menu
  }

  ngOnInit(): void {}
  /**
   * 
   * @param item - The menu item object containing the URL to navigate to
   * @description This function is used to navigate to the specified URL when a menu item is clicked.
   * It uses the utility service to perform the navigation.
   */
  getItems = (item) =>{
      this.utility.navigate(item.url);
  }
}
