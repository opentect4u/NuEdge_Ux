import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-scmDashboard',
  templateUrl: './scmDashboard.component.html',
  styleUrls: ['./scmDashboard.component.css']
})
export class ScmDashboardComponent implements OnInit {

  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/scmType","icon":"","id":32},
  {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadScm","icon":"","id":21}
 ]

constructor(private utility: UtiliService) { }

ngOnInit() {
}
navigate(items){
this.utility.navigate(items.url);
}
}
