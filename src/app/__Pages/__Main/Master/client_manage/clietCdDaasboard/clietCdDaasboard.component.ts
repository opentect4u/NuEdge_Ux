import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';


@Component({
  selector: 'app-clietCdDaasboard',
  templateUrl: './clietCdDaasboard.component.html',
  styleUrls: ['./clietCdDaasboard.component.css']
})
export class ClietCdDaasboardComponent implements OnInit {
  __menu = [
    {"parent_id": 4,"menu_name": "Existing","has_submenu": "N","url": "/main/master/clModify","icon":"","flag":'E'},
    {"parent_id": 4,"menu_name": "Add New","has_submenu": "N","url": "main/master/claddnew","icon":"","flag":"A"},
    {"parent_id": 4,"menu_name": "Upload Csv","has_submenu": "N","url": "main/master/clUploadCsv","icon":"","flag":"U"}
  ]
  
  constructor(private __utility: UtiliService) {
    console.log(this.__menu);
    
   }

  ngOnInit() {
  }
  navigate(__items){
   switch(__items.flag){
    case "E" : this.__utility.navigatewithqueryparams(__items.url,{queryParams:{flag:btoa(__items.flag)}});break;
    case "A" : this.__utility.navigate(__items.url);break;
    case "U" : this.__utility.navigate(__items.url);break;
    default: this.__utility.showSnackbar('Something went wrong !! Please try again later',0);break;

   }
  }

}
