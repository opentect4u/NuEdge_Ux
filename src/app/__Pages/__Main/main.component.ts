import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Route } from 'src/app/__Model/route';
import { UtiliService } from 'src/app/__Services/utils.service';
// import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  __rtDt: Route;
  constructor(
    private __actRt: ActivatedRoute,
   private router: Router,
    private __utility: UtiliService
  ) {
    this.__utility.__route$.subscribe(res =>{
      console.log(res);
      this.__rtDt = res;

    })
    // this.loadDropdownScript();
  }

  ngOnInit() {
  }

  // For Loading Script of top drop down menu in header.
  // loadDropdownScript() {
  //   this.__utility.addScript();
  // }
}
