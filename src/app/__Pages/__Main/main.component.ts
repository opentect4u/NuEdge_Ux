import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/__Model/route';
// import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  __rtDt: Route;
  constructor(
    // private __utility: UtiliService
  ) {
    // this.loadDropdownScript();
    // this.__utility.__route$.subscribe(res => {
    //   if (res) {
    //     this.__rtDt = res;
    //   }
    // })
  }

  ngOnInit() { }

  // For Loading Script of top drop down menu in header.
  // loadDropdownScript() {
  //   this.__utility.addScript();
  // }
}
