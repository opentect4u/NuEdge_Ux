import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-bankDashboard',
  templateUrl: './bankDashboard.component.html',
  styleUrls: ['./bankDashboard.component.css']
})
export class BankDashboardComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/bnkModify","icon":"","id":26},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadbnk","icon":"","id":27}]

constructor(private utility: UtiliService) { }

ngOnInit() {
}
navigate(items){
this.utility.navigate(items.url);
}

}
