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
  navigate(items){
       this.utility.navigate(items.url);
  }
}
