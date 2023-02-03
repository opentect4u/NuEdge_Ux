import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  __columns: string[] = ['sl_no', 'bank_name', 'edit', 'delete'];
  __selectbnk = new MatTableDataSource<bank>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dbIntr: DbIntrService,private __utility: UtiliService) { }
  ngOnInit(): void { this.getBankMaster(); }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getBankMaster();
    }
  }
  populateDT(__items: bank) {
    this.__utility.navigatewithqueryparams('/main/master/bnkModify',{queryParams:{id:btoa(__items.id.toString())}})
  }
  private getBankMaster() {
    this.__dbIntr.api_call(0, '/depositbank', null).pipe((map((x: responseDT) => x.data))).subscribe((res: bank[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res) {
    this.__selectbnk = new MatTableDataSource(__res);
    this.__selectbnk.paginator = this.paginator;
  }
}
