import { Component, OnInit } from '@angular/core';
import menu from '../../../../../assets/json/mailback.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-mailbackhome',
  templateUrl: './mailbackhome.component.html',
  styleUrls: ['./mailbackhome.component.css']
})
export class MailbackhomeComponent implements OnInit {

  mailBackMenu = menu;

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {
  }
  getItems(items){
    console.log(items);
    this.utility.navigate(items.url);

  }
}
