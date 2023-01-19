import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'pan', 'mobile', 'edit', 'delete'];
  __documents = new MatTableDataSource<client>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) { }
  ngOnInit() {
    this.getDocumentMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getDocumentMaster();
    }
  }
  populateDT(__items: client) {
    console.log(__items);
    this.openDialog(__items.id, __items);
  }
  openDialog(id: number, items: client | null = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '90%';
    dialogConfig.panelClass = "fullscreen-dialog"
    if (id > 0) {
      this.__dbIntr.api_call(0, '/documentshowEdit', 'client_id=' + id).pipe((map((x: responseDT) => x.data))).subscribe(res => {
        dialogConfig.data = {
          id: id,
          title: 'Update Documents',
          items: items,
          cl_id: id,
          cl_code: items.client_code,
          __docsDetail: res
        };
        const dialogref = this.__dialog.open(DocsModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
          if (dt?.id > 0) {
          }
        });
      })

    }
    else {
      dialogConfig.data = {
        id: id,
        title: 'Add Documents',
        items: items,
        __docsDetail: []
      };

      const dialogref = this.__dialog.open(DocsModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
        }
      });
    }
  }
  addMasters(__id: number, __items) { this.openDialog(__id, __items); }
  getDocumentMaster() {
    this.__dbIntr.api_call(0, '/documentsearch', null).pipe(map((x: any) => x.data)).subscribe((res: client[]) => {
           this.setPaginator(res);
    })
  }
  private setPaginator(__res){
    this.__documents = new MatTableDataSource(__res);
    this.__documents.paginator = this.paginator;
  }
}
