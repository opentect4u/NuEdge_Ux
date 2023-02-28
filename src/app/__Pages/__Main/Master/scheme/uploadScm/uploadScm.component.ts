import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
@Component({
  selector: 'app-uploadScm',
  templateUrl: './uploadScm.component.html',
  styleUrls: ['./uploadScm.component.css']
})
export class UploadScmComponent implements OnInit {
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
      label:atob(this.__route.snapshot.queryParamMap.get('product_id')) == '1' ?  "Mutual Fund" : "Others",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:{id:this.__route.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Scheme",
      url:'/main/master/productwisemenu/scheme',
      hasQueryParams:true,
      queryParams:{product_id:this.__route.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Scheme Upload",
      url:'/main/master/productwisemenu/scheme/uploadScm',
      hasQueryParams:true,
      queryParams:{product_id:this.__route.snapshot.queryParamMap.get('product_id')}
    }
]
  displayedColumns: Array<string> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableColumns: Array<Column> = [
    {
      columnDef: 'amc_id',
      header: 'amc_id',
      cell: (element: Record<string, any>) => `${element['amc_id']}`,
      isDate: true
    },
    {
      columnDef: 'category_id',
      header: 'category_id',
      cell: (element: Record<string, any>) => `${element['category_id']}`,
      isDate: true
    },
    {
      columnDef: 'subcategory_id',
      header: 'subcategory_id',
      cell: (element: Record<string, any>) => `${element['subcategory_id']}`,
      isDate: true
    },
    {
      columnDef: 'scheme_name',
      header: 'scheme_name',
      cell: (element: Record<string, any>) => `${element['scheme_name']}`
    },
    {
      columnDef: 'scheme_type',
      header: 'scheme_type',
      cell: (element: Record<string, any>) => `${element['scheme_type']}`,
      isDate: true
    },
    {
      columnDef: 'nfo_start_dt',
      header: 'nfo_start_dt',
      cell: (element: Record<string, any>) => `${element['nfo_start_dt']}`,
      isDate: true
    },
    {
      columnDef: 'nfo_end_dt',
      header: 'nfo_end_dt',
      cell: (element: Record<string, any>) => `${element['nfo_end_dt']}`,
      isDate: true
    },
    {
      columnDef: 'nfo_reopen_dt',
      header: 'nfo_reopen_dt',
      cell: (element: Record<string, any>) => `${element['nfo_reopen_dt']}`,
      isDate: true
    } ,
    {
      columnDef: 'pip_fresh_min_amt',
      header: 'pip_fresh_min_amt',
      cell: (element: Record<string, any>) => `${element['pip_fresh_min_amt']}`,
      isDate: true
    },
    {
      columnDef: 'pip_add_min_amt',
      header: 'pip_add_min_amt',
      cell: (element: Record<string, any>) => `${element['pip_add_min_amt']}`,
      isDate: true
    },
    {
      columnDef: 'sip_freq_wise_amt',
      header: 'sip_freq_wise_amt',
      cell: (element: Record<string, any>) => `${element['sip_freq_wise_amt']}`,
      isDate: true
    }
  ];

   __dataTbleForNFO = [
    {
      product_id:2,
        amc_id:3,
        category_id:4,
        subcategory_id:5,
        scheme_name:"Others1",
        id:2,
        scheme_type:'N',
        nfo_start_dt:'2023-02-27',
        nfo_end_dt:'2023-02-27',
        nfo_reopen_dt:'2023-02-27',
        pip_fresh_min_amt:2000,
        pip_add_min_amt:4000,
        sip_freq_wise_amt:
        JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"2000","sip_add_min_amt":"3000"},
        {"id":"W","freq_name":"Weekly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"F","freq_name":"fortnightly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"M","freq_name":"Monthly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"Q","freq_name":"Quarterly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
        ]),
    }
   ];
   __dataTbleForOngoing = [
    {
      product_id:2,
      amc_id:3,
      category_id:4,
      subcategory_id:5,
      scheme_name:"Others1",
      id:2,
      scheme_type:'O',
      pip_fresh_min_amt:2000,
      pip_add_min_amt:4000,
      sip_freq_wise_amt:
      JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"2000","sip_add_min_amt":"3000"},
      {"id":"W","freq_name":"Weekly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"F","freq_name":"fortnightly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"M","freq_name":"Monthly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"Q","freq_name":"Quarterly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
      ]),
    }
   ]

  tableData = new MatTableDataSource<any>(this.__dataTbleForNFO);
  allowedExtensions = ['csv', 'xlsx'];
  __uploadRnt = new FormGroup({
    rntFile: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    file: new FormControl(''),
    scheme_type: new FormControl('N',[Validators.required])
  })
  __columns: string[] = ['sl_no', 'scm_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<scheme>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __route: ActivatedRoute) { this.previewlatestCategoryEntry(); }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  ngAfterViewInit(){
      this.__uploadRnt.controls['scheme_type'].valueChanges.subscribe(res =>{
           this.tableData = new MatTableDataSource(res == 'N' ? this.__dataTbleForNFO : this.__dataTbleForOngoing);
      })
  }
  previewlatestCategoryEntry() {
    this.__dbIntr.api_call(0, '/scheme', null).pipe(pluck('data')).subscribe((res: scheme[]) => {
      this.__selectRNT = new MatTableDataSource(res);
      this.__selectRNT.paginator = this.paginator;
    })
  }
  populateDT(__items: scheme) {
    // this.__utility.navigate('/main/master/cateModify', btoa(__items.id.toString()));
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/scheme',
    {queryParams: {id:btoa(__items.id.toString()),flag:btoa(__items.scheme_type)}});
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
    __uploadRnt.append('scheme_type', this.__uploadRnt.get('schcme_type').value);

    this.__dbIntr.api_call(1, '/schemeimport', __uploadRnt).subscribe((res: responseDT) => {
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
