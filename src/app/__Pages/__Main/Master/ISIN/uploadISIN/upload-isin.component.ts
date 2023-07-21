import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Column } from 'src/app/__Model/column';
import { plan } from 'src/app/__Model/plan';
import { option } from 'src/app/__Model/option';
import { amc } from 'src/app/__Model/amc';
import { scheme } from 'src/app/__Model/__schemeMst';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-upload-isin',
  templateUrl: './upload-isin.component.html',
  styleUrls: ['./upload-isin.component.css']
})
export class UploadISINComponent implements OnInit {
 displayedColumns: Array<string> = [];
 planMst = new MatTableDataSource<plan>([]);
 optionMst = new MatTableDataSource<option>([]);
 schemeMst = new MatTableDataSource<scheme>([]);

 amcMst:amc[] = [];
 isinMst:any =[];

 optClm:string[] = ['id','opt_name'];
 planClm:string[] = ['id','plan_name'];
 scmClm:string[] = ['id','scheme_name'];

 tableColumns: Array<Column> = [
  {
    columnDef: 'scheme_name',
    header: 'Scheme Name',
    cell: (element: Record<string, any>) => `${element['scheme_name']}`
  },
  {
    columnDef: 'option',
    header: 'Option',
    cell: (element: Record<string, any>) => `${element['option']}`
  },
  {
    columnDef: 'plan',
    header: 'Plan',
    cell: (element: Record<string, any>) => `${element['plan']}`
  },

  {
    columnDef: 'isin',
    header: 'ISIN',
    cell: (element: Record<string, any>) => `${element['isin']}`
  },
  {
    columnDef:'prod_code',
    header: 'Product Code',
    cell: (element: Record<string, any>) => `${element['prod_code']}`
  }
];

tableData = new MatTableDataSource<any>(
  [
    {scheme_name:'XXXXXXXX',option:'XXXXXX',plan:'XXXXXXXX',isin:'123424',prod_code:''},
  ]
 )
  constructor(
    public route: ActivatedRoute,
    private utility: UtiliService,
    private __dbIntr:DbIntrService
  ) { }

  ngOnInit(): void {
    this.getAmcMst();
    this.getplanMst();
    this.getoptionMst();
    // this.getISINMst();
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
  }
  viewAll(){
     this.utility.navigate('/main/master/productwisemenu/scheme/isin')
  }
  /**
   * getting plan master data
   */
  getplanMst = () =>{
    this.__dbIntr.api_call(0,'/plan',null)
    .pipe(pluck("data"))
    .subscribe((res:plan[]) =>{
         this.planMst = new MatTableDataSource(res);
    })
  }
  /**
   * getting option master data
   */
  getoptionMst = () =>{
    this.__dbIntr.api_call(0,'/option',null)
    .pipe(pluck("data"))
    .subscribe((res:option[]) =>{
         this.optionMst = new MatTableDataSource(res);
    })
  }

  /**
   * get scheme against scheme
   * @param amc_id
   */

  getAmcWisescheme = (amc_id:number) =>{
    this.__dbIntr.api_call(0,'/scheme','amc_id='+amc_id)
    .pipe(pluck("data"))
    .subscribe((res:scheme[]) =>{
         this.schemeMst = new MatTableDataSource(res);
    })
  }

  /**
   * get Amc Master data
   */

  getAmcMst = () =>{
    this.__dbIntr.api_call(0,'/amc',null)
    .pipe(pluck("data"))
    .subscribe((res:amc[]) =>{
         this.amcMst = res;
    })
  }

  /**
   * get ISIN Master data
   */
  getISINMst = () => {
    this.__dbIntr.api_call(1,'/schemeISINDetailSearch',
    this.utility.convertFormData({paginate:'5'})).
    pipe(pluck("data")).subscribe((res: any) =>{
      this.isinMst = res.data;
    })
  }

  /**
   * populate selected data in scheme ISIN
   * @param ev
   */
  populateDT = (__items) =>{
    this.utility.navigatewithqueryparams(
      '/main/master/productwisemenu/scheme/isin',
    {queryParams: {id:btoa(__items.id.toString())}}
    )
  }
}
