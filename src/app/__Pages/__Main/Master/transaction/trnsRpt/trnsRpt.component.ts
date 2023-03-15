import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
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
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __trns_type: any=[];
  __trnsType = new FormGroup({
    trns_name: new FormControl(''),
    trans_type_id: new FormControl('')
  })
  __export =  new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no','trns_type', 'trns_name'];
  __exportedClmns: string[] = ['sl_no', 'trns_type','trns_name'];
  __paginate: any= [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
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
  // this.getTrnsMst();
  // this.tableExport();
  this.getTransactionTypeMst();
  this.getTransMst();
}

getTransMst(column_name: string | null = '',sort_by: string | null | '' = 'asc'){
  const __tranSearch = new FormData();
  __tranSearch.append('paginate',this.__pageNumber.value);
  __tranSearch.append('product_id',this.data.product_id);
  __tranSearch.append('column_name',column_name);
  __tranSearch.append('sort_by',sort_by);
  __tranSearch.append('trns_name',this.__trnsType.value.trns_name ? this.__trnsType.value.trns_name : '');
  __tranSearch.append('trns_type_id',this.__trnsType.value.trans_type_id ? this.__trnsType.value.trans_type_id : '');
   this.__dbIntr.api_call(1,'/transctionSearch',__tranSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.tableExport(column_name,sort_by);
   })
}

getTransactionTypeMst(){
  this.__dbIntr.api_call(0,'/transctiontype',
  'product_id=' + this.data.product_id).pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
   this.__trns_type = res;
  });
}

tableExport(column_name: string | null = '',sort_by: string | null | '' = 'asc'){
  const __trnsExport = new FormData();
  __trnsExport.append('paginate',this.__pageNumber.value);
  __trnsExport.append('product_id',this.data.product_id);
  __trnsExport.append('column_name',column_name);
  __trnsExport.append('sort_by',sort_by);
  __trnsExport.append('trns_name',this.__trnsType.value.trns_name ? this.__trnsType.value.trns_name : '');
  __trnsExport.append('trns_type_id',this.__trnsType.value.trans_type_id ? this.__trnsType.value.trans_type_id : '');
  this.__dbIntr.api_call(1,'/transctionExport',__trnsExport).pipe(map((x: any) => x.data)).subscribe((res: any[]) =>{
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
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&trns_name='+this.__trnsType.value.trns_name)
        + ('&trns_type_id='+this.__trnsType.value.trans_type_id)
        + ('&product_id='+this.data.product_id)
        + ('&column_name='+this.__sortColumnsAscOrDsc.active)
        + ('&sort_by='+this.__sortColumnsAscOrDsc.direction)
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
  this.submit();
}

populateDT(__items: any) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items.id, __items);
}
openDialog(id, __items) {
  console.log(__items);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '50%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.id = 'TRNS_'+id;
  dialogConfig.data = {
    flag : 'TRNS_'+id,
    id: id,
    title: id == 0 ? 'Add Transaction' : 'Update Transaction',
    items: __items,
    product_id:this.data.product_id
  };
  try{
    const dialogref = this.__dialog.open(TrnsModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
           this.updateRow(dt.data);
      }
      else{
        this.addRow(dt.data);
      }
    });
  }
  catch(ex){
    console.log(ex);

    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
    this.__utility.getmenuIconVisible({
      id: id,
      items: __items,
      flag:'TRNS_'+id
    });
  }

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
   this.getTransMst(this.__sortColumnsAscOrDsc.active,this.__sortColumnsAscOrDsc.direction);
}
private updateRow(row_obj: any) {
  this.__selecttrnsType.data = this.__selecttrnsType.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type,
        value.trns_name = row_obj.trns_name
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type,
        value.trns_name = row_obj.trns_name
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
sortData(sort){
  this.__sortColumnsAscOrDsc =sort;
  this.submit();
}
delete(__el,index){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'TT',
      id: __el.id,
      title: 'Delete '  + __el.trns_name,
      api_name:'/trnsDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selecttrnsType.data.splice(index,1);
          this.__selecttrnsType._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
          this.__export._updateChangeSubscription();
        }
      }

    })
}
}
