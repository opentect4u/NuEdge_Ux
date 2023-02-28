import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-subcatDashboard',
  templateUrl: './subcatDashboard.component.html',
  styleUrls: ['./subcatDashboard.component.css']
})
export class SubcatDashboardComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/subcatModify","icon":"","id":23},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadSubcat","icon":"","id":24}
           ]

  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(items){
       this.utility.navigate(items.url);
  }
}
