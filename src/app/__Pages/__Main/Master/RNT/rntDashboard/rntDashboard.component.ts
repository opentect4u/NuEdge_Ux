import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-rntDashboard',
  templateUrl: './rntDashboard.component.html',
  styleUrls: ['./rntDashboard.component.css']
})
export class RntDashboardComponent implements OnInit {
  
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/rntmodify","icon":"","id":3,"params":'Y'},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/rntUpload","icon":"","id":15,"params":'N'}
           ]

  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(items){
       this.utility.navigate(items.url,items.params == 'Y' ? btoa('0') : '');
  }
}
