import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-map-city-type',
  templateUrl: './map-city-type.component.html',
  styleUrls: ['./map-city-type.component.css']
})
export class MapCityTypeComponent implements OnInit {


  city_type:ICityType[] = [];

  displayedColumns: Array<string> = [];

  tableColumns: Array<Column> = [
   {
    columnDef: 'pincode',
    header: 'Pincode',
    cell: (element: Record<string, any>) => `${element['pincode']}`
    }
 ];

 tableData = new MatTableDataSource<any>([{
  pincode:123456
}]);

  constructor(private dbIntr:DbIntrService) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getCityType();
  }

  upload = (ev) =>{

  }

  getCityType = () =>{
    this.dbIntr.api_call(0,'/cityType',null)
    .pipe(pluck('data'))
    .subscribe((res:ICityType[]) => {
      this.city_type = res;
    })
  }

}


export interface ICityType{
  id:number
  name: string;
}
