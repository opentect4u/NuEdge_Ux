import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/__Model/user_dtls.model';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'core-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  /**COLOR */
  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
];
  /***END */

  @ViewChild('profileDRP') __profileDrpDown: ElementRef;
  @ViewChild('searchInput') __searchInput: ElementRef;

  @Input() __items: any;
  @Input() __classUL;
  @Input() __flag;
  @Output() clickItems:EventEmitter<object> = new EventEmitter();
  @Input() user_dtls:IUser;
  public circleColor: string;
  constructor(private __utils: UtiliService,private dialog:MatDialog) { }

  ngOnInit() {
    // if (this.user_dtls) {
      const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];
    // }
  }



  openProfileMenu() { this.__profileDrpDown.nativeElement.classList.toggle("show"); }
  getItems(__items) {
    if (__items.flag == 'N') {
      this.clickItems.emit(__items)
    }
    else {
      this.__searchInput.nativeElement.classList.toggle('mystyle');
    }
  }
  route() {
    this.__utils.navigate('/')
  }
  logout = () =>{
    localStorage.clear();
    this.dialog.closeAll();
    this.__utils.navigate('/');

  }
}
