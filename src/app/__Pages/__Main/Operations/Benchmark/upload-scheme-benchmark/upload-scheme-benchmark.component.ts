import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/__Model/column';
import { Iexchange } from '../../../Master/exchange/exchange.component';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
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
      benchmark:'',
      date:'DD-MM-YYYY',
      open:'',
      high:'',
      low:'',
      close:'',
    }
  ]);
  constructor(private dbIntr:DbIntrService,private utility:UtiliService) {
   }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    // this.getExchangeMst();
  }

  // getExchangeMst = () =>{
  //   this.dbIntr.api_call(0,'/exchange',null).pipe(pluck('data')).subscribe((res:Iexchange[]) =>{
  //     this.exchangeMst = res;
  //   })
  // }

  uploadSchemeBenchmark = (
   file_dtls:IuploadFile
  ) =>{

    const dt: Partial<IuploadFile> = {
      file: file_dtls.file,
      end_count: file_dtls.end_count,
      start_count: file_dtls.start_count,
    };
    this.reccursiveUpload(dt);
  }




  reccursiveUpload = (dt: Partial<IuploadFile>) => {
    // if(dt.total_count == dt.end_count){
    this.dbIntr
      .api_call(1, '/benchmarkSchemeimport',
      this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        if (res.total_count == dt.end_count) {
          this.utility.showSnackbar('File Successfully Uploaded',1);
          return;
        }
        dt.start_count = Number(dt.end_count) + 1;
        dt.end_count =
          Number(res.end_count) + 500 > Number(res.total_count)
            ? Number(res.total_count)
            : Number(res.end_count) + 500;
        dt.total_count = res.total_count;
        this.reccursiveUpload(dt);
      });
  };

}

export interface IuploadFile{
  start_count:number | undefined,
  end_count:number| undefined,
  file:FileList | undefined,
  total_count:number | undefined
}
