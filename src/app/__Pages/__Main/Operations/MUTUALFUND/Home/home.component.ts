import { Component, OnInit } from '@angular/core';
import mfHomeMenu from '../../../../../../assets/json/Operations/mfHome.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   menu = mfHomeMenu;
  constructor(
    private utility: UtiliService
  ) { }

  ngOnInit(): void {
    console.log(this.menu)
  }
  getItems(event){
     this.utility.navigate(event.url);
  }
}
