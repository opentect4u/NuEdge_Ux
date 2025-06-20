import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'common-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  /**
   *   Set menu items in tiles
  **/
  @Input() __listItems: any[];
  @Input() __flag: string;
  constructor() { }

  ngOnInit() {}

  ngOnChanges(change:SimpleChanges){
    console.log(change);

  }

}
