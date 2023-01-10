import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmpModificationComponent } from './empModification/empModification.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  __selectemp: any = []
  constructor(private __dialog: MatDialog) { }

  ngOnInit() { }
  getSearchItem(__ev) {
    this.__selectemp.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog('', '');
    }
    else {
      this.__selectemp.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.emp_code, __items);
  }
  openDialog(id, __items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '50%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Employee' : 'Update Employee',
      items: __items
    };
    const dialogref = this.__dialog.open(EmpModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) { this.__selectemp[this.__selectemp.findIndex(x => x.emp_code == dt.emp_code)].emp_name = dt?.emp_name; }
    });
  }
}
