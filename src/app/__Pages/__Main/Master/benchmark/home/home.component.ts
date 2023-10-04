import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { global } from 'src/app/__Utility/globalFunc';
import { BenchmarkEntryComponent } from '../Dialog/benchmark-entry/benchmark-entry.component';
import { BenchmarkReportComponent } from '../Dialog/benchmark-report/benchmark-report.component';
import { column } from 'src/app/__Model/tblClmns';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  __menu = menu;

  constructor(
    private utility:UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    private routeDtls:ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.routeDtls.queryParams
    .pipe(filter(params => params.dtls ? atob(params.dtls) : params.dtls))
    .subscribe(res =>{
         if(res){
          console.log(JSON.parse(atob(res.dtls)));
          this.openEntryDialog(JSON.parse(atob(res.dtls)),JSON.parse(atob(res.dtls)).id);
         }
    });
  }
   getItems = (items) =>{
    switch (items.flag) {
      case 'M':
        this.openEntryDialog(null,0);
        break;
      case 'U':
        this.utility.navigate(
          '/main/master/productwisemenu/benchmark/upload')
        break;
      case 'R':
        this.openDialogForReports();break;
      // this.opendialogForRPT();break;
    }
  }

  openEntryDialog = (benchmark:Ibenchmark,id:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'BENCH',
      id: id,
      benchmark: benchmark,
      title: id == 0 ? 'Add Benchmark' : 'Update Benchmark',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        BenchmarkEntryComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        console.log(dt);
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'BENCH',
      });
    }
  }

  openDialogForReports(benchmark_id :string | null = ''){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "BENCH",
    dialogConfig.data = {
      product_id:benchmark_id,
      right: global.randomIntFromInterval(1, 60),
    }
    try {
      const dialogref = this.__dialog.open(
        BenchmarkReportComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        product_id:benchmark_id,
      });
    }
  }
}


export declare interface IBenchmarkDialog{

  openEntryDialog(benchmark:Ibenchmark,id:number):void;
  openDialogForReports(benchmark_id :string | null):void;
}


export declare interface Ibenchmark{
      id:number;
     ex_id:number;
     ex_name?:string;
     benchmark:string;
     category_id:number;
     category_name:string;
     subcategory_name:string;
     exchange_name:string;
     subcat_id:number;
     launch_date:Date;
     base_value:string;
     base_date:Date;
}

export class benchmarkClmns{
    static column:column[] =
    [
      {field:'edit',header:'Edit',width:'6rem'},
      {field:'delete',header:'Delete',width:'6rem'},
      {field:'sl_no',header:'Sl No',width:'10rem'},
      {field:'exchange_name',header:'Exchange',width:'10rem'},
      {field:'benchmark',header:'Benchmark',width:'25rem'},
      {field:'launch_date',header:'Launch Date',width:'16rem'},
      {field:'base_date',header:'Base Date',width:'16rem'},
      {field:'base_value',header:'Base Value',width:'16rem'},
      {field:'category_name',header:'Category',width:'16rem'},
      {field:'subcategory_name',header:'Sub Category',width:'30rem'},
    ]
}