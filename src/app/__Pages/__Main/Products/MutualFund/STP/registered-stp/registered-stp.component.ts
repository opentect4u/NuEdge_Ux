import { Component, Input, OnInit } from '@angular/core';
import { ITab } from '../stp-home/stp-home.component';

@Component({
  selector: 'registered-stp',
  templateUrl: './registered-stp.component.html',
  styleUrls: ['./registered-stp.component.css']
})
export class RegisteredStpComponent implements OnInit {

  @Input() sub_tab:ITab[] = [];

  index:number = 0;

  constructor() { }

  ngOnInit(): void {
    console.log('sa')
  }


   /**
   * Event fired at the time of change tab
   * @param tabDtls
   */
    TabDetails  = <T extends {index:number,tabDtls:{tab_name:string,id:number,img_src:string,flag:string}}>(data:T) : void => {
          console.log(data);
    }
}
