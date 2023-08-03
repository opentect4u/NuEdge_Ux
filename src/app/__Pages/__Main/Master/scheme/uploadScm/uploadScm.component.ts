import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { Column } from 'src/app/__Model/column';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
@Component({
  selector: 'app-uploadScm',
  templateUrl: './uploadScm.component.html',
  styleUrls: ['./uploadScm.component.css']
})
export class UploadScmComponent implements OnInit {
  __prod_id=btoa('1');
  __colcat: string[] = ['id','cat_name'];
  __colAmc: string[] = ['id','amc_short_name'];
  __colsubCate: string[] = ['id','cat_name','subcat_name']
  __amcMaster =  new MatTableDataSource<amc>([]);
  __catMaster =  new MatTableDataSource<category>([]);
  __subcatMaster = new MatTableDataSource<subcat>([]);
  displayedColumns: Array<string> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableColumns: Array<Column> = [
    {
      columnDef: 'amc__short_name',
      header: 'AMC Short Name',
      cell: (element: Record<string, any>) => `${element['amc__short_name']}`
    },
    {
      columnDef: 'cat_name',
      header: 'Category Name',
      cell: (element: Record<string, any>) => `${element['cat_name']}`
    },
    {
      columnDef: 'sub_cat_name',
      header: 'Sub Category Name',
      cell: (element: Record<string, any>) => `${element['sub_cat_name']}`
    },

    {
      columnDef: 'Scheme',
      header: 'Scheme',
      cell: (element: Record<string, any>) => `${element['Scheme']}`
    },
    {
      columnDef: 'NFO Start Date',
      header: 'NFO Start Date',
      cell: (element: Record<string, any>) => `${element['NFO Start Date']}`,
      isDate: true
    },
    {
      columnDef: 'NFO End Date',
      header: 'NFO End Date',
      cell: (element: Record<string, any>) => `${element['NFO End Date']}`,
      isDate: true
    },
    {
      columnDef: 'NFO Reopen Date',
      header: 'NFO Reopen Date',
      cell: (element: Record<string, any>) => `${element['NFO Reopen Date']}`,
      isDate: true
    } ,
    {
      columnDef: 'Entry Date',
      header: 'Entry Date',
      cell: (element: Record<string, any>) => `${element['Entry Date']}`,
      isDate: true
    } ,
    {
      columnDef: 'PIP Fresh Minimum Amount',
      header: 'PIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['PIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'PIP Additional Minimum Amount',
      header: 'PIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['PIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'SIP Date',
      header: 'SIP Date',
      cell: (element: Record<string, any>) => `${element['SIP Date']}`,
      isDate: true
    },
    {
      columnDef: 'Daily SIP Fresh Minimum Amount',
      header: 'Daily SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Daily SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Daily SIP Additional Minimum Amount',
      header: 'Daily SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Daily SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Weekly SIP Fresh Minimum Amount',
      header: 'Weekly SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Weekly SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Weekly SIP Additional Minimum Amount',
      header: 'Weekly SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Weekly SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Fortnightly SIP Fresh Minimum Amount',
      header: 'Fortnightly SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Fortnightly SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Fortnightly SIP Additional Minimum Amount',
      header: 'Fortnightly SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Fortnightly SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Monthly SIP Fresh Minimum Amount',
      header: 'Monthly SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Monthly SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Monthly SIP Additional Minimum Amount',
      header: 'Monthly SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Monthly SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Quarterly SIP Fresh Minimum Amount',
      header: 'Quarterly SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Quarterly SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Quarterly SIP Additional Minimum Amount',
      header: 'Quarterly SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Quarterly SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Semi Anually SIP Fresh Minimum Amount',
      header: 'Semi Anually SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Semi Anually SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Semi Anually SIP Additional Minimum Amount',
      header: 'Semi Anually SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Semi Anually SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Anually SIP Fresh Minimum Amount',
      header: 'Anually SIP Fresh Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Anually SIP Fresh Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Anually SIP Additional Minimum Amount',
      header: 'Anually SIP Additional Minimum Amount',
      cell: (element: Record<string, any>) => `${element['Anually SIP Additional Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Special SIP',
      header: 'Special SIP',
      cell: (element: Record<string, any>) => `${element['Special SIP']}`,
      isDate: true
    },

    {
      columnDef: 'SWP Date',
      header: 'SWP Date',
      cell: (element: Record<string, any>) => `${element['SWP Date']}`,
      isDate: true
    },

    {
      columnDef: 'Daily SWP Amount',
      header: 'Daily SWP Amount',
      cell: (element: Record<string, any>) => `${element['Daily SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Weekly SWP Amount',
      header: 'Weekly SWP Amount',
      cell: (element: Record<string, any>) => `${element['Weekly SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Fortnightly SWP Amount',
      header: 'Fortnightly SWP Amount',
      cell: (element: Record<string, any>) => `${element['Fortnightly SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Monthly SWP Amount',
      header: 'Monthly SWP Amount',
      cell: (element: Record<string, any>) => `${element['Monthly SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Quarterly SWP Amount',
      header: 'Quarterly SWP Amount',
      cell: (element: Record<string, any>) => `${element['Quarterly SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Semi Anually SWP Amount',
      header: 'Semi Anually SWP Amount',
      cell: (element: Record<string, any>) => `${element['Semi Anually SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Anually SWP Amount',
      header: 'Anually SWP Amount',
      cell: (element: Record<string, any>) => `${element['Anually SWP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Special SWP',
      header: 'Special SWP',
      cell: (element: Record<string, any>) => `${element['Special SWP']}`,
      isDate: true
    },
    {
      columnDef: 'STP Date',
      header: 'STP Date',
      cell: (element: Record<string, any>) => `${element['STP Date']}`,
      isDate: true
    },

    {
      columnDef: 'Daily STP Amount',
      header: 'Daily STP Amount',
      cell: (element: Record<string, any>) => `${element['Daily STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Weekly STP Amount',
      header: 'Weekly STP Amount',
      cell: (element: Record<string, any>) => `${element['Weekly STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Fortnightly STP Amount',
      header: 'Fortnightly STP Amount',
      cell: (element: Record<string, any>) => `${element['Fortnightly STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Monthly STP Amount',
      header: 'Monthly STP Amount',
      cell: (element: Record<string, any>) => `${element['Monthly STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Quarterly STP Amount',
      header: 'Quarterly STP Amount',
      cell: (element: Record<string, any>) => `${element['Quarterly STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Semi Anually STP Amount',
      header: 'Semi Anually STP Amount',
      cell: (element: Record<string, any>) => `${element['Semi Anually STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Anually STP Amount',
      header: 'Anually STP Amount',
      cell: (element: Record<string, any>) => `${element['Anually STP Amount']}`,
      isDate: true
    },
    {
      columnDef: 'Special STP',
      header: 'Special STP',
      cell: (element: Record<string, any>) => `${element['Special STP']}`,
      isDate: true
    },
    {
      columnDef: 'STEP UP Minimum Amount',
      header: 'STEP UP Minimum Amount',
      cell: (element: Record<string, any>) => `${element['STEP UP Minimum Amount']}`,
      isDate: true
    },
    {
      columnDef: 'STEP UP Minimum Percentage',
      header: 'STEP UP Minimum Percentage',
      cell: (element: Record<string, any>) => `${element['STEP UP Minimum Percentage']}`,
      isDate: true
    },
    {
      columnDef: 'bench_mark',
      header: 'Benchmark',
      cell: (element: Record<string, any>) => `${element['bench_mark']}`,
      isDate: true
    },
  ];

   __dataTbleForNFO = [
    {
        "cat_name":"XXXX",
        "sub_cat_name":"XXXX",
        "amc__short_name":"XXXX",
        "Scheme":"Others1",
        "Id":2,
        "NFO Start Date":'27-02-2023',
        "NFO End Date":'27-02-2023',
        "NFO Reopen Date":'27-02-2023',
        'Entry Date':'27-02-2023',
        "PIP Fresh Minimum Amount":2000,
        "PIP Additional Minimum Amount":4000,
        "SIP Date":'1,2,3',
        "Daily SIP Fresh Minimum Amount":"2000",
        "Daily SIP Additional Minimum Amount": "2000",
        "Weekly SIP Fresh Minimum Amount":"2000",
        "Weekly SIP Additional Minimum Amount": "2000",
        "Fortnightly SIP Fresh Minimum Amount":"2000",
        "Fortnightly SIP Additional Minimum Amount": "2000",
        "Monthly SIP Fresh Minimum Amount":"2000",
        "Monthly SIP Additional Minimum Amount": "2000",
        "Quarterly SIP Fresh Minimum Amount":"2000",
        "Quarterly SIP Additional Minimum Amount": "2000",
        "Semi Anually SIP Fresh Minimum Amount":"2000",
        "Semi Anually SIP Additional Minimum Amount": "2000",
        "Anually SIP Fresh Minimum Amount":"2000",
        "Anually SIP Additional Minimum Amount": "2000",
        'Special SIP':"",
        "SWP Date":'1,2,3',
        "Daily SWP Amount":"2000",
        "Weekly SWP Amount":"2000",
        "Fortnightly SWP Amount":"2000",
        "Monthly SWP Amount":"2000",
        "Quarterly SWP Amount":"2000",
        "Semi Anually SWP Amount":"2000",
        "Anually SWP Amount":"2000",
        'Special SWP':"",
        "STP Date":'1,2,3',
        "Daily STP Amount":"2000",
        "Weekly STP Amount":"2000",
        "Fortnightly STP Amount":"2000",
        "Monthly STP Amount":"2000",
        "Quarterly STP Amount":"2000",
        "Semi Anually STP Amount":"2000",
        "Anually STP Amount":"2000",
        'Special STP':"",
        "STEP UP Minimum Amount":"",
        "STEP UP Minimum Percentage":"",
        "bench_mark":""
    }
   ];
   __dataTbleForOngoing = [
    {
      "cat_name":"XXXX",
      "sub_cat_name":"XXXX",
      "amc__short_name":"XXXX",
      "Scheme":"Others1",
      "Id":2,
      "PIP Fresh Minimum Amount":2000,
      "PIP Additional Minimum Amount":4000,
      "SIP Date":'1,2,3',
      "Daily SIP Fresh Minimum Amount":"2000",
      "Daily SIP Additional Minimum Amount": "2000",
      "Weekly SIP Fresh Minimum Amount":"2000",
      "Weekly SIP Additional Minimum Amount": "2000",
      "Fortnightly SIP Fresh Minimum Amount":"2000",
      "Fortnightly SIP Additional Minimum Amount": "2000",
      "Monthly SIP Fresh Minimum Amount":"2000",
      "Monthly SIP Additional Minimum Amount": "2000",
      "Quarterly SIP Fresh Minimum Amount":"2000",
      "Quarterly SIP Additional Minimum Amount": "2000",
      "Semi Anually SIP Fresh Minimum Amount":"2000",
      "Semi Anually SIP Additional Minimum Amount": "2000",
      "Anually SIP Fresh Minimum Amount":"2000",
      "Anually SIP Additional Minimum Amount": "2000",
      'Special SIP':"",
      "SWP Date":'1,2,3',
      "Daily SWP Amount":"2000",
      "Weekly SWP Amount":"2000",
      "Fortnightly SWP Amount":"2000",
      "Monthly SWP Amount":"2000",
      "Quarterly SWP Amount":"2000",
      "Semi Anually SWP Amount":"2000",
      "Anually SWP Amount":"2000",
      'Special SWP':"",
      "STP Date":'1,2,3',
      "Daily STP Amount":"2000",
      "Weekly STP Amount":"2000",
      "Fortnightly STP Amount":"2000",
      "Monthly STP Amount":"2000",
      "Quarterly STP Amount":"2000",
      "Semi Anually STP Amount":"2000",
      "Anually STP Amount":"2000",
      'Special STP':"",
      "STEP UP Minimum Amount":"",
      "STEP UP Minimum Percentage":"",
      "bench_mark":""
    }
   ]
  tableData = new MatTableDataSource<any>(this.__dataTbleForNFO);
  __columns: string[] = ['sl_no', 'scm_name', 'edit'];
  __selectRNT = new MatTableDataSource<scheme>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __route: ActivatedRoute) { this.previewlatestCategoryEntry(); }

  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
    this.getCategory();
    this.getAmc();
    this.getSubcategory();
  }

  private getCategory(){
    this.__dbIntr.api_call(0, '/catUsingPro', 'product_id=1').pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
     this.__catMaster = new MatTableDataSource(res);
   })
  }

  private getAmc(){
    this.__dbIntr.api_call(0,'/amc','product_id=1').pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.__amcMaster = new MatTableDataSource(res);
    })
  }
private getSubcategory(){
  this.__dbIntr.api_call(0,'/subcategory','product_id=1').pipe(map((x: responseDT) => x.data)).subscribe((res: subcat[]) => {
    this.__subcatMaster = new MatTableDataSource(res);
  })
}

  previewlatestCategoryEntry() {
    this.__dbIntr.api_call(0, '/scheme', null).pipe(pluck('data')).subscribe((res: scheme[]) => {
      this.__selectRNT = new MatTableDataSource(res.splice(0,5));
    })
  }
  populateDT(__items: scheme) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/scheme',
    {queryParams: {id:btoa(__items.id.toString()),flag:btoa(__items.scheme_type)}});
  }

viewAll(){
  this.__utility.navigate('/main/master/productwisemenu/scheme');
  // this.__utility.navigatewithqueryparams('/main/master/productwisemenu/scheme',
  // {queryParams: {product_id:this.__route.snapshot.queryParamMap.get('product_id')}});
}
setSchemeType(scmType){
  const columnsforNFO = ['NFO Start Date','NFO End Date','NFO Reopen Date','Entry Date']
  this.tableData = new MatTableDataSource(scmType == 'N' ? this.__dataTbleForNFO : this.__dataTbleForOngoing);
   if(scmType == 'O'){
     this.displayedColumns = this.displayedColumns.filter((x) => !columnsforNFO.includes(x));
   }
   else{
     this.displayedColumns.splice(4,0,...columnsforNFO)
   }
}
}
