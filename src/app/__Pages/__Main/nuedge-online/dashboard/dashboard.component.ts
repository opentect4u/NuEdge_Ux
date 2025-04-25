import { Component, OnInit } from '@angular/core';
import menus from '../../../../../assets/json/menu.json';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  menuForNuedgeOnline = menus.filter(el => el.id == 15)[0]?.sub_menu

  constructor(private utility: UtiliService) { }

  ngOnInit(): void {
  }

  getItems = (ev) => {
    this.utility.navigate(ev.url)
  }

}
