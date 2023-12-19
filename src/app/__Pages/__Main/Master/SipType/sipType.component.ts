import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Overlay } from '@angular/cdk/overlay';
import { SiptypemodificationComponent } from './sipTypeModification/sipTypeModification.component';
import { SiptyperptComponent } from './sipTypeRpt/sipTypeRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
selector: 'sipType-component',
templateUrl: './sipType.component.html',
styleUrls: ['./sipType.component.css']
})
export class SiptypeComponent implements OnInit {
  __menu = menu.filter(item => item.flag != 'U');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog
    ) { }
  ngOnInit(): void {
  }
  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag:'SIP',
       id: id,
       title: id == 0 ? 'Add SIP Type' : 'Update SIP Type',
      items: __items,
      product_id: '1'
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        SiptypemodificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      // console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SIP',
      });
    }
  }
  getItems = (__menu) => {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(0,null);
        break;
      case 'R':
        this.openDialogForReports('1')
        break;
      default:
        break;
    }
  }
  openDialogForReports(__prdId){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "ST",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        SiptyperptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prdId
      });
    }
  }
}
