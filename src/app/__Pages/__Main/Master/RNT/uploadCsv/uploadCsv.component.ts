import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-uploadCsv',
  templateUrl: './uploadCsv.component.html',
  styleUrls: ['./uploadCsv.component.css'],
})
export class UploadCsvComponent implements OnInit {
  displayedColumns: Array<string> = [];
  /** */
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
  /** Hold the basic data for R&T to populate in the table and this data will be exported as CSV */
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
  /*****End**/

  /**** Columns to display in the latest R&T Card*/
  __columns: string[] = ['sl_no', 'rnt_name', 'edit'];
  /**** End **/

  /**** Hold the latest R&T Details*/
  __selectRNT = new MatTableDataSource<rnt>([]);
  /**** End*/

  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public  __rtDt: ActivatedRoute
  ) {
  }
  ngOnInit() {
    this.previewlatestRntEntry();/*** Function call to get the latest R&T from backend */
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  /*** Function Defination to get the latest R&T from backend */
  previewlatestRntEntry() {
    this.__dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.__selectRNT = new MatTableDataSource(res.slice(0,5));
      });
  }
  /*** End */

  populateDT(__items: rnt) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/rnt', {
      // queryParams: {id: btoa(__items.id.toString()) },
      queryParams: {id: this.__utility.encrypt_dtls(__items.id.toString()) },
    });
  }
  showCorrospondingAMC(__rntDtls) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/amc', {
      // queryParams: {
      //   id: btoa(__rntDtls.id.toString())
      //       },
      queryParams: {id: this.__utility.encrypt_dtls(__rntDtls.id.toString()) },
    });
  }
  viewAll(){
    this.__utility.navigate('/main/master/productwisemenu/rnt');
    // this.__utility.navigatewithqueryparams('/main/master/productwisemenu/rnt',{
    //   queryParams: {
    //     product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')
    //   }
    // })
  }
}
