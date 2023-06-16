import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
import { ManualEntrComponent } from './Dialog/manual-entr/manual-entr.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { RPTComponent } from './Dialog/rpt/rpt.component';
@Component({
  selector: 'app-stp-type',
  templateUrl: './stp-type.component.html',
  styleUrls: ['./stp-type.component.css']
})
export class StpTypeComponent implements OnInit {
  menus = menu.filter((x) => x.flag != 'U');
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
      label:"STP Type",
      url:'/main/master/productwisemenu/stpType',
      hasQueryParams:true,
      queryParams:''
    }
]
  constructor(
    private route:ActivatedRoute,
    private utility: UtiliService,
    private overlay: Overlay,
    private __dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // this.getBreadCrumbs();
  }
  getBreadCrumbs(){
    this.utility.getBreadCrumb(this.__brdCrmbs)
  }
  getItems(item){
    switch(item.flag){
      case 'M':this.openDialog(item);break;
      case 'R':this.openDialogForRPT(item);break;
    }
  }
  openDialog(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag:'STP',
       id: 0,
       title: 'Add STP Type',
       items: null,
      product_id: '1'
    };
    dialogConfig.id = '0';
    try {
      const dialogref = this.__dialog.open(
        ManualEntrComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      console.log(ex);
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'STP',
      });
    }
  }
  openDialogForRPT(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "STPT",
    dialogConfig.data = {
      product_id: '1'
    }
    try {
      const dialogref = this.__dialog.open(
        RPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        product_id:'1'
      });
    }
  }
}
