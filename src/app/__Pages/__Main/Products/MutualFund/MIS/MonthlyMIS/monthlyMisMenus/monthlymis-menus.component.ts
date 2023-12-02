/********************************************************************
 *   This is Monthly MIS Home Page
 *   Every routes of monthly MIS will be gone thorught it
 *   `8` will be id by which we fetch Monthly MIS Nested route from `Menus` array.
 *
*/
import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../../assets/json/Product/MF/MIS/misMenu.json';

@Component({
  selector: 'app-monthlymis-menus',
  templateUrl: './monthlymis-menus.component.html',
  styleUrls: ['./monthlymis-menus.component.css']
})
export class MonthlymisMenusComponent implements OnInit {
  __menu;

  constructor() { }

  ngOnInit(): void {
    this.__menu = Menus.filter((item) => item.id == 8)[0].has_submenu;
  }

}
