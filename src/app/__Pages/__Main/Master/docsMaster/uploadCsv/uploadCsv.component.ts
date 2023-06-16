import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pluck, take } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { docType } from 'src/app/__Model/__docTypeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
@Component({
  selector: 'app-uploadCsv',
  templateUrl: './uploadCsv.component.html',
  styleUrls: ['./uploadCsv.component.css'],
})
export class UploadCsvComponent implements OnInit {
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
      label: 'Document Type',
      url: '/main/master/docType',
      hasQueryParams: true,
      queryParams: '',
    },
    {
      label: 'Document Type Upload',
      url: '/main/master/uploadDocTypeCsv',
      hasQueryParams: true,
      queryParams: '',
    },
  ];

  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'doc_type',
      header: 'Document Type',
      cell: (element: Record<string, any>) => `${element['doc_type']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      doc_type: 'TEST',
    },
  ]);
  __columns: string[] = ['sl_no', 'doc_type', 'edit'];
  __selectRNT = new MatTableDataSource<docType>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {
    this.previewlatestDocumnetType();
  }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  previewlatestDocumnetType() {
    this.__dbIntr
      .api_call(0, '/documenttype', null)
      .pipe(pluck('data'), take(5))
      .subscribe((res: docType[]) => {
        this.__selectRNT = new MatTableDataSource(res.slice(0, 5));
      });
  }
  populateDT(__items: docType) {
    this.__utility.navigatewithqueryparams('/main/master/docType', {
      queryParams: { id: btoa(__items.id.toString()) },
    });
  }
  viewAll() {
    this.__utility.navigate('/main/master/docType');
  }
}
