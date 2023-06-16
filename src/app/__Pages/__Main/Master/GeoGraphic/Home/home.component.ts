import { Component, OnInit } from '@angular/core';
import geographicalMst from '../../../../../../assets/json/Master/geographicalMst.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { GeographicRPTComponent } from '../geographic-rpt/geographic-rpt.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  geographicalMaster = geographicalMst;
  constructor(private utility: UtiliService, private __dialog: MatDialog,private overlay: Overlay) { }
  ngOnInit(): void {}
  getItems(event){
    if(event.url){
      this.utility.navigate(event.url);
    }
    else{
      // Report
      this.openDialogForReports();
    }
  }

  openDialogForReports(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "R"
    try {
      const dialogref = this.__dialog.open(
        GeographicRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      // this.utility.getmenuIconVisible({
      //   amc_id:amc_id,
      //   rnt_id:__rnt_id
      // });
    }

  }
}
