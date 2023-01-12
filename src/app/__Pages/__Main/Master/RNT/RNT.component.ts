import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RNTmodificationComponent } from './RNTmodification/RNTmodification.component';

@Component({
  selector: 'master-RNT',
  templateUrl: './RNT.component.html',
  styleUrls: ['./RNT.component.css']
})
export class RNTComponent implements OnInit {
  __selectRNT: any = [];
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit() {this.getRNTmaster()}
  getSearchItem(__ev) {
    this.__selectRNT.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectRNT.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items.rnt_name);
  }
  openDialog(id, rnt_name) {
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
    console.log(dt);
    
      if (dt?.id > 0) {
        this.__selectRNT[this.__selectRNT.findIndex(x => x.id == dt.id)].rnt_name = dt.rnt_name;
      }
    });
  }
  getRNTmaster(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectRNT = res;
    })
  }
}
