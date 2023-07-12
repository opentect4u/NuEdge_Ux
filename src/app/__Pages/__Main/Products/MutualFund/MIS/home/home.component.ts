import { Component, OnInit } from '@angular/core';
import Menus from '../../../../../../../assets/json/Product/MF/MIS/misMenu.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = Menus;
  constructor() { }
  ngOnInit(): void {
  }
}
