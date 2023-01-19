import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-docsModification',
  templateUrl: './docsModification.component.html',
  styleUrls: ['./docsModification.component.css']
})
export class DocsModificationComponent implements OnInit {
  __docsForm = new FormGroup({
    doc_type: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<DocsModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__docsForm.setValue({
        doc_type: this.data.doc_type,
        id: this.data.id
      });
    }
  }

  ngOnInit() {
  }
  submit() {
    if (this.__docsForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    this.__dbIntr.api_call(1, '/documenttypeAddEdit', this.__docsForm.value).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'Document type updated successfully' : 'Document type added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
}
