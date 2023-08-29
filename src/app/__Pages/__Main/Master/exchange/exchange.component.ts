import { Component, OnInit } from '@angular/core';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { EntryComponent } from './Dialog/entry/entry.component';
import { global } from 'src/app/__Utility/globalFunc';
import { ExchangeReportComponent } from './Dialog/Report/exchange-report.component';


@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css'],
})
export class ExchangeComponent implements OnInit,IDialog {
  /**
   * Hodling menus i.e Manual Entry,Upload CSV / Reports
   */
  __menu = menu;

  constructor(
    private utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
    ) {}

  ngOnInit(): void {}


  openEntryDialog(exchange:Iexchange | null = null,id:number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'EXC',
      id: id,
      exchange: exchange,
      title: id == 0 ? 'Add Exchange' : 'Update Exchange',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        EntryComponent,
        dialogConfig
      );
      // dialogref.afterClosed().subscribe((dt) => {
      // });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'EXC',
      });
    }
  };

  /**
   * Event trigger on click on menu
   * @param items
   */
  getItems = (items) => {
    switch (items.flag) {
      case 'M':
        this.openEntryDialog(null,0);
        break;
      case 'U':
        // this.utility.navigate(
        //   '/main/master/productwisemenu/scheme/isin/uploadIsin')
        break;
      case 'R':
        this.openDialogForReports();break;
      // this.opendialogForRPT();break;
    }
  };

  openDialogForReports(id:string | null = ''){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "BENCH",
    dialogConfig.data = {
      exchange_id:id,
      right: global.randomIntFromInterval(1, 60),
    }
    try {
      const dialogref = this.__dialog.open(
        ExchangeReportComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        exchange_id:id
      });
    }
  }
}

export declare interface IDialog{

  openEntryDialog(exhange:Iexchange,id:number):void;

  openDialogForReports(id:string | null):void;
}


export declare interface Iexchange{
     ex_name:string;
     id:number;
}
