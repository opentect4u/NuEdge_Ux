import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { global } from 'src/app/__Utility/globalFunc';
import { RcvformrptComponent } from './rcvFormRpt/rcvFormRpt.component';
import { RcvmodificationComponent } from './rcvModification/rcvModification.component';
import { RcvformmodifyfornfoComponent } from './rcvFormModifyForNFO/rcvFormModifyForNFO.component';
import { RcvfrmmodificationfornonfinComponent } from './rcvFormmodificationForNonFIn/rcvFrmModificationForNonFin.component';
@Component({
  selector: 'app-form-recieve',
  templateUrl: './form-recieve.component.html',
  styleUrls: ['./form-recieve.component.css']
})
export class FormRecieveComponent implements OnInit {
  menu = menu.filter((x: any) => x.flag != 'U')
  constructor(
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  getItems(event){
    console.log(event);
    switch(event.flag){
      case 'M': this.openDialog(0);break;
      case 'R':this.openDialogForReports();break;
      default: break;
     }
  }


  private openDialog(id) {
    var type = atob(this.__rtDt.snapshot.paramMap.get('type_id')) == '4'
    ? 'NFO_'
    : atob(this.__rtDt.snapshot.paramMap.get('type_id')) == '1'
    ? 'Financial_' : 'Non_Financial_';
    const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = false;
     dialogConfig.width = '80%';
     dialogConfig.id = id > 0  ? (type + id.toString()) : type+"0";
     dialogConfig.hasBackdrop = false;
     dialogConfig.disableClose = false;
     dialogConfig.autoFocus = false;
     dialogConfig.closeOnNavigation = false;
     dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
     try{
       dialogConfig.data = {
       data:null,
       flag:type + 'RF',
       id: 0,
       title: 'Form Recievable' + (atob(this.__rtDt.snapshot.paramMap.get('type_id')) == '4' ? ' - NFO' : (atob(this.__rtDt.snapshot.paramMap.get('type_id')) == '1' ? ' - Financial' : ' - Non Financial')),
       product_id:'1',
       trans_type_id:atob(this.__rtDt.snapshot.paramMap.get('type_id')),
       temp_tin_no:null,
       right:global.randomIntFromInterval(1,60)
     };
     var  dialogref;
       if(atob(this.__rtDt.snapshot.paramMap.get('type_id')) == '1'){
         dialogref = this.__dialog.open(RcvmodificationComponent, dialogConfig);
       }
       else if(atob(this.__rtDt.snapshot.paramMap.get('type_id')) == '4'){
         dialogref = this.__dialog.open(RcvformmodifyfornfoComponent, dialogConfig);
       }
       else{
         dialogref = this.__dialog.open(RcvfrmmodificationfornonfinComponent, dialogConfig);
       }
       dialogref.afterClosed().subscribe(dt => {
         if (dt) {
         }
       });
     }
     catch(ex){
       console.log(ex);

       const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
       dialogRef.updateSize("80%");
       this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:(type + 'RF')})
     }
   }
   openRcvForm(__items){
    switch(__items.flag){
     case 'A': this.openDialog(0);break;
     case 'R':
     this.openDialogForReports();
     break;
     default: break;

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
       dialogConfig.id = "FRR_" + this.__rtDt.snapshot.paramMap.get('type_id'),
       dialogConfig.data = {
          trans_id:
          this.__rtDt.snapshot.queryParamMap.get('trans_id')
          ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '',
          trans_type_id:
          this.__rtDt.snapshot.paramMap.get('type_id')
          ? atob(this.__rtDt.snapshot.paramMap.get('type_id')) : '',
          product_id:'1',

       }
       try {
         const dialogref = this.__dialog.open(
           RcvformrptComponent,
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
