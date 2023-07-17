import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-MFDashboard',
  templateUrl: './MFDashboard.component.html',
  styleUrls: ['./MFDashboard.component.css']
})
export class MFDashboardComponent implements OnInit {
  __menus = []

  constructor(private __rtDt: ActivatedRoute,private __utility: UtiliService) {
   }

  ngOnInit() {}
  navigate(__url){
        this.__utility.navigatewithqueryparams(__url,{queryParams:{product_id:this.__rtDt.snapshot.params['id']}})
  }
}
