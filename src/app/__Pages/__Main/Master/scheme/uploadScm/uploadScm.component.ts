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
      columnDef: 'AMC ID',
      header: 'AMC ID',
      cell: (element: Record<string, any>) => `${element['AMC ID']}`,
      isDate: true
    },
    {
      columnDef: 'Category ID',
      header: 'Category ID',
      cell: (element: Record<string, any>) => `${element['Category ID']}`,
      isDate: true
    },
    {
      columnDef: 'Sub Category ID',
      header: 'Sub Category ID',
      cell: (element: Record<string, any>) => `${element['Sub Category ID']}`,
      isDate: true
    },
    {
      columnDef: 'Scheme',
      header: 'Scheme',
      cell: (element: Record<string, any>) => `${element['Scheme']}`
    },
    {
      columnDef: 'Scheme Type',
      header: 'Scheme Type',
      cell: (element: Record<string, any>) => `${element['Scheme Type']}`,
      isDate: true
    },
    {
      columnDef: 'NFO Start Date',
      header: 'NFO Start Date',
      cell: (element: Record<string, any>) => `${element['NFO Start Date']}`,
      isDate: true
    },
    {
      columnDef: 'NFO End Date',
      header: 'NFO End Date',
      cell: (element: Record<string, any>) => `${element['NFO End Date']}`,
      isDate: true
    },
    {
      columnDef: 'NFO Reopen Date',
      header: 'NFO Reopen Date',
      cell: (element: Record<string, any>) => `${element['NFO Reopen Date']}`,
      isDate: true
    } ,
    {
      columnDef: 'PIP Fresh Minimum Amount',
      header: 'PIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['PIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'PIP Fresh Additional Amount',
      header: 'PIP Fresh Additional Amount',
      cell: (element: Record<string, any>) => `${element['PIP Fresh Additional Amount']}`,
      isDate: true
    },
    {
      columnDef: 'SIP Date',
      header: 'SIP Date',
      cell: (element: Record<string, any>) => `${element['SIP Date']}`,
      isDate: true
    },
    {
      columnDef: 'SWP Date',
      header: 'SWP Date',
      cell: (element: Record<string, any>) => `${element['SWP Date']}`,
      isDate: true
    },
    {
      columnDef: 'STP Date',
      header: 'STP Date',
      cell: (element: Record<string, any>) => `${element['STP Date']}`,
      isDate: true
    },
    {
      columnDef: 'SIP Frequency Wise Amount',
      header: 'SIP Frequency Wise Amount',
      cell: (element: Record<string, any>) => `${element['SIP Frequency Wise Amount']}`,
      isDate: true
    },
    {
      columnDef: 'SWP frequency Wise Amount',
      header: 'SWP frequency Wise Amount',
      cell: (element: Record<string, any>) => `${element['SWP frequency Wise Amount']}`,
      isDate: true
    },
    {
      columnDef: 'STP Frequency Wise Amount',
      header: 'STP Frequency Wise Amount',
      cell: (element: Record<string, any>) => `${element['STP Frequency Wise Amount']}`,
      isDate: true
    }
  ];

   __dataTbleForNFO = [
    {
        "Product ID":2,
        "AMC ID":3,
        "Category ID":4,
        "Sub Category ID":5,
        "Scheme":"Others1",
        "Id":2,
        "Scheme Type":'N',
        "NFO Start Date":'2023-02-27',
        "NFO End Date":'2023-02-27',
        "NFO Reopen Date":'2023-02-27',
        "PIP Fresh Minimum Amount":2000,
        "PIP Fresh Additional Amount":4000,
        "SIP Date":JSON.stringify(
          [{"id":"1" ,"date":"1"},{"id":"4" ,"date":"4"}]
        ),
        "STP Date":JSON.stringify(
          [{"id":"2" ,"date":"2"},{"id":"3" ,"date":"3"}]
        ),
        "SWP Date":JSON.stringify(
          [{"id":"3" ,"date":"3"},{"id":"4" ,"date":"4"}]
        ),
        "SIP Frequency Wise Amount":
        JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"2000","sip_add_min_amt":"3000"},
        {"id":"W","freq_name":"Weekly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"F","freq_name":"fortnightly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"M","freq_name":"Monthly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"Q","freq_name":"Quarterly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
        ]),
        "SWP frequency Wise Amount":
        JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"W","freq_name":"Weekly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"F","freq_name":"fortnightly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"M","freq_name":"Monthly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"Q","freq_name":"Quarterly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
        ]),
        "STP Frequency Wise Amount":
        JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"W","freq_name":"Weekly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"F","freq_name":"fortnightly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"M","freq_name":"Monthly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"Q","freq_name":"Quarterly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
        {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
        {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
        ]),
    }
   ];
   __dataTbleForOngoing = [
    {
      "Product ID":2,
      "AMC ID":3,
      "Category ID":4,
      "Sub Category ID":5,
      "Scheme":"Others1",
      "Id":2,
      "Scheme Type":'N',
      "PIP Fresh Minimum Amount":2000,
      "PIP Fresh Additional Amount":4000,
      "SIP Date":JSON.stringify(
        [{"id":"1" ,"date":"1"},{"id":"4" ,"date":"4"}]
      ),
      "STP Date":JSON.stringify(
        [{"id":"2" ,"date":"2"},{"id":"3" ,"date":"3"}]
      ),
      "SWP Date":JSON.stringify(
        [{"id":"3" ,"date":"3"},{"id":"4" ,"date":"4"}]
      ),
      "SIP Frequency Wise Amount":
      JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"2000","sip_add_min_amt":"3000"},
      {"id":"W","freq_name":"Weekly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"F","freq_name":"fortnightly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"M","freq_name":"Monthly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"Q","freq_name":"Quarterly","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
      ]),
      "SWP frequency Wise Amount":
      JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"W","freq_name":"Weekly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"F","freq_name":"fortnightly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"M","freq_name":"Monthly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"Q","freq_name":"Quarterly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"S","freq_name":"Semi Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""},
      {"id":"A","freq_name":"Anually","is_cheked":false,"sip_fresh_min_amt":"","sip_add_min_amt":""}
      ]),
      "STP Frequency Wise Amount":
      JSON.stringify([{"id":"D","freq_name":"Daily","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"W","freq_name":"Weekly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"F","freq_name":"fortnightly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"M","freq_name":"Monthly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
      {"id":"Q","freq_name":"Quarterly","is_cheked":true,"sip_fresh_min_amt":"","sip_add_min_amt":"3000"},
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
    console.log(this.tableData);

  }
  ngAfterViewInit(){
      this.__uploadRnt.controls['scheme_type'].valueChanges.subscribe(res =>{
           const columnsforNFO = ['NFO Start Date','NFO End Date','NFO Reopen Date']
           this.tableData = new MatTableDataSource(res == 'N' ? this.__dataTbleForNFO : this.__dataTbleForOngoing);
            if(res == 'O'){
              this.displayedColumns = this.displayedColumns.filter((x) => !columnsforNFO.includes(x));
            }
            else{
              this.displayedColumns.splice(5,0,...columnsforNFO)
            }
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
