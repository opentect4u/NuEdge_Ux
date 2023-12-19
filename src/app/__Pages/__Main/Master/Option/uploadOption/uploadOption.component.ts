import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { option } from 'src/app/__Model/option';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';

@Component({
  selector: 'app-uploadOption',
  templateUrl: './uploadOption.component.html',
  styleUrls: ['./uploadOption.component.css'],
})
export class UploadOptionComponent implements OnInit {
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
      label:"Option",
      url:'/main/master/productwisemenu/option',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Option Upload",
      url:'/main/master/productwisemenu/option/uploadOption',
      hasQueryParams:true,
      queryParams:''
    }
]
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'opt_name',
      header: 'Option',
      cell: (element: Record<string, any>) => `${element['opt_name']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      opt_name: 'XXXXXXXX',
    },
  ]);
  __columns: string[] = ['sl_no', 'opt_name', 'edit'];
  __selectOpt = new MatTableDataSource<option>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.previewlatestOptEntry();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestOptEntry() {
    this.__dbIntr
      .api_call(0, '/option', null)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: option[]) => {
        this.__selectOpt = new MatTableDataSource(res.splice(0,5));
      });
  }

  populateDT(__items: option) {
    this.__utility.navigatewithqueryparams(
      '/main/master/productwisemenu/option',
      // { queryParams: {
      //   id: btoa(__items.id.toString()),
      // } }
      { queryParams: {
        id: this.__utility.encrypt_dtls(__items.id.toString()),
      } }
    );
  }
  viewAll(){
    this.__utility.navigate(
      '/main/master/productwisemenu/option'
    );
  }
}
