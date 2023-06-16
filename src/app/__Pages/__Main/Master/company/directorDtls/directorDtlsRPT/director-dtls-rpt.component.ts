import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { directorDtlsClm } from 'src/app/__Utility/Master/Company/directorDtls';

@Component({
  selector: 'app-director-dtls-rpt',
  templateUrl: './director-dtls-rpt.component.html',
  styleUrls: ['./director-dtls-rpt.component.css']
})
export class DirectorDtlsRptComponent implements OnInit {
  @Input() directorMst: any= [];
  columns=directorDtlsClm.column;
    /* send data after click on edit button
  & send the corrosponding row data & active manual Entry Tab by default*/
  @Output() selectIndex: EventEmitter<any> = new  EventEmitter<any>();
  /** End */
  constructor() { }

  ngOnInit(): void {}
  populateDT(director){
   this.selectIndex.emit({tabIndex:0,data:director});
  }
}
