import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ModificationComponent } from '../Modification/modification.component';

@Component({
selector: 'Rpt-component',
templateUrl: './Rpt.component.html',
styleUrls: ['./Rpt.component.css']
})
export class RptComponent implements OnInit {
  __sortAscOrDsc = {active:'',direction:''};
  __paginate: any= [];
  __isVisible: boolean = true;
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no','email_event','email_subject','delete'];
  __exportedClmns: string[] = ['sl_no', 'email_event','email_subject'];
  __emailMst = new MatTableDataSource<any>([]);
  __export = new MatTableDataSource<any>([]);
  __emailTemplate =  new FormGroup({
    event: new FormControl(''),
    subject: new FormControl(''),
  });

constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<RptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){this.getEmailTemplateMst();}
  
getEmailTemplateMst(column_name: string | null = '',sort_by: string | null| '' = 'asc'){
 const __fb = new FormData();
 __fb.append('paginate',this.__pageNumber.value);
 __fb.append('column_name',column_name);
 __fb.append('sort_by',sort_by);
 __fb.append('event',this.__emailTemplate.value.event ? this.__emailTemplate.value.event : '');
 __fb.append('subject',this.__emailTemplate.value.subject ? this.__emailTemplate.value.subject : '');
this.__dbIntr.api_call(1,'/emailSearch',__fb).pipe(pluck("data")).subscribe((res: any) =>{
    this.__emailMst = new MatTableDataSource(res.data);
    this.__paginate =res.links;
    this.exportTble(__fb);
})
}

filter(){
 this.getEmailTemplateMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
exportTble(__fb: FormData){
  __fb.delete('paginate');
 this.__dbIntr.api_call(1,'/emailExport',__fb).pipe(pluck("data")).subscribe((res: any) =>{
    this.__export = new MatTableDataSource(res);
 })
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

}
populateDT(__items){
  this.openDialog(__items,__items.id);
}
openDialog(__email: any, __emailId: number){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = "40%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data ={
    flag:'E',
    id:__emailId,
    items:__email,
    title: __emailId == 0 ? 'Add Email Template' : 'Update Email Template',
    right:global.randomIntFromInterval(0,60)
  }
  dialogConfig.id =  __emailId > 0  ? __emailId.toString() : "0";
  try{
    const dialogref = this.__dialog.open(ModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);

      if (dt) {
        if(dt.id > 0){
          //update Row
          this.updateRow(dt.data);
        }
        else{
          //add Row
          this.__emailMst.data.unshift(dt.data);
          this.__export.data.unshift(dt.data);
          this.__emailMst._updateChangeSubscription();
          this.__export._updateChangeSubscription();
        }
      }
    });
  }
  catch(ex){
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize("40%");
    this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"E"})
  }
}
updateRow(row_obj){
  this.__emailMst.data = this.__emailMst.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.event = row_obj.event
         value.subject = row_obj.subject,
          value.body = row_obj.body
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.event = row_obj.event
         value.subject = row_obj.subject,
          value.body = row_obj.body
      }
      return true;
    }
  );
}
getval(__paginate) {
  this.__pageNumber.setValue(__paginate.toString());
  this.filter();
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url +
        ('&paginate=' + this.__pageNumber.value)
        + ('&event=' + this.__emailTemplate.value.event ? this.__emailTemplate.value.event : '')
        +('&subject='+ this.__emailTemplate.value.subject ? this.__emailTemplate.value.subject : '')
        +('&column_name='+ this.__sortAscOrDsc.active)
        +('&sort_by='+ this.__sortAscOrDsc.direction))
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__emailMst = new MatTableDataSource(res.data);
        this.__paginate = res.links;
      });
  }
}
sortData(sort){
  this.__sortAscOrDsc = sort;
  this.filter();
}
}
