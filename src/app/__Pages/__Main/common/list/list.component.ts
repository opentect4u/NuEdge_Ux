import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { IUser } from 'src/app/__Model/user_dtls.model';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { storage } from 'src/app/__Utility/storage';

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
  constructor(private __utils: UtiliService,private dialog:MatDialog,private dbIntr:DbIntrService) { }

  ngOnInit() {
    // if (this.user_dtls) {
      const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];
    // }
  }


  /**
   * * @description This function toggles the visibility of the profile dropdown menu.
   * * It adds or removes the "show" class to the profile dropdown element.
   * * This is typically used to display or hide the profile options when the user clicks on their profile icon.
   */
  openProfileMenu() { this.__profileDrpDown.nativeElement.classList.toggle("show"); }
  /**
   * 
   * @param __items - The menu item object containing the URL to navigate to
   * @description This function is used to handle the click event on a menu item.
   * It emits the clicked item through the clickItems EventEmitter if the flag is 'N'.
   * If the flag is not 'N', it toggles a CSS class on the search input element.
   * This can be used to highlight or style the search input when a different menu item is clicked.
   */
  getItems(__items) {
    if (__items.flag == 'N') {
      this.clickItems.emit(__items)
    }
    else {
      this.__searchInput.nativeElement.classList.toggle('mystyle');
    }
  }
  /**
   * * @description This function is used to navigate to the home route.
   * * It uses the UtiliService to perform the navigation.
   * * This is typically used to redirect the user to the home page of the application.
   */
  route() {
    this.__utils.navigate('/')
  }
  /**
   * * @description This function is used to log out the user.
   * * It makes an API call to the '/logout' endpoint using the DbIntrService.
   * * If the logout is successful, it clears the storage, closes all open dialogs, and navigates to the home route.
   * * This is typically used to end the user's session and redirect them to the login page or home page.
   */
  logout = () =>{
    this.dbIntr.api_call(1,'/logout',null)
    .pipe(pluck('suc'))
    .subscribe(res =>{
      if(res){
      storage.clearStorage();
      this.dialog.closeAll();
      this.route();
    }
    })
  }
}
