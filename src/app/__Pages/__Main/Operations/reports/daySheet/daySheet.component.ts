import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Column } from 'src/app/__Model/column';
import { RPTService } from 'src/app/__Services/RPT.service';
// import { MatTableDataSource } from '@angular/material/table';
import { CmnDialogComponent } from '../common/cmnDialog/cmnDialog.component';

@Component({
  selector: 'reports-daySheet',
  templateUrl: './daySheet.component.html',
  styleUrls: ['./daySheet.component.css']
})
export class DaySheetComponent implements OnInit {
  //  __report = new MatTableDataSource<any>([]);
  __searchDT: string;
  tableColumns: Array<Column> = [
    {
      columnDef: 'Tin No',
      header: 'Tin Number',
      cell: (element: Record<string, any>) => `${element['tin_no']}`
    },
    {
      columnDef: 'Entry date',
      header: 'Entry Date',
      cell: (element: Record<string, any>) => `${element['entry_date']}`,
      isDate:true
      
    },
    {
      columnDef: 'form type',
      header: 'Transaction Type',
      cell: (element: Record<string, any>) => `${element['trans_name']}`
    },
    {
      columnDef: 'Client Name',
      header: 'Client Name',
      cell: (element: Record<string, any>) => `${element['client_name']}`
    },
    {
      columnDef: 'amc',
      header: 'Amc',
      cell: (element: Record<string, any>) => `${element['amc_name']}`
    },
    {
      columnDef: 'scheme name',
      header: 'Scheme Name',
      cell: (element: Record<string, any>) => `${element['scheme_to_name']}`
    },
    {
      columnDef: 'Login_at',
      header: 'Login At',
      cell: (element: Record<string, any>) => `${element['rnt_name']}`
    }
  ];
  tableData: Array<any> = [];

  __searchForm = new FormGroup({
    searchdate: new FormControl(this.__datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required])
  })

  constructor(private __datePipe: DatePipe, private __dialog: MatDialog, private __Rpt: RPTService) {
    console.log('Day Sheet Reports loaded');
  }

  ngOnInit() {
  }
  generateReport() {
    console.log(this.__searchForm.value);

  }
  openDialog() {
    // this.__dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = {
      title: 'Generate Day Sheet Reports',
      api_name: '/daysheetReport'
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(CmnDialogComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        console.log(dt);
        this.__searchDT = dt.date;
        this.tableData = dt.data;
      }
    });
  }
  exportasPDF($event) {
    if ($event) {
      this.__Rpt.downloadReport('#daySheetRpt',
        {
          date: this.__datePipe.transform(new Date(), 'yyyy-MM-dd h:mma'),
          title: 'Day Sheet Rports - ' + this.__searchDT
        }, 'Day_Sheet_' + this.__searchDT)
    }

  }
}
