import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private utility: UtiliService) { }

  ngOnInit(): void {
  }
  __menu = [
    {
      parent_id: 4,
      title: 'Existing',
      has_submenu: 'N',
      url: '/main/master/mstOperations/clntMst/clOption/clientmaster',
      flag: 'E',
      icon: "fa fa-user-o"
    },
    {
      parent_id: 4,
      title: 'Add New',
      has_submenu: 'N',
      url: '/main/master/mstOperations/clntMst/clOption/addnew',
      flag: 'A',
      icon: "fa fa-user-o"
    },
    {
      parent_id: 4,
      title: 'Upload CSV',
      has_submenu: 'N',
      url: 'main/master/clUploadCsv',
      flag: 'U',
      icon: "fa fa-user-o"
    },
  ];
  getItems(event){
   this.utility.navigate(event.url,event.flag == 'E' ? btoa(event.flag) : null);
  }
}
