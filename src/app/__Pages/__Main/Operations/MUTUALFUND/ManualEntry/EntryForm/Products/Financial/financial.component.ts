import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../../../../../assets/json/Master/commonMenuMst.json';
import { FinmodificationComponent } from './Dialog/financialModification/finModification.component';
import { FinrptComponent } from './Dialog/finRPT/finRPT.component';
@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css'],
})
export class FinancialComponent implements OnInit {
  menu = menu.filter((x: any) => x.flag != 'U');
  constructor(
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __RtDT: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute
  ) {}
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id')
    ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id'))
    : '';
  __transType_id: string = this.__rtDt.snapshot.paramMap.get('trans_type_id')
    ? atob(this.__rtDt.snapshot.paramMap.get('trans_type_id'))
    : '';
  __prod_id: string = '1';
  ngOnInit(): void {}
  getItems(event) {
    console.log(event);
    switch (event.flag) {
      case 'M':
        this.opendDialog(
          '0',
          '1',
          atob(this.__rtDt.snapshot.paramMap.get('trans_type_id'))
        );
        break;
      default:
        this.openDialogForRPT();
        break;
    }
  }

  opendDialog(__temp_tin_no, prd_id, trans_type_id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'FIN',
      product_id: prd_id,
      trans_type_id: trans_type_id,
      id: __temp_tin_no ? __temp_tin_no : '0',
      title: 'Financial Entry',
      data: null,
    };
    dialogConfig.id = __temp_tin_no ? __temp_tin_no : '0';
    try {
      const dialogref = this.__dialog.open(
        FinmodificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'FIN',
      });
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
    (dialogConfig.id = 'FINRPT'),
      (dialogConfig.data = {
        product_id: this.__prod_id,
        trans_type_id: this.__transType_id,
        trans_id: this.__rtDt.snapshot.queryParamMap.get('trans_id')
          ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id'))
          : '',
      });
    try {
      const dialogref = this.__dialog.open(FinrptComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
