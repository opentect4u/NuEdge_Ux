import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-docsMaster',
  templateUrl: './docsMaster.component.html',
  styleUrls: ['./docsMaster.component.css']
})
export class DocsMasterComponent implements OnInit {
  __pageNumber= new FormControl(10);
  __paginate:any=[];
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/docTypeModify","icon":"","id":48,"flag":"M"},
  {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadDocTypeCsv","icon":"","id":49,"flag":"U"}
 ]
  __columns: string[] = ['sl_no', 'doc_type', 'edit', 'delete'];
  __selectDocs = new MatTableDataSource<docType>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService,private __utility: UtiliService, private overlay: Overlay) { }
  ngOnInit() { this.getDocumentmaster(); }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getDocumentmaster();
    }
  }
  populateDT(__items: docType) {
    // this.__utility.navigatewithqueryparams('/main/master/docTypeModify', {queryParams:{id:btoa(__items.id.toString())}})
     this.openDialog(__items.id,__items.doc_type);
     
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
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        }
        else {
          this.addRow(dt.data);
        }
      }
    });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("40%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"D"})
    }
  }
  private getDocumentmaster(__paginate: string | null = "10") {
    this.__dbIntr.api_call(0, '/documenttype', "paginate="+__paginate).pipe(map((x: responseDT) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
  }
  private updateRow(row_obj: docType) {
    this.__selectDocs.data = this.__selectDocs.data.filter((value: docType, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type;
      }
      return true;
    });
  }
  private addRow(row_obj: docType) {
    this.__selectDocs.data.unshift(row_obj);
    this.__selectDocs._updateChangeSubscription();
  }
  private setPaginator(__res) {
    this.__selectDocs = new MatTableDataSource(__res);
    this.__selectDocs.paginator = this.paginator;
  }
  navigate(items){
     switch(items.flag){
      case "M":this.openDialog(0);break;
      case "U":this.__utility.navigate(items.url);break;
      default: break;

     }
}
getval(__paginate){
  this.__pageNumber.setValue(__paginate);
   this.getDocumentmaster(__paginate);
}
getPaginate(__paginate){
if(__paginate.url){
 this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber.value)).pipe(map((x: any) => x.data)).subscribe((res: any) => {
   this.setPaginator(res.data);
   this.__paginate = res.links;
 })
}
}
}
