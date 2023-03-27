import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { pluck, take } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-uploadCsv',
  templateUrl: './uploadCsv.component.html',
  styleUrls: ['./uploadCsv.component.css'],
})
export class UploadCsvComponent implements OnInit {



  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'R&T Full Name',
      header: 'R&T Full Name',
      cell: (element: Record<string, any>) => `${element['rnt_full_name']}`,
    },
    {
      columnDef: 'R&T Short Name',
      header: 'R&T Short Name',
      cell: (element: Record<string, any>) => `${element['rnt_name']}`,
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
      columnDef: 'distributor_care_no',
      header: 'Distributor Care Number',
      cell: (element: Record<string, any>) => `${element['distributor_care_no']}`,
    },
    {
      columnDef: 'distributor_care_email',
      header: 'Distributor Care Email',
      cell: (element: Record<string, any>) => `${element['distributor_care_email']}`,
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
      columnDef: 'Level-1 Name',
      header: 'Level-1 Name',
      cell: (element: Record<string, any>) => `${element['Level-1 Name']}`,
    },
    {
      columnDef: 'Level-1 Contact',
      header: 'Level-1 Contact',
      cell: (element: Record<string, any>) => `${element['Level-1 Contact']}`,
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
      rnt_name: 'CAMS',
      rnt_full_name:'Computer Age Management Services Limited',
      web_site: 'www.axismf.com',
      cus_care_no: 1111111111,
      cus_care_email: 'abc@gmail.com',
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
      distributor_care_no:'',
      distributor_care_email:'',
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
      "Level-6 Name": "",

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
  __columns: string[] = ['sl_no', 'rnt_name', 'edit'];
  __selectRNT = new MatTableDataSource<rnt>([]);
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
      label:"R&T",
      url:'/main/master/productwisemenu/rnt',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"R&T Upload",
      url:'/main/master/productwisemenu/rnt/rntUpload',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]

  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public  __rtDt: ActivatedRoute
  ) {
    this.previewlatestRntEntry();
  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestRntEntry() {
    this.__dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.__selectRNT = new MatTableDataSource(res.slice(0,5));
      });
  }
  populateDT(__items: rnt) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/rnt', {
      queryParams: { product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'), id: btoa(__items.id.toString()) },
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
      .api_call(1, '/rntimport', __uploadRnt)
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
  showCorrospondingAMC(__rntDtls) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/amc', {
      queryParams: {
        id: btoa(__rntDtls.id.toString()),
        product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')
      },
    });
  }
}
