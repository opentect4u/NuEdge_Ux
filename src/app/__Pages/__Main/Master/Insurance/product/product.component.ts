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
import { ProductCrudComponent } from './Dialog/product-crud/product-crud.component';
import { ProductRPTComponent } from './Dialog/product-rpt/product-rpt.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Master",
      url:'/main/master/products',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.rtDt.snapshot.queryParamMap.get('product_id')) == '3' ?  "Insurance" : "Others",
      url:'/main/master/insurance',
      hasQueryParams:true,
      queryParams:{id:this.rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Product",
      url:'/main/master/insurance/product',
      hasQueryParams:false,
      queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
__menu = [
  {
    menu_name: 'Manual Entry',
    flag: 'M',
    url:''
  },
  {
    menu_name: 'Upload CSV',
    url: '/main/master/insurance/uploadproduct',
    flag: 'U',
  },
  {
    menu_name: 'Reports',
    url: '',
    flag: 'R',
  },
];
  constructor(
   private rtDt:ActivatedRoute,
   private __utility: UtiliService,
   private __dialog: MatDialog,
   private overlay: Overlay,
   private __dbIntr: DbIntrService

  ) { }
  ngOnInit(): void {
    this.setBreadCrumbs();
    if(this.rtDt.snapshot.queryParamMap.get('id')){
      this.getparticularProduct(atob(this.rtDt.snapshot.queryParamMap.get('id')));
    }
    if(this.rtDt.snapshot.queryParamMap.get('comp_id')){
      this.navigate(
         this.__menu.find((x: any) => x.flag == 'R')
      )

    }
  }
  getparticularProduct(res){
    console.log(res);

    this.__dbIntr.api_call(0,'/ins/product','id='+res).pipe(pluck("data")).subscribe(res =>{
      this.openDialog(res[0],res[0].id);
    })
  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__el){
    switch (__el.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        // this.__utility.navigate(__menu.url);
        this.__utility.navigatewithqueryparams(__el.url,{queryParams:{product_id:this.rtDt.snapshot.queryParamMap.get('product_id')}})
        break;
        case 'R':
          // this.openDialogForReport();
               this.openDialogForReport(
                atob(this.rtDt.snapshot.queryParamMap.get('product_id')),
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
      product_id:this.rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.rtDt.snapshot.queryParamMap.get('product_id')) : '',
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
