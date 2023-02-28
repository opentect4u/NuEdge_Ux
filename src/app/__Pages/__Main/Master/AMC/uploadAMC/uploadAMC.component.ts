import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
@Component({
  selector: 'app-uploadAMC',
  templateUrl: './uploadAMC.component.html',
  styleUrls: ['./uploadAMC.component.css'],
})
export class UploadAMCComponent implements OnInit {

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
      label:"AMC",
      url:'/main/master/productwisemenu/amc',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"AMC Upload",
      url:'/main/master/productwisemenu/amc/amcUpload',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]


  displayedColumns: Array<string> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableColumns: Array<Column> = [
    {
      columnDef: 'R&T_id',
      header: 'rnt_id',
      cell: (element: Record<string, any>) => `${element['rnt_id']}`,
    },
    {
      columnDef: 'product_id',
      header: 'product_id',
      cell: (element: Record<string, any>) => `${element['product_id']}`,
      isDate: true,
    },
    {
      columnDef: 'amc_name',
      header: 'amc_name',
      cell: (element: Record<string, any>) => `${element['amc_name']}`,
    },
    {
      columnDef: 'website',
      header: 'website',
      cell: (element: Record<string, any>) => `${element['website']}`,
    },
    {
      columnDef: 'ofc_addr',
      header: 'ofc_addr',
      cell: (element: Record<string, any>) => `${element['ofc_addr']}`,
    },
    {
      columnDef: 'cus_care_no',
      header: 'cus_care_no',
      cell: (element: Record<string, any>) => `${element['cus_care_no']}`,
    },
    {
      columnDef: 'sip_start_date',
      header: 'sip_start_date',
      cell: (element: Record<string, any>) => `${element['sip_start_date']}`,
    },
    {
      columnDef: 'sip_end_date',
      header: 'sip_end_date',
      cell: (element: Record<string, any>) => `${element['sip_end_date']}`,
    },
    {
      columnDef: 'cus_care_email',
      header: 'cus_care_email',
      cell: (element: Record<string, any>) => `${element['cus_care_email']}`,
    },
    {
      columnDef: 'l1_name',
      header: 'l1_name',
      cell: (element: Record<string, any>) => `${element['l1_name']}`,
    },
    {
      columnDef: 'l1_contact_no',
      header: 'l1_contact_no',
      cell: (element: Record<string, any>) => `${element['l1_contact_no']}`,
    },
    {
      columnDef: 'l1_email',
      header: 'l1_email',
      cell: (element: Record<string, any>) => `${element['l1_email']}`,
    },
    {
      columnDef: 'l2_name',
      header: 'l2_name',
      cell: (element: Record<string, any>) => `${element['l2_name']}`,
    },
    {
      columnDef: 'l2_contact_no',
      header: 'l2_contact_no',
      cell: (element: Record<string, any>) => `${element['l2_contact_no']}`,
    },
    {
      columnDef: 'l2_email',
      header: 'l2_email',
      cell: (element: Record<string, any>) => `${element['l2_email']}`,
    },
    {
      columnDef: 'l3_name',
      header: 'l3_name',
      cell: (element: Record<string, any>) => `${element['l3_name']}`,
    },
    {
      columnDef: 'l3_contact_no',
      header: 'l3_contact_no',
      cell: (element: Record<string, any>) => `${element['l3_contact_no']}`,
    },
    {
      columnDef: 'l3_email',
      header: 'l3_email',
      cell: (element: Record<string, any>) => `${element['l3_email']}`,
    },
    {
      columnDef: 'l4_name',
      header: 'l4_name',
      cell: (element: Record<string, any>) => `${element['l4_name']}`,
    },
    {
      columnDef: 'l4_contact_no',
      header: 'l4_contact_no',
      cell: (element: Record<string, any>) => `${element['l4_contact_no']}`,
    },
    {
      columnDef: 'l4_email',
      header: 'l4_email',
      cell: (element: Record<string, any>) => `${element['l4_email']}`,
    },
    {
      columnDef: 'l5_name',
      header: 'l5_name',
      cell: (element: Record<string, any>) => `${element['l5_name']}`,
    },
    {
      columnDef: 'l5_contact_no',
      header: 'l5_contact_no',
      cell: (element: Record<string, any>) => `${element['l5_contact_no']}`,
    },
    {
      columnDef: 'l5_email',
      header: 'l5_email',
      cell: (element: Record<string, any>) => `${element['l5_email']}`,
    },
    {
      columnDef: 'l6_name',
      header: 'l6_name',
      cell: (element: Record<string, any>) => `${element['l6_name']}`,
    },
    {
      columnDef: 'l6_contact_no',
      header: 'l6_contact_no',
      cell: (element: Record<string, any>) => `${element['l6_contact_no']}`,
    },
    {
      columnDef: 'l6_email',
      header: 'l6_email',
      cell: (element: Record<string, any>) => `${element['l6_email']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      amc_name: 'HDFC Mutual Fund',
      created_at: '2023-02-01T06:07:38.000000Z',
      created_by: 0,
      cus_care_email: 'hello@hdfcfund.com',
      cus_care_no: 180030106767,
      id: 11,
      l1_contact_no: 9831348519,
      l1_email: 'ashishb@hdfcfund.com',
      l1_name: 'Ashish Bhatia',
      l2_contact_no: 9748513090,
      l2_email: 'servicesssouthkolkata@hdfcfund.com',
      l2_name: 'Nabanita Deb',
      l3_contact_no: 9734133268,
      l3_email: 'servicesssouthkolkata@hdfcfund.com',
      l3_name: 'Debobroto Chatterjee',
      l4_contact_no: 9734133268,
      l4_email: 'servicesssouthkolkata@hdfcfund.com',
      l4_name: 'Debobroto Chatterjee',
      l5_contact_no: null,
      l5_email: null,
      l5_name: null,
      l6_contact_no: null,
      l6_email: null,
      l6_name: null,
      l7_contact_no: null,
      l7_email: null,
      l7_name: null,
      ofc_addr: 'G2, Thapar House, 163, S.P.Mukherjee Road, Kolkata-700026',
      product_id: 1,
      rnt_id: 1,
      sip_end_date: '2023-02-28',
      sip_start_date: '2023-02-01',
      updated_at: '2023-02-01T06:07:38.000000Z',
      updated_by: null,
      website: 'www.hdfcfund.com',
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
  __columns: string[] = ['sl_no', 'amc_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<amc>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
    this.previewlatestRntEntry();
  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestRntEntry() {
    this.__dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.__selectRNT = new MatTableDataSource(res);
        this.__selectRNT.paginator = this.paginator;
      });
  }

  populateDT(__items: amc) {
    this.__utility.navigatewithqueryparams('main/master/productwisemenu/amc', {
      queryParams: {
        amc_id: btoa(__items.id.toString()),
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
      },
    });
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
    // this.onFileDropped(__ev);
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
      .api_call(1, '/amcimport', __uploadRnt)
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
