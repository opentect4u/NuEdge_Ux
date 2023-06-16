import { Component, OnInit } from '@angular/core';
import {breadCrumb} from '../../../../../__Model/brdCrmb';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Column } from 'src/app/__Model/column';
@Component({
  selector: 'app-upload-isin',
  templateUrl: './upload-isin.component.html',
  styleUrls: ['./upload-isin.component.css']
})
export class UploadISINComponent implements OnInit {
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
      label:atob(this.route.snapshot.queryParamMap.get('product_id')) == '1' ?  "Mutual Fund" : "Others",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:{id:this.route.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Scheme",
      url:'/main/master/productwisemenu/scheme',
      hasQueryParams:true,
      queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"ISIN",
      url:'/main/master/productwisemenu/scheme/isin',
      hasQueryParams:true,
      queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Upload ISIN",
      url:'/main/master/productwisemenu/scheme/uploadIsin',
      hasQueryParams:true,
      queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}
    }
 ]
 displayedColumns: Array<string> = [];

 tableColumns: Array<Column> = [
  {
    columnDef: 'scheme_name',
    header: 'Scheme Name',
    cell: (element: Record<string, any>) => `${element['scheme_name']}`
  },
  {
    columnDef: 'option',
    header: 'Option',
    cell: (element: Record<string, any>) => `${element['option']}`
  },
  {
    columnDef: 'plan',
    header: 'Plan',
    cell: (element: Record<string, any>) => `${element['plan']}`
  },

  {
    columnDef: 'isin',
    header: 'ISIN',
    cell: (element: Record<string, any>) => `${element['isin']}`
  },
];

tableData = new MatTableDataSource<any>(
  [
    {scheme_name:'XXXXXXXX',option:'XXXXXX',plan:'XXXXXXXX',isin:'123424'},
  ]
 )
  constructor(
    public route: ActivatedRoute,
    private utility: UtiliService,
    private __dbIntr:DbIntrService
  ) { }

  ngOnInit(): void {
    this.getBreadCrumb();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);

  }
  getBreadCrumb(){
    this.utility.getBreadCrumb(this.__brdCrmbs);
  }
  viewAll(){
     this.utility.navigate('/main/master/productwisemenu/scheme/isin')
  }
  populateDT(event){


  }
}
