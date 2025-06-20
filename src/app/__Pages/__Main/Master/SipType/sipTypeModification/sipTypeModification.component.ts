import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, skip } from 'rxjs/operators';

@Component({
selector: 'sipTypeModification-component',
templateUrl: './sipTypeModification.component.html',
styleUrls: ['./sipTypeModification.component.css']
})
export class SiptypemodificationComponent implements OnInit {
// __ProductMaster: any = [];
__isVisible:boolean = false;

__trns_type = new FormGroup({
  sip_type_name: new FormControl('',[Validators.required]),
  id: new FormControl(0)
})
constructor(
  public dialogRef: MatDialogRef<SiptypemodificationComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService,
  public __dialog: MatDialog) {

   this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
    if(this.data.id == res.id && this.data.flag == res.flag){
      this.__isVisible = res.isVisible
    }
  })
  if (this.data.id > 0) {
    this.__trns_type.setValue({
      sip_type_name: this.data.items.sip_type_name,
      id: this.data.id
    });
  }
  // this.getProductMaster();

}

ngOnInit() { }
/**
 * 
 * @returns void
 * * @memberof SiptypemodificationComponent
 * * @description
 * * This function is responsible for submitting the SIP Type form data to the server.
 * * It checks if the form is valid, creates a FormData object, appends the form values to it,
 * * and makes an API call to submit the data.
 * * @example
 * * // Usage: Call this function when the user clicks the submit button on the SIP Type form.
 * * * @returns {void}
 * 
 */
submit() {
  if (this.__trns_type.invalid) {
    return;
  }

  const __trnsTYpe = new FormData();
  __trnsTYpe.append('sip_type_name',this.__trns_type.value.sip_type_name);
  __trnsTYpe.append('id',this.data.id);
  this.__dbIntr.api_call(1, '/sipTypeAddEdit', __trnsTYpe).subscribe((res: any) => {
    if (res.suc == 1) {
      // this.reset();
      this.dialogRef.close({id:this.data.id,data:res.data});
    }
    this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Sip Type updated successfully' : 'Sip Type added successfully') : 'Something went wrong! please try again later', res.suc);
    // this.reset();
  })
}
// getProductMaster() {
//   this.__dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
//     this.__ProductMaster = res;
//   })
// }
/**
 * * This function is used to reset the form fields to their initial values.
 * * It sets the form controls to their default values and resets the form state.
 * * @memberof SiptypemodificationComponent
 */
minimize(){
  this.dialogRef.updateSize("30%",'47px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
/**
 *  * This function is used to toggle the visibility of the dialog.
 *  * It updates the size of the dialog to 40% and toggles the visibility state.
 *  * @memberof SiptypemodificationComponent
 *  *  * @description
 *  * This function is responsible for toggling the visibility of the dialog.
 *  * It updates the size of the dialog to 40% and toggles the visibility state.
 */
maximize(){
  this.dialogRef.updateSize("40%");
  this.__isVisible = !this.__isVisible;
}
/**
 * * This function is used to toggle the full-screen mode of the dialog.
 * * It updates the size of the dialog to 60% and toggles the visibility state.
 * * @memberof SiptypemodificationComponent
 *  
 * * @description
 * * This function is responsible for toggling the full-screen mode of the dialog.
 * * It updates the size of the dialog to 60% and toggles the visibility state.
 * * @example
 *  
 * * // Usage: Call this function to toggle the full-screen mode of the dialog.
 * * @returns {void}
 * * @memberof SiptypemodificationComponent
 *  * * @description
 * * This function is responsible for toggling the full-screen mode of the dialog.
 * * It updates the size of the dialog to 60% and toggles the visibility state.
 * * @example
 * * // Usage: Call this function to toggle the full-screen mode of the dialog.
 * * @returns {void}
 */
fullScreen(){
  this.dialogRef.updateSize("60%");
  this.__isVisible = !this.__isVisible;
}
}
