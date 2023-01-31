import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { AMCModificationComponent } from './AMCModification/AMCModification.component';

@Component({
  selector: 'app-AMC',
  templateUrl: './AMC.component.html',
  styleUrls: ['./AMC.component.css']
})
export class AMCComponent implements OnInit {
  __columns: string[] = ['sl_no', 'amc_name', 'edit', 'delete'];
  __selectAMC = new MatTableDataSource<amc>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService,private route :ActivatedRoute) { }
  ngOnInit(): void {
    this.getAMCMaster(this.route.snapshot.queryParamMap.get('id') == null ? this.route.snapshot.queryParamMap.get('id') : ('rnt_id='+this.route.snapshot.queryParamMap.get('id')));
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getAMCMaster();
    }
  }
  populateDT(__items: amc) {
    this.openDialog(__items.id, __items);
  }
  private openDialog(id: number, __items: amc | null = null) {
    console.log(__items);
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '55%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add AMC' : 'Update AMC',
      items: __items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(AMCModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
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
  private getAMCMaster(__params: string | null = null) {
    console.log(__params);
    
    this.__dbIntr.api_call(0, '/amc', __params).pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.setPaginator(res);
    })
  }
  private updateRow(row_obj: amc) {
    this.__selectAMC.data = this.__selectAMC.data.filter((value: amc, key) => {
      if (value.id == row_obj.id) {
        value.amc_name = row_obj.amc_name;
        value.product_id = row_obj.product_id;
        value.rnt_id = row_obj.rnt_id;
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
  private addRow(row_obj: amc) {
    this.__selectAMC.data.unshift(row_obj);
    this.__selectAMC._updateChangeSubscription();
  }
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
    this.__selectAMC.paginator = this.paginator;
  }
}
