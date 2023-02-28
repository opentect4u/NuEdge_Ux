import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-manualEntrDashboard',
  templateUrl: './manualEntrDashboard.component.html',
  styleUrls: ['./manualEntrDashboard.component.css']
})
export class ManualEntrDashboardComponent implements OnInit {

  constructor(
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute
  ) {
    console.log(this.__rtDt.snapshot.queryParamMap.get('product_id'));
  }

  ngOnInit() {
  }
  navigate(__url){
      this.__utility.navigatewithqueryparams(__url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}})
  }
}
