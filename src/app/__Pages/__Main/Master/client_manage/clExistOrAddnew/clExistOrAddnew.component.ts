import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-clExistOrAddnew',
  templateUrl: './clExistOrAddnew.component.html',
  styleUrls: ['./clExistOrAddnew.component.css']
})
export class ClExistOrAddnewComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operations',
      url: '/main/master/mstOperations',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Client Master',
      url: '/main/master/clntMstHome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Create Client Code',
      url: '/main/master/clOption',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: "Add New",
      url: '/main/master/claddnew',
      hasQueryParams: false,
      queryParams: '',
    },
  ];
  __menu = [
    {"parent_id": 4,"menu_name": "Minor","has_submenu": "N","url": "/main/master/clientmaster","icon":"","flag":'M'},
    {"parent_id": 4,"menu_name": "Pan Holder","has_submenu": "N","url": "main/master/clientmaster","icon":"","flag":"P"},
    {"parent_id": 4,"menu_name": "Non Pan Holder","has_submenu": "N","url": "main/master/clientmaster","icon":"","flag":"N"},

  ]
  constructor(private utility: UtiliService) { }

  ngOnInit() {
    this.utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(items){
    console.log(items.flag);
      this.utility.navigatewithqueryparams(items.url,{queryParams:{flag:btoa(items.flag)}})
  }
}
