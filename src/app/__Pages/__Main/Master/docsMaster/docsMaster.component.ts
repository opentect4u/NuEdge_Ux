import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-docsMaster',
  templateUrl: './docsMaster.component.html',
  styleUrls: ['./docsMaster.component.css']
})
export class DocsMasterComponent implements OnInit {
  __selectDocs: any = [];
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) { }
  ngOnInit() {this.getDocumentmaster();}
  getSearchItem(__ev) {
    this.__selectDocs.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectDocs.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items.doc_type);
  }
  openDialog(id, doc_type) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '50%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Document Type' : 'Update Document Type',
      doc_type: doc_type
    };
    const dialogref = this.__dialog.open(DocsModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectDocs[this.__selectDocs.findIndex(x => x.id == dt.id)].doc_type = dt.doc_type;
      }
    });
  }
  getDocumentmaster(){
    this.__dbIntr.api_call(0,'/documenttype',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectDocs = res;
    })
  }
}
