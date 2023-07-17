import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Overlay } from '@angular/cdk/overlay';
import { TrnsrptComponent } from './trnsRpt/trnsRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  __menu = menu.filter(item => item.flag!='U');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog
    ) { }
  ngOnInit(): void {}

  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.id = 'TRNS_'+id;
    dialogConfig.data = {
      flag : 'TRNS_'+id,
      id: id,
      title: id == 0 ? 'Add Transaction' : 'Update Transaction',
      items: __items,
      product_id:'1'
    };
    try{
      const dialogref = this.__dialog.open(TrnsModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {});
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      console.log(dialogRef);
       dialogRef.updateSize('50%');
      this.__utility.getmenuIconVisible({
        id: id,
        items: __items,
        flag:'TRNS_'+id
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
    dialogConfig.id = "TRNS",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        TrnsrptComponent,
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
