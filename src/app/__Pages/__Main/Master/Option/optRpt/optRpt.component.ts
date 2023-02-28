
import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { OptionModificationComponent } from '../optionModification/optionModification.component';

@Component({
selector: 'optRpt-component',
templateUrl: './optRpt.component.html',
styleUrls: ['./optRpt.component.css']
})
export class OptrptComponent implements OnInit {
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    option: new FormControl(''),
     options:new FormControl('2')
  })
  __export =  new MatTableDataSource<option>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no', 'option', 'delete'];
  __exportedClmns: string[] = ['sl_no', 'option'];
  __paginate: any= [];
  __selectOption = new MatTableDataSource<option>([]);
  __isVisible: boolean = true;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<OptrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
  
}


ngOnInit(){
  // this.getOptionmaster();
  // this.tableExport();
  this.submit();
}

tableExport(){
  const __catExport = new FormData();
  __catExport.append('opt_name',this.__catForm.value.option ? this.__catForm.value.option : '');
  this.__dbIntr.api_call(1,'/optionExport',__catExport).pipe(map((x: any) => x.data)).subscribe((res: option[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}

private getOptionmaster(__paginate: string | null = '10') {
  this.__dbIntr
  .api_call(0, '/option', 'paginate=' + __paginate)
  .pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
    this.setPaginator(res.data);
    this.__paginate = res.links;
  });
}
private setPaginator(__res) {
  this.__selectOption = new MatTableDataSource(__res);
  // this.__selectOption.paginator = this.paginator;
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&option=' + this.__catForm.value.option)
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
  // this.getOptionmaster(this.__pageNumber.value);
  this.submit();
}

populateDT(__items: option) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}

openDialog(__category: option | null = null, __catId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'O',
    id: __catId,
    items: __category,
    title: __catId == 0 ? 'Add Option' : 'Update Option',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      OptionModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectOption.data.unshift(dt.data);
          this.__selectOption._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'O',
    });
  }
}
private updateRow(row_obj: option) {
  this.__selectOption.data = this.__selectOption.data.filter(
    (value: option, key) => {
      if (value.id == row_obj.id) {
        value.opt_name = row_obj.opt_name
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: option, key) => {
      if (value.id == row_obj.id) {
        value.opt_name = row_obj.opt_name
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
  this.__Rpt.downloadReport('#Option',
  {
    title: 'Option '
  }, 'Option')
}
submit(){
  const __amcSearch = new FormData();
  __amcSearch.append('option',this.__catForm.value.option);
  __amcSearch.append('paginate',this.__pageNumber.value);
   this.__dbIntr.api_call(1,'/optionDetailSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.showColumns();
     this.tableExport();
   })
}

showColumns(){

}
}
