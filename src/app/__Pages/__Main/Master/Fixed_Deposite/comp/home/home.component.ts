import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CrudComponent } from '../Dialog/crud/crud.component';
import { RptComponent } from '../Dialog/rpt/rpt.component';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu = menu;
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
   previewParticularcompany(cmpId){
     this.__dbIntr.api_call(0,'/fd/company','id='+cmpId).pipe(pluck("data")).subscribe(res =>{
       console.log(res);
      this.openDialog(res[0],res[0].id)
    })
   }

   getItems(__el){
     switch (__el.flag) {
       case 'M':
         this.openDialog(null, 0);
         break;
       case 'U':
         this.__utility.navigate('/main/master/fixedeposit/company/uploadCompany');
         // this.__utility.navigatewithqueryparams(__el.url,{queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}})
         break;
         case 'R':
           this.openDialogForReport();
           break;
       default:
         break;
     }
   }

   openDialog(__cmp ,__id){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.autoFocus = false;
     dialogConfig.closeOnNavigation = false;
     dialogConfig.disableClose = true;
     dialogConfig.hasBackdrop = false;
     dialogConfig.width = '60%';
     dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
     dialogConfig.data = {
       flag: 'FDCOMP',
       id: __id,
       cmp: __cmp,
       title: __id == 0 ? 'Add Company' : 'Update Company',
       right: global.randomIntFromInterval(1,60),
     };

     dialogConfig.id = __id > 0 ? __id.toString() : '0';
     try {
       const dialogref = this.__dialog.open(
         CrudComponent,
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
         flag: 'FDCOMP',
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
