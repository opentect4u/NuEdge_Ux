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
  navigate(items){
       this.utility.navigate(items.url);
  }

}
