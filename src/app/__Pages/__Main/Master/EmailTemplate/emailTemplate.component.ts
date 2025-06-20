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
/**
 *  * This function is used to navigate to a specific action based on the provided items.
 *  * It checks the flag of the items and performs the corresponding action.
 *  * @param __items - The items containing the action to be performed. 
 * @param __items 
 */
navigate(__items){
  console.log(__items);
  switch(__items.flag){
    case 'U':  break;
    case 'R': this.openDialogForRPT();break;
    case 'M': this.openDialog(null,0);break;
  }
}

/**
 *  * This function is used to open a dialog for adding or updating an email template.  
 * * It creates a MatDialogConfig object, sets various properties for the dialog,
 * * and opens the ModificationComponent dialog with the provided configuration.
 * * @param {any} __email - The email template data to be added or updated.
 * * @param {number} __emailId - The ID of the email template to be added or updated.
 * * @return {void}
 * * @memberof EmailtemplateComponent
 * * @description
 * * This function is responsible for opening a dialog for adding or updating an email template.
 * * It creates a MatDialogConfig object, sets various properties for the dialog,
 * * and opens the ModificationComponent dialog with the provided configuration.
 */
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
/**
 * * This function is used to open a dialog for generating reports.
 * * It creates a MatDialogConfig object, sets various properties for the dialog,
 * * and opens the RptComponent dialog with the provided configuration.
 */
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
