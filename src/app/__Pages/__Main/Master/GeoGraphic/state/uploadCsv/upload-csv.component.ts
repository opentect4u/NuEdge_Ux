import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit {

  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }
  state = new MatTableDataSource<any>([]);
  displayedColumns: Array<string> = [];
  countryMst:  any=[];
 tableColumns: Array<Column> = [
  {
    columnDef: 'state_name',
    header: 'State',
    cell: (element: Record<string, any>) => `${element['state_name']}`
  }
];

tableData = new MatTableDataSource<any>([
  {
    state_name:'XXXXXX'
  }]);
  ngOnInit(): void {
    this.getlatestState();
    this.getCountryMst();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  getCountryMst(){
   this.__dbIntr.api_call(0,'/country',null).pipe(pluck("data")).subscribe((res: any) =>{
    this.countryMst = res;
  })
  }
  getlatestState(){
    this.__dbIntr.api_call(0,'/states',null).pipe(pluck('data')).subscribe((res: any) =>{
        this.state = new MatTableDataSource(res.splice(0,5));
    })
  }
  viewAll(){
    this.__utility.navigate('/main/master/geographic/state');
  }
  populateDT(event){
    this.__utility.navigatewithqueryparams(
      '/main/master/geographic/state',
      {
        queryParams:{
          id:btoa(event.id)
        }
      }
      );

  }
}
