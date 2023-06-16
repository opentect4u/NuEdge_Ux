import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-upload-district',
  templateUrl: './upload-district.component.html',
  styleUrls: ['./upload-district.component.css']
})
export class UploadDistrictComponent implements OnInit {

  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }
  district = new MatTableDataSource<any>([]);
  displayedColumns: Array<string> = [];
  countryMst:any = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'district_name',
      header: 'District',
      cell: (element: Record<string, any>) => `${element['district_name']}`
    }
  ];

tableData = new MatTableDataSource<any>([{
    district_name:'XXXXXXX'
  }]);

  ngOnInit(): void {
    this.getlatestDistrict();
    this.getlatestCountry();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  getlatestDistrict(){
   this.__dbIntr.api_call(0,'/districts',null).pipe(pluck('data')).subscribe((res: any) =>{
             this.district = new MatTableDataSource(res.splice(0,5))
   })
  }
  getlatestCountry(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck("data")).subscribe(res =>{
      this.countryMst = res;
    })
  }
  populateDT(event){
    this.__utility.navigatewithqueryparams('/main/master/geographic/district',
    {
      queryParams:{
        id:btoa(event.id)
      }
    })
  }
  viewAll(){
    this.__utility.navigate('/main/master/geographic/district')
  }
}
