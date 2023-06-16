import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-upload-prd-type',
  templateUrl: './upload-prd-type.component.html',
  styleUrls: ['./upload-prd-type.component.css']
})
export class UploadPrdTypeComponent implements OnInit {
  displayedColumns: Array<string> = [];
  tableData = new MatTableDataSource([
    {
      "product_type":"Annuity"
    }
  ]);
  tableColumns: Array<Column> = [
    {
      columnDef: 'Product Type',
      header: 'Product Type',
      cell: (element: Record<string, any>) => `${element['product_type']}`,
    }
  ]
  __columns: string[] = ['sl_no','product_type','edit'];
  __productTypeMst= new MatTableDataSource<insPrdType>([]);
  constructor(
    private __dbIntr: DbIntrService,
    public __rtDt: ActivatedRoute,
    private __utility: UtiliService
  ) { }
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
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '3' ?  "Insurance" : "Others",
      url:'/main/master/insurance',
      hasQueryParams:true,
      queryParams:{id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Product Type",
      url:'/main/master/insurance/producttype',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Upload Product Type",
      url:'/main/master/insurance/uploadproducttype',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
 instTypeMst: any=[];
  ngOnInit(): void {
    this.getProductType();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getInsTypeMst();

  }
  getInsTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
    this.instTypeMst = res;
    })
  }
  getProductType(){
   this.__dbIntr.api_call(0,'/ins/productType',null).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
    this.__productTypeMst = new MatTableDataSource(res.slice(0,5));
   })
  }
  populateDT(__el: insPrdType){
    this.__utility.navigatewithqueryparams(
      '/main/master/insurance/producttype',
      { queryParams: {
        id: btoa(__el.id.toString()),
      } }
    );
  }
  viewAll(){
    this.__utility.navigate(
      '/main/master/insurance/producttype'
    );
  }
}
