import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { shareholderClmns } from 'src/app/__Utility/Master/Company/sharehld';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'share-holder-rpt',
  templateUrl: './share-holder-rpt.component.html',
  styleUrls: ['./share-holder-rpt.component.css']
})
export class ShareHolderRPTComponent implements OnInit {
  url:string = `${environment.company_logo_url + 'shared-doc/'}`
  @Input() shareHolderMst = [];
  columns:column[] =shareholderClmns.column;
  @Output() sendSelectedRowDt = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  populateDT(ev){
   this.sendSelectedRowDt.emit({index:0,data:ev});
  }
}
