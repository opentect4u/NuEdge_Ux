import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntrDashboardComponent } from '../../../manualEntrDashboard/manualEntrDashboard.component';
import { AckrptComponent } from './ackRPT/ackRPT.component';
import { ManualentrforackfinComponent } from './manualEntrForAckFin/manualEntrforAckFin.component';

@Component({
selector: 'ackEntry-component',
templateUrl: './ackEntry.component.html',
styleUrls: ['./ackEntry.component.css']
})
export class AckentryComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1' ? "Mutual Fund" : "others",
      url:'/main/operations/mfdashboard' + '/' + this.__rtDt.snapshot.queryParamMap.get('product_id'),
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Manual Entry",
      url:'/main/operations/manualEntr',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Acknowledgement Trax",
      url:'/main/operations/acknowledgement',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')
      }
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) == '1' ? "Financial"
      : atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) == '4' ? 'NFO' : 'Non Financial',
      url:'/main/operations/acknowledgement/ackEntry',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
        trans_type_id:this.__rtDt.snapshot.queryParamMap.get('trans_type_id')
      }
    }
];
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '';
  __transType_id: string =this.__rtDt.snapshot.queryParamMap.get('trans_type_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) : '';
  __prod_id: string =this.__rtDt.snapshot.queryParamMap.get('product_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '';
constructor(private __utility: UtiliService,private __rtDt: ActivatedRoute,private __dialog: MatDialog,private overlay: Overlay) {
}

ngOnInit(){
 this.__utility.getBreadCrumb(this.__brdCrmbs);
}
navigate(__mode){
  switch(__mode){
    case 'A':
      this.opendDialog(
      '0',
      atob(this.__rtDt.snapshot.queryParamMap.get('product_id')),
      atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id'))
      )
    break;
    case 'R':
    this.openDialogForRPT();

    break;

  }
//  this.__utility.navigatewithqueryparams('/main/operations/mfTraxEntry/prodTypeModification',{queryParams:{product_id:btoa("1"),trans_type_id:btoa("1")}});
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
     flag:'ACK',
     product_id:prd_id,
     trans_type_id:trans_type_id,
     id:__temp_tin_no ?  __temp_tin_no : 'ACK-0',
     title:'Acknowledgement Entry For ' + (trans_type_id == '1' ? 'Financial' : 'NFO')
  };
  dialogConfig.id = __temp_tin_no ? 'ACK-'+__temp_tin_no : 'ACK-0';
  try {
    const dialogref = this.__dialog.open(
      ManualentrforackfinComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {

    });
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
    dialogConfig.id = "FINACKRPT",
    dialogConfig.data = {
      product_id: this.__prod_id,
      trans_type_id: this.__transType_id,
      trans_id:this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : ''
    }
    try {
      const dialogref = this.__dialog.open(
        AckrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
}
}
