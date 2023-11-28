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

  setActiveStyles(): void {
    this._isActive = true;
  }
  setInactiveStyles(): void {
    this._isActive = false;
  }
  getLabel?(): string {
     return this.items;
  }
  focus() {
    this.element.nativeElement.focus();
  }

  @HostBinding('class.keyNavigateHover') get isActive() {
    return this._isActive;
  }
}
