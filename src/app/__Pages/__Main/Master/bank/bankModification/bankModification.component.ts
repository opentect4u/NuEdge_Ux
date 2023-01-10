import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-bankModification',
  templateUrl: './bankModification.component.html',
  styleUrls: ['./bankModification.component.css']
})
export class BankModificationComponent implements OnInit {
  __bankForm = new FormGroup({
    ifs_code: new FormControl('', [Validators.required]),
    bank_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<BankModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__bankForm.setValue({
        ifs_code: this.data.items.ifs_code,
        bank_name: this.data.items.bank_name,
        id: this.data.id
      });
    }
  }

  ngOnInit() { }
  submit() {
    if (this.__bankForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/depositbankAddEdit', this.__bankForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      if (res == 1) {
        this.dialogRef.close(this.__bankForm.value);
      }
    })
  }

}
