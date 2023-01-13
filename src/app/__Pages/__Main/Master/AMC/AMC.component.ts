import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { AMCModificationComponent } from './AMCModification/AMCModification.component';

@Component({
  selector: 'app-AMC',
  templateUrl: './AMC.component.html',
  styleUrls: ['./AMC.component.css']
})
export class AMCComponent implements OnInit {
  __columns: string[] = ['sl_no','amc_name','edit','delete'];
  __selectAMC =new MatTableDataSource();
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit(): void {
    this.getAMCMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F') {
      this.__selectAMC = new MatTableDataSource([__ev.item]);
    }
    else{
      this.getAMCMaster();
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
      title: id == 0 ? 'Add AMC' : 'Update AMC',
      items: __items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(AMCModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
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
  getAMCMaster(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(map((x:any) => x.data)).subscribe(res =>{
      this.__selectAMC = new MatTableDataSource(res);
    })
  }
  updateRow(row_obj) {
    this.__selectAMC.data = this.__selectAMC.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.amc_name = row_obj.amc_name;
        value.product_id = row_obj.product_id;
        value.rnt_id = row_obj.rnt_id
      }
      return true;
    });
  }
  addRow(row_obj) {
    this.__selectAMC.data.push(row_obj);
    this.__selectAMC._updateChangeSubscription();
  }
}
