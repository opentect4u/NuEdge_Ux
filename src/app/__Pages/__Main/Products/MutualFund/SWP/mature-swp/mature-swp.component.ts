import { Component, Input, OnInit } from '@angular/core';
import { ITab } from '../swp-home/swp-home.component';

@Component({
  selector: 'matured-swp',
  templateUrl: './mature-swp.component.html',
  styleUrls: ['./mature-swp.component.css']
})
export class MatureSwpComponent implements OnInit {
/**
   * Sub Tab Details
   */
@Input() sub_tab:ITab[] = [];

constructor() { }

ngOnInit(): void {
}
 /**
 * Event fired at the time of change tab
 * @param tabDtls
 */
 TabDetails  = <T extends {index:number,tabDtls:{tab_name:string,id:number,img_src:string,flag:string}}>(data:T) : void => {
  console.log(data);
}

}
