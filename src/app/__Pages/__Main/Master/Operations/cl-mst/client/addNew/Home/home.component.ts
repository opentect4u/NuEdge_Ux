import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = [
    {"parent_id": 4,
    "icon": "",
    "title": "Minor",
    "has_submenu": "N",
    "img":"existing.png",
    "url": "/main/master/mstOperations/clntMst/clOption/addnew/clientmaster",
    "flag":'M'},
    {"parent_id": 4,
    "icon": "",
    "title": "Pan Holder",
    "img":"panHolder.png",
    "has_submenu": "N",
    "url": "main/master/mstOperations/clntMst/clOption/addnew/clientmaster","flag":"P"},
    {"parent_id": 4,
    "icon": "",
    "title": "Non Pan Holder",
    "has_submenu": "N",
    "img":"nonpanHolder.png",
    "url": "main/master/mstOperations/clntMst/clOption/addnew/clientmaster","flag":"N"},

  ]
  constructor(private utility: UtiliService) { }

  ngOnInit(): void {
  }
  getItems(event){
  this.utility.navigate(event.url,btoa(event.flag));

  }

}
