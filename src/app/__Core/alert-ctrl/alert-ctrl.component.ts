import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'alert-ctrl',
  templateUrl: './alert-ctrl.component.html',
  styleUrls: ['./alert-ctrl.component.css']
})
export class AlertCtrlComponent implements OnInit {

  @Input() severity: string;

  @Input() detail: string;


  constructor() { }

  ngOnInit(): void {
  }

}
