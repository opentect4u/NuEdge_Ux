import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import dateslist from '../../../../../../assets/json/dates.json';
@Component({
  selector: 'app-scmModification',
  templateUrl: './scmModification.component.html',
  styleUrls: ['./scmModification.component.css']
})
export class ScmModificationComponent implements OnInit {
  __dates = dateslist;
  __isVisible:boolean = false;
  __amcMaster: amc[];
  __catMaster: category[];
  __subcatMaster: subcat[];
  __ProductMaster:product[] = [];

      settings = {
        singleSelection: false,
        idField: 'id',
        textField: 'date',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'Deselect All',
        allowSearchFilter: false,
        limitSelection: -1,
        clearSearchFilter: true,
        maxHeight: 197,
        itemsShowLimit: 3,
        searchPlaceholderText: 'Search',
        noDataAvailablePlaceholderText: 'No recors found',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false,
      };

  __scmForm = new FormGroup({
      category_id: new FormControl(this.data.id > 0 ? this.data.items.category_id : '', [Validators.required]),
    subcategory_id: new FormControl(this.data.id > 0 ? this.data.items.subcategory_id : '', [Validators.required]),
    product_id: new FormControl(this.data.product_id),
    amc_id: new FormControl(this.data.id > 0 ? this.data.items.amc_id : '', [Validators.required]),
    scheme_name: new FormControl(this.data.id > 0 ? this.data.items.scheme_name : '', [Validators.required]),
    scheme_type: new FormControl(this.data.scheme_type),
    dates: new FormControl(''),
    id: new FormControl(this.data.id),
    nfo_start_dt: new FormControl(this.data.id > 0 ? this.data.items.nfo_start_dt : '',this.data.scheme_type == 'N' ? [Validators.required] : []),
      nfo_end_dt: new FormControl(this.data.id > 0 ? this.data.items.nfo_end_dt : '',this.data.scheme_type == 'N' ? [Validators.required] : []),
      nfo_reopen_dt: new FormControl(this.data.id > 0 ? this.data.items.nfo_reopen_dt : '',this.data.scheme_type == 'N' ? [Validators.required] : []),
      pip_fresh_min_amt: new FormControl(this.data.id > 0 ? this.data.items.pip_fresh_min_amt : '',[Validators.required]),
      sip_fresh_min_amt: new FormControl(this.data.id > 0 ? this.data.items.sip_fresh_min_amt : '',[Validators.required]),
      pip_add_min_amt: new FormControl(this.data.id > 0 ? this.data.items.pip_add_min_amt : '',[Validators.required]),
      sip_add_min_amt: new FormControl(this.data.id > 0 ? this.data.items.sip_add_min_amt : '',[Validators.required]),
      gstin_no:new FormControl(this.data.id > 0 ? this.data.items.gstin_no : ''),
  })
  constructor(
    public dialogRef: MatDialogRef<ScmModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
      this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
        if(this.data.id == res.id && this.data.flag == res.flag){
          this.__isVisible = res.isVisible
        }
      })
      console.log(this.data.product_id);

    }

  ngOnInit() {
    this.getProductMaster();
    if(this.data.id > 0){
      this.getamcMasterbyproductId(this.data.items.product_id);
        this.getcatMasterbyproductId(this.data.items.product_id);
        this.getsubcatMasterbyproductId(this.data.items.category_id);
    }
    else{
      this.getamcMasterbyproductId(this.data.product_id);
      this.getcatMasterbyproductId(this.data.product_id);
    }
  }
  ngAfterViewInit(){
      /*--------------Trigger when Product changes---------------*/
      // this.__scmForm.controls["product_id"].valueChanges.subscribe(res => {
      //     this.getamcMasterbyproductId(res);
      //     this.getcatMasterbyproductId(res);
      //   this.__scmForm.controls["subcategory_id"].patchValue('');
      //   this.__subcatMaster = [];
      // })
      /*--------------End---------------*/

      /*--------------Trigger when Category changes---------------*/
      this.__scmForm.controls["category_id"].valueChanges.subscribe(res => {
        console.log(res);
        this.getsubcatMasterbyproductId(res);
      })
      /*--------------End---------------*/
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
  getProductMaster(){
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("100%");
    this.__isVisible = !this.__isVisible;
  }
  submit(){
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
        __scm.append("id",this.__scmForm.value.id);
        __scm.append("scheme_type", this.__scmForm.value.scheme_type);
        __scm.append("nfo_start_dt",this.__scmForm.value.nfo_start_dt);
      __scm.append("nfo_end_dt",this.__scmForm.value.nfo_end_dt);
      __scm.append("nfo_reopen_dt",this.__scmForm.value.nfo_reopen_dt);
      __scm.append("pip_fresh_min_amt",this.__scmForm.value.pip_fresh_min_amt);
      __scm.append("sip_fresh_min_amt",this.__scmForm.value.sip_fresh_min_amt);
      __scm.append("pip_add_min_amt",this.__scmForm.value.pip_add_min_amt);
      __scm.append("sip_add_min_amt",this.__scmForm.value.sip_add_min_amt);
      __scm.append("gstin_no",this.__scmForm.value.gstin_no);
        this.__dbIntr.api_call(1, '/schemeAddEdit', __scm).subscribe((res: any) => {
      if (res.suc == 1) {
           this.reset();
           this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Scheme updated successfully' : 'Scheme added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  reset(){
    this.__scmForm.reset();
  }

  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }
}
