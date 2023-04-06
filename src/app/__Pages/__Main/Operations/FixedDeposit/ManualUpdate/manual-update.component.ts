import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
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
      label:"Fixed Deposit",
      url:'/main/operations/fixedeposit',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Manual Update",
      url:'/main/operations/fixedeposit/manualupdate',
      hasQueryParams:false,
      queryParams:''
    }
];
__menu: any = [
  {
   id: 1,
   menu_name: "Manual Entry",
   flag:'M'
  },
  {
     id: 2,
     menu_name: "Report",
     flag:'R'
   },
]
  constructor(
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.setBrdCrmbs();
  }
  setBrdCrmbs(){
      this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__el){
    console.log(__el);
    switch(__el.flag){
      case 'M':
        this.openDialogForManualEntry();
        break;
      case 'R':
        this.openDialogForRPT();
        break;

    }
  }

  openDialogForManualEntry(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "FDMU",
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
    dialogConfig.id = "FDMU",
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
}
