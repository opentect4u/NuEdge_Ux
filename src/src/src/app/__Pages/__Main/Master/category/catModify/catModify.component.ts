import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
@Component({
  selector: 'app-catModify',
  templateUrl: './catModify.component.html',
  styleUrls: ['./catModify.component.css']
})
export class CatModifyComponent implements OnInit {
  __cateId: number = 0;
  __columns: string[] = ['sl_no', 'cat_name', 'edit', 'delete'];
  __selectCategory = new MatTableDataSource<category>([]);
  __ProductMaster:product[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __categoryForm = new FormGroup({
    product_id: new FormControl('', [Validators.required]),
    cat_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(public __route: ActivatedRoute,
    private __router: Router,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService) { this.previewlatestcategoryEntry(); this.getProductMaster()}

  ngOnInit() { this.previewParticularCategory(); }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  getProductMaster(){
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
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
        if (this.__cateId > 0) {
          if (this.__selectCategory.data.findIndex((x: category) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/catmodify/' + {queryParams:{id:btoa('0')}}, { skipLocationChange: false }).then(res => {
            // set logic if needed
           })
        }
        else {
          this.__selectCategory.data.unshift(res.data);
          this.__selectCategory._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__cateId > 0 ? 'Category updated successfully' : 'Category added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
    })

  }
  populateDT(__items: category) {
    this.setRNT(__items);
    this.__cateId = __items.id;
  }
  setRNT(__items: category) {
    this.__categoryForm.setValue({
      cat_name:__items.cat_name,
      product_id:__items.product_id,
      id: __items.id
    });
  }
  previewParticularCategory() {
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/category', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }
  previewlatestcategoryEntry() {
    this.__dbIntr.api_call(0, '/category', null).pipe((map((x: any) => x.data))).subscribe((res: category[]) => {
      this.populateCategory(res);
    })
  }
  populateCategory(_Rnts: category[]) {
    this.__selectCategory = new MatTableDataSource(_Rnts);
    this.__selectCategory._updateChangeSubscription();
    this.__selectCategory.paginator = this.paginator;
  }
  reset() {
    this.__categoryForm.reset();
    this.__categoryForm.patchValue({
      id: 0
    });
    this.__cateId = 0;
  }
  private updateRow(row_obj: category) {
    this.__selectCategory.data = this.__selectCategory.data.filter((value: category, key) => {
      if (value.id == row_obj.id) {
        value.cat_name = row_obj.cat_name;
        value.product_id = row_obj.product_id;
      }
      return true;
    });
  }
  showCorrospondingAMC(__rntDtls:rnt){
    this.__utility.navigatewithqueryparams('/main/master/subcategory',{queryParams:{id:btoa(__rntDtls.id.toString())}})
  }

}
