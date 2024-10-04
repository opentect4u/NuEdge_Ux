import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Operations/manualEntrymenu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menu = menu.filter(el => el.id > 1);
  constructor(private utility: UtiliService) {
  }

  ngOnInit(): void {}
  getItems(event) {
    this.utility.navigate(event.url);
  }
}
