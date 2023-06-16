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
  pincodeMst= new MatTableDataSource<any>([]);

  displayedColumns: Array<string> = [];

  tableColumns: Array<Column> = [
   {
    columnDef: 'pincode',
    header: 'Pincode',
    cell: (element: Record<string, any>) => `${element['pincode']}`
    },
    {
    columnDef: 'city_type',
    header: 'City Type',
    cell: (element: Record<string, any>) => `${element['city_type']}`
    }
 ];
  countryMst: any =[];
 tableData = new MatTableDataSource<any>([{
  pincode:123456,
  city_type:'X-30'
}]);
  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    this.getCoutryMst();
    this.getlatestPincode();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }

  getCoutryMst(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck('data')).subscribe(res =>{
        this.countryMst = res;
    })
  }

  getlatestPincode(){
    this.__dbIntr.api_call(0,'/pincode',null).pipe(pluck('data')).subscribe((res: any) =>{
      this.pincodeMst = new MatTableDataSource(res.splice(0,5))
})
  }
  viewAll(){
    this.__utility.navigate('/main/master/geographic/pincode');
  }
  populateDT(event){
    this.__utility.navigatewithqueryparams(
      '/main/master/geographic/pincode',
      {queryParams:{
        id:btoa(event.id)
      }}
      );

  }
}
