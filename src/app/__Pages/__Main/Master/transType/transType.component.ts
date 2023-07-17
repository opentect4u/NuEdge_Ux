import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { TrnstypeModificationComponent } from './trnstypeModification/trnstypeModification.component';
import { Overlay } from '@angular/cdk/overlay';
import { TrnstyperptComponent } from './trnsTypeRpt/trnsTypeRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-transType',
  templateUrl: './transType.component.html',
  styleUrls: ['./transType.component.css']
})
export class TransTypeComponent implements OnInit {
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
  dialogConfig.width = '50%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.id = 'TRNS_Type'+id;
  dialogConfig.data = {
    flag : 'TRNS_Type'+id,
    id: id,
    title: id == 0 ? 'Add Transaction Type' : 'Update Transaction Type',
    items: __items,
    product_id: '1'
  };
  try{
    const dialogref = this.__dialog.open(TrnstypeModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
    });
  }
  catch(ex){
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('50%');
    this.__utility.getmenuIconVisible({
      id: id,
      items: __items,
      flag:'TRNS_Type'+id
    });
  }
  }
  getItems = (__menu) =>{
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
    dialogConfig.id = "TT",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        TrnstyperptComponent,
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
