import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../assets/json/Product/MF/homeMenus.json';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  menus = Menus;
  constructor() {}

  ngOnInit(): void {}
}
