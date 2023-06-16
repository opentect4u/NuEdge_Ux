import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-scmType',
  templateUrl: './scmType.component.html',
  styleUrls: ['./scmType.component.css']
})
export class ScmTypeComponent implements OnInit {

  

constructor(private utility: UtiliService) { }

ngOnInit() {
}
navigate(type){
// this.utility.navigate(items.url);
this.utility.navigatewithqueryparams('/main/master/scmModify',{queryParams:{flag:btoa(type)}})
}
}
