import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-RNT',
  templateUrl: './RNT.component.html',
  styleUrls: ['./RNT.component.css']
})
export class RNTComponent implements OnInit {
  __columns: string[] = ['sl_no', 'rnt_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<rnt>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService
    ) { }
  ngOnInit() { 
    this.getRNTmaster() 
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {}
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getRNTmaster();
    }
  }
  populateDT(__items: rnt) {
    this.__utility.navigate('/main/master/rntmodify',btoa(__items.id.toString()));
  }

  private getRNTmaster() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe((res: rnt[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res){
    this.__selectRNT = new MatTableDataSource(__res);
    this.__selectRNT.paginator = this.paginator;
  }
  showCorrospondingAMC(__rntDtls){
    this.__utility.navigatewithqueryparams('/main/master/amcmaster',{queryParams:{id:__rntDtls.id}})
  }
}
