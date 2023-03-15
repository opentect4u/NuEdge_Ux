import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { insComp } from 'src/app/__Model/insComp';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CmpCrudComponent } from './Dialog/cmp-crud/cmp-crud.component';
import { CmpRPTComponent } from './Dialog/cmp-rpt/cmp-rpt.component';

@Component({
  selector: 'app-cmp-mst',
  templateUrl: './cmp-mst.component.html',
  styleUrls: ['./cmp-mst.component.css']
})
export class CmpMstComponent implements OnInit {
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
      label:"Company",
      url:'/main/master/insurance/company',
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
    url: '/main/master/insurance/uploadcompany',
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
    this.setBrdCrmbs();
    if(this.rtDt.snapshot.queryParamMap.get('id')){
      this.previewParticularcompany(atob(this.rtDt.snapshot.queryParamMap.get('id')))
    }
  }
  previewParticularcompany(cmpId){
    this.__dbIntr.api_call(0,'/ins/company','id='+cmpId).pipe(pluck("data")).subscribe(res =>{
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
          console.log(__el.flag);

          this.openDialogForReport();
              //  this.openDialogForReport(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')))
          break;
      default:
        break;
    }
  }
  setBrdCrmbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  openDialog(__cmp:insComp | null = null,__id){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'CMP',
      id: __id,
      cmp: __cmp,
      title: __id == 0 ? 'Add Company' : 'Update Company',
      product_id:this.rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.rtDt.snapshot.queryParamMap.get('product_id')) : '',
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CmpCrudComponent,
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
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'CMP',
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
    dialogConfig.id = "INSCMP",
    dialogConfig.data = {
      flag: 'CMP',
      product_id:this.rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.rtDt.snapshot.queryParamMap.get('product_id')) : '',
    }
    try {
      const dialogref = this.__dialog.open(
        CmpRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        flag:'CMP',
        id:dialogConfig.id
      });
    }

  }
}
