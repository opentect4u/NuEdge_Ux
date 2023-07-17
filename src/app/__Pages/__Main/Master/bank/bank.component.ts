import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { BnkrptComponent } from './bankRpt/bnkRpt.component';
import { BnkModificationComponent } from './bnkModification/bnkModification.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'master-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  __menu = menu;

  // [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":26,"flag":"M"},
  //            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/bank/uploadbnk","icon":"","id":27,"flag":"U"},
  //            {"parent_id": 4,"menu_name": "Reports","has_submenu": "N","url": "","icon":"","id":27,"flag":"R"}]

  constructor(
    private overlay:Overlay,
    private __dialog:MatDialog,
    private __dbIntr: DbIntrService,
    private __rtDt: ActivatedRoute,
    private __utility: UtiliService) { }
  ngOnInit(): void {
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
    if(this.__rtDt.snapshot.queryParamMap.get('id')){
      this.getParticularBank();
     }

  }

  getParticularBank(){
    this.__dbIntr.api_call(0,'/depositbank','id='+atob(this.__rtDt.snapshot.queryParamMap.get('id'))).pipe(pluck("data")).subscribe((res: bank[]) =>{
      if(res.length > 0){
        this.openDialog(res[0],res[0].id);
      }
    })
  }
  openDialog(__bank: bank | null = null , __bnkId: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "40%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:'B',
      id:__bnkId,
      items:__bank,
      title: __bnkId == 0 ? 'Add Bank' : 'Update Bank',
      right:global.randomIntFromInterval(1,60)
    }
    dialogConfig.id = __bnkId > 0  ? __bnkId.toString() : "0";
    try{
      const dialogref = this.__dialog.open(BnkModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
      });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("40%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"B"})
    }

  }
  getItems =(__menu) => {
    switch(__menu.flag){
      case 'M' :this.openDialog(null,0); break;
      case 'U' :this.__utility.navigate('main/master/bank/uploadbnk'); break;
      case 'R' :this.openDialogForReports('1'); break;
       default:break;
    }
  }
openDialogForReports(__prdId){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '100%';
  dialogConfig.height = '100%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.panelClass = "fullscreen-dialog"
  dialogConfig.id = "B",
  dialogConfig.data = {
    product_id:__prdId
  }
  try {
    const dialogref = this.__dialog.open(
      BnkrptComponent,
      dialogConfig
    );
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
    this.__utility.getmenuIconVisible({
      product_id:__prdId
    });
  }
}
}
