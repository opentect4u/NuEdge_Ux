import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-amcDashBorad',
  templateUrl: './amcDashBorad.component.html',
  styleUrls: ['./amcDashBorad.component.css']
})
export class AmcDashBoradComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/amcModify","icon":"","id":16},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "/main/master/amcUpload","icon":"","id":17}]
  constructor() { }

  ngOnInit() {
  }

}
