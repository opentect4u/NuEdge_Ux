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
import { MapPlanOptionComponent } from '../entry_dialog/map-plan-option/map-plan-option.component';
@Component({
  selector: 'mailBack-trxn-rpt-without-scm',
  templateUrl: './trxn-rpt-without-scm.component.html',
  styleUrls: ['./trxn-rpt-without-scm.component.css'],
  providers:[ConfirmationService]
})
export class TrxnRptWithoutScmComponent implements OnInit {


  @ViewChild('primeTbl') primeTbl :Table;
  @ViewChild('searchFilter') filter:ElementRef;
  @Input() sub_file_type :string;
  @Input() file_type:string;


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
    console.log(this.sub_file_type);
    console.log(this.file_type);
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
        this.utility.convertFormData({...trxn,file_type:this.file_type,sub_file_type:this.sub_file_type})
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
    // dialogConfig.height = '100%';
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
            this.delete_AMC_Transaction(trxn.amc_code);
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
  delete_AMC_Transaction = (amc_code) =>{
    // this.trxnRptWithOutScm.splice(
    //   this.trxnRptWithOutScm.findIndex(item => item.id == id),1
    // );
    this.trxnRptWithOutScm = this.trxnRptWithOutScm.filter((item) => item.amc_code != amc_code)
    this.primeTbl.reset();
    this.filter.nativeElement.value = '';
  }
  MapISIN = (trxn,index:number) =>{
    if(trxn.scheme_name){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'MAPPLANOPTION_' + trxn.id,
      id: 0,
      transaction_dtls: trxn,
      title: 'Map Plan Option',
      product_id:'1', /** For Mutual Fund */
      right: global.randomIntFromInterval(1, 60),
      file_type:this.file_type,
      sub_file_type:this.sub_file_type
    };
    dialogConfig.id = 'MAPPLANOPTION_' + trxn.id;
    try {
      const dialogref = this.__dialog.open(
        MapPlanOptionComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.trxnRptWithOutScm = this.trxnRptWithOutScm.filter((item) => (item.product_code != trxn.product_code && item.folio_no != trxn.folio_no));
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'MAPPLANOPTION_' + trxn.id,
      });
    }
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
            this.delete_ISIN_Transaction(trxn);
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

  delete_ISIN_Transaction = (trxn) =>{
    console.log(trxn);
    //CAMS
    if(trxn.rnt_id == 1){
      this.trxnRptWithOutScm = this.trxnRptWithOutScm.filter((item) => (item.product_code != trxn.product_code))
    }
    else{ //KFINTECH
      this.trxnRptWithOutScm = this.trxnRptWithOutScm.filter((item) => (item.product_code != trxn.product_code && item.isin_no != trxn.isin_no));
    }
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
      file_type:this.file_type,
      sub_file_type: this.sub_file_type,
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
            this.trxnRptWithOutScm = this.trxnRptWithOutScm.filter((item) => (item.product_code != trxn.product_code && item.folio_no != trxn.folio_no));
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
