import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { submenu } from 'src/app/__Model/submenu';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ReportComponent } from './Dialog/report/report.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';

@Component({
  selector: 'app-fdcertificate',
  templateUrl: './fdcertificate.component.html',
  styleUrls: ['./fdcertificate.component.css']
})
export class FDCertificateComponent implements OnInit {
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
      label:"FD Certificate Delivery",
      url:'/main/operations/fixedeposit/fdcertificate',
      hasQueryParams:false,
      queryParams:''
    }
];
__menu = [
  {
   id: 1,
   menu_name: "Manual Entry",
   flag:'M'
  },
  {
     id: 2,
     menu_name: "Reports",
     flag:'R'
   }
]

  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.setBreadCrumb();
  }
  setBreadCrumb(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  openFdCertificate(__el){
    switch(__el.flag){
      case "R": this.openDIalogForRPT();break;
      case "M": this.openDialog(null,0);break;
    }
  }
  openDialog(__frmData,__id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "FDCD",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        SearchRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({

      });
    }
  }
  openDIalogForRPT()
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "FDCD",
    dialogConfig.data = {}
    try {
      const dialogref = this.__dialog.open(
        ReportComponent,
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
