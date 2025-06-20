import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-docsModification',
  templateUrl: './docsModification.component.html',
  styleUrls: ['./docsModification.component.css']
})
export class DocsModificationComponent implements OnInit {
  __isVisible:boolean = false;
  __docsForm = new FormGroup({
    doc_type: new FormControl(this.data.id > 0 ?this.data.doc_type : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<DocsModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
      this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
        if(this.data.id == res.id && this.data.flag == res.flag){
          this.__isVisible = res.isVisible
        }
      })
  }

  ngOnInit() {
  }
  /**
   * * * This function is responsible for submitting the document type form data to the server.
   * * * It checks if the form is valid, creates a FormData object, appends the form values to it,
   * * * and makes an API call to submit the data.
   * * * @returns void  
   */
  submit() {
    if (this.__docsForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __docType = new FormData();
    __docType.append("doc_type",this.__docsForm.value.doc_type);
    __docType.append("id",this.__docsForm.value.id);

    this.__dbIntr.api_call(1, '/documenttypeAddEdit', __docType).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
        this.reset();
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'Document type updated successfully' : 'Document type added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  /**
   * * * This function is responsible for resetting the document type form data.
   * * * It clears the form values and resets the form state.
   * * * @returns void
   */
  minimize(){
    this.dialogRef.updateSize("40%",'47px');
    this.dialogRef.updatePosition({bottom: '0px', right: '0px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof DocsModificationComponent
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to toggle the full screen mode of the dialog.
   * * * @returns void
   * * * @memberof DocsModificationComponent
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to reset the document type form fields to their initial values.
   * * * It sets the form controls to their default values and resets the form state.
   * * * @memberof DocsModificationComponent
   * * * @description
   * * * This function is responsible for resetting the document type form data.
   */
  reset(){
    this.__docsForm.reset();
  }
}
