import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { mutualFund } from 'src/app/__Model/__MutualFund';

import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Cmn_dialogComponent } from '../common/cmn_dialog/cmn_dialog.component';

@Component({
  selector: 'MF-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  __financMst = new MatTableDataSource<mutualFund>([]);
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) {
    this.getFianancMaster();
  }

  ngOnInit() { }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(null, '');
    }
    else if (__ev.flag == 'F') {
      this.__financMst = new MatTableDataSource([__ev.item]);
    }
    else {
      this.getFianancMaster();
    }
  }
  openDialog(__id: string | null = null, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '98%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = {
      id: __id,
      title: 'Financial Trax',
      data: __items,
      trans_type: 'F',
      parent_id: 1
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(Cmn_dialogComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
      if (dt) {
        if (dt.id) {
          this.updateRow(dt.data)
        }
        else {
          this.addRow(dt.data);
        }
      }
    });
  }
  getFianancMaster() {
    this.__dbIntr.api_call(0, '/mfTraxShow?trans_type_id=1', null).pipe(map((x: responseDT) => x.data)).subscribe((res: mutualFund[]) => {
      this.setPaginator(res);
    })
  }
  setPaginator(__res) {
    this.__financMst = new MatTableDataSource(__res);
  }
  addRow(row_obj) {
    this.__financMst.data.unshift(row_obj);
    this.__financMst._updateChangeSubscription();
  }

  updateRow(row_obj) {
    this.__financMst.data[this.__financMst.data.findIndex((x: any) => x.tin_no == row_obj.tin_no)] = row_obj;
    this.__financMst._updateChangeSubscription();
  }

  getSelectedItemForUpdate(__ev: mutualFund) {
    this.openDialog(__ev.tin_no, __ev);
  }
}