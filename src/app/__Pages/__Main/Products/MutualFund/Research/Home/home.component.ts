import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Product/MF/homeMenus.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menus = menu.filter((x) => x.id == 10)[0].sub_menu;
  constructor() {}
  ngOnInit(): void {}
}
