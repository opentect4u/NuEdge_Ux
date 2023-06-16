import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
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
      label:"Geographical Master",
      url:'/main/master/geographic',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Country",
      url:'/main/master/geographic/country',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Upload Country",
      url:'/main/master/geographic/country/uploadcountry',
      hasQueryParams:true,
      queryParams:''
    }
]
 countryMst= new MatTableDataSource<any>([]);

 displayedColumns: Array<string> = [];

 tableColumns: Array<Column> = [
  {
    columnDef: 'country_name',
    header: 'Country',
    cell: (element: Record<string, any>) => `${element['country_name']}`
  }
];

tableData = new MatTableDataSource<any>([{country_name:'XXXXXXXX'}]);

  constructor(
    private utility: UtiliService,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    // this.utility.getBreadCrumb(this.__brdCrmbs);
    this.getlatestCountry();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  getlatestCountry(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck("data")).subscribe((res: any) =>{
      this.countryMst = new MatTableDataSource(res.splice(0,5));
    })
  }
  populateDT(event){
    this.utility.navigatewithqueryparams('/main/master/geographic/country',
    {
      queryParams:{
        id:btoa(event.id)
      }
    })
  }
  viewAll(){
    this.utility.navigate('/main/master/geographic/country')
  }
}
