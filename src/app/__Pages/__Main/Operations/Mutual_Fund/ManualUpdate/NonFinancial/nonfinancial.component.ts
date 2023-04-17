import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
@Component({
  selector: 'app-nonfinancial',
  templateUrl: './nonfinancial.component.html',
  styleUrls: ['./nonfinancial.component.css']
})
export class NonfinancialComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Mutual Fund",
      url:'/main/operations/mfdashboard' + '/' + this.__rtDt.snapshot.queryParamMap.get('product_id'),
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Manual Entry",
      url:'/main/operations/manualEntr',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Manual Update",
      url:'/main/operations/manualupdate',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Non Financial",
      url:'/main/operations/manualupdate/nonfinancial',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')
      }
    }
];
__menu = [
  {
    "parent_id": 4,
    "menu_name": "Manual Entry",
    "flag":"M"
  },
  {
  "parent_id": 4,
  "menu_name": "Reports",
  "flag":"R"
  }
];
  constructor(
    private overlay: Overlay,
    private __rtDt: ActivatedRoute,
    private __utility: UtiliService,
    private __dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.setBreadCrumb();
  }
  setBreadCrumb(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
   }
  openManualUpdate(__items){
    switch(__items.flag){
      case 'R':this.openDialogForRPT();break;
      case 'M':this.openDialog();break;
      default: break;
    }
  }
  openDialogForRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "NONFINMURPT",
    dialogConfig.data = {
      product_id: '1',
      trans_type_id: '3',
      title:'Non Financial Report'

    }
    try {
      const dialogref = this.__dialog.open(
        RPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "NONFINMUSRCHRPT",
    dialogConfig.data = {
      product_id: '1',
      trans_type_id: '3',
      title:'Non Financial Manual Entry Report'
    }
    try {
      const dialogref = this.__dialog.open(
        SearchRPTComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }
  }
}
