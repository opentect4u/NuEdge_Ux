import { Component, OnInit ,Inject} from '@angular/core';
import commonMenu from '../../../../../../../../../assets/json/Master/commonMenuMst.json';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EntryRptComponent } from './Dialog/entry-rpt/entry-rpt.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu = commonMenu.filter((x: any) => x.flag!= 'U');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  getItems(event){
    console.log(event);

    switch(event.flag){
      case 'M':
      this.opendialog();
      break;
      case 'R':
      this.opendialogFor_RPT();
        break;

    }

  }
  opendialog(){
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
      flag: 'KYCMU',
      title:'Manual Entry Report'
    };
    dialogConfig.id = 'KYCMU';
    try {
      const dialogref = this.__dialog.open(
        EntryRptComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
    }
  }
  opendialogFor_RPT(){
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
      flag: 'KYCMU',
      title:'Manual Update Entry Report'
    };
    dialogConfig.id = 'KYCMU';
    try {
      const dialogref = this.__dialog.open(
        RPTComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
    }
  }
}
