import { Component, OnInit } from '@angular/core';
import { UtiliService } from 'src/app/__Services/utils.service';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
import { ManualEntrComponent } from './Dialog/manual-entr/manual-entr.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { RPTComponent } from './Dialog/rpt/rpt.component';
@Component({
  selector: 'app-stp-type',
  templateUrl: './stp-type.component.html',
  styleUrls: ['./stp-type.component.css']
})
export class StpTypeComponent implements OnInit {
  menus = menu.filter((x) => x.flag != 'U');
  constructor(
    private utility: UtiliService,
    private overlay: Overlay,
    private __dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }
  /*
    * This function is used to handle the click event on the menu items.
    * It checks the flag of the clicked item and opens the corresponding dialog.  
    * @param {any} item - The clicked menu item.
    * @return {void}
    * @memberof StpTypeComponent
    * */
  getItems(item){
    switch(item.flag){
      case 'M':this.openDialog(item);break;
      case 'R':this.openDialogForRPT(item);break;
    }
  }
  
  /** * This function is used to open a dialog for adding or updating STP Type.
 * It creates a MatDialogConfig object, sets various properties for the dialog,
 * and opens the ManualEntrComponent dialog with the provided configuration.
 * @param {any} item - The clicked menu item.
 * @return {void}
 * @memberof StpTypeComponent
 * @description
 * */
  openDialog(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag:'STP',
       id: 0,
       title: 'Add STP Type',
       items: null,
      product_id: '1'
    };
    dialogConfig.id = '0';
    try {
      const dialogref = this.__dialog.open(
        ManualEntrComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      console.log(ex);
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'STP',
      });
    }
  }
  /**
   * 
   * @param item - The clicked menu item.
   * @description
   * This function is used to open a dialog for generating reports related to STP Type.
   */
  openDialogForRPT(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "STPT",
    dialogConfig.data = {
      product_id: '1'
    }
    try {
      const dialogref = this.__dialog.open(
        RPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        product_id:'1'
      });
    }
  }
}
