import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { category } from 'src/app/__Model/__category';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DocsModificationComponent } from '../docsModification/docsModification.component';


@Component({
selector: 'docTypeRpt-component',
templateUrl: './docTypeRpt.component.html',
styleUrls: ['./docTypeRpt.component.css']
})
export class DoctyperptComponent implements OnInit {
  __sortAscOrDsc = {active: '',direction:'asc'};
  __catForm = new FormGroup({
    doc_type: new FormControl(''),
     options:new FormControl('2')
  })
  __export =  new MatTableDataSource<docType>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no', 'doc_type', 'delete'];
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
  this.getDocumnetTypeMst();
}

 getDocumnetTypeMst(column_name: string | null = '',sort_by: string | null | ''='asc'){
  const __docTypeSearch = new FormData();
  __docTypeSearch.append('doc_type',this.__catForm.value.doc_type ? this.__catForm.value.doc_type : '');
  __docTypeSearch.append('paginate',this.__pageNumber.value);
  __docTypeSearch.append('column_name',column_name);
  __docTypeSearch.append('sort_by',sort_by);
   this.__dbIntr.api_call(1,'/documenttypeDetailSearch',__docTypeSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.tableExport(column_name,sort_by);
   })
 }

tableExport(column_name: string | null = '',sort_by: string | null | ''='asc'){
  const __docTypeExport = new FormData();
  __docTypeExport.append('column_name',column_name);
  __docTypeExport.append('sort_by',sort_by);
  __docTypeExport.append('doc_type',this.__catForm.value.doc_type ? this.__catForm.value.doc_type : '');
  this.__dbIntr.api_call(1,'/documenttypeExport',__docTypeExport).pipe(map((x: any) => x.data)).subscribe((res: docType[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
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
        + ('&doc_type=' + this.__catForm.value.doc_type)
        + ('&column_name=' + this.__sortAscOrDsc.active)
        + ('&sort_by=' + this.__sortAscOrDsc.direction)
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

populateDT(__items: docType) {
  this.openDialog(__items.doc_type, __items.id);
}
showCorrospondingAMC(__items) {
  this.__utility.navigatewithqueryparams(
    'main/master/productwisemenu/subcategory',
    {
      queryParams: { id: btoa(__items.id.toString()) },
    }
  );
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
  this.__Rpt.downloadReport('#DocumentType',
  {
    title: 'DocumentType '
  }, 'DocumentType')
}
submit(){
 this.getDocumnetTypeMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}

sortData(sort){
  this.__sortAscOrDsc = sort;
  this.submit();
}

}
