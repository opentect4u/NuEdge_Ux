import { Component, Input, OnInit } from '@angular/core';
import { ITab } from '../swp-home/swp-home.component';

@Component({
  selector: 'registered-swp',
  templateUrl: './registered-swp.component.html',
  styleUrls: ['./registered-swp.component.css']
})
export class RegisteredSwpComponent implements OnInit {

  @Input() sub_tab:ITab[] = [];

  index:number = 0;

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
