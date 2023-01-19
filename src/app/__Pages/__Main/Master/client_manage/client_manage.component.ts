import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ClientModificationComponent } from './clientModification/clientModification.component';

@Component({
  selector: 'master-client_manage',
  templateUrl: './client_manage.component.html',
  styleUrls: ['./client_manage.component.css']
})
export class Client_manageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'pan','mobile','edit','delete'];
  __selectClients = new MatTableDataSource<client>([]);
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {this.getClientMaster();}
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if(__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else{
      this.getClientMaster();
      this.updateDataTable();
    }
  }
  populateDT(__items:client) {
    this.openDialog(__items.id, __items);
  }
  private openDialog(id: number, items: client | null = null) {
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
        this.__selectClients.data.unshift(dt);
        this.updateDataTable();
      }
    });
  }
  private getClientMaster(){
  this.__dbIntr.api_call(0,'/client',null).pipe(map((x:responseDT) => x.data)).subscribe((res:client[]) => {
   this.setPaginator(res);
  })
  }
  private setPaginator(__res){
    this.__selectClients = new MatTableDataSource(__res);
    this.__selectClients.paginator =this.paginator;
  }
  private updateDataTable(){
    this.__selectClients._updateChangeSubscription();
  }
}
