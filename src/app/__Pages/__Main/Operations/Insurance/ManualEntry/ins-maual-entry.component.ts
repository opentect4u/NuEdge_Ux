import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { InsTraxRPTComponent } from './Dialog/ins-trax-rpt/ins-trax-rpt.component';
import { TraxEntryComponent } from './Dialog/trax-entry/trax-entry.component';

@Component({
  selector: 'app-ins-maual-entry',
  templateUrl: './ins-maual-entry.component.html',
  styleUrls: ['./ins-maual-entry.component.css']
})
export class InsMaualEntryComponent implements OnInit {
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
      label:"Trax",
      url:'/main/operations/insurance/trax',
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
    },
    {
      "parent_id": 4,
      "menu_name": "Renewal Buisness opportunity",
      "has_submenu": "N",
      "url": "",
      "icon":"",
      "id":16,
      "flag":"R"
      },

  ];
  constructor(
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.setBreadCrumbs();
  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs)
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
  openDialog(__insTrax,__id){
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
      flag:'INSTRAX',
      id: 0,
      title: 'Insurance Trax',
      right:global.randomIntFromInterval(1,60),
      tin_no: __insTrax ? __insTrax.tin_no : '',
      data:''
    };
    console.log(dialogConfig.data);
    const   dialogref = this.__dialog.open(TraxEntryComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {});
    }
    catch(ex){
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("80%");
      this.__utility.getmenuIconVisible({
        id:Number(dialogConfig.id),
        isVisible:false,
        flag:'INSTRAX'})
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
    dialogConfig.id = "INSRPT",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        InsTraxRPTComponent,
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
