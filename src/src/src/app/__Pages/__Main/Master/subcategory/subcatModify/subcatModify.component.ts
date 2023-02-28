import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
@Component({
  selector: 'app-subcatModify',
  templateUrl: './subcatModify.component.html',
  styleUrls: ['./subcatModify.component.css']
})
export class SubcatModifyComponent implements OnInit {
  __subcateId: number = 0;
  __columns: string[] = ['sl_no', 'subcat', 'edit', 'delete'];
  __selectCategory = new MatTableDataSource<subcat>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  __catMaster: category[] = [];
  __subcatForm = new FormGroup({
    category_id: new FormControl('', [Validators.required]),
    subcategory_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(public __route: ActivatedRoute,
    private __router: Router,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService) { this.previewlatestsubcategoryEntry(); this.getCategoryMaster()}

  ngOnInit() { this.previewParticularCategory(); }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  getCategoryMaster(){
    this.__dbIntr.api_call(0, '/category', null).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.__catMaster = res;
    })
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
        if (this.__subcateId > 0) {
          if (this.__selectCategory.data.findIndex((x: subcat) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/subcatModify' + {queryParams:{id:btoa('0')}}, { skipLocationChange: false }).then(res => {
            // set logic if needed
           })
        }
        else {
          this.__selectCategory.data.unshift(res.data);
          this.__selectCategory._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__subcateId > 0 ? 'sub Category updated successfully' : 'sub Category added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
    })

  }
  populateDT(__items: subcat) {
    this.setRNT(__items);
    this.__subcateId = __items.id;
  }
  setRNT(__items: subcat) {
    this.__subcatForm.setValue({
      subcategory_name:__items.subcategory_name,
        category_id:__items.category_id,
        id:__items.id
    });
  }
  previewParticularCategory() {
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/subcategory', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
      })
    }
  }
  previewlatestsubcategoryEntry() {
    this.__dbIntr.api_call(0, '/subcategory', null).pipe((map((x: any) => x.data))).subscribe((res: subcat[]) => {
      this.populateCategory(res);
    })
  }
  populateCategory(_Rnts: subcat[]) {
    this.__selectCategory = new MatTableDataSource(_Rnts);
    this.__selectCategory._updateChangeSubscription();
    this.__selectCategory.paginator = this.paginator;
  }
  reset() {
    this.__subcatForm.reset();
    this.__subcatForm.patchValue({
      id: 0
    });
    this.__subcateId = 0;
  }
  private updateRow(row_obj: subcat) {
    this.__selectCategory.data = this.__selectCategory.data.filter((value: subcat, key) => {
      if (value.id == row_obj.id) {
        value.subcategory_name = row_obj.subcategory_name;
        value.category_id = row_obj.category_id
      }
      return true;
    });
  }
}
