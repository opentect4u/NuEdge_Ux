import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-docsDashboard',
  templateUrl: './docsDashboard.component.html',
  styleUrls: ['./docsDashboard.component.css']
})
export class DocsDashboardComponent implements OnInit {
  __menu = [
    {"parent_id": 4,"menu_name": "Add New","has_submenu": "N","url": "/main/master/docsModify","icon":"","id":45},
    {"parent_id": 4,"menu_name": "Upload Csv","has_submenu": "N","url": "/main/master/uploadCsv","icon":"","id":46}
  ]
  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  /**
   * * This function is used to navigate to a specific URL based on the provided items.
   * * @param items - The items containing the URL to navigate to.
   * * * @return {void}
   * * @memberof DocsDashboardComponent
   * * @description
   * * This function is responsible for navigating to a specific URL when called.
   * * It utilizes the utility service to perform the navigation action.
   */
  navigate(items){
       this.utility.navigate(items.url);
  }

}
