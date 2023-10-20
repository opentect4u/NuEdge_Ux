import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
// import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { ConfirmationService } from 'primeng/api';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { IsinComponent } from '../entry_dialog/isin/isin.component';
import { global } from 'src/app/__Utility/globalFunc';
import { AMCEntryComponent } from 'src/app/shared/amcentry/amcentry.component';
import { BusinessTypeComponent } from '../entry_dialog/business-type/business-type.component';
import { FrequencyComponent } from '../entry_dialog/frequency/frequency.component';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'mailBack-trxn-rpt-without-scm',
  templateUrl: './trxn-rpt-without-scm.component.html',
  styleUrls: ['./trxn-rpt-without-scm.component.css'],
  providers:[ConfirmationService]
})
export class TrxnRptWithoutScmComponent implements OnInit {


  @ViewChild('primeTbl') primeTbl :Table;
  @ViewChild('searchFilter') filter:ElementRef;
  @Input() mismatch_flag:string;


  @Input() tblminWidth: string | undefined = '350rem';

  form_type: string | undefined = '';
  /**
   * Holding Transaction Report which has empty scheme
   */
  @Input() trxnRptWithOutScm: TrxnRpt[];


  /**
   * Hold the Column for Transaction Report
   */
  // TrxnClm:column[] = trxnClm.column;
  @Input() TrxnClm:column[] = [];


  constructor(
    private utility:UtiliService,
    private confirmationService: ConfirmationService,
    private dbIntr:DbIntrService,
    private overlay: Overlay,
    private __dialog: MatDialog,


    ) { }

  ngOnInit(): void {
  }
  getColumns = () =>{
    return this.utility.getColumns(this.TrxnClm);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  lockTrxn = (event,trxn,index:number) =>{
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to lock this transaction?`,
      icon: 'pi pi-lock',
      accept: () => {

        this.dbIntr.api_call(1,'/mailbackMismatchLock',
        this.utility.convertFormData(trxn)
        )
        .subscribe((res: any) =>{
            if(res.suc == 1){
              // this.filter.nativeElement.value = '';
              this.deleteTransaction(trxn.id);
              this.confirmationService.close();
            }
          this.utility.showSnackbar(res.suc == 1 ? 'Transaction Locked Successfully' : res.msg,res.suc);
        })
      },
      reject: () => {
         console.log('Reject Clicked');
          this.confirmationService.close();
      }
  });
  }
  // lockTransaction = (trxn):Promise<any> =>{
  //  return new Promise ((resolve,reject) =>{
  //     this.dbIntr.api_call(1,'/mailbackMismatchLock',
  //     this.utility.convertFormData(trxn)
  //     )
  //     // .pipe(pluck('data'))
  //     .subscribe(res =>{
  //       resolve(res),
  //       reject([])
  //     })
  //   })

  // }

  navigate = () =>{
    this.utility.navigatewithqueryparams(
      '/main/master/productwisemenu/scheme',
      {
        queryParams:{
          scheme_type:btoa('O')
        }
      }
    )
  }

  openAMC = (trxn,index:number) =>{

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'A',
      id: 0,
      amc: null,
      title: 'Add AMC',
      product_id:'1', /** For Mutual Fund */
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = 'AMC_' + trxn.id;
    try {
      const dialogref = this.__dialog.open(
        AMCEntryComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.deleteTransaction(trxn.id);
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'A',
      });
    }

  }

  openISIN = (trxn,index:number) =>{
    console.log(trxn);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "ISIN_" + index,
    dialogConfig.data = {
      flag:"ISIN",
      title:'Add ISIN',
      id:0,
      isViewMode:false,
      isinDtls:trxn
    }
    try {
      const dialogref = this.__dialog.open(
        IsinComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe(res =>{
        if(res){
          // this.updateRow(res.data)
          if(res.suc == 1){
            // this.tr
            this.deleteTransaction(trxn.id);
          }
        }
      })
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        flag:"ISIN",
        id: "ISIN_" + index
      });
    }

  }

  deleteTransaction = (id:number) =>{
    this.trxnRptWithOutScm.splice(
      this.trxnRptWithOutScm.findIndex(item => item.id == id),1
    );
    this.primeTbl.reset();
    this.filter.nativeElement.value = '';
  }

  openModal_for_Form = (modal_type: string,trxn,index:number) => {
    this.form_type = modal_type;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'B',
      id: trxn.id,
      transaction: trxn,
      title: 'Add Business Type',
      product_id: '1', /** For Mutual Fund */
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = 'bu_type' + trxn.id;
    try {
      const dialogref = this.__dialog.open(
        BusinessTypeComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt.suc == 1) {
            this.deleteTransaction(trxn.id);
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'B',
      });
    }
  }

  addFrequency = (field,trxn,index:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'F',
      id: trxn.id,
      transaction: trxn,
      title: 'Add  Frequency',
      product_id: '1', /** For Mutual Fund */
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = 'freq' + trxn.id;
    try {
      const dialogref = this.__dialog.open(
        FrequencyComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt.suc == 1) {
            this.deleteTransaction(trxn.id);
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'F',
      });
    }
  }
}
