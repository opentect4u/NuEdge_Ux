import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/Master/menu.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ProductEntrySecreenComponent } from '../EntryModelDialog/product-entry-secreen/product-entry-secreen.component';
import { QueryTypeSubTypeComponent } from '../EntryModelDialog/query-type-sub-type/query-type-sub-type.component';
import { QueryNatureEntryScreenComponent } from '../EntryModelDialog/query-nature-entry-screen/query-nature-entry-screen.component';
import { QueryStatusComponent } from '../EntryModelDialog/query-status/query-status.component';
import { QueryGivenComponent } from '../EntryModelDialog/query-given/query-given.component';
import { QueryRecieveGivenThroughComponent } from '../EntryModelDialog/query-recieve-given-through/query-recieve-given-through.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-query-desk-home',
  templateUrl: './query-desk-home.component.html',
  styleUrls: ['./query-desk-home.component.css']
})
export class QueryDeskHomeComponent implements OnInit {
  __menu = menu.filter(el => el.id == 15)[0]?.sub_menu;
  constructor(
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private route:Router

  ) { 
    console.log(this.__menu);
  }

  getItems(item){
    console.log(item);
    let compName;
    if(item.flag == 'P'){
      compName = ProductEntrySecreenComponent
    }
    else if(item.flag == 'QTS'){
      compName = QueryTypeSubTypeComponent
    }
    else if(item.flag == 'N'){
      compName = QueryNatureEntryScreenComponent
    }
    else if(item.flag == 'S'){
      compName = QueryStatusComponent
    }
    else if(item.flag == 'B'){
      compName = QueryGivenComponent
    }
    else if(item.flag == 'T'){
      compName = QueryRecieveGivenThroughComponent
    }
    else{
      this.route.navigate(['/main/master/queryDesk/report']);
    }
    this.openDialog(null,item.flag,compName,item.title)
  }

  ngOnInit(): void {
  }

  openDialog(el:any | undefined = null,flag,compName,title){
    if(flag != 'R'){

    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '40%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.data = {
        flag:flag,
        data:el,
        title:title
      };
      dialogConfig.id = '0';
      try {
        const dialogref = this.__dialog.open(
          compName,
          dialogConfig
        );
        dialogref.afterClosed().subscribe((dt) => {
            console.log(dt);
        });
      } catch (ex) {
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.updateSize('40%');
        console.log(ex);
        this.__utility.getmenuIconVisible({
          id: Number(dialogConfig.id),
          isVisible: false,
          flag: flag,
        });
      }
    }

  }

}
