import { Component, Input, OnInit } from '@angular/core';
import { ITab } from '../sip-home/sip-home.component';

@Component({
  selector: 'registered-sip',
  templateUrl: './registered-sip.component.html',
  styleUrls: ['./registered-sip.component.css']
})
export class RegisteredSIPComponent implements OnInit {

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
