import { Overlay} from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ModificationComponent } from './Modification/modification.component';
import { RptComponent } from './RPT/Rpt.component';

@Component({
selector: 'emailTemplate-component',
templateUrl: './emailTemplate.component.html',
styleUrls: ['./emailTemplate.component.css']
})
export class EmailtemplateComponent implements OnInit {
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
    label:"Email Template",
    url:'/main/master/emailTemplate',
    hasQueryParams:true,
    queryParams:''
  }
]
__menu = [
  {
    parent_id: 4,
    menu_name: 'Manual Entry',
    has_submenu: 'N',
    url: '',
    icon: '',
    id: 36,
    flag: 'M',
  },
  // {
  //   parent_id: 4,
  //   menu_name: 'Upload CSV',
  //   has_submenu: 'N',
  //   url: '',
  //   icon: '',
  //   id: 35,
  //   flag: 'U',
  // },
  {
    parent_id: 4,
    menu_name: 'Reports',
    has_submenu: 'N',
    url: '',
    icon: '',
    id: 0,
    flag: 'R',
  },
];

constructor(
  private __rtDt: ActivatedRoute,
  private __utility: UtiliService,
  private __dialog: MatDialog,
  private overlay: Overlay
) {this.__utility.getBreadCrumb(this.__brdCrmbs);}

ngOnInit(){}
navigate(__items){
  console.log(__items);
  switch(__items.flag){
    case 'U':  break;
    case 'R': this.openDialogForRPT();break;
    case 'M': this.openDialog(null,0);break;
  }
}

openDialog(__email: any, __emailId: number){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = "40%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data ={
    flag:'E',
    id:__emailId,
    items:__email,
    title: __emailId == 0 ? 'Add Email Template' : 'Update Email Template',
    right:global.randomIntFromInterval(0,60)
  }
  dialogConfig.id =  __emailId > 0  ? __emailId.toString() : "0";
  try{
    const dialogref = this.__dialog.open(ModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
      }
    });
  }
  catch(ex){
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize("40%");
    this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"E"})
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
  dialogConfig.id = "ER";
  dialogConfig.data =
  {
    items:null
  }
  try {
    const dialogref = this.__dialog.open(
      RptComponent,
      dialogConfig
    );
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
  }
}
}
