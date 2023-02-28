import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { trnsType } from 'src/app/__Model/__transTypeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { TrnsModificationComponent } from '../trnsModification/trnsModification.component';
// import { TrnstypeModificationComponent } from '../trnstypeModification/trnstypeModification.component';

@Component({
selector: 'trnsRpt-component',
templateUrl: './trnsRpt.component.html',
styleUrls: ['./trnsRpt.component.css']
})
export class TrnsrptComponent implements OnInit {
  __trns_type: any=[];
  __trnsType = new FormGroup({
    trns_name: new FormControl(''),
    trans_type_id: new FormControl('')
  })
  __export =  new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no','Transaction Type', 'Transaction', 'delete'];
  __exportedClmns: string[] = ['sl_no', 'Transaction Type','Transaction'];
  __paginate: any= [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = false;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<TrnsrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.getTrnsMst();
  this.tableExport();
  this.getTransactionTypeMst();
}
getTransactionTypeMst(){
  this.__dbIntr.api_call(0,'/transctiontype',
  'product_id=' + this.data.product_id).pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
   this.__trns_type = res;
  });
}

tableExport(){
  const __catExport = new FormData();
  __catExport.append('product_id',this.data.product_id);
  __catExport.append('trns_name',this.__trnsType.value.trns_name ? this.__trnsType.value.trns_name : '');
  __catExport.append('trns_type_id',this.__trnsType.value.trns_type_id ? this.__trnsType.value.trns_type_id : '');
  this.__dbIntr.api_call(1,'/transctionExport',__catExport).pipe(map((x: any) => x.data)).subscribe((res: any[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}
getTrnsMst(__paginate: string | null = '10'){
  this.__dbIntr.api_call(0,'/transction',
  'paginate='+__paginate + '&product_id=' + this.data.product_id).pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
    this.setPaginator(res.data);
    this.__paginate = res.links;
  });
}

private setPaginator(__res) {
  this.__selecttrnsType = new MatTableDataSource(__res);
  // this.__selecttrnsType.paginator = this.paginator;
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url + ('&paginate=' + this.__pageNumber.value)
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}
getval(__paginate) {
  this.__pageNumber.setValue(__paginate.toString());
  this.getTrnsMst(this.__pageNumber.value);
}

populateDT(__items: plan) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}
openDialog(id, __items) {
  const disalogConfig = new MatDialogConfig();
  disalogConfig.width = '50%';
  disalogConfig.data = {
    id: id,
    title: id == 0 ? 'Add Transaction' : 'Update Transaction',
    items: __items,
    product_id:this.data.product_id
  };
  const dialogref = this.__dialog.open(TrnsModificationComponent, disalogConfig);
  dialogref.afterClosed().subscribe(dt => {
    if (dt?.id > 0) {
         this.updateRow(dt.data);
    }
    else{
      this.addRow(dt.data);
    }
  });
}
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
minimize(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.updateSize("40%",'55px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

exportPdf(){
  this.__Rpt.downloadReport('#trns',
  {
    title: 'Transaction'
  }, 'Transaction')
}
submit(){
  const __amcSearch = new FormData();
  // __amcSearch.append('trns_type',this.__trnsType.value.trns_type);
  __amcSearch.append('product_id',this.data.product_id);
  __amcSearch.append('trns_name',this.__trnsType.value.trns_name ? this.__trnsType.value.trns_name : '');
  __amcSearch.append('trns_type_id',this.__trnsType.value.trns_type_id ? this.__trnsType.value.trns_type_id : '');
   this.__dbIntr.api_call(1,'/transctionSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
    //  this.showColumns();
     this.tableExport();
   })
}
private updateRow(row_obj: any) {
  this.__selecttrnsType.data = this.__selecttrnsType.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type
      }
      return true;
    }
  );
}
addRow(row_obj){
  this.__selecttrnsType.data.unshift(row_obj);
  this.__export.data.unshift(row_obj);
  this.__export._updateChangeSubscription();
  this.__selecttrnsType._updateChangeSubscription();
}
}
