import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Column } from 'src/app/__Model/column';
import { option } from 'src/app/__Model/option';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit {
  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'comp_type',
      header: 'Company Type',
      cell: (element: Record<string, any>) => `${element['comp_type']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
        comp_type: 'XXXXXXXX',
    },
  ]);
  __columns: string[] = ['sl_no', 'comp_type', 'edit'];
  __selectCompType = new MatTableDataSource<any>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __rtDt: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.previewCompanyType();

    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  previewCompanyType() {
    this.__dbIntr
      .api_call(0, '/fd/companyType', null)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: option[]) => {
        this.__selectCompType = new MatTableDataSource(res.slice(0,5));
      });
  }

  populateDT(__items: any) {
    this.__utility.navigatewithqueryparams(
      '/main/master/fixedeposit/companytype',
      { queryParams: {
        id: btoa(__items.id.toString())
           } }
    );
  }
  viewAll(){
    this.__utility.navigate('/main/master/fixedeposit/companytype');
  }
}
