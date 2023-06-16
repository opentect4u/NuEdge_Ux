import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-share-holder',
  templateUrl: './share-holder.component.html',
  styleUrls: ['./share-holder.component.css'],
})
export class ShareHolderComponent implements OnInit {
  tabIndex: number = 0;
  @Input() subTab = [];
  @Input() shareHolderMst: any = [];
  @Input() country: any = [];
  @Input() cmpDtlsMst: any = [];
  public formDT;
  @Output() sendsavedsharedholderDtls = new EventEmitter<any>();
  ngOnInit(): void {}
  onTabChange(ev) {
    this.tabIndex = ev.index;
  }
  populateDT(ev) {
    this.onTabChange(ev);
    this.formDT = ev?.data;
  }
  submitsavedsharedholderDtls(ev) {
    this.sendsavedsharedholderDtls.emit(ev);
  }
  reset(ev) {
    this.formDT = ev;
  }
}
