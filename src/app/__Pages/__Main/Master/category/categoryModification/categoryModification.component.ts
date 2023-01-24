import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-categoryModification',
  templateUrl: './categoryModification.component.html',
  styleUrls: ['./categoryModification.component.css']
})
export class CategoryModificationComponent implements OnInit {
  __ProductMaster: product[];
  __categoryForm = new FormGroup({
    product_id: new FormControl('', [Validators.required]),
    cat_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<CategoryModificationComponent>,
    private __utility: UtiliService,
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
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __cat = new FormData();
    __cat.append("cat_name",this.__categoryForm.value.cat_name);
    __cat.append("product_id",this.__categoryForm.value.product_id);
    __cat.append("id",this.__categoryForm.value.id);

    this.__dbIntr.api_call(1, '/categoryAddEdit', __cat).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'Category updated successfully' : 'Category added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }

}
