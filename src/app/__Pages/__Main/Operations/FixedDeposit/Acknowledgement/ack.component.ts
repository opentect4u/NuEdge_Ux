import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { AckRPTComponent } from './Dialog/ack-rpt/ack-rpt.component';
import { AckSearchRPTComponent } from './Dialog/ack-search-rpt/ack-search-rpt.component';

@Component({
  selector: 'app-ack',
  templateUrl: './ack.component.html',
  styleUrls: ['./ack.component.css']
})
export class AckComponent implements OnInit {
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
      label:"Acknowledgement Trax",
      url:'/main/operations/fixedeposit/ack',
      hasQueryParams:true,
      queryParams:''
    }
  ];
  __menu: any = [
    {
     id: 1,
     menu_name: "Acknowledgement Entry",
     has_submenu: "N",
     flag:'A'
    },
    {
       id: 2,
       menu_name: "Report",
       has_submenu: "N",
       url:"",
       flag:'R'
     },
 ]

  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.setBreadCrumbs();
  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs)
  }
  openDialog(__items){
    switch(__items.flag){
      case 'A': this.opendialogForAckEntry();break;
      case 'R': this.openDialogForRPT();break;
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
  dialogConfig.id = "FDACKRPT",
  dialogConfig.data = {}
  try {
    const dialogref = this.__dialog.open(
      AckRPTComponent,
      dialogConfig
    );
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
  }
  }
  opendialogForAckEntry(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "FDACK",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        AckSearchRPTComponent,
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
