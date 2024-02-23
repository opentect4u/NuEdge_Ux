import { Component, OnInit } from '@angular/core';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { global } from 'src/app/__Utility/globalFunc';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MftraxModificationComponent } from './dialog/mftrax-modification/mftrax-modification.component';
import { MfTraxReportComponent } from './dialog/mf-trax-report/mf-trax-report.component';

@Component({
  selector: 'app-mftrax',
  templateUrl: './mftrax.component.html',
  styleUrls: ['./mftrax.component.css']
})
export class MFTraxComponent implements OnInit {

  __menu = menu.filter(item => item.flag != 'U');

  constructor(
    private __dialog: MatDialog,
    private overlay: Overlay,
    private utility:UtiliService
  ) { }

  ngOnInit(): void {
  }

  getItems = (ev) =>{
      switch(ev.flag){
        case 'M' :this.openDialogForCreateMFTrax(null,0);break;
        default:  this.openDialogForReports();break;
      }
  }
  openDialogForCreateMFTrax = (mfTrax: IMFTrax | null = null,id:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'MFTRAX',
      id: id,
      exchange: mfTrax,
      title: id == 0 ? 'Add MFTrax' : 'Update MFTrax',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        MftraxModificationComponent,
        dialogConfig
      );
      // dialogref.afterClosed().subscribe((dt) => {
      // });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'MFTRAX',
      });
    }
  }

  openDialogForReports(id:string | null = ''){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "MFTRX",
    dialogConfig.data = {
      mf_trax_id:id,
      right: global.randomIntFromInterval(1, 60),
    }
    try {
      const dialogref = this.__dialog.open(
        MfTraxReportComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.utility.getmenuIconVisible({
        mf_trax_id:id
      });
    }
  }

}

export declare interface IMFTrax{
    mf_trax:string;
    id:number;
}
