import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { BankModificationComponent } from './bankModification/bankModification.component';

@Component({
  selector: 'master-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  __columns: string[] = ['sl_no', 'bank_name', 'edit', 'delete'];
  __selectbnk = new MatTableDataSource<bank>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) { }
  ngOnInit(): void { this.getBankMaster(); }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getBankMaster();
    }
  }
  populateDT(__items: bank) {
    this.openDialog(__items.id, __items);
  }
  private openDialog(id: number, __items: bank | null = null) {
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
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        }
        else {
          this.addRow(dt.data);
        }
      }
    });
  }
  private getBankMaster() {
    this.__dbIntr.api_call(0, '/depositbank', null).pipe((map((x: responseDT) => x.data))).subscribe((res: bank[]) => {
      this.setPaginator(res);
    })
  }
  private updateRow(row_obj: bank) {
    this.__selectbnk.data = this.__selectbnk.data.filter((value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name;
        value.ifs_code = row_obj.ifs_code;

      }
      return true;
    });
  }
  private addRow(row_obj: bank) {
    this.__selectbnk.data.unshift(row_obj);
    this.__selectbnk._updateChangeSubscription();
  }
  private setPaginator(__res) {
    this.__selectbnk = new MatTableDataSource(__res);
    this.__selectbnk.paginator = this.paginator;
  }
}
