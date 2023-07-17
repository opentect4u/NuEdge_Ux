import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'core-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('profileDRP') __profileDrpDown: ElementRef;
  @ViewChild('searchInput') __searchInput: ElementRef;

  @Input() __items: any;
  @Input() __classUL;
  @Input() __flag;
  @Output() clickItems:EventEmitter<object> = new EventEmitter();
  constructor(private __utils: UtiliService) { }

  ngOnInit() {
  }
  openProfileMenu() { this.__profileDrpDown.nativeElement.classList.toggle("show"); }
  getItems(__items) {
    if (__items.flag == 'N') {
      this.clickItems.emit(__items)
      // if (__items.url != '') {
      //   this.__utils.navigate(__items.url);
      // }

    }
    else {
      this.__searchInput.nativeElement.classList.toggle('mystyle');
    }
  }
  route() {
    this.__utils.navigate('/')
  }
}
