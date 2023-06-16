import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { loginPassClmns } from 'src/app/__Utility/Master/Company/loginPass';

@Component({
  selector: 'login-pass-rpt',
  templateUrl: './login-pass-rpt.component.html',
  styleUrls: ['./login-pass-rpt.component.css']
})
export class LoginPassRPTComponent implements OnInit {
   @Input() loginPasswordLockerMst= [];
   columns: column[] = loginPassClmns.columns;
   @Output() sendParticularRowData = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  populateDT(ev){
    this.sendParticularRowData.emit({index:0,data:ev})
  }
  openURL(url){
    window.open(url,'__blank');

  }
}
