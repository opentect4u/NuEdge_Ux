import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RNTmodificationComponent } from './RNTmodification/RNTmodification.component';

@Component({
  selector: 'master-RNT',
  templateUrl: './RNT.component.html',
  styleUrls: ['./RNT.component.css']
})
export class RNTComponent implements OnInit {
  __columns: string[] = ['sl_no', 'rnt_name', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<rnt>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private __dialog: MatDialog, 
    private __dbIntr: DbIntrService
    ) { }
  ngOnInit() { 
    this.getRNTmaster() 
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getRNTmaster();
    }
  }
  populateDT(__items: rnt) {
    this.openDialog(__items.id, __items);
  }
  private openDialog(id: number, __items: rnt| null = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '55%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add RNT' : 'Update RNT',
      rnt_name: __items ? __items?.rnt_name : '',
      items:__items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(RNTmodificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        if (dt.id > 0) {
          this.updateRow(dt.data)
        }
        else {
          this.addRow(dt.data);
        }
      }
    });
  }
  private getRNTmaster() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe((res: rnt[]) => {
      this.setPaginator(res);
    })
  }
  private updateRow(row_obj: rnt) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: rnt, key) => {
      if (value.id == row_obj.id) {
        value.rnt_name = row_obj.rnt_name;
        value.website=row_obj.website;

        value.ofc_addr=row_obj.ofc_addr;
        value.cus_care_no=row_obj.cus_care_no;
        value.cus_care_email=row_obj.cus_care_email;

        value.l1_name=row_obj.l1_name;
        value.l1_email=row_obj.l1_email;
        value.l1_contact_no=row_obj.l1_contact_no;

        value.l2_name=row_obj.l2_name;
        value.l2_email=row_obj.l2_email;
        value.l2_contact_no=row_obj.l2_contact_no;

        value.l3_name=row_obj.l3_name;
        value.l3_email=row_obj.l3_email;
        value.l3_contact_no=row_obj.l3_contact_no;

        value.l4_name=row_obj.l4_name;
        value.l4_email=row_obj.l3_email;
        value.l4_contact_no=row_obj.l4_contact_no;

        value.l5_name=row_obj.l5_name;
        value.l5_email=row_obj.l5_email;
        value.l5_contact_no=row_obj.l5_contact_no;

        value.l6_name=row_obj.l6_name;
        value.l6_email=row_obj.l6_email;
        value.l6_contact_no=row_obj.l6_contact_no;
      }
      return true;
    });
  }
  private addRow(row_obj: rnt) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
  }
  private setPaginator(__res){
    this.__selectRNT = new MatTableDataSource(__res);
    this.__selectRNT.paginator = this.paginator;
  }
}
