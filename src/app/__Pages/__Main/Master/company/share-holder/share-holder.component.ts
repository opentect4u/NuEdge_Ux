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
  /**
   * * * This function is used to handle the tab change event.
   * * * It updates the tabIndex property with the index of the selected tab.
   * * @param {any} ev - The event containing the index of the selected tab.
   * * @returns {void}
   * @memberof ShareHolderComponent
   */
  onTabChange(ev) {
    this.tabIndex = ev.index;
  }
  populateDT(ev) {
    this.onTabChange(ev);
    this.formDT = ev?.data;
  }
  /**
   * * * This function is used to submit the saved shareholder details.
   * * * It emits an event with the provided event data.
   * * @param {any} ev - The event containing the shareholder details to submit.
   */
  submitsavedsharedholderDtls(ev) {
    this.sendsavedsharedholderDtls.emit(ev);
  }
  /**
   * * * This function is used to reset the form data.
   * * * It is triggered by an event and sets the form data to the provided event data.
   * * @param {any} ev - The event containing the form data to reset.
   * * @returns {void}
   * @memberof ShareHolderComponent
   */
  reset(ev) {
    this.formDT = ev;
  }
}
