import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { AckSearchRPTComponent } from './Dialog/Entry/ack-search-rpt/ack-search-rpt.component';
import { AckRPTComponent } from './Dialog/Report/ack-rpt.component';

@Component({
  selector: 'app-ack-home',
  templateUrl: './ack-home.component.html',
  styleUrls: ['./ack-home.component.css']
})
export class AckHomeComponent implements OnInit {
  __menu = menu.filter(item => item.flag != 'U');
  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  getItems = (__items) => {
    switch(__items.flag){
      case 'A': this.opendialogForAckEntry();break;
      case 'R': this.openDialogForRPT();break;
    }
  }
 openDialogForRPT(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '100%';
  dialogConfig.height = '100%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.panelClass = "fullscreen-dialog"
  dialogConfig.id = "INSACKRPT",
  dialogConfig.data = {}
  try {
    const dialogref = this.__dialog.open(
      AckRPTComponent,
      dialogConfig
    );
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
  }
  }
  opendialogForAckEntry(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "ACKSE",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        AckSearchRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({

      });
    }
  }
}
