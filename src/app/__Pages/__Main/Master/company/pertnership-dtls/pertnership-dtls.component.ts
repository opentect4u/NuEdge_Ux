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
  /** 
   * * This function is used to handle the tab change event.
   * * It updates the tabindex with the index of the selected tab.
   * * @param {any} ev - The event containing the tab change information.
   * * @returns {void}
   */
  onTabChange(ev){
    this.tabindex = ev.index
  }
  /** * * This function is used to set the partnership details based on the provided event data.
   * * It updates the pertnerShipDT with the data from the event and calls the onTabChange function.
   * * @param {any} ev - The event containing the partnership details.
   * * @returns {void}
   */
  setPertnerDormDtls(ev){
   this.pertnerShipDT = ev?.data;
   this.onTabChange(ev)
  }
  /** * This function is used to send the partnership details to the parent component.
   * * It emits the pertnerShipDT as an event to the parent component.
   * * @param {any} ev - The event containing the partnership details to be sent.
   * * @returns {void}
   */
  sendDetailsToParent(ev){
   this.setpertnershipDtls.emit(ev)
  }
  /** * This function is used to reset the partnership details.
   * * It updates the pertnerShipDT with the provided event data.
   * * @param {any} ev - The event containing the partnership details to be reset.
   * * @returns {void}
   */
  reset(ev){
    this.pertnerShipDT = ev;
  }
}
