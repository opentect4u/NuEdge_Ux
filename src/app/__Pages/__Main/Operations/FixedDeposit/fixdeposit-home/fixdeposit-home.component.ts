import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-fixdeposit-home',
  templateUrl: './fixdeposit-home.component.html',
  styleUrls: ['./fixdeposit-home.component.css']
})
export class FixdepositHomeComponent implements OnInit {
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
    },
    {
      label:"Fixed Deposit",
      url:'/main/operations/fixedeposit',
      hasQueryParams:false,
      queryParams:''
    }
]
__menu: submenu[] = [
   {
    id: 1,
    menu_name: "Form Recievable",
    has_submenu: "N",
    url: "/main/operations/fixedeposit/rcvForm"
   },
   {
      id: 2,
      menu_name: "FD Trax",
      has_submenu: "N",
      url: "/main/operations/fixedeposit/fdtrax"
    },
    {
      id: 3,
      menu_name: "Acknowledgement Trax",
      has_submenu: "N",
      url: "/main/operations/fixedeposit/ack"
    },
    {
      id: 4,
      menu_name: "Manual Update",
      has_submenu: "N",
      url: "/main/operations/fixedeposit/manualupdate"
    }
]

  constructor(private __utility: UtiliService) {
   }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__url){
        this.__utility.navigate(__url)
  }


}
