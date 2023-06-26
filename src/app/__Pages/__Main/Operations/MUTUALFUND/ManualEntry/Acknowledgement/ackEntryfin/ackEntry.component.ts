import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { AckrptComponent } from './ackRPT/ackRPT.component';
import { ManualentrforackfinComponent } from './manualEntrForAckFin/manualEntrforAckFin.component';
import ackMenu from '../../../../../../../../assets/json/Operations/ackMenu.json';
@Component({
  selector: 'ackEntry-component',
  templateUrl: './ackEntry.component.html',
  styleUrls: ['./ackEntry.component.css'],
})
export class AckentryComponent implements OnInit {
  menu = ackMenu;
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id')
    ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id'))
    : '';
  __transType_id: string = this.__rtDt.snapshot.paramMap.get('trans_type_id')
    ? atob(this.__rtDt.snapshot.paramMap.get('trans_type_id'))
    : '';
  __prod_id: string = '1';
  constructor(
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) {}

  ngOnInit() {}
  getItems(event) {
    switch (event.flag) {
      case 'A':
        this.opendDialog(
          null,
          '1',
          atob(this.__rtDt.snapshot.paramMap.get('trans_type_id'))
        );
        break;
      case 'R':
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
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'ACK',
      product_id: prd_id,
      trans_type_id: trans_type_id,
      id: __temp_tin_no ? __temp_tin_no : 'ACK-' + trans_type_id,
      title:
        'Acknowledgement Entry Report For ' +
        (trans_type_id == '1'
          ? 'Financial'
          : trans_type_id == '4'
          ? 'NFO'
          : 'Non Financial'),
    };
    dialogConfig.id = __temp_tin_no
      ? 'ACK-' + __temp_tin_no
      : 'ACK-' + trans_type_id;
    try {
      const dialogref = this.__dialog.open(
        ManualentrforackfinComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      // this.__utility.getmenuIconVisible({
      //   id: Number(dialogConfig.id),
      //   isVisible: false,
      //   flag:'FIN'
      // });
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
    (dialogConfig.id = 'FINACKRPT'),
      (dialogConfig.data = {
        product_id: this.__prod_id,
        trans_type_id: this.__transType_id,
        trans_id: this.__rtDt.snapshot.queryParamMap.get('trans_id')
          ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id'))
          : '',
      });
    try {
      const dialogref = this.__dialog.open(AckrptComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
