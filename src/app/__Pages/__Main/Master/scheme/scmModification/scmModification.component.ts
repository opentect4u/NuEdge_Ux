import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-scmModification',
  templateUrl: './scmModification.component.html',
  styleUrls: ['./scmModification.component.css']
})
export class ScmModificationComponent implements OnInit {
  __prdMaster: product[];
  __amcMaster: amc[];
  __catMaster: category[];
  __subcatMaster: subcat[];
  __scmForm = new FormGroup({
    category_id: new FormControl('', [Validators.required]),
    subcategory_id: new FormControl('', [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
    amc_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<ScmModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    this.getproductMaster();
    if (this.data.id > 0) {
      this.getamcMasterbyproductId(this.data.items.product_id);
      this.getcatMasterbyproductId(this.data.items.product_id);
      this.getsubcatMasterbyproductId(this.data.items.category_id);
      this.__scmForm.setValue({
        product_id: this.data.items.product_id,
        amc_id: this.data.items.amc_id,
        category_id: this.data.items.category_id,
        subcategory_id: this.data.items.subcategory_id,
        scheme_name: this.data.items.scheme_name,
        id: this.data.id
      });
    }
  }

  ngOnInit() { }
  submit() {
    if (this.__scmForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __scm =new FormData();
    __scm.append("product_id", this.__scmForm.value.product_id);
        __scm.append("amc_id", this.__scmForm.value.amc_id);
       __scm.append("category_id", this.__scmForm.value.category_id);
        __scm.append("subcategory_id", this.__scmForm.value.subcategory_id);
        __scm.append("scheme_name", this.__scmForm.value.scheme_name);
        __scm.append("id", this.data.id);

    this.__dbIntr.api_call(1, '/schemeAddEdit', __scm).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'Scheme updated successfully' : 'Scheme added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  ngAfterViewInit() {
    /*--------------Trigger when Product changes---------------*/
    this.__scmForm.controls["product_id"].valueChanges.subscribe(res => {
      this.getamcMasterbyproductId(res);
      this.getcatMasterbyproductId(res);
      this.__scmForm.controls["subcategory_id"].patchValue('');
      this.__subcatMaster = [];
    })
    /*--------------End---------------*/

    /*--------------Trigger when Category changes---------------*/
    this.__scmForm.controls["category_id"].valueChanges.subscribe(res => {
      this.getsubcatMasterbyproductId(res);
    })
    /*--------------End---------------*/
  }
  private getproductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__prdMaster = res;
    })
  }
  private getamcMasterbyproductId(product_id) {
    this.__dbIntr.api_call(0, '/amcUsingPro', 'product_id=' + product_id).pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.__amcMaster = res;
    })
  }
  private getcatMasterbyproductId(product_id) {
    this.__dbIntr.api_call(0, '/catUsingPro', 'product_id=' + product_id).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.__catMaster = res;
    })
  }
  private getsubcatMasterbyproductId(cat_id) {
    this.__dbIntr.api_call(0, '/subcatUsingPro', 'category_id=' + cat_id).pipe(map((x: responseDT) => x.data)).subscribe((res: subcat[]) => {
      this.__subcatMaster = res;
    })
  }
}
