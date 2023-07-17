import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';

@Component({
  selector: 'app-trxn-rpt',
  templateUrl: './trxn-rpt.component.html',
  styleUrls: ['./trxn-rpt.component.css']
})
export class TrxnRptComponent implements OnInit {
  trxnRpt:TrxnRpt[] =[];
  column:column[] = trxnClm.column;
  constructor(private dbIntr:DbIntrService) { }

  ngOnInit(): void {
    this.getTrxnRptMst();
  }
  getTrxnRptMst = () =>{
        this.dbIntr.api_call(1,'/showTransDetails',null)
        .pipe(pluck("data"))
        .subscribe((res:TrxnRpt[]) =>{
            this.trxnRpt = res;
        })
  }
}
