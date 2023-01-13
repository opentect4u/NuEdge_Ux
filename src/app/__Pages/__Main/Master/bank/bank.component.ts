import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { BankModificationComponent } from './bankModification/bankModification.component';

@Component({
  selector: 'master-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  __columns: string[] = ['sl_no','bank_name','edit','delete'];
  __selectbnk = new MatTableDataSource();
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit(): void {this.getBankMaster();}
  getSearchItem(__ev) {
    // this.__selectbnk.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F'){
      this.__selectbnk = new MatTableDataSource([__ev.itmm]);
    }
    else{
      this.getBankMaster();
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
  getBankMaster(){
    this.__dbIntr.api_call(0,'/depositbank',null).pipe((map((x: any)=> x.data))).subscribe(res => {
     this.__selectbnk =new MatTableDataSource(res);
    })
  }
  updateRow(row_obj) {
    console.log(row_obj);
    
    this.__selectbnk.data = this.__selectbnk.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name;
        value.ifs_code = row_obj.ifs_code;

      }
      return true;
    });
  }
  addRow(row_obj) {
    this.__selectbnk.data.push(row_obj);
    this.__selectbnk._updateChangeSubscription();
  }
}
