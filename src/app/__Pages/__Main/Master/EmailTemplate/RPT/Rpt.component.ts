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

/**
 *  * This function is used to get the email template master data.
 *  * It retrieves the data from the server using the DbIntrService and populates the MatTableDataSource with the retrieved data.
 *  * It also handles pagination and sorting of the data.
 * @param column_name 
 * @param sort_by 
 */
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

/**
 *  * This function is used to filter the email template master data based on the provided sorting options.
 *  * It calls the getEmailTemplateMst function with the active column and sorting direction.
 *  * @returns void
 */
filter(){
 this.getEmailTemplateMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
/**
 *  * This function is used to export the email template data to a table.
 *  * It takes a FormData object as a parameter, removes the 'paginate' field from it, and makes an API call to export the data.
 *  * The response data is then assigned to the __export MatTableDataSource.
 *  * @returns void
 * @param __fb 
 */
exportTble(__fb: FormData){
  __fb.delete('paginate');
 this.__dbIntr.api_call(1,'/emailExport',__fb).pipe(pluck("data")).subscribe((res: any) =>{
    this.__export = new MatTableDataSource(res);
 })
}
/**
 * * This function is used to toggle the visibility of the dialog.
 * * It updates the size and position of the dialog based on the current visibility state.  
 */
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
/**
 * * * This function is used to minimize the dialog.
 * * * It updates the size and position of the dialog to a smaller size and moves it to the bottom right corner.
 * * * @returns void
 */
minimize(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.updateSize("40%",'55px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
/**
 * * * This function is used to maximize the dialog.
 * * * It updates the size of the dialog to 40% and toggles the visibility state.
 * * * @returns void
 * * * @description
 * * * This function is responsible for maximizing the dialog by updating its size and toggling the visibility state.
 */
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
/**
 * * * This function is used to export the email template data as a PDF.
 * * * It currently does not have any implementation.
 * * * @returns void
 */
exportPdf(){

}
/**
 *  * This function is used to populate the data table with the provided items.
 *  * It opens a dialog with the provided items and the item ID.
 *  * If the item ID is 0, it indicates that a new email template is being added.
 *  * If the item ID is greater than 0, it indicates that an existing email template is being updated.
 *  * @memberof RptComponent
 * @param __items 
 */
populateDT(__items){
  this.openDialog(__items,__items.id);
}
/**
 *  * This function is used to open a dialog for adding or updating an email template.
 *  * It configures the dialog with various options such as auto focus, close on navigation, disable close, has backdrop, width, and scroll strategy.
 *  * It also sets the data for the dialog, including the flag, id, items, title, and right position.
 *  * After the dialog is closed, it updates the email template master data based on the returned data.
 *  * @memberof RptComponent
 * @param __email 
 * @param __emailId 
 */
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
/**
 *  * This function is used to update a row in the email template master data.
 *  * It filters the data in the __emailMst and __export data sources to find the row with the matching id.
 *  * If a match is found, it updates the event, subject, and body properties of that row with the values from the provided row_obj.
 *  * @memberof RptComponent
 * @param row_obj 
 */
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
/**
 *  * This function is used to set the page number for pagination and filter the email template master data.
 *  * It updates the value of the __pageNumber form control with the provided __paginate value.
 *  * After updating the page number, it calls the filter function to retrieve the filtered data.
 *  * @memberof RptComponent
 * @param __paginate 
 */
getval(__paginate) {
   this.__pageNumber.setValue(__paginate.toString());
  this.filter();
}
/**
 *  * This function is used to retrieve paginated data for the email template master.
 *  * It checks if the __paginate object has a URL property, and if so, 
 * * it makes an API call to get the paginated data.
 *  * The API call includes the current page number, email event, email subject, column name, and sort direction.
 *  * The retrieved data is then assigned to the __emailMst MatTableDataSource and the __paginate variable.
 *  * @memberof RptComponent
 * @param __paginate 
 */
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
/**
 *  * This function is used to sort the email template master data based on the provided sorting options.
 *  * It updates the __sortAscOrDsc variable with the provided sort object and calls the filter function to retrieve the sorted data.
 *  * @memberof RptComponent
 * @param sort 
 */
sortData(sort){
  this.__sortAscOrDsc = sort;
  this.filter();
}
}
