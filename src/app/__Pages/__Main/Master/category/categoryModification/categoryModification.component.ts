import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-categoryModification',
  templateUrl: './categoryModification.component.html',
  styleUrls: ['./categoryModification.component.css']
})
export class CategoryModificationComponent implements OnInit {
  __ProductMaster: any = [];
  __categoryForm = new FormGroup({
    product_id: new FormControl('', [Validators.required]),
     cat_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<CategoryModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {   
    if (this.data.id > 0) {
      this.__categoryForm.setValue({
        cat_name: this.data.items.cat_name,
        product_id: this.data.items.product_id,
        id: this.data.id
      });
    }
    this.getProductMaster();
  }

  ngOnInit() { }
  submit() {
    if (this.__categoryForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/categoryAddEdit', this.__categoryForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      if (res == 1) {
        this.dialogRef.close(this.__categoryForm.value);
      }
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__ProductMaster = res;
    })
  }

}
