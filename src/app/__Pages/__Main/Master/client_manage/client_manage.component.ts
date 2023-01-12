import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ClientModificationComponent } from './clientModification/clientModification.component';

@Component({
  selector: 'master-client_manage',
  templateUrl: './client_manage.component.html',
  styleUrls: ['./client_manage.component.css']
})
export class Client_manageComponent implements OnInit {
  __selectClients: any = [];
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {this.getClientMaster();}
  getSearchItem(__ev) {
    this.__selectClients.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectClients.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '95%';
    disalogConfig.panelClass= 'fullscreen-dialog';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Client Master' : 'Update Client Master',
      items: items
    };
    const dialogref = this.__dialog.open(ClientModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        // this.__selectClients[this.__selectClients.findIndex(x => x.id == dt.id)].doc_type = dt.doc_type;
      }
    });
  }
  getClientMaster(){
  this.__dbIntr.api_call(0,'/client',null).pipe(map((x:any) => x.data)).subscribe(res => {
    this.__selectClients = res;
  })
  }
  
}
