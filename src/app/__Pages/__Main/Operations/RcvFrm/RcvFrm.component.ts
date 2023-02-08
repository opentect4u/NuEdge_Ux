import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
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
  __menu = [{"parent_id": 4,"menu_name": "Add New","has_submenu": "N","url": "","icon":"","id":16,"flag":"A"}];

  __columns: string[] = ['sl_no', 'temp_tin_no', 'rcv_datetime', 'bu_type'];
  __RcvForms = new MatTableDataSource<rcvForm>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getRvcFormMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {}
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getRvcFormMaster();
      this.updateDataTable();
    }
  }

  private getRvcFormMaster(__paginate: string | null = "10") {
    this.__dbIntr.api_call(0, '/formreceived', 'paginate='+__paginate).pipe(map((x: responseDT) => x.data)).subscribe((res: rcvForm[]) => {
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
  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.data = {
      id: 0,
      title: 'Form Recievable'
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(RcvFormAdditionComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        this.__RcvForms.data.push(dt?.data);
        this.updateDataTable();
        this.__utility.showSnackbar(dt?.suc ==  1 ? 'Form with temporary TIN number ' + dt?.data.temp_tin_id +  ' has been recieved successfully' : 'Something went wrong ! please try again later',dt?.suc)
      }
    });
  }
  openRcvForm(){
      this.__utility.navigatewithqueryparams('/main/rcvFormmodification',
      {queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'),type_id:this.__rtDt.snapshot.queryParamMap.get('type_id')}})

  }
}
