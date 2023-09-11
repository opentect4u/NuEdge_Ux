import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { global } from 'src/app/__Utility/globalFunc';
import { BenchmarkEntryForReportComponent } from '../benchmark-entry-for-report/benchmark-entry-for-report.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu =  menu.filter(item => item.flag != 'R');
  constructor(
    private utility:UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  getItems = (ev) =>{
    switch(ev.flag){
      case 'M' :
        this.openDialog();
        break;
      case 'U' :
        this.utility.navigate('main/operations/benchmark/uploadSchemeBenchmark');
        break;
       default:break;
    }
  }

  openDialog = () =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'BENCH',
      title: 'Add Scheme Benchmark',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = '0';
    try {
      const dialogref = this.__dialog.open(
        BenchmarkEntryForReportComponent,
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
