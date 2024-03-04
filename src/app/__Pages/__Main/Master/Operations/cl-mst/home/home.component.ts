import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/clientMstDashMenu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = menu;
  constructor(
    private utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    ) { }

  ngOnInit(): void {}
  getItems(event){
    //  this.utility.navigate(event.url)
    console.log(event.flag);
    switch(event.flag){

      case 'C':break;
      case 'U': break;
      case 'A': break;
      case 'D':
      case 'R': this.utility.navigate(event.url);break;

    }
  }


}
