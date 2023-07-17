import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../assets/json/Product/MF/homeMenus.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus  = Menus.filter(x => x.id == 6)[0].sub_menu;
  constructor() {}
  ngOnInit(): void {}
}
