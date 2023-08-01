import { Component, Input, OnInit } from '@angular/core';
import { ITab } from '../stp-home/stp-home.component';

@Component({
  selector: 'matured-stp',
  templateUrl: './matured-stp.component.html',
  styleUrls: ['./matured-stp.component.css']
})
export class MaturedStpComponent implements OnInit {

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
