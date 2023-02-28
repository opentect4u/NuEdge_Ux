import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PlanModificationComponent } from '../planModification/planModification.component';

@Component({
selector: 'planRpt-component',
templateUrl: './planRpt.component.html',
styleUrls: ['./planRpt.component.css']
})
export class PlanrptComponent implements OnInit {
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    plan_name: new FormControl(''),
     options:new FormControl('2')
  })
  __export =  new MatTableDataSource<plan>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no', 'plan', 'delete'];
  __exportedClmns: string[] = ['sl_no', 'plan'];
  __paginate: any= [];
  __selectPLN = new MatTableDataSource<plan>([]);
  __isVisible: boolean = false;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<PlanrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.getPlanmaster();
  this.tableExport();
}

tableExport(){
  const __catExport = new FormData();
  __catExport.append('cat_id',this.__catForm.value.cat_id ? this.__catForm.value.cat_id : '');
  this.__dbIntr.api_call(1,'/planExport',__catExport).pipe(map((x: any) => x.data)).subscribe((res: plan[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}

private getPlanmaster(__paginate: string | null = '10') {
  this.__dbIntr
  .api_call(0, '/plan', 'paginate=' + __paginate)
  .pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
    this.setPaginator(res.data);
    this.__paginate = res.links;
  });
}
private setPaginator(__res) {
  this.__selectPLN = new MatTableDataSource(__res);
  // this.__selectPLN.paginator = this.paginator;
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
  this.getPlanmaster(this.__pageNumber.value);
}

populateDT(__items: plan) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}
showCorrospondingAMC(__items) {
  this.__utility.navigatewithqueryparams(
    'main/master/productwisemenu/subcategory',
    {
      queryParams: { id: btoa(__items.id.toString()) },
    }
  );
}
openDialog(__category: plan | null = null, __catId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'P',
    id: __catId,
    items: __category,
    title: __catId == 0 ? 'Add Plan' : 'Update Plan',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      PlanModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectPLN.data.unshift(dt.data);
          this.__selectPLN._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'P',
    });
  }
}
private updateRow(row_obj: plan) {
  this.__selectPLN.data = this.__selectPLN.data.filter(
    (value: plan, key) => {
      if (value.id == row_obj.id) {
        value.plan_name = row_obj.plan_name
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: plan, key) => {
      if (value.id == row_obj.id) {
        value.plan_name = row_obj.plan_name
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
  this.__Rpt.downloadReport('#plan',
  {
    title: 'Plan '
  }, 'Plan')
}
submit(){
  const __amcSearch = new FormData();
  __amcSearch.append('plan_name',this.__catForm.value.plan_name);
   this.__dbIntr.api_call(1,'/planDetailSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.showColumns();
     this.tableExport();
   })
}

showColumns(){

}
}
