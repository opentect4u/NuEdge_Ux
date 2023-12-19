import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-uploadSubcat',
  templateUrl: './uploadSubcat.component.html',
  styleUrls: ['./uploadSubcat.component.css'],
})
export class UploadSubcatComponent implements OnInit {
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'Sub Category',
      header: 'Sub Category',
      cell: (element: Record<string, any>) => `${element['Sub Category']}`,
      isDate: true,
    },
  ];
  tableData = new MatTableDataSource([
    {
      "Sub Category": 'Others'
    },
  ]);
  __columns: string[] = ['sl_no', 'subcate', 'edit'];
  __selectRNT = new MatTableDataSource<subcat>([]);
  __catMst: category[] = [];
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.previewlatestCategoryEntry();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
    this.getCategory();
  }
  getCategory(){
    this.__dbIntr.api_call(0,'/category',null).pipe(pluck("data")).subscribe((res: category[]) =>{
     this.__catMst = res;
    })
  }
  previewlatestCategoryEntry() {
    this.__dbIntr
      .api_call(0, '/subcategory', null)
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {
        this.__selectRNT = new MatTableDataSource(res.splice(0,5));
      });
  }
  populateDT(__items: subcat) {
    // this.__utility.navigate('/main/master/cateModify', btoa(__items.id.toString()));
    this.__utility.navigatewithqueryparams(
      '/main/master/productwisemenu/subcategory',
      // { queryParams: {
      //   sub_cat_id: btoa(__items.id.toString()),
      // } }

      { queryParams: {
        sub_cat_id: this.__utility.encrypt_dtls(__items.id.toString()),
      } }
    );
  }
  viewAll(){
    this.__utility.navigate(
      '/main/master/productwisemenu/subcategory'
    );
  }
}
