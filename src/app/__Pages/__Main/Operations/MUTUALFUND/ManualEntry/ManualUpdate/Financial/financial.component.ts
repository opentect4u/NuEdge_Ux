import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import menu from '../../../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css'],
})
export class FinancialComponent implements OnInit {
  menu = menu.filter((x: any) => x.flag != 'U');
  constructor(
    private overlay: Overlay,
    private __rtDt: ActivatedRoute,
    private __utility: UtiliService,
    private __dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setBreadCrumb();
  }
  setBreadCrumb() {}
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
    (dialogConfig.id = 'FINMURPT'),
      (dialogConfig.data = {
        product_id: '1',
        trans_type_id: '1',
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
    (dialogConfig.id = 'FINMUSRCHRPT'),
      (dialogConfig.data = {
        product_id: '1',
        trans_type_id: '1',
        title: 'Financial Manual Entry Report',
      });
    try {
      const dialogref = this.__dialog.open(SearchRPTComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
