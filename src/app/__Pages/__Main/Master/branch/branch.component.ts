import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BranchModificationComponent } from './branchModification/branchModification.component';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  __selectBranch:any=[];
  constructor(private __dialog: MatDialog) { }
  ngOnInit(): void {
  }
  getSearchItem(__ev) {
    this.__selectBranch.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectBranch.push(__ev.item);
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
      title: id == 0 ? 'Add Branch' : 'Update Branch',
      items: __items
    };
    const dialogref = this.__dialog.open(BranchModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectBranch[this.__selectBranch.findIndex(x => x.id == dt.id)].brn_code = dt?.brn_code;
        this.__selectBranch[this.__selectBranch.findIndex(x => x.id == dt.id)].brn_name = dt?.brn_name;
      }
    });
  }
}
