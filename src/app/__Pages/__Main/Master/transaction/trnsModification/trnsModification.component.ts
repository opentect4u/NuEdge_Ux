import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-trnsModification',
  templateUrl: './trnsModification.component.html',
  styleUrls: ['./trnsModification.component.css']
})
export class TrnsModificationComponent implements OnInit {
  __transTypeMaster: any = [];
  __trnsForm = new FormGroup({
    trans_id: new FormControl('', [Validators.required]),
    trns_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<TrnsModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__trnsForm.setValue({
        trans_id: this.data.items.trans_id,
        trns_name: this.data.items.trns_name,
        id: this.data.id
      });
    }
    this.getTransactionTypeMaster();
  }

  ngOnInit() { }
  submit() {
    if (this.__trnsForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/transctionAddEdit', this.__trnsForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      if (res == 1) {
        this.dialogRef.close(this.__trnsForm.value);
      }
    })
  }
  getTransactionTypeMaster() {
    this.__dbIntr.api_call(0, '/transctiontype', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__transTypeMaster = res;
    })
  }
}
