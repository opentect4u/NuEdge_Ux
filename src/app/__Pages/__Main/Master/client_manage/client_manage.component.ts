import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'master-client_manage',
  templateUrl: './client_manage.component.html',
  styleUrls: ['./client_manage.component.css']
})
export class Client_manageComponent implements OnInit {
  _menus =[]
  constructor() { 
  }

  ngOnInit() {
  }
  getSearchItem(__itemDtls){
    console.log(__itemDtls);
  }

}
