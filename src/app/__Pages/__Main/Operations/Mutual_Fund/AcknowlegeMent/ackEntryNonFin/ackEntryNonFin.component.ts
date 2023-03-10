import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { AckRPTForNonFinComponent } from './ackRPTForNonFin/ackRPTForNonFin.component';
import { ManualEntryForNonFinComponent } from './manualEntryForNonFin/manualEntryForNonFin.component';

@Component({
  selector: 'app-ackEntryNonFin',
  templateUrl: './ackEntryNonFin.component.html',
  styleUrls: ['./ackEntryNonFin.component.css'],
})
export class AckEntryNonFinComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operation',
      url: '/main/operations/ophome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label:
        atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1'
          ? 'Mutual Fund'
          : 'others',
      url:
        '/main/operations/mfdashboard' +
        '/' +
        this.__rtDt.snapshot.queryParamMap.get('product_id'),
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Manual Entry',
      url: '/main/operations/manualEntr',
      hasQueryParams: true,
      queryParams: {
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
      },
    },
    {
      label: 'Acknowledgement Trax',
      url: '/main/operations/acknowledgement',
      hasQueryParams: true,
      queryParams: {
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
      },
    },
    {
      label:
        atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) == '1'
          ? 'Financial'
          : atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) == '4'
          ? 'NFO'
          : 'Non Financial',
      url: '/main/operations/acknowledgement/ackNonFin',
      hasQueryParams: true,
      queryParams: {
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
        trans_type_id: this.__rtDt.snapshot.queryParamMap.get('trans_type_id'),
      },
    },
  ];
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id')
    ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id'))
    : '';
  __transType_id: string = this.__rtDt.snapshot.queryParamMap.get(
    'trans_type_id'
  )
    ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id'))
    : '';
  __prod_id: string = this.__rtDt.snapshot.queryParamMap.get('product_id')
    ? atob(this.__rtDt.snapshot.queryParamMap.get('product_id'))
    : '';
  constructor(
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) {}

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__mode) {
    switch (__mode) {
      case 'A':
        this.opendDialog(
          null,
          atob(this.__rtDt.snapshot.queryParamMap.get('product_id')),
          atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id'))
        );
        break;
      case 'R':
        this.openDialogForRPT();

        break;
    }
  }
opendDialog(__temp_tin_no,prd_id,trans_type_id){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '100%';
  dialogConfig.height = '100%';
  dialogConfig.panelClass = "fullscreen-dialog"
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
     flag:'ACK_'+trans_type_id,
     product_id:prd_id,
     trans_type_id:trans_type_id,
     id:__temp_tin_no ?  __temp_tin_no : 'ACK-' + trans_type_id,
     title:'Acknowledgement Entry For ' + (trans_type_id == '1' ? 'Financial' : (trans_type_id == '4' ? 'NFO' : 'Non Financial'))
  };
  dialogConfig.id = __temp_tin_no ? 'ACK-'+__temp_tin_no : 'ACK-'+trans_type_id;
  try {
    const dialogref = this.__dialog.open(
      ManualEntryForNonFinComponent,
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
      flag:'ACK_'+trans_type_id
    });
  }

}
openDialogForRPT(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '100%';
  dialogConfig.height = '100%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.panelClass = "fullscreen-dialog"
  dialogConfig.id = "NONFINACKRPT",
  dialogConfig.data = {
    product_id: this.__prod_id,
    trans_type_id: this.__transType_id,
    trans_id:this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : ''
  }
  try {
    const dialogref = this.__dialog.open(
      AckRPTForNonFinComponent,
      dialogConfig
    );
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
  }
}
}
