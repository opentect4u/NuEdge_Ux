import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  __selectClients: any = [];
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {}
  getSearchItem(__ev) {
    this.__selectClients.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      // this.__selectClients.push(__ev.item);
      this.__dbIntr.api_call(1,'/document','search='+ __ev.item.client_code).subscribe(res =>{
        console.log(res);
      })
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '95%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Client Master' : 'Update Client Master',
      items: items
    };
    const dialogref = this.__dialog.open(DocsModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        // this.__selectClients[this.__selectClients.findIndex(x => x.id == dt.id)].doc_type = dt.doc_type;
      }
    });
  }
  
}
