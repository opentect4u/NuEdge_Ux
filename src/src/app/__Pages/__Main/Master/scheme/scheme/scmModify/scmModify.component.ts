import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
@Component({
  selector: 'app-scmModify',
  templateUrl: './scmModify.component.html',
  styleUrls: ['./scmModify.component.css']
})
export class ScmModifyComponent implements OnInit {
  __flag : string =atob(this.__route.snapshot.queryParamMap.get('flag')) 
  __amcMaster: amc[];
  __catMaster: category[];
  __subcatMaster: subcat[];
  __scmId: number = 0;
  __columns: string[] = ['sl_no', 'scm_name', 'edit', 'delete'];
  __selectScheme = new MatTableDataSource<scheme>([]);
  __ProductMaster:product[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __scmForm = new FormGroup({
    category_id: new FormControl('', [Validators.required]),
    subcategory_id: new FormControl('', [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
    amc_id: new FormControl('', [Validators.required]),
    scheme_name: new FormControl('', [Validators.required]),
    scheme_type: new FormControl(atob(this.__route.snapshot.queryParamMap.get('flag'))),
    id: new FormControl(0),
    nfo_start_dt: new FormControl('',atob(this.__route.snapshot.queryParamMap.get('flag')) == 'N' ? [Validators.required] : []),
      nfo_end_dt: new FormControl('',atob(this.__route.snapshot.queryParamMap.get('flag')) == 'N' ? [Validators.required] : []),
      nfo_reopen_dt: new FormControl('',atob(this.__route.snapshot.queryParamMap.get('flag')) == 'N' ? [Validators.required] : []),
      pip_fresh_min_amt: new FormControl('',[Validators.required]),
      sip_fresh_min_amt: new FormControl('',[Validators.required]),
      pip_add_min_amt: new FormControl('',[Validators.required]),
      sip_add_min_amt: new FormControl('',[Validators.required]),
      isin_no:new FormControl('',[Validators.required]),
  })
  constructor(public __route: ActivatedRoute,
    private __router: Router,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService) {
      this.previewlatestschemeEntry(); 
      this.getProductMaster()
    }

  ngOnInit() { this.previewParticularScheme(); }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  getProductMaster(){
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }

  ngAfterViewInit() {
    /*--------------Trigger when Product changes---------------*/
    this.__scmForm.controls["product_id"].valueChanges.subscribe(res => {
      console.log(res);
        this.getamcMasterbyproductId(res);
        this.getcatMasterbyproductId(res);
      this.__scmForm.controls["subcategory_id"].patchValue('');
      this.__subcatMaster = [];
    })
    /*--------------End---------------*/

    /*--------------Trigger when Category changes---------------*/
    this.__scmForm.controls["category_id"].valueChanges.subscribe(res => {
      console.log(res);
      this.getsubcatMasterbyproductId(res);
    })
    /*--------------End---------------*/
  }
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
        __scm.append("id",this.__scmForm.value.id);
        __scm.append("scheme_type", this.__scmForm.value.scheme_type);
        __scm.append("nfo_start_dt",this.__scmForm.value.nfo_start_dt);
      __scm.append("nfo_end_dt",this.__scmForm.value.nfo_end_dt);
      __scm.append("nfo_reopen_dt",this.__scmForm.value.nfo_reopen_dt);
      __scm.append("pip_fresh_min_amt",this.__scmForm.value.pip_fresh_min_amt);
      __scm.append("sip_fresh_min_amt",this.__scmForm.value.sip_fresh_min_amt);
      __scm.append("pip_add_min_amt",this.__scmForm.value.pip_add_min_amt);
      __scm.append("sip_add_min_amt",this.__scmForm.value.sip_add_min_amt);
      __scm.append("isin_no",this.__scmForm.value.isin_no);
        this.__dbIntr.api_call(1, '/schemeAddEdit', __scm).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this.__scmId > 0) {
          if (this.__selectScheme.data.findIndex((x: scheme) => x.id == res.data.id) != -1) {
            this.updateRow(res.data);
          }
          //if the particular id is not presenet in current list then only route by url with out doing any changes
          this.__router.navigateByUrl('/main/master/scmModify/' + {queryParams:{id:btoa('0')}}, { skipLocationChange: false }).then(res => {
            // set logic if needed
           })
        }
        else {
          this.__selectScheme.data.unshift(res.data);
          this.__selectScheme._updateChangeSubscription();
        }
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__scmId > 0 ? 'Category updated successfully' : 'Category added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
    })

  }
  populateDT(__items: scheme) {
    this.__scmForm.patchValue({
      product_id:__items.product_id});
    console.log(__items);
    this.setRNT(__items);
    this.__scmId = __items.id;
  }
  setRNT(__items: scheme) {
        this.__scmForm.patchValue({
        scheme_name: __items.scheme_name,
        id: __items.id,
        scheme_type:__items.scheme_type,
        nfo_start_dt:__items.nfo_start_dt!= 'null' ? __items.nfo_start_dt  : '' ,
        nfo_end_dt:__items.nfo_end_dt!= 'null' ? __items.nfo_end_dt  : '' ,
        nfo_reopen_dt:__items.nfo_reopen_dt!= 'null' ? __items.nfo_reopen_dt  : '' ,
        pip_fresh_min_amt:__items.pip_fresh_min_amt,
        sip_fresh_min_amt:__items.sip_fresh_min_amt,
        pip_add_min_amt:__items.pip_add_min_amt,
        sip_add_min_amt:__items.sip_add_min_amt,
        isin_no:__items.isin_no,
        amc_id: __items.amc_id,
        category_id: __items.category_id,
        subcategory_id: __items.subcategory_id,

    });
    // setTimeout(() => {
    //   this.__scmForm.patchValue({

    //   })
    // }, 1000);

    console.log(this.__scmForm.value);
    
  }
  previewParticularScheme() {
    if (this.__route.snapshot.queryParamMap.get('id') != null) {
      this.__dbIntr.api_call(0, '/scheme', 'id=' + atob(this.__route.snapshot.queryParamMap.get('id'))).pipe(map((x: any) => x.data)).subscribe(res => {
        this.populateDT(res[0]);
        // this.getamcMasterbyproductId(res[0].product_id);
        // this.getcatMasterbyproductId(res[0].product_id);
        // this.getsubcatMasterbyproductId(res[0].category_id);
      })
     
    }
  }
  previewlatestschemeEntry() {
    this.__dbIntr.api_call(0, '/scheme', 'scheme_type='+atob(this.__route.snapshot.queryParamMap.get('flag'))).pipe((map((x: any) => x.data))).subscribe((res: scheme[]) => {
      this.populateCategory(res);
    })
  }
  populateCategory(_Rnts: scheme[]) {
    this.__selectScheme = new MatTableDataSource(_Rnts);
    this.__selectScheme._updateChangeSubscription();
    this.__selectScheme.paginator = this.paginator;
  }
  reset() {
    this.__scmForm.reset();
    this.__scmForm.patchValue({
      id: 0,
      scheme_type:atob(this.__route.snapshot.queryParamMap.get('flag'))
    });
    this.__scmId = 0;
  }
  private updateRow(row_obj: scheme) {
    this.__selectScheme.data = this.__selectScheme.data.filter((value: scheme, key) => {
      if (value.id == row_obj.id) {
        value.product_id= row_obj.product_id,
        value.amc_id= row_obj.amc_id,
        value.category_id= row_obj.category_id,
        value.subcategory_id= row_obj.subcategory_id,
        value.scheme_name= row_obj.scheme_name,
        value.id= row_obj.id,
        value.scheme_type=row_obj.scheme_type,
        value.nfo_start_dt=row_obj.nfo_start_dt,
        value.nfo_end_dt=row_obj.nfo_end_dt,
        value.nfo_reopen_dt=row_obj.nfo_reopen_dt,
        value.pip_fresh_min_amt=row_obj.pip_fresh_min_amt,
        value.sip_fresh_min_amt=row_obj.sip_fresh_min_amt,
        value.pip_add_min_amt=row_obj.pip_add_min_amt,
        value.sip_add_min_amt=row_obj.sip_add_min_amt,
        value.isin_no=row_obj.isin_no
      }
      return true;
    });
  }
  showCorrospondingAMC(__rntDtls:rnt){
    this.__utility.navigatewithqueryparams('/main/master/subcategory',{queryParams:{id:btoa(__rntDtls.id.toString())}})
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
