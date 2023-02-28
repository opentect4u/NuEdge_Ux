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
import { FinmodificationComponent } from './financialModification/finModification.component';
import { FinrptComponent } from './finRPT/finRPT.component';

@Component({
  selector: 'MF-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
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
      label:"Financial",
      url:'/main/operations/mfTraxEntry/fin',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
        trans_type_id: this.__rtDt.snapshot.queryParamMap.get('trans_type_id')
      }
    }
];
// main/operations/mfTraxEntry/fin
  __paginate: any=[];
  __pageNumber = 10;
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '';
  __transType_id: string =this.__rtDt.snapshot.queryParamMap.get('trans_type_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) : '';
  __prod_id: string =this.__rtDt.snapshot.queryParamMap.get('product_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '';
  __financMst = new MatTableDataSource<mutualFund>([]);
  constructor(
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __RtDT: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute) {
    // this.getFianancMaster();
  }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
   }

  getFianancMaster(__paginate: string  | null = "10") {
    this.__dbIntr.api_call(0, '/mfTraxShow',
    'trans_type_id=' + this.__transType_id
    + '&paginate='+ __paginate
    + (this.__rtDt.snapshot.queryParamMap.get('trans_id') ? '&trans_id='
    + atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '') )
    .pipe(map((x: responseDT) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
  }
  setPaginator(__res) {
    this.__financMst = new MatTableDataSource(__res);
  }
  addRow(row_obj) {
    this.__financMst.data.unshift(row_obj);
    this.__financMst._updateChangeSubscription();
  }

  updateRow(row_obj) {
    this.__financMst.data[this.__financMst.data.findIndex((x: any) => x.tin_no == row_obj.tin_no)] = row_obj;
    this.__financMst._updateChangeSubscription();
  }

  getSelectedItemForUpdate(__ev: mutualFund) {
    console.log(__ev);
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
      // this.opendDialog();
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
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
       flag:'FIN',
       product_id:prd_id,
       trans_type_id:trans_type_id,
       id:__temp_tin_no ?  __temp_tin_no : '0',
       title:'Financial Entry'
    };
    dialogConfig.id = __temp_tin_no ?  __temp_tin_no : '0';
    try {
      const dialogref = this.__dialog.open(
        FinmodificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            if (dt.cl_type == 'E') {

            } else {
              // this.updateRow(dt.data);
            }
          } else {

          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag:'FIN'
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
    dialogConfig.id = "FINRPT",
    dialogConfig.data = {
      product_id: this.__prod_id,
      trans_type_id: this.__transType_id,
      trans_id:this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : ''
    }
    try {
      const dialogref = this.__dialog.open(
        FinrptComponent,
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
