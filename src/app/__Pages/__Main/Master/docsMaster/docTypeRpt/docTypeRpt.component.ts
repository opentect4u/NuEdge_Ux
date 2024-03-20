import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DocsModificationComponent } from '../docsModification/docsModification.component';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { docTypeClmns } from 'src/app/__Utility/Master/docTypeClmns';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { Table } from 'primeng/table';

@Component({
selector: 'docTypeRpt-component',
templateUrl: './docTypeRpt.component.html',
styleUrls: ['./docTypeRpt.component.css']
})
export class DoctyperptComponent implements OnInit {
  formValue;
  itemsPerPage=ItemsPerPage;
  @ViewChild('dt') primeTbl :Table;

  sort=new sort();
  __catForm = new FormGroup({
    doc_type: new FormControl(''),
     options:new FormControl('2')
  })
  __export =  new MatTableDataSource<docType>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = docTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'doc_type'];
  __paginate: any= [];
  __selectdocType = new MatTableDataSource<docType>([]);
  __isVisible: boolean = true;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<DoctyperptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.formValue = this.__catForm.value;
  this.getDocumnetTypeMst();
}

 getDocumnetTypeMst(){
  const __docTypeSearch = new FormData();
  __docTypeSearch.append('doc_type',this.formValue?.doc_type ? this.__catForm.value.doc_type : '');
  __docTypeSearch.append('paginate',this.__pageNumber.value);
  __docTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
  __docTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : '1'));
   this.__dbIntr.api_call(1,'/documenttypeDetailSearch',__docTypeSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    // this.__paginate =res.links;
    // this.setPaginator(res.data);
    this.setPaginator(res);

     this.tableExport(__docTypeSearch);
   })
 }

tableExport(__docTypeExport){
  __docTypeExport.delete('paginate');
  this.__dbIntr.api_call(1,'/documenttypeExport',__docTypeExport).pipe(map((x: any) => x.data)).subscribe((res: docType[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}

filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}
getColumns = () =>{
  return this.__utility.getColumns(this.__columns);
}
private setPaginator(__res) {
  this.__selectdocType = new MatTableDataSource(__res);
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&doc_type=' + this.formValue?.doc_type)
        + ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
        ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}
populateDT(__items: docType) {
  this.openDialog(__items.doc_type, __items.id);
}
openDialog(__category: string | null = null, __catId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'D',
    id: __catId,
    doc_type: __category,
    title: __catId == 0 ? 'Add Document Type' : 'Update Document Type',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      DocsModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectdocType.data.unshift(dt.data);
          this.__selectdocType._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'D',
    });
  }
}
private updateRow(row_obj: docType) {
  this.__selectdocType.data = this.__selectdocType.data.filter(
    (value: docType, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: docType, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type
      }
      return true;
    }
  );
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
  this.dialogRef.updateSize("40%",'47px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

exportPdf(){
  this.__Rpt.downloadReport('#DocumentType',
  {
    title: 'DocumentType '
  }, 'DocumentType')
}
submit(){
 this.formValue = this.__catForm.value;
 this.getDocumnetTypeMst();
}

customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField != 'delete'){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  this.getDocumnetTypeMst();
  }
}
onselectItem(ev){
  this.getDocumnetTypeMst();
}
delete(docType,index){
  const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'DT',
        id: docType.id,
        title: 'Delete '  + docType.doc_type,
        api_name:'/documenttypeDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selectdocType.data.splice(index,1);
            this.__selectdocType._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == docType.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
}
}
