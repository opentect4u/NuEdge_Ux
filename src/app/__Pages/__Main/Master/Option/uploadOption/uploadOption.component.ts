import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { option } from 'src/app/__Model/option';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-uploadOption',
  templateUrl: './uploadOption.component.html',
  styleUrls: ['./uploadOption.component.css'],
})
export class UploadOptionComponent implements OnInit {
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
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1' ?  "Mutual Fund" : "Others",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:{id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Option",
      url:'/main/master/productwisemenu/option',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Option Upload",
      url:'/main/master/productwisemenu/option/uploadOption',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
  displayedColumns: Array<string> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableColumns: Array<Column> = [
    {
      columnDef: 'opt_name',
      header: 'Option',
      cell: (element: Record<string, any>) => `${element['opt_name']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      opt_name: 'XXXXXXXX',
    },
  ]);
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    rntFile: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    file: new FormControl(''),
  });
  __columns: string[] = ['sl_no', 'opt_name', 'edit'];
  __selectOpt = new MatTableDataSource<option>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
    this.previewlatestOptEntry();

  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestOptEntry() {
    this.__dbIntr
      .api_call(0, '/option', null)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: option[]) => {
        this.__selectOpt = new MatTableDataSource(res);
        this.__selectOpt.paginator = this.paginator;
      });
  }

  populateDT(__items: option) {
    this.__utility.navigatewithqueryparams(
      '/main/master/productwisemenu/option',
      { queryParams: {
        id: btoa(__items.id.toString()),
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')
      } }
    );
  }
  getFiles(__ev) {
    this.__uploadRnt
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileSizeValidator(__ev.files),
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__uploadRnt
      .get('file')
      ?.patchValue(
        this.__uploadRnt.get('rntFile').status == 'VALID' ? __ev.files[0] : ''
      );
  }
  uploadRnt() {
    if (this.__uploadRnt.invalid) {
      this.__utility.showSnackbar(
        'Please recheck the form again & resubmit',
        0
      );
      return;
    }
    const __uploadRnt = new FormData();
    __uploadRnt.append('file', this.__uploadRnt.get('file').value);
    this.__dbIntr
      .api_call(1, '/optionimport', __uploadRnt)
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
    this.__uploadRnt.get('file').patchValue('');
    this.__uploadRnt.controls.rntFile.setErrors({
      checkRequire: __ev.files.length > 0 ? false : true,
    });
    this.__uploadRnt.controls.rntFile.setErrors({
      checkSize: !fileValidators.fileSizeValidatorcopy(__ev.files),
    });
    fileValidators
      .fileExtensionValidatorcopy(this.allowedExtensions, __ev.files)
      .then((res) => {
        this.__uploadRnt.get('rntFile').setErrors({ checkExt: !res });
        console.log(this.__uploadRnt.get('rntFile').errors.checkExt);
        if (res) {
          if (
            __ev.files.length > 0 &&
            fileValidators.fileSizeValidatorcopy(__ev.files)
          ) {
            this.__uploadRnt.get('file').patchValue(__ev.files[0]);
            this.__uploadRnt.get('rntFile').clearValidators();
            this.__uploadRnt.get('rntFile').updateValueAndValidity();
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
    this.__uploadRnt.reset();
    this.__uploadRnt
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__uploadRnt.get('rntFile').updateValueAndValidity();
  }
}