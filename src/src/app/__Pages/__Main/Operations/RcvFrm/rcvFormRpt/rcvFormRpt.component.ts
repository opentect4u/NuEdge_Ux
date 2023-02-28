import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DeletercvComponent } from '../deletercv/deletercv.component';
import { RcvmodificationComponent } from '../rcvModification/rcvModification.component';
// import { AmcModificationComponent } from './amcModification/amcModification.component';
// import { AmcrptComponent } from './amcRpt/amcRpt.component';
@Component({
selector: 'rcvFormRpt-component',
templateUrl: './rcvFormRpt.component.html',
styleUrls: ['./rcvFormRpt.component.css']
})
export class RcvformrptComponent implements OnInit {
  __export= new MatTableDataSource<any>([]);

  __isVisible:boolean= false;
  __RcvForms = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __paginate: any= [];
  __columns: string[] = ['edit','sl_no', 'temp_tin_no', 'rcv_datetime', 'bu_type','delete'];
  __exportedClmns: string[] = ['sl_no', 'temp_tin_no', 'rcv_datetime', 'bu_type'];
constructor(
  private __Rpt: RPTService,
  private __dialog: MatDialog,
  private __utility: UtiliService,
  public dialogRef: MatDialogRef<RcvformrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
   private __dbIntr: DbIntrService
) {
}

ngOnInit(){
  this.getRvcFormMaster();
  this.tableExport();

}
tableExport(){
  const __amcExport = new FormData();
  // __amcExport.append('amc_id',this.__detalsSummaryForm.value.amc_id ? this.__detalsSummaryForm.value.amc_id : '');
  // __amcExport.append('rnt_id',this.__detalsSummaryForm.value.rnt_id ? this.__detalsSummaryForm.value.rnt_id : '');
  // __amcExport.append('gstin',this.__detalsSummaryForm.value.gst_in ? this.__detalsSummaryForm.value.gst_in : '');
  // __amcExport.append('contact_person',this.__detalsSummaryForm.value.contact_per ? this.__detalsSummaryForm.value.contact_per : '');
  this.__dbIntr.api_call(1,'/formreceivedExport',__amcExport).pipe(map((x: any) => x.data)).subscribe((res: amc[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}
getRvcFormMaster(__paginate: string | null = "10"){
  this.__dbIntr.api_call(0, '/formreceived', 'paginate='+__paginate +
    ('&trans_type_id='+ this.data.trans_type_id +
    (this.data.type_id ? '&trans_id=' + this.data.type_id : ''))
    ).pipe(map((x: any) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
}
getval(__itemsPerPage){
  this.__pageNumber.setValue(__itemsPerPage);
  this.getRvcFormMaster();
}
getPaginate(__paginate){
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
private setPaginator(__res) {
  this.__RcvForms = new MatTableDataSource(__res);
}
deleteRcvForm(__element,index){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  // dialogConfig.disableClose = true;
  // dialogConfig.hasBackdrop = false;
  dialogConfig.width =  "40%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data ={
     temp_tin_no:__element.temp_tin_no

  }
  try{
    const dialogref = this.__dialog.open(DeletercvComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if(dt){
        this.__RcvForms.data.splice(index,1);
        this.__RcvForms._updateChangeSubscription();
      }
    })
  }
  catch(ex){
  }
}
populateDT(__items){
  console.log(__items);

const dialogConfig = new MatDialogConfig();
dialogConfig.autoFocus = false;
dialogConfig.width = '80%';
dialogConfig.id = __items.temp_tin_no;
dialogConfig.hasBackdrop = false;
dialogConfig.disableClose = false;
dialogConfig.autoFocus = false;
dialogConfig.closeOnNavigation = false;
dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
try{
  dialogConfig.data = {
  flag:'RF',
  id: __items.temp_tin_no,
  title: 'Form Recievable',
  product_id:__items.product_id,
  trans_type_id:__items.trans_id,
  temp_tin_no:__items.temp_tin_no,
  right:global.randomIntFromInterval(1,60)
};
  const dialogref = this.__dialog.open(RcvmodificationComponent, dialogConfig);
  dialogref.afterClosed().subscribe(dt => {
    if (dt) {
    }
  });
}
catch(ex){
  const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
  dialogRef.updateSize("80%");
  this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"RF"})
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
    this.__Rpt.downloadReport('#rcvForm',
    {
      title: 'Receive Form '
    }, 'Receive Form')
  }


}
