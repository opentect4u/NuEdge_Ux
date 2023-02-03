import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-catDashboard',
  templateUrl: './catDashboard.component.html',
  styleUrls: ['./catDashboard.component.css']
})
export class CatDashboardComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/catModify","icon":"","id":20},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadcategory","icon":"","id":21}
           ]

  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(items){
       this.utility.navigate(items.url);
  }

}
