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
  cityTypeMst= new MatTableDataSource<any>([]);

  displayedColumns: Array<string> = [];

  tableColumns: Array<Column> = [
    {
    columnDef: 'city_type',
    header: 'City Type',
    cell: (element: Record<string, any>) => `${element['city_type']}`
    }
 ];

 tableData = new MatTableDataSource<any>([{
  city_type:'X-00'
}]);
  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    this.getcityTypeMst();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);

  }
getcityTypeMst(){
  this.__dbIntr.api_call(0,'/cityType',null).pipe(pluck('data')).subscribe((res: any) =>{
    this.cityTypeMst = new MatTableDataSource(res.splice(0,5))
  })
}
viewAll(){
  this.__utility.navigate('/main/master/geographic/cityType')
}
populateDT(event){
  this.__utility.navigatewithqueryparams(
    '/main/master/geographic/cityType',
    {
      queryParams:{
        id:btoa(event.id)
      }
    }
    )
}
}
