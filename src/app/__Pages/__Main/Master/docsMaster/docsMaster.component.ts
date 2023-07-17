import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';
import { DoctyperptComponent } from './docTypeRpt/docTypeRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';

@Component({
  selector: 'master-docsMaster',
  templateUrl: './docsMaster.component.html',
  styleUrls: ['./docsMaster.component.css']
})
export class DocsMasterComponent implements OnInit {
  __menu = menu;

//   [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":48,"flag":"M"},
//   {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/docType/uploadDocTypeCsv","icon":"","id":49,"flag":"U"},
//   {"parent_id": 4,"menu_name": "Reports","has_submenu": "N","url": "","icon":"","id":49,"flag":"R"}
//  ]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog,
    private __rtDT: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private overlay: Overlay) { }
  ngOnInit() {
    if(this.__rtDT.snapshot.queryParamMap.get('id')){
      this.getParticularDocument();
    }
  }
  getParticularDocument(){
    this.__dbIntr.api_call(0,'/documenttype','id='+atob(this.__rtDT.snapshot.queryParamMap.get('id'))).pipe(pluck("data")).subscribe((res: any) =>{
            if(res.length > 0){
              this.openDialog(res[0].id,res[0].doc_type);
            }
    })
  }
  private openDialog(id: number, doc_type: string | null = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.id =id > 0  ? id.toString() : "0";
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Document Type' : 'Update Document Type',
      doc_type: doc_type,
      flag:"D"
    };
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
    const dialogref = this.__dialog.open(DocsModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
    });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("40%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"D"})
    }
  }
  getItems = (items) => {
     switch(items.flag){
      case "M":this.openDialog(0);break;
      case "U":this.__utility.navigate('main/master/docType/uploadDocTypeCsv');break;
      case "R":this.openDialogForReports('1');break;
      default: break;

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
  dialogConfig.id = "D",
  dialogConfig.data = {
    product_id:__prdId
  }
  try {
    const dialogref = this.__dialog.open(
      DoctyperptComponent,
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
