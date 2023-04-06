import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit {
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
      label:'Fixed Deposit',
      url:'/main/master/fixedeposit',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Scheme",
      url:'/main/master/fixedeposit/scheme',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Upload Csv",
      url:'/main/master/fixedeposit/uploadscheme',
      hasQueryParams:false,
      queryParams:''
    }
]
displayedColumns: Array<string> = [];
displayedColumns__forcomp_type: Array<string> = [];
displayedColumns__forcomp: Array<string>= [];
tableColumns: Array<Column> = [
  {
    columnDef: 'comp_type',
    header: 'Company Type',
    cell: (element: Record<string, any>) => `${element['comp_type']}`,
  },
  {
    columnDef: 'company_name',
    header: 'Company Short Name',
    cell: (element: Record<string, any>) => `${element['company_name']}`,
  },
  {
    columnDef: 'scheme_name',
    header: 'Scheme Name',
    cell: (element: Record<string, any>) => `${element['scheme_name']}`,
  },
];
tableData = new MatTableDataSource([
  {
      comp_type: 'XXXXXXXX',
      company_name: 'XXXXXXXXX',
      scheme_name:'XXXXXXXXX'
  },
]);

tableColumns_forcomp: Array<Column> = [
  {
    columnDef: 'comp_type',
    header: 'Company Type',
    cell: (element: Record<string, any>) => `${element['comp_type']}`,
  },
  {
    columnDef: 'comp_full_name',
    header: 'Company Full Name',
    cell: (element: Record<string, any>) => `${element['comp_full_name']}`,
  },
  {
    columnDef: 'comp_short_name',
    header: 'Company Short Name',
    cell: (element: Record<string, any>) => `${element['comp_short_name']}`,
  },
];
tableData_forcomp = new MatTableDataSource();

tableColumns_forcomp_type: Array<Column> = [
  {
    columnDef: 'comp_type',
    header: 'Company Type',
    cell: (element: Record<string, any>) => `${element['comp_type']}`,
  },
];
tableData_forcomp_type = new MatTableDataSource();
allowedExtensions = ['csv', 'xlsx'];
__uploadRnt = new FormGroup({
  rntFile: new FormControl('', [
    Validators.required,
    fileValidators.fileExtensionValidator(this.allowedExtensions),
  ]),
  file: new FormControl(''),
});
__columns: string[] = ['sl_no', 'scheme', 'edit'];
__selectScm = new MatTableDataSource<any>([]);
constructor(
  private __dbIntr: DbIntrService,
  private __utility: UtiliService,
  public __rtDt: ActivatedRoute
) {
  this.previewScheme();
  this.getCompanyType();
  this.getCompany();
}
getCompany(){
  this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe((res: any) =>{
    this.tableData_forcomp = new MatTableDataSource(res);
  })
}
getCompanyType(){
  this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe((res: any) =>{
    this.tableData_forcomp_type = new MatTableDataSource(res);
  })
}

ngOnInit() {
  this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  this.displayedColumns__forcomp_type = this.tableColumns_forcomp_type.map((c) => c.columnDef);
  this.displayedColumns__forcomp = this.tableColumns_forcomp.map((c) => c.columnDef);


  this.__utility.getBreadCrumb(this.__brdCrmbs);
}
previewScheme() {
  this.__dbIntr
    .api_call(0, '/fd/scheme', null)
    .pipe(map((x: responseDT) => x.data))
    .subscribe((res) => {
      this.__selectScm = new MatTableDataSource(res.slice(0,5));
    });
}

populateDT(__items: any) {
  this.__utility.navigatewithqueryparams(
    '/main/master/fixedeposit/scheme',
    { queryParams: {
      id: btoa(__items.id.toString())
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
    .api_call(1, '/fd/schemeimport', __uploadRnt)
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
