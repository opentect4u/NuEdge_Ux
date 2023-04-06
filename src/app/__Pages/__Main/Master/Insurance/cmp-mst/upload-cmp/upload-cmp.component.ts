import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { insComp } from 'src/app/__Model/insComp';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-upload-cmp',
  templateUrl: './upload-cmp.component.html',
  styleUrls: ['./upload-cmp.component.css']
})
export class UploadCmpComponent implements OnInit {

  __columns: string[] = ['sl_no','comp_name','edit'];
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> =  [
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
    {
      columnDef: 'WebSite',
      header: 'Website',
      cell: (element: Record<string, any>) => `${element['web_site']}`,
      isDate: true,
    },
    {
      columnDef:'gstin',
      header:'GSTIN',
      cell: (element: Record<string, any>) => `${element['gstin']}`,
    },
    {
      columnDef: 'cus_care_whatsapp_no',
      header: 'Customer Care WhatsApp Number',
      cell: (element: Record<string, any>) => `${element['cus_care_whatsapp_no']}`,
    },
    {
      columnDef: 'cus_care_no',
      header: 'Customer Care Number',
      cell: (element: Record<string, any>) => `${element['cus_care_no']}`,
    },
    {
      columnDef: 'cus_care_email',
      header: 'Customer Care Email',
      cell: (element: Record<string, any>) => `${element['cus_care_email']}`,
    },
    {
      columnDef: 'dist_care_no',
      header: 'Distributor Care Number',
      cell: (element: Record<string, any>) => `${element['dist_care_no']}`,
    },
    {
      columnDef: 'dist_care_email',
      header: 'Distributor Care Email',
      cell: (element: Record<string, any>) => `${element['dist_care_email']}`,
    },
    {
      columnDef:'head_ofc_contact_per',
      header:'Head Office Contact Person',
      cell: (element: Record<string, any>) => `${element['head_ofc_contact_per']}`,

    },
    {
      columnDef:'head_contact_per_mob',
      header:'Head Office Contact Person Mobile',
      cell: (element: Record<string, any>) => `${element['head_contact_per_mob']}`,

    },
    {
      columnDef:'head_contact_per_email',
      header:'Head Office Contact Person Email',
      cell: (element: Record<string, any>) => `${element['head_contact_per_email']}`,

    },
    {
      columnDef:'head_ofc_addr',
      header:'Head Office Address',
      cell: (element: Record<string, any>) => `${element['head_ofc_addr']}`,
    },
    {
      columnDef:'local_ofc_contact_per',
      header:'Local Office Contact Person',
      cell: (element: Record<string, any>) => `${element['local_ofc_contact_per']}`,

    },
    {
      columnDef:'local_contact_per_mob',
      header:'Local Office Contact Person Mobile',
      cell: (element: Record<string, any>) => `${element['local_contact_per_mob']}`,

    },
    {
      columnDef:'local_contact_per_email',
      header:'Local Office Contact Person Email',
      cell: (element: Record<string, any>) => `${element['local_contact_per_email']}`,

    },
    {
      columnDef:'local_ofc_addr',
      header:'Local Office Address',
      cell: (element: Record<string, any>) => `${element['local_ofc_addr']}`,
    },

    {
      columnDef:'login_url',
      header:'Login URL',
      cell: (element: Record<string, any>) => `${element['login_url']}`,
    },
    {
      columnDef:'login_id',
      header:'Login ID',
      cell: (element: Record<string, any>) => `${element['login_id']}`,
    },
    {
      columnDef:'login_pass',
      header:'Login Password',
      cell: (element: Record<string, any>) => `${element['login_pass']}`,
    },
    {
      columnDef:'security_qus_1',
      header:'Security Question 1',
      cell: (element: Record<string, any>) => `${element['security_question_1']}`,
    },
    {
      columnDef:'security_ans_1',
      header:'Security Answer 1',
      cell: (element: Record<string, any>) => `${element['security_answer_1']}`,
    },
    {
      columnDef:'security_qus_2',
      header:'Security Question 2',
      cell: (element: Record<string, any>) => `${element['security_question_2']}`,
    },
    {
      columnDef:'security_ans_2',
      header:'Security Answer 2',
      cell: (element: Record<string, any>) => `${element['security_answer_2']}`,
    },
    {
      columnDef:'security_qus_3',
      header:'Security Question 3',
      cell: (element: Record<string, any>) => `${element['security_question_3']}`,
    },
    {
      columnDef:'security_ans_3',
      header:'Security Answer 3',
      cell: (element: Record<string, any>) => `${element['security_answer_3']}`,
    },
    {
      columnDef:'security_qus_4',
      header:'Security Question 4',
      cell: (element: Record<string, any>) => `${element['security_question_4']}`,
    },
    {
      columnDef:'security_ans_4',
      header:'Security Answer 4',
      cell: (element: Record<string, any>) => `${element['security_answer_4']}`,
    },
    {
      columnDef:'security_qus_5',
      header:'Security Question 5',
      cell: (element: Record<string, any>) => `${element['security_question_5']}`,
    },
    {
      columnDef:'security_ans_5',
      header:'Security Answer 5',
      cell: (element: Record<string, any>) => `${element['security_answer_5']}`,
    },
    {
      columnDef:'security_qus_6',
      header:'Security Question 6',
      cell: (element: Record<string, any>) => `${element['security_question_6']}`,
    },
    {
      columnDef:'security_ans_6',
      header:'Security Answer 6',
      cell: (element: Record<string, any>) => `${element['security_answer_6']}`,
    },
    {
      columnDef:'security_qus_7',
      header:'Security Question 7',
      cell: (element: Record<string, any>) => `${element['security_question_7']}`,
    },
    {
      columnDef:'security_ans_7',
      header:'Security Answer 7',
      cell: (element: Record<string, any>) => `${element['security_answer_7']}`,
    },
    {
      columnDef: 'Level-1 Email',
      header: 'Level-1 Email',
      cell: (element: Record<string, any>) => `${element['Level-1 Email']}`,
    },
    {
      columnDef: 'Level-2 Name',
      header: 'Level-2 Name',
      cell: (element: Record<string, any>) => `${element['Level-2 Name']}`,
    },
    {
      columnDef: 'Level-2 Contact',
      header: 'Level-2 Contact',
      cell: (element: Record<string, any>) => `${element['Level-2 Contact']}`,
    },
    {
      columnDef: 'Level-2 Email',
      header: 'Level-2 Email',
      cell: (element: Record<string, any>) => `${element['Level-2 Email']}`,
    },
    {
      columnDef: 'Level-3 Name',
      header: 'Level-3 Name',
      cell: (element: Record<string, any>) => `${element['Level-3 Name']}`,
    },
    {
      columnDef: 'Level-3 Contact',
      header: 'Level-3 Contact',
      cell: (element: Record<string, any>) => `${element['Level-3 Contact']}`,
    },
    {
      columnDef: 'Level-3 Email',
      header: 'Level-3 Email',
      cell: (element: Record<string, any>) => `${element['Level-3 Email']}`,
    },
    {
      columnDef: 'Level-4 Name',
      header: 'Level-4 Name',
      cell: (element: Record<string, any>) => `${element['Level-4 Name']}`,
    },
    {
      columnDef: 'Level-4 Contact',
      header: 'Level-4 Contact',
      cell: (element: Record<string, any>) => `${element['Level-4 Contact']}`,
    },
    {
      columnDef: 'Level-4 Email',
      header: 'Level-4 Email',
      cell: (element: Record<string, any>) => `${element['Level-4 Email']}`,
    },
    {
      columnDef: 'Level-5 Name',
      header: 'Level-5 Name',
      cell: (element: Record<string, any>) => `${element['Level-5 Name']}`,
    },
    {
      columnDef: 'Level-5 Contact',
      header: 'Level-5 Contact',
      cell: (element: Record<string, any>) => `${element['Level-5 Contact']}`,
    },
    {
      columnDef: 'Level-5 Email',
      header: 'Level-5 Email',
      cell: (element: Record<string, any>) => `${element['Level-5 Email']}`,
    },
    {
      columnDef: 'Level-6 Name',
      header: 'Level-6 Name',
      cell: (element: Record<string, any>) => `${element['Level-6 Name']}`,
    },
    {
      columnDef: 'Level-6 Contact',
      header: 'Level-6 Contact',
      cell: (element: Record<string, any>) => `${element['Level-6 Contact']}`,
    },
    {
      columnDef: 'Level-6 Email',
      header: 'Level-6 Email',
      cell: (element: Record<string, any>) => `${element['Level-6 Email']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      comp_full_name: 'NuEdge Corporate Pvt Ltd',
      comp_short_name:'NCPL',
      web_site: 'www.axismf.com',
      cus_care_no: 1111111111,
      cus_care_email: 'abc@gmail.com',
      dist_care_no:1111111111,
      dist_care_email: 'abc@gmail.com',
      head_ofc_contact_per:'TEST',
      head_contact_per_mob:'1111111111',
      head_contact_per_email:'abc@gmail.com',
      head_ofc_addr:'Bompas Road',
      local_ofc_contact_per:'TEST',
      local_contact_per_mob:'1111111111',
      local_contact_per_email:'abc@gmail.com',
      local_ofc_addr:'Bompas Road',
      login_url:'www.google.com',
      login_id:'nuedge@gmail.com',
      login_pass:'XXXXX',
      cus_care_whatsapp_no:'111111111111',
      gstin:'GST/IN/1234',
      security_question_1: "",
      security_answer_1: "",
      security_question_2: "",
      security_answer_2: "",
      security_question_3: "",
      security_answer_3: "",
      security_question_4: "",
      security_answer_4: "",
      security_question_5: "",
      security_answer_5: "",
      security_question_6: "",
      security_answer_6: "",
      security_question_7: "",
      security_answer_7: "",
      "Level-1 Contact": 9831348519,
      "Level-1 Email": 'ashishb@hdfcfund.com',
      "Level-1 Name": 'Ashish Bhatia',
      "Level-2 Contact": 9748513090,
      "Level-2 Email": 'servicesssouthkolkata@hdfcfund.com',
      "Level-2 Name": 'Nabanita Deb',
      "Level-3 Contact": 9734133268,
      "Level-3 Email": 'servicesssouthkolkata@hdfcfund.com',
      "Level-3 Name": 'Debobroto Chatterjee',
      "Level-4 Contact": 9734133268,
      "Level-4 Email": 'servicesssouthkolkata@hdfcfund.com',
      "Level-4 Name": 'Debobroto Chatterjee',
      "Level-5 Contact": "",
      "Level-5 Email": "",
      "Level-5 Name": "",
      "Level-6 Contact": "",
      "Level-6 Email": "",
      "Level-6 Name": ""
    }
  ]);
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
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '3' ?  "Insurance" : "Others",
      url:'/main/master/insurance',
      hasQueryParams:true,
      queryParams:{id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Company",
      url:'/main/master/insurance/company',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Upload Company",
      url:'/main/master/insurance/uploadcompany',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
allowedExtensions = ['csv', 'xlsx'];
  __cmpMst = new MatTableDataSource<insComp>([]);
  instTypeMst : any=[];
  __cmpForm = new FormGroup({
    ins_type_id: new FormControl('',[Validators.required]),
    rntFile: new FormControl('', [
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
    file: new FormControl(''),
  })
  constructor(
    private __dbIntr: DbIntrService,
    public __rtDt: ActivatedRoute,
    private __utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.getInsType();
    this.setBreadCrumb();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
     this.getCompanyMst();
  }
  getCompanyMst(){
    this.__dbIntr.api_call(0,'/ins/company',null).pipe(pluck("data")).subscribe((res: insComp[]) =>{
      this.__cmpMst = new MatTableDataSource(res.slice(0,5));
    })
  }
  setBreadCrumb(){
    this.__utility.getBreadCrumb(this.__brdCrmbs)
  }
  getInsType(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
        this.instTypeMst = res;
    })
  }
  getFiles(__ev) {
    this.__cmpForm
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileSizeValidator(__ev.files),
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__cmpForm
      .get('file')
      ?.patchValue(
        this.__cmpForm.get('rntFile').status == 'VALID' ? __ev.files[0] : ''
      );
    // this.onFileDropped(__ev);
  }
  uploadRnt() {
    if (this.__cmpForm.invalid) {
      this.__utility.showSnackbar(
        'Please recheck the form again & resubmit',
        0
      );
      return;
    }
    const __cmpForm = new FormData();
    __cmpForm.append('file', this.__cmpForm.get('file').value);
    __cmpForm.append('ins_type_id', this.__cmpForm.get('ins_type_id').value);

    this.__dbIntr
      .api_call(1, '/ins/companyimport', __cmpForm)
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
    this.__cmpForm.get('file').patchValue('');
    this.__cmpForm.controls.rntFile.setErrors({
      checkRequire: __ev.files.length > 0 ? false : true,
    });
    this.__cmpForm.controls.rntFile.setErrors({
      checkSize: !fileValidators.fileSizeValidatorcopy(__ev.files),
    });
    fileValidators
      .fileExtensionValidatorcopy(this.allowedExtensions, __ev.files)
      .then((res) => {
        this.__cmpForm.get('rntFile').setErrors({ checkExt: !res });
        console.log(this.__cmpForm.get('rntFile').errors.checkExt);
        if (res) {
          if (
            __ev.files.length > 0 &&
            fileValidators.fileSizeValidatorcopy(__ev.files)
          ) {
            this.__cmpForm.get('file').patchValue(__ev.files[0]);
            this.__cmpForm.get('rntFile').clearValidators();
            this.__cmpForm.get('rntFile').updateValueAndValidity();
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
    // this.__cmpForm.reset();
  this.__cmpForm.patchValue({
    file:'',
    rntFile:'',
    ins_type_id:''
  })
    this.__cmpForm
      .get('rntFile')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
      ]);
    this.__cmpForm.get('rntFile').updateValueAndValidity();
  }
  populateDT(__el: insComp){
    this.__utility.navigatewithqueryparams(
      '/main/master/insurance/company',
      { queryParams: {
        id: btoa(__el.id.toString()),
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')
      } }
    );
  }
}
