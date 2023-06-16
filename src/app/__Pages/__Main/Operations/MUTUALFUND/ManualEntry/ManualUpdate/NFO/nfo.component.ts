import { Component, OnInit } from '@angular/core';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import Menu from '../../../../../../../../assets/json/Master/commonMenuMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RPTComponent } from './Dialog/rpt/rpt.component';
@Component({
  selector: 'app-nfo',
  templateUrl: './nfo.component.html',
  styleUrls: ['./nfo.component.css'],
})
export class NfoComponent implements OnInit {
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
    (dialogConfig.id = 'NFORPT'),
      (dialogConfig.data = {
        product_id: '1',
        trans_type_id: '4',
      });
    try {
      const dialogref = this.__dialog.open(RPTComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      // this.__utility.getmenuIconVisible({

      // });
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
    (dialogConfig.id = 'NFOSRCHRPT'),
      (dialogConfig.data = {
        product_id: '1',
        trans_type_id: '4',
        title: 'NFO Manual Entry Report',
      });
    try {
      const dialogref = this.__dialog.open(SearchRPTComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
