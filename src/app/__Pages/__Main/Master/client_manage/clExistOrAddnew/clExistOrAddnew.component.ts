import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-clExistOrAddnew',
  templateUrl: './clExistOrAddnew.component.html',
  styleUrls: ['./clExistOrAddnew.component.css']
})
export class ClExistOrAddnewComponent implements OnInit {
  __menu = [
    {"parent_id": 4,"menu_name": "Minor","has_submenu": "N","url": "/main/master/clientmaster","icon":"","flag":'M'},
    {"parent_id": 4,"menu_name": "Pan Holder","has_submenu": "N","url": "main/master/clientmaster","icon":"","flag":"P"},
    {"parent_id": 4,"menu_name": "Non Pan Holder","has_submenu": "N","url": "main/master/clientmaster","icon":"","flag":"N"},

  ]
  constructor(private utility: UtiliService) { }

  ngOnInit() {
  }
  navigate(items){
    console.log(items.flag);
      this.utility.navigatewithqueryparams(items.url,{queryParams:{flag:btoa(items.flag)}})
  }
}
