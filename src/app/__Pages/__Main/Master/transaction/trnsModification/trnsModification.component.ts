import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-trnsModification',
  templateUrl: './trnsModification.component.html',
  styleUrls: ['./trnsModification.component.css']
})
export class TrnsModificationComponent implements OnInit {
  __transTypeMaster: any = [];
  __trnsForm = new FormGroup({
    trans_id: new FormControl('', [Validators.required]),
    trns_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  __isVisible:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TrnsModificationComponent>,
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
      // console.log(this.data);
      this.__trnsForm.patchValue({
        trans_id: this.data.items.trans_type_id,
        trns_name: this.data.items.trns_name,
        id: this.data.id
      });
    }
    this.getTransactionTypeMaster();
  }

  ngOnInit() { }
  /**
   * * This function is responsible for submitting the transaction form data to the server.
   * * It checks if the form is valid, creates a FormData object, appends the form values to it,
   * * and makes an API call to submit the data.
   * * @returns void
   */
  submit() {
    if (this.__trnsForm.invalid) {
      return;
    }
    const __trns = new FormData();
    __trns.append('trans_type_id',this.__trnsForm.value.trans_id);
    __trns.append('trns_name',this.__trnsForm.value.trns_name);
    __trns.append('id',this.__trnsForm.value.id);

    this.__dbIntr.api_call(1, '/transctionAddEdit', __trns).subscribe((res: any) => {
      if (res.suc == 1) {
        // this.reset();
        this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Transaction  updated successfully' : 'Transaction added successfully') : 'Something went wrong! please try again later', res.suc);
      // this.reset();
    })
  }
  /**
   * * This function is used to fetch the transaction type master data from the server.
   * * It makes an API call to retrieve the data and assigns it to the __transTypeMaster variable.
   * * @returns void
   * * @memberof TrnsModificationComponent
   */
  getTransactionTypeMaster() {
    this.__dbIntr.api_call(0, '/transctiontype', 'product_id='+this.data.product_id).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__transTypeMaster = res;
    })
  }
  /**
   * * This function is used to toggle the visibility of the dialog.
   * * It updates the size and position of the dialog based on the current visibility state.
   * * @returns void
   * * @memberof TrnsModificationComponent
   */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * This function is used to maximize the dialog.
   * * It updates the size of the dialog to 40% and toggles the visibility state.
   * * @returns void
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * This function is used to toggle the full screen mode of the dialog.
   * * It updates the size of the dialog to 60% and toggles the visibility state.
   * * @returns void
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
}
