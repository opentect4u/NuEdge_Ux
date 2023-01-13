import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-docsMaster',
  templateUrl: './docsMaster.component.html',
  styleUrls: ['./docsMaster.component.css']
})
export class DocsMasterComponent implements OnInit {
  __columns: string[] = ['sl_no','doc_type','edit','delete'];

  __selectDocs = new  MatTableDataSource();
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) { }
  ngOnInit() {this.getDocumentmaster();}
  getSearchItem(__ev) {
    // this.__selectDocs.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F'){
      // this.__selectDocs.push(__ev.item);
      this.__selectDocs = new MatTableDataSource([__ev.item]);
    }
    else{
      this.getDocumentmaster();
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items.doc_type);
  }
  openDialog(id, doc_type) {
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
        if(dt?.id > 0){
           this.updateRow(dt.data);
        }
        else{
          this.addRow(dt.data);
        }
      }
    });
  }
  getDocumentmaster(){
    this.__dbIntr.api_call(0,'/documenttype',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectDocs = new MatTableDataSource(res);
    })
  }
  updateRow(row_obj) {
    this.__selectDocs.data = this.__selectDocs.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type;
      }
      return true;
    });
  }
  addRow(row_obj) {
    this.__selectDocs.data.push(row_obj);
    this.__selectDocs._updateChangeSubscription();
  }
}
