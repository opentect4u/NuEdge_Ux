import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { bank } from 'src/app/__Model/__bank';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';

@Component({
  selector: 'app-bankUpload',
  templateUrl: './bankUpload.component.html',
  styleUrls: ['./bankUpload.component.css']
})
export class BankUploadComponent implements OnInit {

  displayedColumns: Array<string> = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'ifs_code',
      header: 'IFSC',
      cell: (element: Record<string, any>) => `${element['ifs_code']}`
    },
    {
      columnDef: 'bank_name',
      header: 'Bank',
      cell: (element: Record<string, any>) => `${element['bank_name']}`,
      isDate: true
    },
    {
      columnDef: 'branch_name',
      header: 'Branch',
      cell: (element: Record<string, any>) => `${element['branch_name']}`,
      isDate: true
    }
    ,
    {
      columnDef: 'micr_code',
      header: 'MICR',
      cell: (element: Record<string, any>) => `${element['micr_code']}`,
      isDate: true
    } ,
    {
      columnDef: 'branch_addr',
      header: 'Branch Address',
      cell: (element: Record<string, any>) => `${element['branch_addr']}`,
      isDate: true
    }
  ];
  tableData = new MatTableDataSource(
    [{
      bank_name: "Others",
      ifs_code: 1,
      branch_name:"HB",
      branch_addr:"Sodepur,Kamarpara",
      micr_code:"M-1234"
    }]
  );
  __columns: string[] = ['sl_no', 'bank_name', 'edit'];
  __selectRNT = new MatTableDataSource<bank>([]);
  constructor(private __dbIntr: DbIntrService, private __utility: UtiliService) { }

  ngOnInit() {
    this.previewlatestCategoryEntry();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  previewlatestCategoryEntry() {
    this.__dbIntr.api_call(0, '/depositbank', null).pipe(pluck('data')).subscribe((res: bank[]) => {
      this.__selectRNT = new MatTableDataSource(res.splice(0,5));
    })
  }
  populateDT(__items: bank) {
    this.__utility.navigatewithqueryparams('/main/master/bank',{queryParams: {id:btoa(__items.id.toString())}});
  }
viewAll(){
  this.__utility.navigate('/main/master/bank');
}
}
