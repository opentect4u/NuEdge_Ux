import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-upload-prd-type',
  templateUrl: './upload-prd-type.component.html',
  styleUrls: ['./upload-prd-type.component.css']
})
export class UploadPrdTypeComponent implements OnInit {
  allowedExtensions = ['csv', 'xlsx'];
  displayedColumns: Array<string> = [];

  tableData = new MatTableDataSource([
    {
      "product_type":"Annuity"
    }
  ]);
  tableColumns: Array<Column> = [
    {
      columnDef: 'Product Type',
      header: 'Product Type',
      cell: (element: Record<string, any>) => `${element['product_type']}`,
    }
  ]
  __uploadprdType = new FormGroup({
    ins_type_id: new FormControl(''),
    rntFile: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    file: new FormControl(''),
  });
  __columns: string[] = ['sl_no','product_type','edit'];
  __productTypeMst= new MatTableDataSource<insPrdType>([]);
  constructor(
    private __dbIntr: DbIntrService,
    public __rtDt: ActivatedRoute,
    private __utility: UtiliService
  ) { }
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
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '3' ?  "Insurance" : "Others",
      url:'/main/master/insurance',
      hasQueryParams:true,
      queryParams:{id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Product Type",
      url:'/main/master/insurance/producttype',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Upload Product Type",
      url:'/main/master/insurance/uploadproducttype',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
 instTypeMst: any=[];
  ngOnInit(): void {
    this.getProductType();
    this.setBreadCrumb();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getInsTypeMst();

  }
  getInsTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
    this.instTypeMst = res;
    })
  }
  setBreadCrumb(){
    this.__utility.getBreadCrumb(this.__brdCrmbs)
  }
  getProductType(){
   this.__dbIntr.api_call(0,'/ins/productType',null).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
    this.__productTypeMst = new MatTableDataSource(res.slice(0,5));
   })
  }
  populateDT(__el: insPrdType){
    this.__utility.navigatewithqueryparams(
      '/main/master/insurance/producttype',
      { queryParams: {
        id: btoa(__el.id.toString()),
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')
      } }
    );
  }

  getFiles(__ev) {
    this.__uploadprdType
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileSizeValidator(__ev.files),
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__uploadprdType
      .get('file')
      ?.patchValue(
        this.__uploadprdType.get('rntFile').status == 'VALID' ? __ev.files[0] : ''
      );
    // this.onFileDropped(__ev);
  }
  uploadRnt() {
    if (this.__uploadprdType.invalid) {
      this.__utility.showSnackbar(
        'Please recheck the form again & resubmit',
        0
      );
      return;
    }
    const __uploadprdType = new FormData();
    __uploadprdType.append('file', this.__uploadprdType.get('file').value);
    __uploadprdType.append('ins_type_id', this.__uploadprdType.get('ins_type_id').value);

    this.__dbIntr
      .api_call(1, '/ins/productTypeimport', __uploadprdType)
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
    this.__uploadprdType.get('file').patchValue('');
    this.__uploadprdType.controls.rntFile.setErrors({
      checkRequire: __ev.files.length > 0 ? false : true,
    });
    this.__uploadprdType.controls.rntFile.setErrors({
      checkSize: !fileValidators.fileSizeValidatorcopy(__ev.files),
    });
    fileValidators
      .fileExtensionValidatorcopy(this.allowedExtensions, __ev.files)
      .then((res) => {
        this.__uploadprdType.get('rntFile').setErrors({ checkExt: !res });
        console.log(this.__uploadprdType.get('rntFile').errors.checkExt);
        if (res) {
          if (
            __ev.files.length > 0 &&
            fileValidators.fileSizeValidatorcopy(__ev.files)
          ) {
            this.__uploadprdType.get('file').patchValue(__ev.files[0]);
            this.__uploadprdType.get('rntFile').clearValidators();
            this.__uploadprdType.get('rntFile').updateValueAndValidity();
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
    // this.__uploadprdType.reset();
  this.__uploadprdType.patchValue({
    file:'',
    rntFile:''
  })
    this.__uploadprdType
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__uploadprdType.get('rntFile').updateValueAndValidity();
  }
}
