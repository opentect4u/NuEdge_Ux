import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { insComp } from 'src/app/__Model/insComp';
import { insProduct } from 'src/app/__Model/insproduct';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.css'],
})
export class UploadProductComponent implements OnInit {
  __insTypeMst: any = [];
  __cmpMst: insComp[] = [];
  __prdMst = new MatTableDataSource<insProduct>([]);
  __columns: string[] = ['sl_no', 'product_name', 'edit'];
  __brdCrmbs: breadCrumb[] = [
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label:
        atob(this.rtDt.snapshot.queryParamMap.get('product_id')) == '3'
          ? 'Insurance'
          : 'Others',
      url: '/main/master/insurance',
      hasQueryParams: true,
      queryParams: { id: this.rtDt.snapshot.queryParamMap.get('product_id') },
    },
    {
      label: 'Product',
      url: '/main/master/insurance/product',
      hasQueryParams: false,
      queryParams: {
        product_id: this.rtDt.snapshot.queryParamMap.get('product_id'),
      },
    },
    {
      label: 'Upload Product',
      url: '/main/master/insurance/uploadproduct',
      hasQueryParams: false,
      queryParams: {
        product_id: this.rtDt.snapshot.queryParamMap.get('product_id'),
      },
    },
  ];

  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'Product',
      header: 'Product Name',
      cell: (element: Record<string, any>) => `${element['Product']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      Product: 'XXXXXXXX',
    },
  ]);
  constructor(
    public rtDt: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getProductMst();
    this.getInsTypeMst();
    this.setBreadCrumbs();
  }
  setBreadCrumbs() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  getInsTypeMst() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        console.log(res);

        this.__insTypeMst = res;
      });
  }
  getcompanyMst(res: string) {
    this.__dbIntr
      .api_call(0, '/ins/company', 'ins_type_id=' + res)
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__cmpMst = res;
      });
  }
  getProductMst() {
    this.__dbIntr
      .api_call(0, '/ins/product', null)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: insProduct[]) => {
        this.__prdMst = new MatTableDataSource(res.splice(0,5));
      });
  }
  populateDT(__el: insProduct) {
    this.__utility.navigatewithqueryparams('/main/master/insurance/product', {
      queryParams: {
        id: btoa(__el.id.toString()),
        product_id: this.rtDt.snapshot.queryParamMap.get('product_id'),
      },
    });
  }
  viewAll() {
    this.__utility.navigatewithqueryparams('/main/master/insurance/product', {
      queryParams: {
        product_id: this.rtDt.snapshot.queryParamMap.get('product_id'),
      },
    });
  }
}
