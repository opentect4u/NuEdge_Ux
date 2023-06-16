import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() alertMsgTitle:string;
  @Input() alertMsgSubTitle:string;
  constructor() { }

  ngOnInit(): void {
  }

}
