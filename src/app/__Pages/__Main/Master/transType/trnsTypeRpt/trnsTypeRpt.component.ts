import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { TrnstypeModificationComponent } from '../trnstypeModification/trnstypeModification.component';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { column } from 'src/app/__Model/tblClmns';
import { transClmns, trnsTypeClmns } from 'src/app/__Utility/Master/trans';


@Component({
selector: 'trnsTypeRpt-component',
templateUrl: './trnsTypeRpt.component.html',
styleUrls: ['./trnsTypeRpt.component.css']
})
export class TrnstyperptComponent implements OnInit {

  formValue;

  itemsPerPage = ItemsPerPage
  sort =new sort();

  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __trnsType = new FormGroup({
    trns_type: new FormControl('')
  })
  __export =  new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[]=trnsTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'trns_type'];
  __paginate: any= [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;

constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<TrnstyperptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.formValue = this.__trnsType.value;
}
gettransTypeMst(){
  const __trnsTypeSearch = new FormData();
  __trnsTypeSearch.append('trns_type',this.formValue.trns_type);
  __trnsTypeSearch.append('paginate',this.__pageNumber.value);
  __trnsTypeSearch.append('product_id',this.data.product_id);
  __trnsTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
  __trnsTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
   this.__dbIntr.api_call(1,'/transctiontypeSearch',__trnsTypeSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.tableExport(__trnsTypeSearch);
   })
}

tableExport(__trnsTypeExport){
  __trnsTypeExport.delete('paginate')
  this.__dbIntr.api_call(1,'/transctiontypeExport',__trnsTypeExport).pipe(map((x: any) => x.data)).subscribe((res: any[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}
getTrnsTypeMst(__paginate: string | null = '10'){
  this.__dbIntr.api_call(0,'/transctiontype',
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
        +('&trns_type='+ this.formValue?.trns_type)
        + ('&product_id=' +this.data.product_id) +
        ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
        ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
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
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '50%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.id = 'TRNS_Type'+id;
  dialogConfig.data = {
    flag : 'TRNS_Type'+id,
    id: id,
    title: id == 0 ? 'Add Transaction Type' : 'Update Transaction Type',
    items: __items,
    product_id:this.data.product_id
  };
  try{
    const dialogref = this.__dialog.open(TrnstypeModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
           this.updateRow(dt.data);
      }
      else{
        // this.addRow(dt.data);
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
      flag:'TRNS_Type'+id
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
  this.__Rpt.downloadReport('#trxn_type',
  {
    title: 'Transaction type - ' + new Date().toLocaleDateString()
  }, 'Transaction type','portrait')
}
submit(){
  this.formValue = this.__trnsType.value;
  this.gettransTypeMst();
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
      title: 'Delete '  + __el.trns_type,
      api_name:'/trnsTypeDelete'
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
customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField != 'delete'){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  // this.submit();
  this.gettransTypeMst();
  }
}
onselectItem(ev){
  // this.__pageNumber.setValue(ev.option.value);
  // this.submit();
  this.gettransTypeMst();
}
}
