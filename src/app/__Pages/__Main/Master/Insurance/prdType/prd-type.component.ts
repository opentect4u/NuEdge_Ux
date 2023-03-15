import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PrdTypeRPTComponent } from './Dialog/prd-type-rpt/prd-type-rpt.component';
import { PrdTypeCrudComponent } from './Dialog/prdTypeCrud/prd-type-crud.component';
@Component({
  selector: 'app-prd-type',
  templateUrl: './prd-type.component.html',
  styleUrls: ['./prd-type.component.css']
})
export class PrdTypeComponent implements OnInit {
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
      label:"Product Type",
      url:'/main/master/insurance/producttype',
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
    url: '/main/master/insurance/uploadproducttype',
    flag: 'U',
  },
  {
    menu_name: 'Reports',
    url: '',
    flag: 'R',
  },
];
  constructor(
    private rtDt: ActivatedRoute,
    private __utility: UtiliService,
    private overlay:Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    this.setBreadCrumbs();
    if(this.rtDt.snapshot.queryParamMap.get('id')){
      this.previewParticularproductType(atob(this.rtDt.snapshot.queryParamMap.get('id')))
    }
  }
  previewParticularproductType(__prd_id){
    this.__dbIntr.api_call(0,'/ins/productType','id='+__prd_id).pipe(pluck("data")).subscribe(res =>{
       console.log(res);

      this.openDialog(res[0],res[0].id)
    })
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
      product_id:this.rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.rtDt.snapshot.queryParamMap.get('product_id')) : '',
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        PrdTypeCrudComponent,
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
        flag: 'PRDTYPE',
      });
    }
  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
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
      product_id:this.rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.rtDt.snapshot.queryParamMap.get('product_id')) : '',
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
