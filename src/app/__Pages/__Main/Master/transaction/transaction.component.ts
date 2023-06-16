import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Overlay } from '@angular/cdk/overlay';
import { TrnsrptComponent } from './trnsRpt/trnsRpt.component';
import { breadCrumb } from 'src/app/__Model/brdCrmb';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Master",
      url:'/main/master/products',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Mutual Fund",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Transaction",
      url:'/main/master/productwisemenu/trns',
      hasQueryParams:true,
      queryParams:''
    }
]

  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 36,
      flag: 'M',
    },
    // {
    //   parent_id: 4,
    //   menu_name: 'Upload CSV',
    //   has_submenu: 'N',
    //   url: '',
    //   icon: '',
    //   id: 35,
    //   flag: 'U',
    // },
    {
      parent_id: 4,
      menu_name: 'Reports',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 0,
      flag: 'R',
    },
  ];
  __selectTrns:any=[];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute,
    private __dialog: MatDialog
    ) { }
  ngOnInit(): void {
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
  }

  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.id = 'TRNS_'+id;

    dialogConfig.data = {
      flag : 'TRNS_'+id,
      id: id,
      title: id == 0 ? 'Add Transaction' : 'Update Transaction',
      items: __items,
      product_id:'1'
    };
    try{
      const dialogref = this.__dialog.open(TrnsModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {});
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      console.log(dialogRef);
       dialogRef.updateSize('50%');
      // dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: id,
        items: __items,
        flag:'TRNS_'+id
      });
    }
  }
  navigate(__menu) {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(0,null);
        break;
      case 'U':
        this.__utility.navigate(__menu.url);
        break;
      case 'R':
        this.openDialogForReports('1')
        break;
      default:
        break;
    }
  }
  openDialogForReports(__prdId){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "TRNS",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        TrnsrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prdId
      });
    }
  }
}
