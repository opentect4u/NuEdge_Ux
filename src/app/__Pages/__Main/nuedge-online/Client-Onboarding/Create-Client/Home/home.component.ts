import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import menus from '../../../../../../../assets/json/menu.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private utility: UtiliService) { }
  
    __menu = []

  ngOnInit(): void {
        const dt = menus.filter(el => el.id == 20)[0]?.sub_menu.filter(el => el.menu_name == 'Client Onboarding');
        const  mainMenu:any = dt[0];
        this.__menu = mainMenu.sub_menu.filter(el => el.menu_name == 'Create Client')[0]?.sub_menu;
        console.log(this.__menu)
  }

  getItems = (ev) => {
    this.utility.navigate(ev.url)
  }

}
