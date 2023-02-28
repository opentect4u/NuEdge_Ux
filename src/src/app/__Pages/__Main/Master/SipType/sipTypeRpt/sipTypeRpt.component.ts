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
import { SiptypemodificationComponent } from '../sipTypeModification/sipTypeModification.component';


@Component({
selector: 'sipTypeRpt-component',
templateUrl: './sipTypeRpt.component.html',
styleUrls: ['./sipTypeRpt.component.css']
})
export class SiptyperptComponent implements OnInit {
  __trnsType = new FormGroup({
    sip_type_name: new FormControl('')
  })
  __export =  new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no', 'sipType_name', 'delete'];
  __exportedClmns: string[] = ['sl_no', 'sipType_name'];
  __paginate: any= [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = false;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<SiptyperptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.getTrnsTypeMst();
  this.tableExport();
}

tableExport(){
  const __catExport = new FormData();
  // __catExport.append('product_id',this.data.product_id);
  __catExport.append('sip_type_name',this.__trnsType.value.sip_type_name ? this.__trnsType.value.sip_type_name : '');
  this.__dbIntr.api_call(1,'/sipTypeExport',__catExport).pipe(map((x: any) => x.data)).subscribe((res: any[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}
getTrnsTypeMst(__paginate: string | null = '10'){
  this.__dbIntr.api_call(0,'/sipType',
  'paginate='+__paginate).pipe(map((x: responseDT) => x.data))
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
  this.getTrnsTypeMst(this.__pageNumber.value);
}

populateDT(__items: plan) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}
openDialog(id, __items) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag:'SIP',
     id: id,
     title: id == 0 ? 'Add Sip Type' : 'Update Sip Type',
    items: __items,
    product_id: this.data.prodcut_id
  };
  dialogConfig.id = id > 0 ? id.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      SiptypemodificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          // this.__selectPLN.data.unshift(dt.data);
          // this.__selectPLN._updateChangeSubscription();
          this.addRow(dt.data);
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    console.log(ex);
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'SIP',
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
  this.__Rpt.downloadReport('#sip_type',
  {
    title: 'SIP type '
  }, 'SIP type')
}
submit(){
  const __amcSearch = new FormData();
  __amcSearch.append('sip_type_name',this.__trnsType.value.sip_type_name);
  // __amcSearch.append('product_id',this.data.product_id);
   this.__dbIntr.api_call(1,'/sipTypeSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
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
        value.sip_type_name = row_obj.sip_type_name
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.sip_type_name = row_obj.sip_type_name
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
