import { Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';
import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'core-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnInit,Highlightable, ListKeyManagerOption {
  private _isActive: boolean = false;
  @Input() disabled: boolean = false;
  @Input() items;


  constructor() { }

  setActiveStyles(): void {
    this._isActive = true;
  }
  setInactiveStyles(): void {
    this._isActive = false;
  }
  getLabel?(): string {
     return this.items;
  }

  ngOnInit(): void {}

  @HostBinding('class.keyNavigateHover') get isActive() {
    return this._isActive;
  }
}
