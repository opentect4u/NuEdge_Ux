import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
selector: 'finRPT-component',
templateUrl: './finRPT.component.html',
styleUrls: ['./finRPT.component.css']
})
export class FinrptComponent implements OnInit {
  __isVisible:boolean= false;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __export =  new MatTableDataSource<any>([]);
  __exportedClmns: string[] =[ "sl_no", 'tin_id'];
  __financMst = new MatTableDataSource<any>([]);
  __columns = ["sl_no", 'tin_id', 'edit', 'delete'];


constructor(
  private overlay: Overlay,
  private __utility: UtiliService,
  private __dbIntr: DbIntrService,
  private __dialog: MatDialog,
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<FinrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
) {
}

ngOnInit(){
 this.getFianancMaster();
 this.tableExport();
  console.log(this.data.trans_type_id);

}
tableExport(){
          const __mfTrax = new FormData();
          __mfTrax.append('trans_type_id', this.data.trans_Type_id)
          __mfTrax.append('trans_id', this.data.trans_id)
    this.__dbIntr.api_call(1,'/mfTraxExport',__mfTrax).pipe(pluck('data')).subscribe((res: any) =>{
    this.__export = new MatTableDataSource(res);
    });
}

getFianancMaster(__paginate: string  | null = "10") {
  this.__dbIntr.api_call(0, '/mfTraxShow',
 ( 'trans_type_id=' + this.data.trans_type_id)
  + '&paginate='+ __paginate
  + (this.data.trans_id ? '&trans_id='
  + this.data.trans_id : '') )
  .pipe(map((x: responseDT) => x.data)).subscribe((res: any) => {
    this.setPaginator(res);
  })
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
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

getval(__paginate){
  this.__pageNumber= __paginate.toString();
  this.getPaginate();
}
getPaginate(__paginate: any | null = null){
  if(__paginate){
   this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber) + (this.data.trans_id ? ('&trans_id=' + this.data.trans_id ) : '')).pipe(map((x: any) => x.data)).subscribe((res: any) => {
     this.setPaginator(res);
   })
  }
  else{
    this.__dbIntr.api_call(0,'/mfTraxShow' ,'paginate='+this.__pageNumber).pipe(map((x: any) => x.data)).subscribe((res: any) => {
       this.setPaginator(res);
     })
  }
}
setPaginator(res){
  this.__financMst = new MatTableDataSource(res.data);
  this.__paginate = res.links;
 }
 populateDT(__element){

 }
 submit(){
  const __mfTrax = new FormData();
  __mfTrax.append('trans_type_id', this.data.trans_Type_id)
  __mfTrax.append('trans_id', this.data.trans_id)
  this.__dbIntr.api_call(1,'/mfTraxDetailSearch',__mfTrax).pipe(pluck('data')).subscribe((res: any) =>{
     this.__paginate =res.links;
      this.setPaginator(res.data);
       this.tableExport();
  });
 }
 exportPdf(){
  this.__Rpt.downloadReport('#__finRPT',
  {
    title: 'Financial Report'
  }, 'Financial Report  ')
}
}
