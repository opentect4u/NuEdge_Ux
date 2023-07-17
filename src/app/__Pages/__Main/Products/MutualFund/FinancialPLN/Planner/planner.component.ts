import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Product/MF/MIS/FinPLN/planner.json';
@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  menus = menu;
  constructor() { }
  ngOnInit(): void {
  }
}
