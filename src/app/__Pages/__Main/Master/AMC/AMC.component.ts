import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { AMCModificationComponent } from './AMCModification/AMCModification.component';

@Component({
  selector: 'app-AMC',
  templateUrl: './AMC.component.html',
  styleUrls: ['./AMC.component.css']
})
export class AMCComponent implements OnInit {
  __selectAMC:any=[];
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit(): void {
    this.getAMCMaster();
  }
  getSearchItem(__ev) {
    this.__selectAMC.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectAMC.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '30%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add AMC' : 'Update AMC',
      items: __items
    };
    const dialogref = this.__dialog.open(AMCModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
      if (dt?.id > 0) {
        this.__selectAMC[this.__selectAMC.findIndex(x => x.id == dt.id)].amc_name = dt.amc_name;
        this.__selectAMC[this.__selectAMC.findIndex(x => x.id == dt.id)].rnt_id = dt.rnt_id;
        this.__selectAMC[this.__selectAMC.findIndex(x => x.id == dt.id)].product_id = dt.product_id;
      }
    });
  }
  getAMCMaster(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(map((x:any) => x.data)).subscribe(res =>{
      this.__selectAMC = res;
    })
  }
}
