import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Iexchange } from '../../exchange.component';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import { EntryComponent } from '../entry/entry.component';
import { sort } from 'src/app/__Model/sort';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';

@Component({
  selector: 'app-exchange-report',
  templateUrl: './exchange-report.component.html',
  styleUrls: ['./exchange-report.component.css']
})
export class ExchangeReportComponent implements OnInit {

  /**
   * Holding Exchange
   */

  paginate:string = '10';

  exchangeMstData:Iexchange[] = [];


  __isVisible: boolean = true;


  column = ExClm.column;


  sort = new sort();

  constructor(
    public dialogRef: MatDialogRef<ExchangeReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number,right:string},
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.getExchangeReport();
  }

  /**
   * Getting Exhange Master Data From Backend data
   */
  getExchangeReport = () =>{
   const exchange = new FormData();
   exchange.append('paginate', this.paginate);
   exchange.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
   exchange.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
   this.__dbIntr.api_call(0,'/exchangeDetailSearch',exchange)
   .pipe(
    pluck("data")
   )
   .subscribe((res:Iexchange[])=>{
    this.exchangeMstData = res;
   })
  }
  fullScreen() {
    this.dialogRef.updateSize("80%");
    this.__isVisible = !this.__isVisible;
  }
  minimize() {
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize() {
    this.fullScreen();
  }

  getColumns = () =>{
    return this.__utility.getColumns(this.column);
  }

  populateDT = (item:Iexchange) =>{
    console.log(item);
   this.openEntryDialog(item,item.id);
  }

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
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          this.updateRow(dt);
        }

      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'EXC',
      });
    }
  };

  updateRow = (item:Iexchange) =>{
        this.exchangeMstData = this.exchangeMstData.map(el =>
            el.id == item.id ? item : el
          );
  }

  customSort = (ev:sort) =>{
    this.sort = ev;
    this.getExchangeReport();
  }

   delete = (exchange:Iexchange,index:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'EX',
      id: exchange.id,
      title: 'Delete '  + exchange.ex_name,
      api_name:'/exchangeDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.exchangeMstData.splice(index,1);
        }
      }

    })
   }
}




export class ExClm{
    static column = [
      {field:'sl_no',header:'Sl No',width:'10rem'},
      {field:'ex_name',header:'Exchange',width:'83rem'},
      {field:'edit',header:'Edit',width:'7rem'},
      {field:'delete',header:'Delete',width:'7rem'}
    ]
}
