import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';

import menu from '../../../../../assets/json/OpMenu.json';

@Component({
  selector: 'operations-operationHome',
  templateUrl: './operationHome.component.html',
  styleUrls: ['./operationHome.component.css']
})
export class OperationHomeComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    }
]

   __menu:submenu[] = menu;
  constructor(private __utility: UtiliService) { }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__items){
    this.__utility.navigate(__items.url)

    // switch(__items.flag){
    //   case 'M':this.__utility.navigate(__items.url,btoa(__items.id));break;
    //   default:this.__utility.navigate(__items.url);break;
    // }
  }
}
