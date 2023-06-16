import { Component, OnInit } from '@angular/core';
import kycMenu from '../../../../../../../../assets/json/Operations/kycMenu.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Overlay } from '@angular/cdk/overlay';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { KyModificationComponent } from './Dialog/kyModification/kyModification.component';
import { KycrptComponent } from './Dialog/KycRpt/kycRPT.component';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-kychome',
  templateUrl: './kychome.component.html',
  styleUrls: ['./kychome.component.css']
})
export class KychomeComponent implements OnInit {
  menu = kycMenu;
  constructor(
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute,
    private __utility:UtiliService,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) { }
  ngOnInit(): void {}
  openDialog(id: string | null = null, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      if (id) {
        this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __items.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
          console.log(res);
          dialogConfig.data = {
            id: id,
            title: 'Update Kyc Status',
            items: res[0],
            kyc_data: __items
          };
          const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
          dialogref.afterClosed().subscribe(dt => {
          });

        })
      }
      else {
        dialogConfig.data = {
          id: 0,
          title: 'Add KYC',
          items: __items
        };
        const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
        });
      }
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }

  }

  getItems(event){
    switch(event.flag){
      case 'M':this.openDialog('','');break;
      case 'R': this.openDialogRPT();break;
      case 'A': this.__utility.navigate('/main/operations/dashboard/manualEntr/kycTrax/acknowledgement');break;
      case 'U': this.__utility.navigate('/main/operations/dashboard/manualEntr/kycTrax/manualupdate');break;

      default: break;
    }
  }
  openDialogRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "KYC_RPT";
    try {
      const dialogref = this.__dialog.open(
        KycrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      // this.__utility.getmenuIconVisible({
      //   amc_id:amc_id,
      //   rnt_id:__rnt_id
      // });
    }

  }

}
