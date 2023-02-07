import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
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
  __isVisible:boolean = false;
  __ProductMaster: product[];
  __categoryForm = new FormGroup({
    product_id: new FormControl(this.data.id > 0 ? this.data.items.product_id : '', [Validators.required]),
    cat_name: new FormControl(this.data.id > 0 ? this.data.items.cat_name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<CategoryModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {

    this.getProductMaster();
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      console.log(res);
      // this.__isVisible = res;
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
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
        this.reset();
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'Category updated successfully' : 'Category added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
  reset(){
    this.__categoryForm.reset();
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
}
