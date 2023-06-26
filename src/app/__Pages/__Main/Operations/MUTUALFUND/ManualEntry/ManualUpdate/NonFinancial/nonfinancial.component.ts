import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import Menu from '../../../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-nonfinancial',
  templateUrl: './nonfinancial.component.html',
  styleUrls: ['./nonfinancial.component.css'],
})
export class NonfinancialComponent implements OnInit {
  menu = Menu.filter((x: any) => x.flag != 'U');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  getItems(event) {
    switch (event.flag) {
      case 'R':
        this.openDialogForRPT();
        break;
      case 'M':
        this.openDialog();
        break;
      default:
        break;
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
    (dialogConfig.id = 'NONFINMURPT'),
      (dialogConfig.data = {
        product_id: '1',
        trans_type_id: '3',
        title: 'Manual Update Report For Non Financial',
      });
    try {
      const dialogref = this.__dialog.open(RPTComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = 'fullscreen-dialog';
    (dialogConfig.id = 'NONFINMUSRCHRPT'),
      (dialogConfig.data = {
        product_id: '1',
        trans_type_id: '3',
        title: 'Non Financial Manual Entry Report',
      });
    try {
      const dialogref = this.__dialog.open(SearchRPTComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
