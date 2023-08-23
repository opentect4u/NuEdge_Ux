import { Component, OnInit } from '@angular/core';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { global } from 'src/app/__Utility/globalFunc';
import { BenchmarkEntryComponent } from './Dialog/benchmark-entry/benchmark-entry.component';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css']
})
export class BenchmarkComponent implements OnInit,IBenchmarkDialog {
  __menu = menu;

  constructor(
    private utility:UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
    ) { }

  ngOnInit(): void {}
   getItems = (items) =>{
    switch (items.flag) {
      case 'M':
        this.openEntryDialog(null,0);
        break;
      case 'U':
        // this.utility.navigate(
        //   '/main/master/productwisemenu/scheme/isin/uploadIsin')
        break;
      case 'R':
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
}


export declare interface IBenchmarkDialog{

  openEntryDialog(benchmark:Ibenchmark,id:number):void;

}


export declare interface Ibenchmark{
      id:number;
     ex_id:number;
     benchmark:string;
     category_id:number;
     subcat_id:number;
     launch_date:Date;
     launch_price:string;
}
