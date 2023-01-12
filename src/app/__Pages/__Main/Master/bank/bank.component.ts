import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BankModificationComponent } from './bankModification/bankModification.component';

@Component({
  selector: 'master-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  __selectbnk:any=[];
  constructor(private __dialog: MatDialog) { }
  ngOnInit(): void {
  }
  getSearchItem(__ev) {
    this.__selectbnk.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectbnk.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Bank' : 'Update Bank',
      items: __items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(BankModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectbnk[this.__selectbnk.findIndex(x => x.id == dt.id)].ifs_code= dt?.ifs_code;
        this.__selectbnk[this.__selectbnk.findIndex(x => x.id == dt.id)].bank_name = dt?. bank_name;
      }
    });
  }
}
