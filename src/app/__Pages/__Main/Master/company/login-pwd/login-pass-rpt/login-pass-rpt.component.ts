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
  /** * This function is used to populate the data table with the selected row data.
 * It emits an event with the index and data of the selected row.
 * @param {any} ev - The event containing the data of the selected row.
 * @returns {void}
 */
  populateDT(ev){
    this.sendParticularRowData.emit({index:0,data:ev})
  }
  /** * This function is used to open a URL in a new tab.
 * @param {string} url - The URL to be opened.
 * @returns {void}
 */
  openURL(url){
    window.open(url,'__blank');

  }
}
