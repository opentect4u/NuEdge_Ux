import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { mutualFund } from 'src/app/__Model/__MutualFund';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Cmn_dialogComponent } from '../common/cmn_dialog/cmn_dialog.component';

@Component({
  selector: 'mf-nonfinancial',
  templateUrl: './nonfinancial.component.html',
  styleUrls: ['./nonfinancial.component.css']
})
export class NonfinancialComponent implements OnInit {
  __nonFinMst = new MatTableDataSource<mutualFund>([]);
  constructor(
    private __dialog: MatDialog, private __dbIntr: DbIntrService
  ) {}

  ngOnInit() {
    this.getNonfinancialMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(null,'');
    }
    else if (__ev.flag == 'F') {
      this.__nonFinMst = new MatTableDataSource([__ev.item]);
    }
    else {
      this.getNonfinancialMaster();
    }
  }
  getNonfinancialMaster() {
    this.__dbIntr.api_call(0, '/mfTraxShow?trans_type_id=3', null).pipe(map((x: responseDT) => x.data)).subscribe((res: mutualFund[]) => {
      this.__nonFinMst = new MatTableDataSource(res);
    })
  }
  openDialog(__id: string | null = null, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '98%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = {
      id: __id,
      title: 'Non Financial Trax',
      data: __items,
      trans_type: 'N',
      parent_id: 1
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(Cmn_dialogComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        if(dt.id){
          this.updateRow(dt.data);
        }
        else{
          this.addRow(dt.data);
        }
      }
    });
  }
  addRow(row_obj) {
    this.__nonFinMst.data.unshift(row_obj);
    this.__nonFinMst._updateChangeSubscription();
  }
  updateRow(row_obj){
    this.__nonFinMst.data[this.__nonFinMst.data.findIndex((x: any) => x.tin_no == row_obj.tin_no)] = row_obj;
    this.__nonFinMst._updateChangeSubscription();
  }
  getSelectedItemForUpdate(__ev: mutualFund) {
    this.openDialog(__ev.tin_no, __ev);
  }
}
