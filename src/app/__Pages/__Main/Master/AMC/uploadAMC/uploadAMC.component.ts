import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { Column } from 'src/app/__Model/column';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-uploadAMC',
  templateUrl: './uploadAMC.component.html',
  styleUrls: ['./uploadAMC.component.css'],
})
export class UploadAMCComponent implements OnInit {

  __rntMst: rnt[] = [];
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [

    {
      columnDef: 'AMC Full Name',
      header: 'AMC Full Name',
      cell: (element: Record<string, any>) => `${element['AMC Full Name']}`,
    },
    {
      columnDef: 'AMC Short Name',
      header: 'AMC Short Name',
      cell: (element: Record<string, any>) => `${element['AMC Short Name']}`,
    },
    {
      columnDef:'GSTIN',
      header:'GSTIN',
      cell: (element: Record<string, any>) => `${element['GSTIN']}`,
    },
    {
      columnDef: 'website',
      header: 'website',
      cell: (element: Record<string, any>) => `${element['website']}`,
    },
    {
      columnDef: 'Customer Care WhatsApp Number',
      header: 'Customer Care WhatsApp Number',
      cell: (element: Record<string, any>) => `${element['Customer Care WhatsApp Number']}`,
    },
    {
      columnDef: 'Customer Care Number',
      header: 'Customer Care Number',
      cell: (element: Record<string, any>) => `${element['Customer Care Number']}`,
    },
    {
      columnDef: 'Customer Care Email',
      header: 'Customer Care Email',
      cell: (element: Record<string, any>) => `${element['Customer Care Email']}`,
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
      columnDef:'Head Office Contact Person',
      header:'Head Office Contact Person',
      cell: (element: Record<string, any>) => `${element['Head Office Contact Person']}`,

    },
    {
      columnDef:'Head Office Contact Person Mobile',
      header:'Head Office Contact Person Mobile',
      cell: (element: Record<string, any>) => `${element['Head Office Contact Person Mobile']}`,

    },
    {
      columnDef:'Head Office Contact Person Email',
      header:'Head Office Contact Person Email',
      cell: (element: Record<string, any>) => `${element['Head Office Contact Person Email']}`,

    },
    {
      columnDef:'Head Office Address',
      header:'Head Office Address',
      cell: (element: Record<string, any>) => `${element['Head Office Address']}`,
    },
    {
      columnDef:'Local Office Contact Person',
      header:'Local Office Contact Person',
      cell: (element: Record<string, any>) => `${element['Local Office Contact Person']}`,

    },
    {
      columnDef:'Local Office Contact Person Mobile',
      header:'Local Office Contact Person Mobile',
      cell: (element: Record<string, any>) => `${element['Local Office Contact Person Mobile']}`,

    },
    {
      columnDef:'Local Office Contact Email',
      header:'Local Office Contact Person Email',
      cell: (element: Record<string, any>) => `${element['Local Office Contact Email']}`,

    },
    {
      columnDef:'Local Office Address',
      header:'Local Office Address',
      cell: (element: Record<string, any>) => `${element['Local Office Address']}`,
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
    {
      columnDef: 'amc_code',
      header: 'AMC Code',
      cell: (element: Record<string, any>) => `${element['amc_code']}`,
    }
  ];
  tableData = new MatTableDataSource([
    {

      "AMC Full Name": 'HDFC Mutual Fund',
      "AMC Short Name":"HMF",
      "created_at": '2023-02-01T06:07:38.000000Z',
      "created_by": 0,
      "Customer Care WhatsApp Number": 180030106767,
      "Customer Care Email": 'hello@hdfcfund.com',
      "Customer Care Number": 180030106767,
      "distributor_care_no":"1111111111",
      "distributor_care_email":"hello@hdfcfund.com",
      "id": 11,
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
      "Office Address": 'G2, Thapar House, 163, S.P.Mukherjee Road, Kolkata-700026',
      "Product Id": 1,
      "updated_at": '2023-02-01T06:07:38.000000Z',
      "updated_by": "",
      "website": 'www.hdfcfund.com',
      "GSTIN":'GST-1234',
      "Head Office Contact Person":'TEST',
      "Head Office Contact Person Mobile":'1111111111',
      "Head Office Contact Person Email":'abc@gmail.com',
      "Head Office Address":'Bompas Road',
      "Local Office Contact Person":'TEST',
      "Local Office Contact Person Mobile":'1111111111',
      "Local Office Contact Email":'abc@gmail.com',
      "Local Office Address":'Bompas Road',
      "login_url":'www.google.com',
      "login_id":'nuedge@gmail.com',
      "login_pass":'XXXXX',
      "security_question_1": "",
      "security_answer_1": "",
      "security_question_2": "",
      "security_answer_2": "",
      "security_question_3": "",
      "security_answer_3": "",
      "security_question_4": "",
      "security_answer_4": "",
      "security_question_5": "",
      "security_answer_5": "",
      "security_question_6": "",
      "security_answer_6": "",
      "security_question_7": "",
      "security_answer_7": "",
      "amc_code":"001",
    },
  ]);
  __columns: string[] = ['sl_no', 'amc_name', 'edit'];
  __selectRNT = new MatTableDataSource<amc>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
    this.previewlatestRntEntry();
  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getRntMst();
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res: rnt[]) =>{
     this.__rntMst = res;
    })
  }
  previewlatestRntEntry() {
    this.__dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.__selectRNT = new MatTableDataSource(res.splice(0,5));
      });
  }

  populateDT(__items: amc) {
    this.__utility.navigatewithqueryparams('main/master/productwisemenu/amc', {
      queryParams: {
        amc_id: btoa(__items.id.toString()),
      },
    });
  }

  viewAll(){
    this.__utility.navigate('main/master/productwisemenu/amc');
    // this.__utility.navigatewithqueryparams('main/master/productwisemenu/amc', {
    //   queryParams: {
    //     product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
    //   },
    // });
  }
}
