import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ScmModificationComponent } from './scmModification/scmModification.component';

@Component({
  selector: 'master-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit {
  __columns: string[] = ['sl_no', 'scm_name', 'edit','delete'];
  __selectScheme = new MatTableDataSource();
  constructor(private __dialog: MatDialog,private __dbIntr:DbIntrService) { }
  ngOnInit(): void {this.getSchememaster();}
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F'){
      this.__selectScheme = new MatTableDataSource([__ev.item]);
    }
    else{
      this.getSchememaster();
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Scheme' : 'Update Scheme',
      items: __items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(ScmModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        if(dt?.id > 0){
        this.updateRow(dt.data);
        }
        else{
          this.addRow(dt.data);
        }
      }
    });
  }
  getSchememaster(){
    this.__dbIntr.api_call(0,'/scheme',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectScheme = new MatTableDataSource(res);
    })
  }
  updateRow(row_obj) {
    this.__selectScheme.data = this.__selectScheme.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.category_id = row_obj.category_id;
        value.subcategory_id = row_obj.subcategory_id;
        value.amc_id = row_obj.amc_id;
        value.scheme_name = row_obj.scheme_name;
        value.product_id = row_obj.product_id;
      }
      return true;
    });
  }
  addRow(row_obj) {
    this.__selectScheme.data.push(row_obj);
    this.__selectScheme._updateChangeSubscription();
  }
}
