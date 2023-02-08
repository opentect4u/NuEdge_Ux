import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import prd_type from '../../../../../../assets/json/product_type.json';
@Component({
  selector: 'app-rcvDashboard',
  templateUrl: './rcvDashboard.component.html',
  styleUrls: ['./rcvDashboard.component.css']
})
export class RcvDashboardComponent implements OnInit {
  __menu: any=[];
  constructor(private __rtDt: ActivatedRoute,private __utility: UtiliService) { 
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')));
    this.__menu = prd_type.filter((x: any) => x.id.toString() == atob(this.__rtDt.snapshot.queryParamMap.get('product_id')))[0].sub_menu;
    console.log(this.__menu);
    
  }

  ngOnInit() {
  }
  navigate(__items){
    this.__utility.navigatewithqueryparams('/main/rcvForm',{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'),type_id:btoa(__items.id)}})

  }
}
