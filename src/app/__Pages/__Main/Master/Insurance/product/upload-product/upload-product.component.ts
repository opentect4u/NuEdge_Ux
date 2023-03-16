import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { insComp } from 'src/app/__Model/insComp';
import { insProduct } from 'src/app/__Model/insproduct';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.css']
})
export class UploadProductComponent implements OnInit {
  __insTypeMst: any=[]
  __cmpMst: insComp[] = [];
  allowedExtensions = ['csv', 'xlsx'];
  __productForm = new FormGroup({
    rntFile: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    file: new FormControl(''),
    ins_type_id: new FormControl('',[Validators.required]),
    company_id: new FormControl('',[Validators.required])
  });
  __prdMst = new MatTableDataSource<insProduct>([]);
  __columns:string[] = ['sl_no','product_name','edit'];
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Master",
      url:'/main/master/products',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.rtDt.snapshot.queryParamMap.get('product_id')) == '3' ?  "Insurance" : "Others",
      url:'/main/master/insurance',
      hasQueryParams:true,
      queryParams:{id:this.rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Product",
      url:'/main/master/insurance/product',
      hasQueryParams:false,
      queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Upload Product",
      url:'/main/master/insurance/uploadproduct',
      hasQueryParams:false,
      queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}
    }
];

  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'Product',
      header: 'Product Name',
      cell: (element: Record<string, any>) => `${element['Product']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      "Product": 'XXXXXXXX',
    },
  ]);
    constructor(
      public rtDt: ActivatedRoute,
      private __dbIntr: DbIntrService,
      private __utility: UtiliService
    ) { }

    ngOnInit(): void {
      this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getProductMst();
    this.getInsTypeMst();
    this.setBreadCrumbs();

  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  ngAfterViewInit(){
    this.__productForm.controls['ins_type_id'].valueChanges.subscribe(res =>{
      this.getcompanyMst(res);
    })
  }
  getInsTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
      console.log(res);

      this.__insTypeMst = res;
    })
  }
  getcompanyMst(res: string){
    this.__dbIntr.api_call(0,'/ins/company','ins_type_id='+res).pipe(pluck("data")).subscribe((res: insComp[]) =>{
      this.__cmpMst = res;
    })
  }
  getProductMst(){
    this.__dbIntr.api_call(0,'/ins/product',null).pipe(map((x: responseDT) => x.data))
    .subscribe((res: insProduct[]) => {
      this.__prdMst = new MatTableDataSource(res);
    });
  }
  populateDT(__el:insProduct){
    this.__utility.navigatewithqueryparams(
      '/main/master/insurance/product',
      { queryParams: {
        id: btoa(__el.id.toString()),
        product_id: this.rtDt.snapshot.queryParamMap.get('product_id')
      } }
    );
  }

  getFiles(__ev) {
    this.__productForm
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileSizeValidator(__ev.files),
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__productForm
      .get('file')
      ?.patchValue(
        this.__productForm.get('rntFile').status == 'VALID' ? __ev.files[0] : ''
      );
    // this.onFileDropped(__ev);
  }
  uploadProduct() {
    if (this.__productForm.invalid) {
      this.__utility.showSnackbar(
        'Please recheck the form again & resubmit',
        0
      );
      return;
    }
    const __productForm = new FormData();
    __productForm.append('file', this.__productForm.get('file').value);
    __productForm.append('ins_type_id', this.__productForm.get('ins_type_id').value);
    __productForm.append('company_id', this.__productForm.get('company_id').value);

    this.__dbIntr
      .api_call(1, '/ins/productimport', __productForm)
      .subscribe((res: responseDT) => {
        this.__utility.showSnackbar(
          res.suc == 1
            ? 'File Uploadation Successfull'
            : 'Something went wrong! please try again later',
          res.suc
        );
        if (res.suc == 1) {
          this.deleteFiles();
        }
      });
  }
  onFileDropped(__ev) {
    this.__productForm.get('file').patchValue('');
    this.__productForm.controls.rntFile.setErrors({
      checkRequire: __ev.files.length > 0 ? false : true,
    });
    this.__productForm.controls.rntFile.setErrors({
      checkSize: !fileValidators.fileSizeValidatorcopy(__ev.files),
    });
    fileValidators
      .fileExtensionValidatorcopy(this.allowedExtensions, __ev.files)
      .then((res) => {
        this.__productForm.get('rntFile').setErrors({ checkExt: !res });
        console.log(this.__productForm.get('rntFile').errors.checkExt);
        if (res) {
          if (
            __ev.files.length > 0 &&
            fileValidators.fileSizeValidatorcopy(__ev.files)
          ) {
            this.__productForm.get('file').patchValue(__ev.files[0]);
            this.__productForm.get('rntFile').clearValidators();
            this.__productForm.get('rntFile').updateValueAndValidity();
          }
        }
      });
  }
  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals: any = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteFiles() {
    this.__productForm.reset();
    this.__productForm.get('ins_type_id').updateValueAndValidity({emitEvent:false});
    this.__productForm
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__productForm.get('rntFile').updateValueAndValidity();
  }
}
