import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { plan } from 'src/app/__Model/plan';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-uploadPln',
  templateUrl: './uploadPln.component.html',
  styleUrls: ['./uploadPln.component.css'],
})
export class UploadPlnComponent implements OnInit {
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
      label:"Plan",
      url:'/main/master/productwisemenu/plan',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Upload Plan",
      url:'/main/master/productwisemenu/plan/uploadPln',
      hasQueryParams:true,
      queryParams:''
    }
]
  displayedColumns: Array<string> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableColumns: Array<Column> = [
    {
      columnDef: 'Plan',
      header: 'Plan',
      cell: (element: Record<string, any>) => `${element['Plan']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      "Plan": 'XXXXXXXX',
    },
  ]);
  __columns: string[] = ['sl_no', 'rnt_name', 'edit'];
  __selectRNT = new MatTableDataSource<plan>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
    this.previewlatestRntEntry();
  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestRntEntry() {
    this.__dbIntr
      .api_call(0, '/plan', null)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: plan[]) => {
        this.__selectRNT = new MatTableDataSource(res);
        this.__selectRNT.paginator = this.paginator;
      });
  }

  populateDT(__items: plan) {
    this.__utility.navigatewithqueryparams(
      '/main/master/productwisemenu/plan',
      { queryParams: {id: btoa(__items.id.toString())} }
    );
  }
  viewAll(){
    this.__utility.navigate('/main/master/productwisemenu/plan');
  }
}
