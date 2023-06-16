import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'products-core-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @Input() items = [];

  constructor() { }

  ngOnInit(): void {
  }

}
