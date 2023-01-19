import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-empModification',
  templateUrl: './empModification.component.html',
  styleUrls: ['./empModification.component.css']
})
export class EmpModificationComponent implements OnInit {
  __empForm = new FormGroup({
    emp_name: new FormControl('', [Validators.required]),
    emp_code: new FormControl('', [Validators.required]),
    id: new FormControl('')
  })
  constructor(
    public dialogRef: MatDialogRef<EmpModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id != '') {
      this.__empForm.setValue({
        emp_name: this.data.items.emp_name,
        emp_code: this.data.items.emp_code,
        id: this.data.id
      });
    }
  }

  ngOnInit() { }
  submit() {
    if (this.__empForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, this.data.id == '' ? '/employeeAdd' : '/employeeEdit', this.__empForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      if (res == 1) {
        this.dialogRef.close(this.__empForm.value);
      }
    })
  }
}
