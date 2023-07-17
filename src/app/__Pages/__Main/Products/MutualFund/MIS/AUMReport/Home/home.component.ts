import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../../assets/json/Product/MF/MIS/misMenu.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menus = Menus.filter((x) => x.id == 3)[0].has_submenu;
  constructor() {}
  ngOnInit(): void {}
}
