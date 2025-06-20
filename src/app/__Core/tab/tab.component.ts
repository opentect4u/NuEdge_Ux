import { Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
type emiteEvent ={
   index: number;
   tabDtls:any
}
@Component({
  selector: 'core-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() customClass: string| undefined = '';
  @Input() Tab: any =[];
  @Input() index:number;
  /**
   * @description This ViewChildren decorator is used to get the reference of all the mat-tab elements in the template
   */
  @Output() GetTabDtls:EventEmitter<emiteEvent> = new EventEmitter<emiteEvent>();
  constructor() { }

  ngOnInit(): void {}
  /**
   * @description This function is used to set the index of the tab
   * @param changes - The SimpleChanges object containing the changes to the input properties
   */
  onTabChanged(event:MatTabChangeEvent){
    this.GetTabDtls.emit({index:event.index,tabDtls:this.Tab[event.index]});
  }
}
