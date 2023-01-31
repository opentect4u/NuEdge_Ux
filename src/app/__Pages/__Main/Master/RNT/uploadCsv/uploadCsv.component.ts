import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { rnt } from 'src/app/__Model/Rnt';
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
  @ViewChild('showing') __showErr: ElementRef;
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'R&T',
      header: 'rnt_name',
      cell: (element: Record<string, any>) => `${element['rnt_name']}`
    },
    {
      columnDef: 'WebSite',
      header: 'website',
      cell: (element: Record<string, any>) => `${element['web_site']}`,
      isDate: true

    },
    {
      columnDef: 'ofc_addr',
      header: 'ofc_addr',
      cell: (element: Record<string, any>) => `${element['ofc_addr']}`
    },
    {
      columnDef: 'cus_care_no',
      header: 'cus_care_no',
      cell: (element: Record<string, any>) => `${element['cus_care_no']}`
    },
    {
      columnDef: 'cus_care_email',
      header: 'cus_care_email',
      cell: (element: Record<string, any>) => `${element['cus_care_email']}`
    }
  ];
  tableData = new MatTableDataSource(
    [{
      rnt_name: "CAMS",
      web_site: "www.axismf.com",
      ofc_addr: "Kanak Building, 41,Chowringhee Road, Kolkata-700041",
      cus_care_no: 1111111111,
      cus_care_email: "abc@gmail.com"
    }]
  );
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    // rntFile: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    rntFile: new FormControl(''),
    file: new FormControl('', [Validators.required])
  })
  __columns: string[] = ['sl_no', 'rnt_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<rnt>([]);
  constructor(private __dbIntr: DbIntrService, private __utility: UtiliService) { this.previewlatestRntEntry(); }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  previewlatestRntEntry() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(pluck('data')).subscribe((res: rnt[]) => {
      this.__selectRNT = new MatTableDataSource(res);
    })
  }
  populateDT(__items: rnt) {
    this.__utility.navigate('/main/master/rntmodify', btoa(__items.id.toString()));
  }
  getFiles(__ev) {  
      // this.__uploadRnt.get('rntFile').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.files), fileValidators.fileExtensionValidator(this.allowedExtensions)]);
      // this.__uploadRnt.get('file')?.patchValue(this.__uploadRnt.get('rntFile').status == 'VALID' ? __ev.files[0] : '');
      this.onFileDropped(__ev);
  }
  uploadRnt() {
    const __uploadRnt = new FormData();
    __uploadRnt.append('file', this.__uploadRnt.get('file').value);
    this.__dbIntr.api_call(1, '/rntimport', __uploadRnt).subscribe((res: responseDT) => {
      this.__utility.showSnackbar(res.suc == 1 ? 'File Uploadation Successfull' : 'Something went wrong! please try again later', res.suc);
      if (res.suc == 1) {
        this.__uploadRnt.reset();
      }
    })
  }
  onFileDropped(__ev){
     if(__ev.files.length > 0){  
      // console.log(fileValidators.fileExtensionValidatorcopy(this.allowedExtensions,__ev.files));
      if(fileValidators.fileSizeValidatorcopy(__ev.files)){
         this.__uploadRnt.get('file').patchValue(__ev.files[0]);
        this.__showErr.nativeElement.innerHTML = '';
      }
      else{
        this.__uploadRnt.get('file').patchValue('');
        this.__showErr.nativeElement.innerHTML = 'File size must be between 2MB';
      }
     }
     else{
      this.__uploadRnt.get('file').patchValue('');
      this.__showErr.nativeElement.innerHTML = 'Please Provide file';
     }   
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
}
  showCorrospondingAMC(__rntDtls){
    this.__utility.navigatewithqueryparams('/main/master/amcmaster',{queryParams:{id:__rntDtls.id}})
  }
}
