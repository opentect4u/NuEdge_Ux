import { Component, OnInit } from '@angular/core';
import prdType from '../../../../../assets/json/Product/prdType.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus = prdType;
  constructor() { }

  ngOnInit(): void {
  }


}
