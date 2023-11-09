import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
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
  __isVisible:boolean = false;
  __catMaster: category[] = [];
  __subcatForm = new FormGroup({
    category_id: new FormControl(this.data.id > 0 ? this.data.items.category_id : '', [Validators.required]),
    subcategory_name: new FormControl(this.data.id > 0 ? this.data.items.subcategory_name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<SubcateModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
      this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
        if(this.data.id == res.id && this.data.flag == res.flag){
          this.__isVisible = res.isVisible
        }
      })
    }

  ngOnInit() {this.getCategoryMaster();this.disabledFormControl();}
  disabledFormControl(){
    if(this.data.id > 0){
      this.__subcatForm.controls['category_id'].disable({onlySelf:true,emitEvent:false});
    }
  }
  submit() {
    if (this.__subcatForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __subcat = new FormData();
    __subcat.append("subcategory_name",this.__subcatForm.value.subcategory_name);
    __subcat.append("category_id",this.__subcatForm.getRawValue().category_id);
    __subcat.append("id",this.__subcatForm.value.id);
    this.__dbIntr.api_call(1, '/subcategoryAddEdit', __subcat).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
        this.reset();
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Subcategory updated successfully' : 'Subcategory added successfully') : res.msg, res.suc);
    })
  }
  getCategoryMaster() {
    this.__dbIntr.api_call(0, '/category', null).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.__catMaster = res;
    })
  }
  reset(){
    this.__subcatForm.reset();
  }
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
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
