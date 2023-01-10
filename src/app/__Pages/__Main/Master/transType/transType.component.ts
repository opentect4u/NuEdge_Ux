import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TrnstypeModificationComponent } from './trnstypeModification/trnstypeModification.component';

@Component({
  selector: 'app-transType',
  templateUrl: './transType.component.html',
  styleUrls: ['./transType.component.css']
})
export class TransTypeComponent implements OnInit {
  __selectTrnstype:any=[];
  constructor(private __dialog: MatDialog) { }
  ngOnInit(): void {
  }
  getSearchItem(__ev) {
    this.__selectTrnstype.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectTrnstype.push(__ev.item);
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
      title: id == 0 ? 'Add Transaction Type' : 'Update Transaction Type',
      items: __items
    };
    const dialogref = this.__dialog.open(TrnstypeModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectTrnstype[this.__selectTrnstype.findIndex(x => x.id == dt.id)].trns_type = dt?.trns_type;
        this.__selectTrnstype[this.__selectTrnstype.findIndex(x => x.id == dt.id)].product_id = dt?.product_id;
      }
    });
  }

}
