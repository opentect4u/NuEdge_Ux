import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { fdComp } from 'src/app/__Model/fdCmp';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

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
      label:"Company",
      url:'/main/master/fixedeposit/company',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Upload CSV",
      url:'/main/master/fixedeposit/uploadcsv',
      hasQueryParams:false,
      queryParams:''
    }
];

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
    comp_full_name: 'NuEdge Corporate Pvt Ltd',
    comp_short_name:'NCPL',
    dist_care_email:'abc@gmail.com',
    dist_care_no:1111111111,
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
__cmpMst = new MatTableDataSource<fdComp>([]);
__CmpTypeMst : any=[];
constructor(
  private __dbIntr: DbIntrService,
  public __rtDt: ActivatedRoute,
  private __utility: UtiliService
) { }

ngOnInit(): void {
  this.getCmpType();
  this.setBreadCrumb();
  this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
   this.getCompanyMst();
}
getCompanyMst(){
  this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe((res: fdComp[]) =>{
    this.__cmpMst = new MatTableDataSource(res.slice(0,5));
  })
}
setBreadCrumb(){
  this.__utility.getBreadCrumb(this.__brdCrmbs)
}
getCmpType(){
  this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe(res =>{
    this.__CmpTypeMst = res;
 })
}
populateDT(__el: fdComp){
  this.__utility.navigatewithqueryparams(
    '/main/master/fixedeposit/company',
    { queryParams: {
      id: btoa(__el.id.toString())
       } }
  );
}
viewAll(){
  this.__utility.navigate('/main/master/fixedeposit/company');
}
}