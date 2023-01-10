import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'common-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
   @Input() __listItems: any[];
   @Input() __flag: string;
  constructor() { }

  ngOnInit() {
  }

}
