import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/__Model/column';
import { Iexchange } from '../../../Master/exchange/exchange.component';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-upload-scheme-benchmark',
  templateUrl: './upload-scheme-benchmark.component.html',
  styleUrls: ['./upload-scheme-benchmark.component.css']
})
export class UploadSchemeBenchmarkComponent implements OnInit {
  displayedColumns: Array<string> = [];
  exchangeMst:Iexchange[] = [];
  tableColumns: Array<Column> = [
    {
      columnDef: 'ex_name',
      header: 'Exchange',
      cell: (element: Record<string, any>) => `${element['ex_name']}`,
    },
    {
      columnDef: 'benchmark',
      header: 'Benchmark',
      cell: (element: Record<string, any>) => `${element['benchmark']}`,
    },
    {
      columnDef: 'date',
      header: 'Date',
      cell: (element: Record<string, any>) => `${element['date']}`,
    },
    {
      columnDef: 'open',
      header: 'Open',
      cell: (element: Record<string, any>) => `${element['open']}`,
    },
    {
      columnDef: 'high',
      header: 'High',
      cell: (element: Record<string, any>) => `${element['high']}`,
    },
    {
      columnDef: 'low',
      header: 'Low',
      cell: (element: Record<string, any>) => `${element['low']}`,
    },
    {
      columnDef: 'close',
      header: 'Close',
      cell: (element: Record<string, any>) => `${element['close']}`,
    },
  ];
  scheme_benchmark = new MatTableDataSource([
    {
      ex_name:'',
      benchmark:'',
      date:'YYYY-MM-DD',
      open:'',
      high:'',
      low:'',
      close:'',
    }
  ]);
  constructor(private dbIntr:DbIntrService) {
   }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getExchangeMst();
  }

  getExchangeMst = () =>{
    this.dbIntr.api_call(0,'/exchange',null).pipe(pluck('data')).subscribe((res:Iexchange[]) =>{
      this.exchangeMst = res;
    })
  }

}
