import { FocusableOption, Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';
import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'core-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements Highlightable, ListKeyManagerOption,FocusableOption  {
  private _isActive: boolean = false;
  @Input() disabled: boolean = false;
  @Input() items;


  constructor(private element: ElementRef) { }
  /**
   * @description This function is used to set the active styles for the list item
   * It sets the _isActive property to true, which will apply the active styles to the list item.
   * @returns {void}
   */
  setActiveStyles(): void {
    this._isActive = true;
  }
  /**
   * @description This function is used to set the styles for the list item when it is inactive
   * It sets the _isActive property to false, which will remove the active styles from the list item.
   * @returns {void}
   */
  setInactiveStyles(): void {
    this._isActive = false;
  }
  /**
   * @description This function is used to get the label of the list item
   * It returns the items property of the component.
   * @returns {string} - The label of the list item.
   */
  getLabel?(): string {
     return this.items;
  }
  focus() {
    this.element.nativeElement.focus();
  }
  /**
   * @description This function is used to check if the list item is active
   * It returns the value of the _isActive property, which indicates whether the list item is currently active or not.
   * @returns {boolean} - true if the list item is active, false otherwise.
   */
  @HostBinding('class.keyNavigateHover') get isActive() {
    return this._isActive;
  }
}
