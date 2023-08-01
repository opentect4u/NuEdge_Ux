import { Component, Input, OnInit } from '@angular/core';
import { ITab } from '../sip-home/sip-home.component';

@Component({
  selector: 'matured-sip',
  templateUrl: './matured-sip.component.html',
  styleUrls: ['./matured-sip.component.css']
})
export class MaturedSIPComponent implements OnInit {

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
