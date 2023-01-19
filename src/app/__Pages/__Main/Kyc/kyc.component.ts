import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { KyModificationComponent } from './kyModification/kyModification.component';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __columns: string[] = ['sl_no', 'tin_no', 'entry_dt', 'pan', 'edit', 'delete'];
  __selectClients = new MatTableDataSource();
  constructor(private __dbIntr: DbIntrService, private __dialog: MatDialog) { }

  ngOnInit() {
    this.checkKycExistOrNot('');
  }

  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog('', '');
    }
    else if (__ev.flag == 'F') {
      this.checkKycExistOrNot(__ev.item.client_code);
    }
    else {
      this.checkKycExistOrNot('');
    }
  }

  populateDT(__items) {
    this.openDialog(__items.pan_no, __items);
  }
  checkKycExistOrNot(client_code) {
    this.__dbIntr.api_call(0, '/kyc', client_code == '' ? null : 'search=' + client_code).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__selectClients = new MatTableDataSource(res);
      this.__selectClients.paginator = this.paginator;
    })
  }


  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '98%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.autoFocus = false;
    if (id != '') {
      this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __items.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
        console.log(res);
        dialogConfig.data = {
          id: id,
          title: 'Update Kyc Status',
          items: res[0],
          kyc_data: __items
        };
        const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
        });

      })
    }
    else {
      dialogConfig.data = {
        id: id,
        title: 'Add Kyc',
        items: __items
      };
      const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
      });
    }
  }
}
