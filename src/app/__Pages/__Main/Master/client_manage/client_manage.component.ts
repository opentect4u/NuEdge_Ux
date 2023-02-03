import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-client_manage',
  templateUrl: './client_manage.component.html',
  styleUrls: ['./client_manage.component.css']
})
export class Client_manageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'pan','mobile','edit','delete'];
  __selectClients = new MatTableDataSource<client>([]);
  constructor(private __dbIntr: DbIntrService,private __utility:UtiliService) { }
  ngOnInit() {this.getClientMaster();}
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {

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
     this.__utility.navigatewithqueryparams('/main/master/clModify',{queryParams:{flag:btoa(__items.client_type),id:btoa(__items.id.toString())}})
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
