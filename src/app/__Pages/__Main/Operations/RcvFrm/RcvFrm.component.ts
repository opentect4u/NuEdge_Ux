import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { rcvForm } from 'src/app/__Model/rcvFormMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RcvFormAdditionComponent } from './rcvFormAddition/rcvFormAddition.component';

@Component({
  selector: 'app-RcvFrm',
  templateUrl: './RcvFrm.component.html',
  styleUrls: ['./RcvFrm.component.css']
})
export class RcvFrmComponent implements OnInit {

  __columns: string[] = ['sl_no', 'temp_tin_no', 'rcv_datetime', 'bu_type'];
  __RcvForms = new MatTableDataSource<rcvForm>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }

  ngOnInit() {
    this.getRvcFormMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.__dbIntr.api_call(0, '/formreceivedshow', null).pipe((map((x: responseDT) => x.data))).subscribe(res => {
        this.openDialog(res);
      })
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getRvcFormMaster();
      this.updateDataTable();
    }
  }

  private getRvcFormMaster() {
    this.__dbIntr.api_call(0, '/formreceived', null).pipe(map((x: responseDT) => x.data)).subscribe((res: rcvForm[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res) {
    this.__RcvForms = new MatTableDataSource(__res);
    this.__RcvForms.paginator = this.paginator;
  }
  private updateDataTable() {
    this.__RcvForms._updateChangeSubscription();
  }
  private openDialog(__res) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '98%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = {
      id: 0,
      title: 'Form Recieve',
      data: __res
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(RcvFormAdditionComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        this.__RcvForms.data.push(dt?.data);
        this.updateDataTable();
        this.__utility.showSnackbar(dt?.suc ==  1 ? 'Form Recieved Successfully' : 'Something went wrong ! please try again later',dt?.suc)
      }
    });
  }
}
