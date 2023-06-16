import { Component, OnInit } from '@angular/core';
import prd_type from '../../../../../../../assets/json/product_type.json';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu;
  constructor(private utility: UtiliService) {
    this.menu = prd_type.filter((x: any) => x.id.toString() == '1')[0].sub_menu;

  }

  ngOnInit(): void {
  }
  getItems(event){
    console.log(event);
    this.utility.navigate(event.url,btoa(event.id));
  }
}
