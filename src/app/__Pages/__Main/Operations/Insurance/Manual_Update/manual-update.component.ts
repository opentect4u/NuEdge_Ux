import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualupdateSearchComponent } from './Dialog/manualupdate-search/manualupdate-search.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-manual-update',
  templateUrl: './manual-update.component.html',
  styleUrls: ['./manual-update.component.css']
})
export class ManualUpdateComponent implements OnInit {
  __menu =  menu.filter(item => item.flag != 'U');

  // [
  //   {
  //     "parent_id": 4,
  //     "menu_name": "Manual Entry",
  //     "has_submenu": "N",
  //     "url": "",
  //     "icon":"",
  //     "id":16,
  //     "flag":"M"
  //   },
  //   {
  //   "parent_id": 4,
  //   "menu_name": "Reports",
  //   "has_submenu": "N",
  //   "url": "",
  //   "icon":"",
  //   "id":16,
  //   "flag":"R"
  //   }
  // ];
  constructor(
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) {
   }
  ngOnInit(): void {
  }
  getItems = (__items) => {
    switch(__items.flag){
      case 'R':this.openDialogForRPT();break;
      case 'M':this.openDiaog();break;
      default: break;
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
    dialogConfig.id = "INSMURPT",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        RPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
  openDiaog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "INSMU",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        ManualupdateSearchComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({

      });
    }

  }
}
