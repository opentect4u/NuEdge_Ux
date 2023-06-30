import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { TrxEntryComponent } from './Dialog/trx-entry/trx-entry.component';
import { TraxRPTComponent } from './Dialog/trax-rpt/trax-rpt.component';

@Component({
  selector: 'app-fd-trax',
  templateUrl: './fd-trax.component.html',
  styleUrls: ['./fd-trax.component.css']
})
export class FdTraxComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
  }
  openTrax(__el){
    console.log(__el);
    switch(__el.flag){
      case "R":
      this.openDIalogForRPT();
      break;
      case "M":
      this.openDialog(null,0);
      break;

    }
  }
  openDIalogForRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "FDTRAXRPT",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        TraxRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({

      });
    }
  }
  openDialog(__traxDtls,__id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id = __id;
    console.log(dialogConfig.id);
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      dialogConfig.data = {
      flag:'FDRAX',
      id: 0,
      title: 'FD Trax',
      right:global.randomIntFromInterval(1,60),
      tin_no: __traxDtls ? __traxDtls.tin_no : '',
      data:''
    };
    console.log(dialogConfig.data);
    const   dialogref = this.__dialog.open(TrxEntryComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {});
    }
    catch(ex){
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("80%");
      this.__utility.getmenuIconVisible({
        id:Number(dialogConfig.id),
        isVisible:false,
        flag:'FDTRAX'})
    }
  }
}
