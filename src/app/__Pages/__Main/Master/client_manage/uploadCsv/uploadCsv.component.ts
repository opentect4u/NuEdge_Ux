import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';


@Component({
  selector: 'app-uploadCsv',
  templateUrl: './uploadCsv.component.html',
  styleUrls: ['./uploadCsv.component.css']
})
export class UploadCsvComponent implements OnInit {
  __brdCrmbs: breadCrumb[] =[
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operations',
      url: '/main/master/mstOperations',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Client Master',
      url: '/main/master/clntMstHome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Create Client Code',
      url: '/main/master/clOption',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label:
      atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'E' ? 'Existing'
      : atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'M' ? "Minor"
      : atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'P' ? 'Pan Holder' : 'Non Pan Holder',
      url: '/main/master/clientmaster',
      hasQueryParams: true,
      queryParams: {flag:this.__rtDt.snapshot.queryParamMap.get('flag')},
    },
    {
      label:
      atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'E' ? 'Existing Client Upload'
      : atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'M' ? "Minor Client Upload"
      : atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'P' ? 'Pan Holder Client Upload' : 'Non Pan Holder Client Upload',
      url: '/main/master/clUploadCsv',
      hasQueryParams: true,
      queryParams: {flag:this.__rtDt.snapshot.queryParamMap.get('flag')},
    }
  ]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'client_name',
      header: 'Client Name',
      cell: (element: Record<string, any>) => `${element['client_name']}`
    },
    {
      columnDef: 'pan',
      header: 'PAN',
      cell: (element: Record<string, any>) => `${element['pan']}`
    }
  ];
  tableData = new MatTableDataSource(
    [{
      client_name:"Suman Mitra",
      pan:"XXXXX1234X"
    }]
  );
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    rntFile: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    file: new FormControl('')
  })
  __columns: string[] = ['sl_no', 'client_name', 'edit'];
  __selectClient = new MatTableDataSource<client>([]);
  constructor(
    public __rtDt: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService) { this.previewlatestRntEntry(); }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestRntEntry() {
    this.__dbIntr.api_call(0, '/client', null).pipe(pluck('data')).subscribe((res: client[]) => {
      this.__selectClient = new MatTableDataSource(res);
      this.__selectClient.paginator =this.paginator;

    })
  }
  populateDT(__items: client) {
    this.__utility.navigatewithqueryparams('/main/master/clientmaster', { queryParams: { flag: btoa(__items.client_type), id: btoa(__items.id.toString()) } })
  }
  getFiles(__ev) {
    this.__uploadRnt.get('rntFile').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.files), fileValidators.fileExtensionValidator(this.allowedExtensions)]);
    this.__uploadRnt.get('file')?.patchValue(this.__uploadRnt.get('rntFile').status == 'VALID' ? __ev.files[0] : '');
    // this.onFileDropped(__ev);
  }
  uploadRnt() {

    if (this.__uploadRnt.invalid) {
      this.__utility.showSnackbar("Please recheck the form again & resubmit", 0);
      return
    }
    const __uploadRnt = new FormData();
    __uploadRnt.append('file', this.__uploadRnt.get('file').value);
    this.__dbIntr.api_call(1, '/clientimport', __uploadRnt).subscribe((res: responseDT) => {
      this.__utility.showSnackbar(res.suc == 1 ? 'File Uploadation Successfull' : 'Something went wrong! please try again later', res.suc);
      if (res.suc == 1) {
        this.deleteFiles();
      }
    })
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
