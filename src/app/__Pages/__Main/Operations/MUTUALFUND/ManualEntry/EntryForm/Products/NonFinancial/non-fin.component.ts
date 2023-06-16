import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../../../../../assets/json/Master/commonMenuMst.json';
import { NonfinmodificationComponent } from './Dialog/nonFinModification/nonFInModification.component';
import { NonfinrptComponent } from './Dialog/nonfinRPT/nonFinRPT.component';

@Component({
  selector: 'app-non-fin',
  templateUrl: './non-fin.component.html',
  styleUrls: ['./non-fin.component.css']
})
export class NonFinComponent implements OnInit {
  menu = menu.filter((x: any) => x.flag != 'U');
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '';
  __transType_id: string =this.__rtDt.snapshot.paramMap.get('trans_type_id') ?  atob(this.__rtDt.snapshot.paramMap.get('trans_type_id')) : '';
  __prod_id: string = '1';
  constructor(
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __RtDT: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }
   getItems(event){
    switch(event.flag){
      case 'M': this.openDialog('0',null)
                 break; //open Modal For NonFinancial Modification
      case 'R': this.openDialogForRPT();
               break; //open Modal For NonFinancial Reports
      default: break;
    }

   }
   openDialog(__id: string | null = null, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.id = 'NonFin_' + __id;
    dialogConfig.data = {
      id: __id,
      title: 'Non Financial Entry',
      data: __items,
      trans_type: 'N',
      parent_id: this.__prod_id,
      trans_type_id:this.__transType_id,
      flag:'NonFin_'+ __id
    };
    dialogConfig.autoFocus = false;
    try{
      const dialogref = this.__dialog.open(NonfinmodificationComponent, dialogConfig);
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag:'NonFin_'+ __id
      });
    }
  }
  openDialogForRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "NONFINRPT",
    dialogConfig.data = {
      product_id: this.__prod_id,
      trans_type_id: this.__transType_id,
      trans_id:this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : ''
    }
    try {
      const dialogref = this.__dialog.open(
        NonfinrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      // this.__utility.getmenuIconVisible({

      // });
    }
  }
}
