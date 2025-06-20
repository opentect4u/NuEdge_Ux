import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Overlay } from '@angular/cdk/overlay';
import { SiptypemodificationComponent } from './sipTypeModification/sipTypeModification.component';
import { SiptyperptComponent } from './sipTypeRpt/sipTypeRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
selector: 'sipType-component',
templateUrl: './sipType.component.html',
styleUrls: ['./sipType.component.css']
})
export class SiptypeComponent implements OnInit {
  __menu = menu.filter(item => item.flag != 'U');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog
    ) { }
  ngOnInit(): void {
  }
  /*
    * This function is used to open a dialog for adding or updating SIP Type.
    * It creates a MatDialogConfig object, sets various properties for the dialog,
    * and opens the SiptypemodificationComponent dialog with the provided configuration.
    * @param {number} id - The ID of the SIP Type to be added or updated.
    * @param {any} __items - Additional items to be passed to the dialog.
    * @return {void}
    * @memberof SiptypeComponent
    * @description
    * This function is responsible for opening a dialog for adding or updating SIP Type.
    * It creates a MatDialogConfig object, sets various properties for the dialog,
    * and opens the SiptypemodificationComponent dialog with the provided configuration.
    */
  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag:'SIP',
       id: id,
       title: id == 0 ? 'Add SIP Type' : 'Update SIP Type',
      items: __items,
      product_id: '1'
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        SiptypemodificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      // console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SIP',
      });
    }
  }
  /**
   * 
   * @param __menu - The menu item that was clicked.
   * @description
   * This function is used to handle the click event on menu items.
   */
  getItems = (__menu) => {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(0,null);
        break;
      case 'R':
        this.openDialogForReports('1')
        break;
      default:
        break;
    }
  }
  /*
    * This function is used to open a dialog for generating reports related to SIP Type.
    * It creates a MatDialogConfig object, sets various properties for the dialog,
    * and opens the SiptyperptComponent dialog with the provided configuration.
    * @param {string} __prdId - The product ID for which the report is to be generated.
    * @return {void}  
    * @memberof SiptypeComponent
    * @description
    * This function is responsible for opening a dialog for generating reports related to SIP Type.
    * It creates a MatDialogConfig object, sets various properties for the dialog,
    * and opens the SiptyperptComponent dialog with the provided configuration.
    */
  openDialogForReports(__prdId){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "ST",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        SiptyperptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prdId
      });
    }
  }
}
