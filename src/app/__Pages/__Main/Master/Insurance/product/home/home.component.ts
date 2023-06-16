import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { insProduct } from 'src/app/__Model/insproduct';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ProductRPTComponent } from '../Dialog/product-rpt/product-rpt.component';
import { ProductCrudComponent } from '../Dialog/product-crud/product-crud.component';
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
      this.getparticularProduct(atob(this.rtDt.snapshot.queryParamMap.get('id')));
    }
    if(this.rtDt.snapshot.queryParamMap.get('comp_id')){
      this.getItems(
         this.menu.find((x: any) => x.flag == 'R')
      )

    }
  }
  getparticularProduct(res){
    this.__dbIntr.api_call(0,'/ins/product','id='+res).pipe(pluck("data")).subscribe(res =>{
      this.openDialog(res[0],res[0].id);
    })
  }

  getItems(__el){
    switch (__el.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate('main/master/insurance/product/uploadproduct');
        // this.__utility.navigatewithqueryparams(__el.url,{queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}})
        break;
        case 'R':
          // this.openDialogForReport();
               this.openDialogForReport(
                '3',
                this.rtDt.snapshot.queryParamMap.get('comp_id') ?
                atob(this.rtDt.snapshot.queryParamMap.get('comp_id')) : '',
                )
          break;
      default:
        break;
    }
  }
  openDialog(product: insProduct,__id: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'INSPRODUCT',
      id: __id,
      product: product,
      title: __id == 0 ? 'Add Product' : 'Update Product',
      product_id:'3',
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ProductCrudComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'INSPRODUCT',
      });
    }
  }
  openDialogForReport(__prdId,__comp_id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "INSPRODUCT",
    dialogConfig.data = {
      product_id:__prdId,
      company_id:__comp_id
    }
    try {
      const dialogref = this.__dialog.open(
        ProductRPTComponent,
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
