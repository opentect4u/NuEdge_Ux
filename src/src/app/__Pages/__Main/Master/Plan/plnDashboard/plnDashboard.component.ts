import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-plnDashboard',
  templateUrl: './plnDashboard.component.html',
  styleUrls: ['./plnDashboard.component.css']
})
export class PlnDashboardComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/plnModify","icon":"","id":36},
  {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadPln","icon":"","id":35}]
  
  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(items){
  this.utility.navigate(items.url);
  }
}
