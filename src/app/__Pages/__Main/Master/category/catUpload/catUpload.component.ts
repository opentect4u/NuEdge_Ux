import { Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { category } from 'src/app/__Model/__category';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-catUpload',
  templateUrl: './catUpload.component.html',
  styleUrls: ['./catUpload.component.css'],
})
export class CatUploadComponent implements OnInit {

  prod_id = btoa('1');
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
      label:"Mutual Fund",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Category",
      url:'/main/master/productwisemenu/category',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Category Upload",
      url:'/main/master/productwisemenu/amc/uploadcategory',
      hasQueryParams:true,
      queryParams:''
    }
]

  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'Category',
      header: 'Category',
      cell: (element: Record<string, any>) => `${element['Category']}`,
      isDate: true,
    },
  ];
  tableData = new MatTableDataSource([{"Category": 'Others'},]);
  __columns: string[] = ['sl_no', 'Cat_name', 'edit'];
  __selectRNT = new MatTableDataSource<category>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
    this.previewlatestCategoryEntry();
  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestCategoryEntry() {
    this.__dbIntr
      .api_call(0, '/category', null)
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        this.__selectRNT = new MatTableDataSource(res.splice(0,5));
      });
  }
  populateDT(__items: category) {
    this.__utility.navigatewithqueryparams(
      '/main/master/productwisemenu/category',
      { queryParams: {
        id: btoa(__items.id.toString())
      } }
    );
  }
  showCorrospondingsubCategory(__rntDtls) {
    this.__utility.navigatewithqueryparams(
      '/main/master/productwisemenu/subcategory',
      {
        queryParams: {
          id: btoa(__rntDtls.id.toString())
      },
      }
    );
  }
  viewAll(){
    this.__utility.navigate(
      '/main/master/productwisemenu/category'
    );
  }
}
