import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';


@Component({
  selector: 'app-AMC',
  templateUrl: './AMC.component.html',
  styleUrls: ['./AMC.component.css']
})
export class AMCComponent implements OnInit {
  __columns: string[] = ['sl_no', 'amc_name', 'edit', 'delete'];
  __selectAMC = new MatTableDataSource<amc>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(  private __utility: UtiliService,private __dbIntr: DbIntrService,private route :ActivatedRoute) { }
  ngOnInit(): void {
    this.getAMCMaster(this.route.snapshot.queryParamMap.get('id') == null ? this.route.snapshot.queryParamMap.get('id') : ('rnt_id='+atob(this.route.snapshot.queryParamMap.get('id'))));
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getAMCMaster(this.route.snapshot.queryParamMap.get('id') == null ? this.route.snapshot.queryParamMap.get('id') : ('rnt_id='+atob(this.route.snapshot.queryParamMap.get('id'))));
    }
  }
  populateDT(__items: amc) {
    this.__utility.navigatewithqueryparams('/main/master/amcModify',{queryParams:{id: btoa(__items.id.toString())}})
  }

  private getAMCMaster(__params: string | null = null) {
    console.log(__params);
    
    this.__dbIntr.api_call(0, '/amc', __params).pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
    this.__selectAMC.paginator = this.paginator;
  }
}
