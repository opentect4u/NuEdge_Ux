import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { EntryComponent } from './Dialog/entry/entry.component';
import { ManualupdateSearchComponent } from './Dialog/manualupdate-search/manualupdate-search.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';

@Component({
  selector: 'app-manual-update',
  templateUrl: './manual-update.component.html',
  styleUrls: ['./manual-update.component.css']
})
export class ManualUpdateComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Insurance",
      url:'/main/operations/insurance',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Manual Update",
      url:'/main/operations/insurance/manualupdate',
      hasQueryParams:true,
      queryParams:''
    }
  ];

  __menu = [
    {
      "parent_id": 4,
      "menu_name": "Manual Entry",
      "has_submenu": "N",
      "url": "",
      "icon":"",
      "id":16,
      "flag":"M"
    },
    {
    "parent_id": 4,
    "menu_name": "Reports",
    "has_submenu": "N",
    "url": "",
    "icon":"",
    "id":16,
    "flag":"R"
    }
  ];
  constructor(
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) {
    this.setBreadCrumb();
   }
   setBreadCrumb(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
   }
  ngOnInit(): void {
    console.log('sss');

  }
  openManualUpdate(__items){
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
