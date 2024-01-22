import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/menu.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  _menu;
  constructor() {
    this._menu = (menu.filter(item => item.id == 15)[0].sub_menu as any).flatMap(({sub_menu}) =>
            sub_menu.flatMap(({sub_menu}) => sub_menu)
    )
  }

  ngOnInit(): void {
  }

}
