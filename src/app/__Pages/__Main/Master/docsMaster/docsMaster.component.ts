import { Component, OnInit, ViewChild } from '@angular/core';
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
  __columns: string[] = ['sl_no', 'doc_type', 'edit', 'delete'];
  __selectDocs = new MatTableDataSource<docType>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService,private __utility: UtiliService) { }
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

    console.log('assasass');
    this.__utility.navigatewithqueryparams('/main/master/docTypeModify', {queryParams:{id:btoa(__items.id.toString())}})
  }
  private openDialog(id: number, doc_type: string | null = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Document Type' : 'Update Document Type',
      doc_type: doc_type
    };
    dialogConfig.autoFocus = false;
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
  private getDocumentmaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.setPaginator(res);
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
}
