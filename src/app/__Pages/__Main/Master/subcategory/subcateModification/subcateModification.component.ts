import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-subcateModification',
  templateUrl: './subcateModification.component.html',
  styleUrls: ['./subcateModification.component.css']
})
export class SubcateModificationComponent implements OnInit {
  __catMaster: any = [];
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
    public __dialog: MatDialog) {   
    this.getCategoryMaster();


  }

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
      return;
    }
    this.__dbIntr.api_call(1, '/subcategoryAddEdit', this.__subcatForm.value).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(this.data.id > 0 ? 'Subcategory updated successfully' : 'Subcategory added successfully', '');
    })
  }
  getCategoryMaster() {
    this.__dbIntr.api_call(0, '/category', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__catMaster = res;
    })
  }
}
