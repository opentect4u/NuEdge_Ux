import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'client_name',
      header: 'client_name',
      cell: (element: Record<string, any>) => `${element['client_name']}`
    },
    {
      columnDef: 'dob',
      header: 'dob',
      cell: (element: Record<string, any>) => `${element['dob']}`,
      isDate: true

    },
    {
      columnDef: 'add_line_1',
      header: 'add_line_1',
      cell: (element: Record<string, any>) => `${element['add_line_1']}`
    },
    {
      columnDef: 'add_line_2',
      header: 'add_line_2',
      cell: (element: Record<string, any>) => `${element['add_line_2']}`
    },
    {
      columnDef: 'city',
      header: 'city',
      cell: (element: Record<string, any>) => `${element['city']}`
    }
    ,
    {
      columnDef: 'dist',
      header: 'dist',
      cell: (element: Record<string, any>) => `${element['dist']}`
    }
    ,
    {
      columnDef: 'state',
      header: 'state',
      cell: (element: Record<string, any>) => `${element['state']}`
    }
    ,
    {
      columnDef: 'pincode',
      header: 'pincode',
      cell: (element: Record<string, any>) => `${element['pincode']}`
    }
    ,
    {
      columnDef: 'pan',
      header: 'pan',
      cell: (element: Record<string, any>) => `${element['pan']}`
    }
    ,
    {
      columnDef: 'mobile',
      header: 'mobile',
      cell: (element: Record<string, any>) => `${element['mobile']}`
    }
    ,
    {
      columnDef: 'sec_mobile',
      header: 'sec_mobile',
      cell: (element: Record<string, any>) => `${element['sec_mobile']}`
    }
    ,
    {
      columnDef: 'email',
      header: 'email',
      cell: (element: Record<string, any>) => `${element['email']}`
    }
    ,
    {
      columnDef: 'sec_email',
      header: 'sec_email',
      cell: (element: Record<string, any>) => `${element['sec_email']}`
    }
    ,
    {
      columnDef: 'client_type',
      header: 'client_type',
      cell: (element: Record<string, any>) => `${element['client_type']}`
    }
    ,
    {
      columnDef: 'guardians_name',
      header: 'guardians_name',
      cell: (element: Record<string, any>) => `${element['guardians_name']}`
    }
    ,
    {
      columnDef: 'guardians_pan',
      header: 'guardians_pan',
      cell: (element: Record<string, any>) => `${element['guardians_pan']}`
    }
    ,
    {
      columnDef: 'relation',
      header: 'relation',
      cell: (element: Record<string, any>) => `${element['relation']}`
    }
  ];
  tableData = new MatTableDataSource(
    [
      { "client_name": "XXXXXX", "dob": "1980-02-01", "add_line_1": "No. 1858\/1,  Rajdanga Main Road", "add_line_2": '', "city": "1", "dist": "3", "state": "28", "pincode": "700107", "pan": "WXYZW1234J", "mobile": "8789652157", "sec_mobile": '', "email": "testpub01@gmail.com", "sec_email": '', "client_type": "P", "guardians_pan": '', "guardians_name": '', "relation": '' },
      { "client_name": "XXXXXXXX", "dob": "1978-01-01", "add_line_1": "Dum Dum Canton ment", "add_line_2": '', "city": "1", "dist": "3", "state": "28", "pincode": "700110", "pan": '', "mobile": "7777777777", "sec_mobile": '', "email": "mondal.tanmoy@synergicsoftek.in", "sec_email": '', "client_type": "N", "guardians_pan": '', "guardians_name": '', "relation": '' },
      { "client_name": "XXXXXXXXX", "dob": '', "add_line_1": '', "add_line_2": '', "city": '', "dist": '', "state": '', "pincode": '', "pan": '', "mobile": '', "sec_mobile": '', "email": '', "sec_email": '', "client_type": "E", "guardians_pan": '', "guardians_name": '', "relation": '' },
      { "client_name": "XXXXXXXXXXXXXXX", "dob": "2022-01-01", "add_line_1": "Rashbihari Avenue", "add_line_2": '', "city": "1", "dist": "3", "state": "28", "pincode": "700000", "pan": '', "mobile": "8888888888", "sec_mobile": '', "email": "test@gmail.com", "sec_email": '', "client_type": "M", "guardians_pan": "ABCDE1234K", "guardians_name": "Test", "relation": "XXXX" }
    ]
  );
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    rntFile: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    file: new FormControl('')
  })
  __columns: string[] = ['sl_no', 'client_name', 'edit', 'delete'];
  __selectClient = new MatTableDataSource<client>([]);
  constructor(private __dbIntr: DbIntrService, private __utility: UtiliService) { this.previewlatestRntEntry(); }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
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
