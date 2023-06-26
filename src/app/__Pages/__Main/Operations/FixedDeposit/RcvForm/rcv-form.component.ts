import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { RcvFormCrudComponent } from './Dialog/rcv-form-crud/rcv-form-crud.component';
import { RcvFormRPTComponent } from './Dialog/rcv-form-rpt/rcv-form-rpt.component';

@Component({
  selector: 'app-rcv-form',
  templateUrl: './rcv-form.component.html',
  styleUrls: ['./rcv-form.component.css']
})
export class RcvFormComponent implements OnInit {
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
      label:"Fixed Deposit",
      url:'/main/operations/fixedeposit',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Form Receivable",
      url:'/main/operations/fixedeposit/rcvForm',
      hasQueryParams:true,
      queryParams:''
    }
  ];

  __menu = [
    {
      "parent_id": 4,
      "menu_name": "Manual Entry",
      "has_submenu": "N",
      "url": "",
      "icon":"",
      "id":16,
      "flag":"M"
    },
    {
    "parent_id": 4,
    "menu_name": "Reports",
    "has_submenu": "N",
    "url": "",
    "icon":"",
    "id":16,
    "flag":"R"
    },
  ];

  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay) { }

  ngOnInit(): void {
    // this.setBreadCrumbs();
  }
  setBreadCrumbs(){
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  openRcvForm(__el){
    console.log(__el);
    switch(__el.flag){
      case "R": this.openDIalogForRPT();break;
      case "M": this.openDialog(null,0);break;

    }
  }
  openDialog(__frmData,__id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id = __id;
    console.log(dialogConfig.id);
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      dialogConfig.data = {
      flag:'FDSRF',
      id: 0,
      title: 'Form Recievable - Fixed Deposit',
      right:global.randomIntFromInterval(1,60),
      temp_tin_no: __frmData ? __frmData.temp_tin_no : ''
    };
    console.log(dialogConfig.data);
    const   dialogref = this.__dialog.open(RcvFormCrudComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {});
    }
    catch(ex){
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("80%");
      this.__utility.getmenuIconVisible({
        id:Number(dialogConfig.id),
        isVisible:false,
        flag:'FDSRF'})
    }

  }
  openDIalogForRPT()
  {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '100%';
      dialogConfig.height = '100%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.panelClass = "fullscreen-dialog"
      dialogConfig.id = "INSFRR_3",
      dialogConfig.data = {}
      try {
        const dialogref = this.__dialog.open(
          RcvFormRPTComponent,
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
