import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PrdTypeCrudComponent } from '../Dialog/prdTypeCrud/prd-type-crud.component';
import { PrdTypeRPTComponent } from '../Dialog/prd-type-rpt/prd-type-rpt.component';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu = menu;
  constructor(
    private rtDt: ActivatedRoute,
    private __utility: UtiliService,
    private overlay:Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    if(this.rtDt.snapshot.queryParamMap.get('id')){
      this.previewParticularproductType(atob(this.rtDt.snapshot.queryParamMap.get('id')))
    }
  }
  previewParticularproductType(__prd_id){
    this.__dbIntr.api_call(0,'/ins/productType','id='+__prd_id).pipe(pluck("data")).subscribe(res =>{
      this.openDialog(res[0],res[0].id)
    })
  }
  getItems(__el){
    switch (__el.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate('main/master/insurance/producttype/uploadproducttype');
        // this.__utility.navigatewithqueryparams(__el.url,{queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}})
        break;
        case 'R':
          this.openDialogForReport();
              //  this.openDialogForReport(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')))
          break;
      default:
        break;
    }
  }
  openDialog(__prdType: insPrdType | null = null,__id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'PRDTYPE',
      id: __id,
      Product_type: __prdType,
      title: __id == 0 ? 'Add Product Type' : 'Update Product Type',
      product_id:'3',
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        PrdTypeCrudComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
      });
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'PRDTYPE',
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
    dialogConfig.id = "INSPRDTYPE",
    dialogConfig.data = {
      flag: 'INSPRDTYPE',
      product_id:'3',
    }
    try {
      const dialogref = this.__dialog.open(
        PrdTypeRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        flag:'INSPRDTYPE',
        id:dialogConfig.id
      });
    }
  }

}
