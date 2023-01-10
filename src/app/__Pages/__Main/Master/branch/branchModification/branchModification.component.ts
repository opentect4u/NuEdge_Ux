import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-branchModification',
  templateUrl: './branchModification.component.html',
  styleUrls: ['./branchModification.component.css']
})
export class BranchModificationComponent implements OnInit {
  __branchForm = new FormGroup({
    brn_code: new FormControl('', [Validators.required]),
    brn_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<BranchModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {   
    if (this.data.id > 0) {
      this.__branchForm.setValue({
        brn_code: this.data.items.brn_code,
        brn_name: this.data.items.brn_name,
        id: this.data.id
      });
    }
  }

  ngOnInit() { }
  submit() {
    if (this.__branchForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/branchAddEdit', this.__branchForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      if (res == 1) {
        this.dialogRef.close(this.__branchForm.value);
      }
    })
  }
}
