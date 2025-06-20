import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.css']
})
export class ManualEntryComponent implements OnInit {
  __isVisible:boolean = false;
  swpForm = new FormGroup({
    swp_type_name: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.swp_type_name) : '',[Validators.required]),
    id:new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<ManualEntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  /**
   * * This function is used to toggle the visibility of the dialog.
   * * @returns void
   * * @memberof ManualEntryComponent
   * * @description
   * * This function is responsible for toggling the visibility of the dialog.
   * * * It updates the size and position of the dialog based on the current visibility state.
   * * * @example
   * * * // Usage: Call this function when the user clicks the toggle button on the dialog.
   * */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof ManualEntryComponent
   * * * @description
   * * * This function is responsible for maximizing the dialog by updating its size and toggling the visibility state.
   * * * @example
   * * * // Usage: Call this function when the user clicks the maximize button on the dialog.
   * 
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to toggle the full screen mode of the dialog.
   * * * @returns void
   * * * @memberof ManualEntryComponent
   * * * @description 
   * * * This function is responsible for toggling the full screen mode of the dialog.
   * * * It updates the size of the dialog to 60% and toggles the
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to submit the SWP Type form data.
   * * * @returns void
   * * * @memberof ManualEntryComponent
   */
  submitSwpType(){
    const swpType = new FormData();
    swpType.append('swp_type_name',this.swpForm.value.swp_type_name);
    swpType.append('id',this.swpForm.value.id);
    swpType.append('product_id',this.data.product_id);

    this.__dbIntr.api_call(1,'/swpTypeAddEdit',swpType).subscribe((res: any) =>{
      this.dialogRef.close({id:this.data.id,data:res.data});
      this.__utility.showSnackbar(res.suc == 1 ? 'SWP type submitted successfully' : res.msg,res.suc);
    })

  }
}
