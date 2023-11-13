import { Component, OnInit } from '@angular/core';
import { menuList } from 'src/app/__Model/menuList';
// import { UtiliService } from 'src/app/__Services/utils.service';
import rightHeaderMenu from '../../../../../assets/json/headerRightMenu.json';
// import topmenu from '../../../../../assets/json/topNavigationmenu.json';
import menus from '../../../../../assets/json/menu.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { map, pluck } from 'rxjs/operators';
import { IUser } from 'src/app/__Model/user_dtls.model';
@Component({
  selector: 'common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  sidebarVisible;
  __rtDt: any;
  __rightHeaderMenu: menuList[] = rightHeaderMenu;
  // __top_menu: any[] = topmenu;
  __top_menu: any[] = menus;
  user_dtls:IUser;
  constructor(
    private dbIntr:DbIntrService
    // private __utility: UtiliService
    ) {
    // this.__utility.__route$.subscribe(res => {
    //   if (res) {
    //     this.__rtDt = res;
    //   }
    // })

  }

  ngOnInit() {
    this.getUserDetails();
  }
  // navigate(__items) {
  //   console.log(__items);
  //   if (__items.url) {
  //     this.__utility.navigate(__items.url);
  //   }
  // }
  openSidePannel(items){
    console.log(items);
     if(items.id == 3){
      this.sidebarVisible = true;
     }
  }

   getUserDetails = () =>{
        this.dbIntr.api_call(0,'/users',null)
        .pipe(
          pluck('data'),
          map((item:IUser) => Object.assign({},item, {...item,short_name:item?.name.split(" ").map((n)=>n[0]).join("").toUpperCase()}))
        ).subscribe((res:IUser) =>{
            // this.createInititals(res);
            this.user_dtls = res;
        })
   }
}
