import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ClientModificationComponent } from './clientModification/clientModification.component';

@Component({
  selector: 'master-client_manage',
  templateUrl: './client_manage.component.html',
  styleUrls: ['./client_manage.component.css']
})
export class Client_manageComponent implements OnInit {

  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'pan','mobile','edit','delete'];
  __selectClients = new MatTableDataSource();
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {this.getClientMaster();}
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F') {
      this.__selectClients = new MatTableDataSource([__ev.item]);
      this.__selectClients._updateChangeSubscription();
    }
    else{
      this.getClientMaster();
       this.__selectClients._updateChangeSubscription();
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '98%';
    dialogConfig.panelClass= 'fullscreen-dialog';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Client Master' : 'Update Client Master',
      items: items
    };
    dialogConfig.autoFocus=false;
    const dialogref = this.__dialog.open(ClientModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        // this.__selectClients.push(dt);
        this.__selectClients.data.push(dt);
        this.__selectClients._updateChangeSubscription();
      }
    });
  }
  getClientMaster(){
  this.__dbIntr.api_call(0,'/client',null).pipe(map((x:any) => x.data)).subscribe(res => {
    this.__selectClients = new MatTableDataSource(res);
  })
  }
  
}
