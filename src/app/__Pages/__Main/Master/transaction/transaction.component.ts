import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  __selectTrns:any=[];
  constructor(private __dialog: MatDialog) { }
  ngOnInit(): void {
  }
  getSearchItem(__ev) {
    this.__selectTrns.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectTrns.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '50%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Transaction' : 'Update Transaction',
      items: __items
    };
    const dialogref = this.__dialog.open(TrnsModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectTrns[this.__selectTrns.findIndex(x => x.id == dt.id)].trans_id= dt?.trans_id;
        this.__selectTrns[this.__selectTrns.findIndex(x => x.id == dt.id)]. trns_name = dt?. trns_name;
      }
    });
  }
}
