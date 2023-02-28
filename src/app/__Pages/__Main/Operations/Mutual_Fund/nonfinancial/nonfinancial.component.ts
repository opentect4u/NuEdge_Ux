import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { mutualFund } from 'src/app/__Model/__MutualFund';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { NonfinmodificationComponent } from './nonFinModification/nonFInModification.component';
import { NonfinrptComponent } from './nonfinRPT/nonFinRPT.component';

@Component({
  selector: 'mf-nonfinancial',
  templateUrl: './nonfinancial.component.html',
  styleUrls: ['./nonfinancial.component.css']
})
export class NonfinancialComponent implements OnInit {
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
      label:"MF Trax",
      url:'/main/operations/MfTrax',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Non Financial",
      url:'/main/operations/mfTraxEntry/nonfin',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
        trans_type_id: this.__rtDt.snapshot.queryParamMap.get('trans_type_id')
      }
    }
];
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '';
  __transType_id: string =this.__rtDt.snapshot.queryParamMap.get('trans_type_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) : '';
  __prod_id: string =this.__rtDt.snapshot.queryParamMap.get('product_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '';
  __nonFinMst = new MatTableDataSource<mutualFund>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __rtDt: ActivatedRoute,
    private __utility: UtiliService,
  ) {}

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
    // this.getNonfinancialMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(null,'');
    }
    else if (__ev.flag == 'F') {
      this.__nonFinMst = new MatTableDataSource([__ev.item]);
    }
    else {
      this.getNonfinancialMaster();
    }
  }
  getNonfinancialMaster() {
    this.__dbIntr.api_call(0, '/mfTraxShow?trans_type_id=3', null).pipe(map((x: responseDT) => x.data)).subscribe((res: mutualFund[]) => {
      this.__nonFinMst = new MatTableDataSource(res);
    })
  }
  openDialog(__id: string | null = null, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.id = 'NonFin_' + __id;     
    dialogConfig.data = {
      id: __id,
      title: 'Non Financial Entry',
      data: __items,
      trans_type: 'N',
      parent_id: this.__prod_id,
      trans_type_id:this.__transType_id,
      flag:'NonFin_'+ __id
    };
    dialogConfig.autoFocus = false;
    try{
      const dialogref = this.__dialog.open(NonfinmodificationComponent, dialogConfig);
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag:'NonFin_'+ __id
      });
    }
    
  }
  addRow(row_obj) {
    this.__nonFinMst.data.unshift(row_obj);
    this.__nonFinMst._updateChangeSubscription();
  }
  updateRow(row_obj){
    this.__nonFinMst.data[this.__nonFinMst.data.findIndex((x: any) => x.tin_no == row_obj.tin_no)] = row_obj;
    this.__nonFinMst._updateChangeSubscription();
  }
  getSelectedItemForUpdate(__ev: mutualFund) {
    this.openDialog(__ev.tin_no, __ev);
  }
  navigate(__mode){
      switch(__mode){
        case 'M': this.openDialog('0',null)
                   break; //open Modal For NonFinancial Modification
        case 'R': break; //open Modal For NonFinancial Reports
        default: break;
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
    dialogConfig.id = "FINRPT",
    dialogConfig.data = {
      product_id: this.__prod_id,
      trans_type_id: this.__transType_id,
      trans_id:this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : ''
    }
    try {
      const dialogref = this.__dialog.open(
        NonfinrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      // this.__utility.getmenuIconVisible({

      // });
    }
  }
}
