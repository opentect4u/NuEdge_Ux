import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pertnership-dtls',
  templateUrl: './pertnership-dtls.component.html',
  styleUrls: ['./pertnership-dtls.component.css']
})
export class PertnershipDtlsComponent implements OnInit {
  tabindex: number =0;

  @Input() subTab = [];
  @Input() cmpDtlsMst: any=[];
  @Input() pertnershipMstDtls: any = [];
  @Input() country: any = [];
  @Output() setpertnershipDtls = new EventEmitter<any>();
  @Input() pertnerShipDT;
  // [country]="countryMst"
  // [cmpDtlsMst]="cmpDtls"
  // (setpertnershipDtls)="setpertnershipDtls($event)"

  ngOnInit(): void {}
  onTabChange(ev){
    this.tabindex = ev.index
  }
  setPertnerDormDtls(ev){
   this.pertnerShipDT = ev?.data;
   this.onTabChange(ev)
  }
  sendDetailsToParent(ev){
   this.setpertnershipDtls.emit(ev)
  }
  reset(ev){
    this.pertnerShipDT = ev;
  }
}
