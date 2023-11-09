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
  minimize(){
    this.dialogRef.updateSize("40%",'47px');
    this.dialogRef.updatePosition({bottom: '0px', right: '0px' });
  }
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  reset(){
    this.__docsForm.reset();
  }
}
