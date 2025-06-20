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
    private __utility: UtiliService) { }

  ngOnInit() {
    console.log(this.displayedColumns);
    this.previewlatestClientEntry();
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
    this.setColumns();
  }
  /** 
   * * This function is responsible for previewing the latest client entries based on the client type.
   * * It makes an API call to fetch the latest client entries and updates the data source for the table.
   * * @returns void
   * @memberof UploadCsvComponent
   */
  previewlatestClientEntry() {
    this.__dbIntr.api_call(0, '/client', 'client_type='+ atob(this.__rtDt.snapshot.paramMap.get('id'))).pipe(pluck('data','data')).subscribe((res: client[]) => {
      this.__selectClient = new MatTableDataSource(res.splice(0,5));
      console.log(this.__selectClient);

    })
  }
  /** * * This function is responsible for setting the columns and table data for downloading/uploading CSV files.
 * * It retrieves the client type from the route parameters, filters the columns to be displayed,
 * * and sets the table data based on the client type.
 * * @returns void
 */
  setColumns(){
    /** FOR SETTING COLUMNS & TABLE DATA FOR DOWNLOADING UPLOAD CSV */
    console.log(atob(this.__rtDt.snapshot.paramMap.get('id')));

    const clmToRemove = ['edit','delete','upload_details'];
    const columns =  atob(this.__rtDt.snapshot.paramMap.get('id')) == 'M'
                        ? clientColumns.MINOR_CLIENT
                        : (atob(this.__rtDt.snapshot.paramMap.get('id')) == 'N'
                        ? clientColumns.NON_PAN_HOLDER_CLIENT
                        : clientColumns.PAN_HOLDER_CLIENT);
    this.__columns = columns.filter(x => !clmToRemove.includes(x));
    this.setTableData(atob(this.__rtDt.snapshot.paramMap.get('id')));
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef).filter(x => this.__columns.includes(x));
    this.clmsToDisplay = this.tableColumns.filter((x) => columns.includes(x.columnDef));
   }
   /** * * This function is responsible for setting the table data based on the client type.
 * * It filters the client columns data to exclude specific fields based on the client type.
 * * @param flag - The client type flag ('M', 'N', or default).
 */
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
   }
   /** * * This function is responsible for navigating to the client master page with the selected item.
 * * It takes the selected item as a parameter and navigates to the client master page with the item's client_type and id as query parameters.
 * * @param __items - The selected item containing client_type and id.
 * * @returns void
 */
  populateDT(__items: client) {
    this.__utility.navigatewithqueryparams(
      (atob(this.__rtDt.snapshot.paramMap.get('id')) == 'E' ?
      '/main/master/mstOperations/clntMst/clOption/clientmaster/' :
      '/main/master/mstOperations/clntMst/clOption/addnew/clientmaster/')+ btoa(__items.client_type),
      { queryParams: { cl_id: btoa(__items.id.toString()) } })
  }
  /** * * This function is responsible for handling file selection for uploading RNT files.
 * * It sets the validators for the file input based on the selected file's size and extension.
 * * @param __ev - The event object containing the selected files.
 * * @returns void
 */
  getFiles(__ev) {
    this.__uploadRnt.get('rntFile').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.files), fileValidators.fileExtensionValidator(this.allowedExtensions)]);
    this.__uploadRnt.get('file')?.patchValue(this.__uploadRnt.get('rntFile').status == 'VALID' ? __ev.files[0] : '');
  }
  /** * * This function is responsible for uploading the RNT file.
 * * It checks if the form is valid, creates a FormData object, appends the file to it,
 * * and makes an API call to upload the file.
 * * @returns void
 */
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
  /*   * This function is used to handle file drop events for uploading RNT files.
   *   It checks if the dropped files meet the required conditions (file size and extension),
   *   and updates the form control values accordingly.
   * * @param __ev - The event object containing the dropped files.
   * * @returns void
   */
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
  /** * * This function is responsible for resetting the file input and its validators.
 * * It clears the file input value and sets the validators for the file input to require a file with a valid extension.
 * * @returns void
 */
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
  /** * * This function is responsible for navigating to the client master page based on the client type.
 * * It checks the client type from the route parameters and navigates to the appropriate client master page.
 * * @returns void
 */
  viewAll(){
    this.__utility.navigate(
      ((atob(this.__rtDt.snapshot.paramMap.get('id')) == 'E'
      ? 'main/master/mstOperations/clntMst/clOption/clientmaster/'
      : 'main/master/mstOperations/clntMst/clOption/addnew/clientmaster/')),
      this.__rtDt.snapshot.paramMap.get('id'));
  }
}
