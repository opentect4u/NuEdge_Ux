import { Component, OnInit } from '@angular/core';
import ackMenu from '../../../../../../../../assets/json/Operations/ackMenu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { AckRptComponent } from './Dialog/ack-rpt/ack-rpt.component';
import { AckEntryRptComponent } from './Dialog/ack-entry-rpt/ack-entry-rpt.component';
@Component({
  selector: 'app-acknowledgement',
  templateUrl: './acknowledgement.component.html',
  styleUrls: ['./acknowledgement.component.css']
})
export class AcknowledgementComponent implements OnInit {
  menu = ackMenu;
  constructor(
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  getItems(event){
    console.log(event);
    switch(event.flag){
      case 'A':
      this.opendDialog();
      break;
      case 'R':
      this.openDialogForRPT();
      break;
    }
  }

  opendDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'KYCACK',
      title:'Acknowledgement Entry Report'
    };
    dialogConfig.id = 'KYCACK';
    try {
      const dialogref = this.__dialog.open(
        AckEntryRptComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
    }
  }
  openDialogForRPT() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.id = 'KYCACKRPT';
      dialogConfig.data = {
        flag:'KYCACKRPT'
      };
    try {
      const dialogref = this.__dialog.open(AckRptComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
