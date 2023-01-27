import { Component, OnInit } from '@angular/core';
import { submenu } from 'src/app/__Model/submenu';

import menu from '../../../../../assets/json/OpMenu.json';

@Component({
  selector: 'operations-operationHome',
  templateUrl: './operationHome.component.html',
  styleUrls: ['./operationHome.component.css']
})
export class OperationHomeComponent implements OnInit {
   __menu:submenu[] = menu;
  constructor() { }

  ngOnInit() {
  }

}
