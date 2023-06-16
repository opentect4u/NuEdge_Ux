import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
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
      label:"Scheme",
      url:'/main/master/fixedeposit/scheme',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Upload CSV",
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
viewAll(){
  this.__utility.navigate('/main/master/fixedeposit/scheme');
}
}
