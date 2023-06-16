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
import { clientColumns } from 'src/app/__Utility/clientColumns';


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
      columnDef: 'sl_no',
      header: 'SL No.',
      cell: (element: Record<string, any>) => `${element['sl_no']}`
    },
    {
      columnDef: 'client_type',
      header: 'Client Type',
      cell: (element: Record<string, any>) => `${element['client_type']}`
    },
    {
      columnDef: 'client_name',
      header: 'Client Name',
      cell: (element: Record<string, any>) => `${element['client_name']}`
    },
    {
      columnDef: 'pan',
      header: 'PAN',
      cell: (element: Record<string, any>) => `${element['pan']}`
    },
    {
      columnDef: 'dob',
      header: 'DOB',
      cell: (element: Record<string, any>) => `${element['dob']}`
    },
    {
      columnDef: 'dob_actual',
      header: 'Actual Date Of Birth',
      cell: (element: Record<string, any>) => `${element['dob_actual']}`
    },
    {
      columnDef: 'maritial_status',
      header: 'Maritial Status',
      cell: (element: Record<string, any>) => `${element['maritial_status']}`
    },
    {
      columnDef: 'anniversary_date',
      header: 'Anniversary Date',
      cell: (element: Record<string, any>) => `${element['anniversary_date']}`
    },
    {
      columnDef: 'guardians_name',
      header: 'Guardian Name',
      cell: (element: Record<string, any>) => `${element['guardians_name']}`
    },
    {
      columnDef: 'guardians_pan',
      header: 'Guardian PAN',
      cell: (element: Record<string, any>) => `${element['guardians_pan']}`
    },
    {
      columnDef: 'relation',
      header: 'Relationship',
      cell: (element: Record<string, any>) => `${element['relation']}`
    },
    {
      columnDef: 'mobile',
      header: 'Mobile',
      cell: (element: Record<string, any>) => `${element['mobile']}`
    },
    {
      columnDef: 'sec_mobile',
      header: 'Alternative Mobile',
      cell: (element: Record<string, any>) => `${element['sec_mobile']}`
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: Record<string, any>) => `${element['email']}`
    },
    {
      columnDef: 'sec_email',
      header: 'Alternative Email',
      cell: (element: Record<string, any>) => `${element['sec_email']}`
    },
    {
      columnDef: 'add_line_1',
      header: 'Address-1',
      cell: (element: Record<string, any>) => `${element['add_line_1']}`
    },
    {
      columnDef: 'add_line_2',
      header: 'Address-2',
      cell: (element: Record<string, any>) => `${element['add_line_2']}`
    },
    {
      columnDef: 'state',
      header: 'State',
      cell: (element: Record<string, any>) => `${element['state']}`
    },
    {
      columnDef: 'dist',
      header: 'District',
      cell: (element: Record<string, any>) => `${element['dist']}`
    },,
    {
      columnDef: 'city',
      header: 'City',
      cell: (element: Record<string, any>) => `${element['city']}`
    },
    {
      columnDef: 'pincode',
      header: 'Pincode',
      cell: (element: Record<string, any>) => `${element['pincode']}`
    }
  ];

  clmsToDisplay: any=[];

  tableData = new MatTableDataSource();
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    rntFile: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    file: new FormControl('')
  })
  __columns: string[] = [];
  __selectClient = new MatTableDataSource<client>([]);
  constructor(
    public __rtDt: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService) { this.previewlatestClientEntry(); }

  ngOnInit() {
    console.log(this.displayedColumns);

    this.__utility.getBreadCrumb(this.__brdCrmbs);
    this.setColumns();
  }
  previewlatestClientEntry() {
    this.__dbIntr.api_call(0, '/client', 'client_type='+ atob(this.__rtDt.snapshot.queryParamMap.get('flag'))).pipe(pluck('data','data')).subscribe((res: client[]) => {
      this.__selectClient = new MatTableDataSource(res.splice(0,5));

    })
  }
  setColumns(){
    /** FOR SETTING COLUMNS & TABLE DATA FOR DOWNLOADING UPLOAD CSV */
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('flag')));

    const clmToRemove = ['edit','delete','upload_details'];
    const columns =  atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'M'
                        ? clientColumns.MINOR_CLIENT
                        : (atob(this.__rtDt.snapshot.queryParamMap.get('flag')) == 'N'
                        ? clientColumns.NON_PAN_HOLDER_CLIENT
                        : clientColumns.PAN_HOLDER_CLIENT);
    this.__columns = columns.filter(x => !clmToRemove.includes(x));
    this.setTableData(atob(this.__rtDt.snapshot.queryParamMap.get('flag')));
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef).filter(x => this.__columns.includes(x));
    this.clmsToDisplay = this.tableColumns.filter((x) => columns.includes(x.columnDef));
   }
   setTableData(flag){
    switch(flag){
      case 'M':
      this.tableData = new MatTableDataSource(
        clientColumns.TBL_DATA.map(
          ({pan,maritial_status,anniversary_date,...rest}) => ({...rest}))
        );
      break;
      case 'N':this.tableData = new MatTableDataSource(
        clientColumns.TBL_DATA.map(
          ({pan,guardians_name,guardians_pan,relation,...rest}) => ({...rest})));
        break;
      default:this.tableData = new MatTableDataSource(
        clientColumns.TBL_DATA.map(
          ({guardians_name,guardians_pan,relation,...rest}) => ({...rest})));
        break;
    }
    console.log(this.tableData.data);
   }
  populateDT(__items: client) {
    this.__utility.navigatewithqueryparams('/main/master/clientmaster', { queryParams: { flag: btoa(__items.client_type), id: btoa(__items.id.toString()) } })
  }
  getFiles(__ev) {
    this.__uploadRnt.get('rntFile').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.files), fileValidators.fileExtensionValidator(this.allowedExtensions)]);
    this.__uploadRnt.get('file')?.patchValue(this.__uploadRnt.get('rntFile').status == 'VALID' ? __ev.files[0] : '');
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
  viewAll(){
    this.__utility.navigatewithqueryparams('/main/master/clientmaster', { queryParams: { flag: this.__rtDt.snapshot.queryParamMap.get('flag') } })

  }
}
