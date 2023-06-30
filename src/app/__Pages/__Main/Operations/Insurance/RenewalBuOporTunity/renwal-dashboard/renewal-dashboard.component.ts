import { Component, OnInit } from '@angular/core';
import commonMenu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { global } from 'src/app/__Utility/globalFunc';
import { EntryComponent } from './Dialog/entry/entry.component';
import { ReportComponent } from './Dialog/report/report.component';
@Component({
  selector: 'app-renewal-dashboard',
  templateUrl: './renewal-dashboard.component.html',
  styleUrls: ['./renewal-dashboard.component.css']
})
export class RenewalDashboardComponent implements OnInit {
  __menu = commonMenu.filter(item => item.flag!= 'U');
  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  getItems(ev){
    console.log(ev);
    switch(ev.flag){
      case 'M': this.openDialogForEntry();break;
      case 'R': this.openDialogForRPT();break;

    }

  }
  openDialogForEntry(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60%';
    dialogConfig.id ='0'
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      dialogConfig.data = {
      flag:'RBO',
      data:null,
      id: 0,
      title: 'Renewal Buisness opportunity Entry',
      product_id:'3',
      temp_tin_no:null,
      right:global.randomIntFromInterval(1,60)
    };
      var  dialogref = this.__dialog.open(EntryComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {});
    }
    catch(ex){
      console.log(ex);

      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("80%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:'RBO'})
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
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.id = 'RBORPT';
    try {
      const dialogref = this.__dialog.open(ReportComponent, dialogConfig);
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
