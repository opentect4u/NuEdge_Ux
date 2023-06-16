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
  cityMst= new MatTableDataSource<any>([]);
  countryMst: any =[];
  displayedColumns: Array<string> = [];

  tableColumns: Array<Column> = [
 {
  columnDef: 'city_name',
  header: 'City',
  cell: (element: Record<string, any>) => `${element['city_name']}`
 }
 ];

 tableData = new MatTableDataSource<any>([{city_name:'XXXXXX'}]);
  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getlatestCity();
    this.getCountryMst();
  }
  getlatestCity(){
   this.__dbIntr.api_call(0,'/city',null).pipe(pluck('data')).subscribe((res: any) =>{
        this.cityMst = new MatTableDataSource(res.splice(0,5));
   })
  }
  getCountryMst(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck('data')).subscribe(res =>{
      this.countryMst = res;
    })
  }
  populateDT(event){
    this.__utility.navigatewithqueryparams('/main/master/geographic/city',
    {
      queryParams:{
        id:btoa(event.id)
      }
    })
  }
  viewAll(){
    this.__utility.navigate('/main/master/geographic/city')
  }
}
