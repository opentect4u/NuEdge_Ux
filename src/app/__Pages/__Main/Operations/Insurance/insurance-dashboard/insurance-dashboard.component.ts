import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-insurance-dashboard',
  templateUrl: './insurance-dashboard.component.html',
  styleUrls: ['./insurance-dashboard.component.css']
})
export class InsuranceDashboardComponent implements OnInit {
__menu: submenu[] = [
   {
    id: 1,
    menu_name: "Form Recievable",
    has_submenu: "N",
    url: "/main/operations/insurance/rcvForm"
   },
   {
      id: 2,
      menu_name: "Insurance Trax",
      has_submenu: "N",
      url: "/main/operations/insurance/trax"
    },
    {
      id: 3,
      menu_name: "Acknowledgement Trax",
      has_submenu: "N",
      url: "/main/operations/insurance/ack"
    },
    {
      id: 4,
      menu_name: "Manual Update",
      has_submenu: "N",
      url: "/main/operations/insurance/manualupdate"
    }
]

  constructor(private __utility: UtiliService) {
   }

  ngOnInit() {}
  navigate(__url){
        this.__utility.navigate(__url)
  }

}
