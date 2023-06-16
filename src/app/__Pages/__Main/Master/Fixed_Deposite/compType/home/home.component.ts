import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RptComponent } from '../dialog/rpt/rpt.component';
import { ComptypeCrudComponent } from '../dialog/comptype-crud/comptype-crud.component';
import { global } from 'src/app/__Utility/globalFunc';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu =menu;
  constructor(
    private rtDt:ActivatedRoute,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    if(this.rtDt.snapshot.queryParamMap.get('id')){
      this.previewParticularcompany(atob(this.rtDt.snapshot.queryParamMap.get('id')))
    }
  }
  getItems(event){
    switch (event.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate('/main/master/fixedeposit/companytype/uploadCompanyType');
        break;
        case 'R':
          this.openDialogForReport();
          break;
      default:
        break;
    }
  }
  previewParticularcompany(cmpId){
    this.__dbIntr.api_call(0,'/fd/companyType','id='+cmpId).pipe(pluck("data")).subscribe(res =>{
     this.openDialog(res[0],res[0].id)
   })
  }
  openDialog(__cmp ,__id){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = false;
     dialogConfig.closeOnNavigation = false;
     dialogConfig.disableClose = true;
     dialogConfig.hasBackdrop = false;
     dialogConfig.width = '40%';
     dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
     dialogConfig.data = {
       flag: 'Fixed_CMP',
       id: __id,
       items: __cmp,
       title: __id == 0 ? 'Add Company Type' : 'Update Company Type',
       right: global.randomIntFromInterval(1,60),
     };

     dialogConfig.id = __id > 0 ? __id.toString() : '0';
     try {
       const dialogref = this.__dialog.open(
         ComptypeCrudComponent,
         dialogConfig
       );
       dialogref.afterClosed().subscribe((dt) => {
         if (dt) {
           if (dt?.id > 0) {
             // this.updateRow(dt.data);
           } else {
             // this.addRow(dt.data);
           }
         }
       });
     } catch (ex) {
       console.log(ex);
       const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
       dialogRef.updateSize('40%');
       this.__utility.getmenuIconVisible({
         id: Number(dialogConfig.id),
         isVisible: false,
         flag: 'Fixed_CMP',
       });
     }

   }

   openDialogForReport(){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = false;
     dialogConfig.closeOnNavigation = false;
     dialogConfig.disableClose = true;
     dialogConfig.hasBackdrop = false;
     dialogConfig.width = '100%';
     dialogConfig.height = '100%';
     dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
     dialogConfig.panelClass = "fullscreen-dialog"
     dialogConfig.id = "FDCMP",
     dialogConfig.data = {
       flag: 'FDCMP',
       // product_id:this.rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.rtDt.snapshot.queryParamMap.get('product_id')) : '',
     }
     try {
       const dialogref = this.__dialog.open(
         RptComponent,
         dialogConfig
       );
     } catch (ex) {
       const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
       dialogRef.addPanelClass('mat_dialog');
       this.__utility.getmenuIconVisible({
         flag:'FDCMP',
         id:dialogConfig.id
       });
     }

   }
}
