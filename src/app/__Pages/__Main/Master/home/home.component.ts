import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { UtiliService } from 'src/app/__Services/utils.service';
import  menu from '../../../../../assets/json/menu.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu:menuBodyList[];
  __brdCrmbs: breadCrumb[] = [{
                              label:"Home",
                              url:'/main',
                              hasQueryParams:false,
                              queryParams:''},
                              {
                                label:"Master",
                                url:'/main/master/products',
                                hasQueryParams:false,
                                queryParams:''
                              },
                              {
                                label:atob(this.__actdt.snapshot.queryParamMap.get('id')) == '1' ? "Mutual Fund" : "Others",
                                url:'/main/master/productwisemenu/home',
                                hasQueryParams:true,
                                queryParams:{id:this.__actdt.snapshot.queryParamMap.get('id')}
                              }
                            ]
  constructor(private __utility:UtiliService,private __actdt: ActivatedRoute) {
      this.__menu = menu.filter((x: menuBodyList) => x.id == 4);
      console.log(this.__menu);
   }

  ngOnInit() {
    this.setBreadCrumb();
  }
  navigate(__items){
        // this.__utility.navigate(__items.url);
        console.log(__items.url);

        this.__utility.navigatewithqueryparams(__items.url,{queryParams:{product_id:this.__actdt.snapshot.queryParamMap.get('id')}})
  }
  setBreadCrumb(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
}
