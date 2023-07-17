import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ReportComponent } from './Dialog/report/report.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-fdcertificate',
  templateUrl: './fdcertificate.component.html',
  styleUrls: ['./fdcertificate.component.css'],
})
export class FDCertificateComponent implements OnInit {
  __menu: submenu[] = menu.filter((item) => item.flag != 'U');
  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay
  ) {}

  ngOnInit(): void {}
  getItems(__el) {
    switch (__el.flag) {
      case 'R':
        this.openDIalogForRPT();
        break;
      case 'M':
        this.openDialog(null, 0);
        break;
    }
  }
  openDialog(__frmData, __id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = 'fullscreen-dialog';
    (dialogConfig.id = 'FDCD'), (dialogConfig.data = {});
    try {
      const dialogref = this.__dialog.open(SearchRPTComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({});
    }
  }
  openDIalogForRPT() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = 'fullscreen-dialog';
    (dialogConfig.id = 'FDCD'), (dialogConfig.data = {});
    try {
      const dialogref = this.__dialog.open(ReportComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({});
    }
  }
}
