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
    this.openDialog(__items.id, __items.rnt_name);
  }
  private openDialog(id: number, rnt_name: string| null = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add RNT' : 'Update RNT',
      rnt_name: rnt_name
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
