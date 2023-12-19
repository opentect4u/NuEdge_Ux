import { Component, OnInit } from '@angular/core';
import { pluck, take } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Ibenchmark } from '../home/home.component';
import { Observable, from, of } from 'rxjs';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Column } from 'src/app/__Model/column';
import { MatTableDataSource } from '@angular/material/table';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { Iexchange } from '../../exchange/exchange.component';

@Component({
  selector: 'app-upload-benchmark',
  templateUrl: './upload-benchmark.component.html',
  styleUrls: ['./upload-benchmark.component.css']
})
export class UploadBenchmarkComponent implements OnInit {


  displayedColumns: Array<string> = [];
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
      columnDef: 'launch_date',
      header: 'Launch Date',
      cell: (element: Record<string, any>) => `${element['launch_date']}`,
    },
    {
      columnDef: 'launch_price',
      header: 'Launch Price',
      cell: (element: Record<string, any>) => `${element['launch_price']}`,
    },
    {
      columnDef: 'cat_name',
      header: 'Category',
      cell: (element: Record<string, any>) => `${element['cat_name']}`,
    },
    {
      columnDef: 'subcat_name',
      header: 'Sub Category',
      cell: (element: Record<string, any>) => `${element['subcat_name']}`,
    },
  ];
  tableData = new MatTableDataSource([
    {
      ex_name: 'XXXXXXXX',
      benchmark: 'XXXXXXXX',
      launch_date: 'DD/MM/YYYY',
      launch_price: 'XXXXXXXX',
      cat_name: 'XXXXXXXX',
      subcat_name: 'XXXXXXXX',
    },
  ]);

  benchmark:Ibenchmark[] = [];
  category:category[] = [];
  subcategory:subcat[] = [];
  exchange:Iexchange[] = [];
  constructor(
    private utility:UtiliService,
    private dbItnr:DbIntrService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.getBenchmark();
    // this.getCategory();
    this.getSubcategory();
    this.getExchangeMaster();
  }

  getBenchmark = () =>{
     this.dbItnr.api_call(0,'/benchmark',null)
     .pipe(pluck('data'))
     .subscribe((res:Observable<Ibenchmark[]>) =>{
        from(res).pipe(take(5)).subscribe((data:any) =>{
          this.benchmark.push(data);
        })
     })
  }

  private getCategory = () =>{
   this.dbItnr.api_call(0,'/category',null).pipe(pluck('data'))
   .subscribe((res:category[]) =>{
       this.category = res;
   })
  }

  private getSubcategory = () =>{
    this.dbItnr.api_call(0,'/subcategory',null).pipe(pluck('data'))
    .subscribe((res:subcat[]) =>{
        this.subcategory = res;
    })
  }

  private getExchangeMaster = () =>{
    this.dbItnr.api_call(0,'/exchange',null).pipe(pluck('data'))
    .subscribe((res:Iexchange[]) =>{
        this.exchange = res;
    })

  }

  populateDT = (ev) =>{
    this.utility.navigatewithqueryparams(
      '/main/master/productwisemenu/benchmark',
      // { queryParams: {dtls: btoa(JSON.stringify(ev))} })
      { queryParams: {dtls: this.utility.encrypt_dtls(JSON.stringify(ev))} })


  }
  viewAll=()=>{
    this.utility.navigate('/main/master/productwisemenu/benchmark');
  }

}
