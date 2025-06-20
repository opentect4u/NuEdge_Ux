import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-docTypeDashboard',
  templateUrl: './docTypeDashboard.component.html',
  styleUrls: ['./docTypeDashboard.component.css']
})
export class DocTypeDashboardComponent implements OnInit {
  
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/docTypeModify","icon":"","id":48},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadDocTypeCsv","icon":"","id":49}
           ]

  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  /**
   * * This function is used to navigate to a specific URL based on the provided items.
   * * It uses the utility service to perform the navigation.
   * @param items - The items containing the URL to navigate to.
   * * @return {void}
   * * @memberof DocTypeDashboardComponent
   * * @description
   * * This function is responsible for navigating to a specific URL when called.
   * * It utilizes the utility service to perform the navigation action.
   */
  navigate(items){
       this.utility.navigate(items.url);
  }
}
