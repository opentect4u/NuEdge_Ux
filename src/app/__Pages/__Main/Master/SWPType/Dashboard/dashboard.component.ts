import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { ActivatedRoute } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { RptComponent } from './rpt/rpt.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menus = menu.filter((x) => x.flag != 'U');

  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog
  ) {
  }

  ngOnInit(): void {}
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
      flag:'SWP',
       id: 0,
       title: 'Add SWP Type',
      items: null,
      product_id: '1'
    };
    dialogConfig.id = '0';
    try {
      const dialogref = this.__dialog.open(
        ManualEntryComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SWP',
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
    dialogConfig.id = "SWPT",
    dialogConfig.data = {
      product_id: '1'
    }
    try {
      const dialogref = this.__dialog.open(
        RptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:'1'
      });
    }
  }
}
