import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/clientMstDashMenu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = menu;
  constructor(private utility: UtiliService) { }

  ngOnInit(): void {
  }
  getItems(event){
    //  this.utility.navigate(event.url)
    console.log(event.flag);
  }
}
