import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
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
  @Output() GetTabDtls:EventEmitter<emiteEvent> = new EventEmitter<emiteEvent>();
  constructor() { }

  ngOnInit(): void {
  }
  onTabChanged(event:MatTabChangeEvent){
    this.GetTabDtls.emit({index:event.index,tabDtls:this.Tab[event.index]});
  }
}
