import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { bank } from 'src/app/__Model/__bank';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
@Component({
  selector: 'app-bankUpload',
  templateUrl: './bankUpload.component.html',
  styleUrls: ['./bankUpload.component.css']
})
export class BankUploadComponent implements OnInit {
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'ifs_code',
      header: 'ifs_code',
      cell: (element: Record<string, any>) => `${element['ifs_code']}`
    },
    {
      columnDef: 'bank_name',
      header: 'bank_name',
      cell: (element: Record<string, any>) => `${element['bank_name']}`,
      isDate: true
    },
    {
      columnDef: 'branch_name',
      header: 'branch_name',
      cell: (element: Record<string, any>) => `${element['branch_name']}`,
      isDate: true
    }
    ,
    {
      columnDef: 'micr_code',
      header: 'micr_code',
      cell: (element: Record<string, any>) => `${element['micr_code']}`,
      isDate: true
    } ,
    {
      columnDef: 'branch_addr',
      header: 'branch_addr',
      cell: (element: Record<string, any>) => `${element['branch_addr']}`,
      isDate: true
    }
  ];
  tableData = new MatTableDataSource(
    [{
      bank_name: "Others",
      ifs_code: 1,
      branch_name:"HB",
      branch_addr:"Kamarpara",
      micr_code:"M-1234"
    }]
  );
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    rntFile: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    file: new FormControl('')
  })
  __columns: string[] = ['sl_no', 'bank_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<bank>([]);
  constructor(private __dbIntr: DbIntrService, private __utility: UtiliService) { this.previewlatestCategoryEntry(); }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  previewlatestCategoryEntry() {
    this.__dbIntr.api_call(0, '/depositbank', null).pipe(pluck('data')).subscribe((res: bank[]) => {
      this.__selectRNT = new MatTableDataSource(res);
    })
  }
  populateDT(__items: bank) {
    // this.__utility.navigate('/main/master/cateModify', btoa(__items.id.toString()));
    this.__utility.navigatewithqueryparams('/main/master/bank',{queryParams: {id:btoa(__items.id.toString())}});
  }
  getFiles(__ev) {  
      this.__uploadRnt.get('rntFile').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.files), fileValidators.fileExtensionValidator(this.allowedExtensions)]);
      this.__uploadRnt.get('file')?.patchValue(this.__uploadRnt.get('rntFile').status == 'VALID' ? __ev.files[0] : '');
      // this.onFileDropped(__ev);
  }
  uploadRnt() {

    if(this.__uploadRnt.invalid){
      this.__utility.showSnackbar("Please recheck the form again & resubmit",0);
      return
    }
    const __uploadRnt = new FormData();
    __uploadRnt.append('file', this.__uploadRnt.get('file').value);
    this.__dbIntr.api_call(1, '/depositbankimport', __uploadRnt).subscribe((res: responseDT) => {
      this.__utility.showSnackbar(res.suc == 1 ? 'File Uploadation Successfull' : 'Something went wrong! please try again later', res.suc);
      if (res.suc == 1) {
        this.deleteFiles();
      }
    })
  }
  onFileDropped(__ev){
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
formatBytes(bytes:any, decimals: any = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
deleteFiles(){
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
