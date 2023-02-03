import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  __columns: string[] = ['sl_no', 'plan_name', 'edit', 'delete'];
  __selectAMC = new MatTableDataSource<plan>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(  private __utility: UtiliService,private __dbIntr: DbIntrService,private route :ActivatedRoute) { }
  ngOnInit(): void {
    this.getPLANMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getPLANMaster();
    }
  }
  populateDT(__items: plan) {
    this.__utility.navigatewithqueryparams('/main/master/plnModify',{queryParams:{id: btoa(__items.id.toString())}})
  }

  private getPLANMaster(__params: string | null = null) {
    console.log(__params);
    
    this.__dbIntr.api_call(0, '/plan', __params).pipe(map((x: responseDT) => x.data)).subscribe((res: plan[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
    this.__selectAMC.paginator = this.paginator;
  }
}
