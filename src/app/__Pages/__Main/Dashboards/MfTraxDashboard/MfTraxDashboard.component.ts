import { Component, OnInit } from '@angular/core';
import { submenu } from 'src/app/__Model/submenu';

@Component({
  selector: 'app-MfTraxDashboard',
  templateUrl: './MfTraxDashboard.component.html',
  styleUrls: ['./MfTraxDashboard.component.css']
})
export class MfTraxDashboardComponent implements OnInit {

  __menu: submenu[] = [
    {
      id: 23,
      menu_name: "Financial",
      has_submenu: "N",
      url: "/main/mftrax/fin"
  },
  {
      id: 24,
      menu_name: "Non-Financial",
      has_submenu: "N",
      url: "/main/mftrax/nonfin"
  },
  {
      id: 25,
      menu_name: "NFO",
      has_submenu: "N",
      url: "/main/mftrax/nfo"
  }
  ]

  constructor() { }

  ngOnInit() {
  }

}
