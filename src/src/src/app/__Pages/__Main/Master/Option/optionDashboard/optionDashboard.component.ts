import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-optionDashboard',
  templateUrl: './optionDashboard.component.html',
  styleUrls: ['./optionDashboard.component.css']
})
export class OptionDashboardComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/optionModify","icon":"","id":40},
  {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadOption","icon":"","id":39}]
  
  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(items){
  this.utility.navigate(items.url);
  }

}
