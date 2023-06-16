import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cmpProfile } from 'src/app/__Utility/Master/Company/cmpProfile';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-rpt',
  templateUrl: './profile-rpt.component.html',
  styleUrls: ['./profile-rpt.component.css']
})
export class ProfileRptComponent implements OnInit {
  logo_url:string  = `${environment.company_logo_url}`; /** Holding the logo url part */
  columns = cmpProfile.column;/** Holding Company Profile Columns */
  @Input() cmpMst: any = []; /** Holding Company Master Data */
   /* send data after click on edit button
  & send the corrosponding row data & active manual Entry Tab by default*/
  @Output() selectIndex: EventEmitter<any> = new  EventEmitter<any>();
  /** End */

  constructor() { }

  ngOnInit(): void {}
  /** Function trigger after click on edit button */
  populateDT(profile){
      this.selectIndex.emit({tabIndex:0,data:profile});
  }
  /** End */
}
