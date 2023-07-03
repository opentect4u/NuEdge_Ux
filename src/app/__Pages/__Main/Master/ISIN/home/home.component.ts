import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntrComponent } from '../Dialog/manual-entr/manual-entr.component';
import commonMenu from '../../../../../../assets/json/Master/commonMenuMst.json';
import { IsinRptComponent } from '../Dialog/isin-rpt/isin-rpt.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu = commonMenu;
  constructor(
    private __rtDt: ActivatedRoute,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  getItems(items){
    console.log(items);
    switch(items.flag){
      case 'M': this.opendialogForEntry(false,'ISIN Manual Entry');
                break;
      case 'U':
      this.__utility.navigate(
        '/main/master/productwisemenu/scheme/isin/uploadIsin')
      break;
      case 'R':
        // this.opendialogForEntry(true,'ISIN Reports');
        this.opendialogForRPT();break;
    }
  }

  opendialogForEntry(isViewMode,title){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "ISIN_"+title,
    dialogConfig.data = {
      flag:"ISIN",
      title:title,
      id:0,
      isViewMode:isViewMode
    }
    try {
      const dialogref = this.__dialog.open(
        ManualEntrComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        flag:"ISIN"
      });
    }
   }
  opendialogForRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "0"
    dialogConfig.data = {
      flag:"ISIN_RPT",
      title:"ISIN Report",
      id:0
    }
    try {
      const dialogref = this.__dialog.open(
        IsinRptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        flag:"ISIN"
      });
    }
  }

}
