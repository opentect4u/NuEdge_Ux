import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-subcateModification',
  templateUrl: './subcateModification.component.html',
  styleUrls: ['./subcateModification.component.css']
})
export class SubcateModificationComponent implements OnInit {
  __catMaster: category[] = [];
  __subcatForm = new FormGroup({
    category_id: new FormControl('', [Validators.required]),
    subcategory_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<SubcateModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {this.getCategoryMaster();}

  ngOnInit() {
    if (this.data.id > 0) {
      this.__subcatForm.setValue({
        subcategory_name: this.data.items.subcategory_name,
        category_id: this.data.items.category_id,
        id: this.data.id
      });
    }
  }
  submit() {
    if (this.__subcatForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __subcat = new FormData();
    __subcat.append("subcategory_name",this.__subcatForm.value.subcategory_name);
    __subcat.append("category_id",this.__subcatForm.value.category_id);
    __subcat.append("id",this.__subcatForm.value.id);
    this.__dbIntr.api_call(1, '/subcategoryAddEdit', __subcat).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'Subcategory updated successfully' : 'Subcategory added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  getCategoryMaster() {
    this.__dbIntr.api_call(0, '/category', null).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.__catMaster = res;
    })
  }
}
