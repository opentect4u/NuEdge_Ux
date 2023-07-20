import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/filehelp.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu  = menu;
  constructor(private utility:UtiliService) { }
  ngOnInit(): void {}
  getItems(items){this.utility.navigate(items.url);}
}
