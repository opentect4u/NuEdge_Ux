import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
@Component({
  selector: 'master-formModification',
  templateUrl: './formModification.component.html',
  styleUrls: ['./formModification.component.css']
})
export class FormModificationComponent implements OnInit {
  __ProductMaster: any = [];
  __formTypeForm = new FormGroup({
    form_name: new FormControl('', [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<FormModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__formTypeForm.setValue({
        form_name: this.data.items.form_name,
        product_id: this.data.items.product_id,
        id: this.data.id
      });
    }
    this.getProductMaster();
  }

  ngOnInit() { }
  submit() {
    if (this.__formTypeForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/formtypeAddEdit', this.__formTypeForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      if (res == 1) {
        this.dialogRef.close(this.__formTypeForm.value);
      }
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__ProductMaster = res;
    })
  }

}
