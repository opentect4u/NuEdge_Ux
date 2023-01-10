import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-trnstypeModification',
  templateUrl: './trnstypeModification.component.html',
  styleUrls: ['./trnstypeModification.component.css']
})
export class TrnstypeModificationComponent implements OnInit {
  __ProductMaster: any = [];
  __trns_type = new FormGroup({
    product_id: new FormControl('', [Validators.required]),
    trns_type: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<TrnstypeModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__trns_type.setValue({
        product_id: this.data.items.product_id,
        trns_type: this.data.items.trns_type,
        id: this.data.id
      });
    }
    this.getProductMaster();

  }

  ngOnInit() { }
  submit() {
    if (this.__trns_type.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/transctiontypeAddEdit', this.__trns_type.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      console.log(res);
      if (res == 1) {
        this.dialogRef.close(this.__trns_type.value);
      }
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__ProductMaster = res;
    })
  }
}
