import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/menu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  _menu;
  constructor(private utility:UtiliService) {
    this._menu = menu.filter(item => item.id == 15)[0].sub_menu;
  }

  ngOnInit(): void {
    this._menu = this._menu.flatMap(({sub_menu}) =>sub_menu);
  }

  getItems = (item) =>{
    this.utility.navigate(item.url);
  }

}
