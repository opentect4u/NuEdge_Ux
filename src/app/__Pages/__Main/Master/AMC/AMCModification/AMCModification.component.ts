import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-AMCModification',
  templateUrl: './AMCModification.component.html',
  styleUrls: ['./AMCModification.component.css']
})
export class AMCModificationComponent implements OnInit {
  __RntMaster: any = [];
  __ProductMaster: any = [];
  __amcForm = new FormGroup({
    rnt_id: new FormControl('', [Validators.required]),
    product_id: new FormControl('', [Validators.required]),
    amc_name: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<AMCModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__amcForm.setValue({
        amc_name: this.data.items.amc_name,
        product_id: this.data.items.product_id,
        rnt_id: this.data.items.rnt_id,
        id: this.data.id
      });
    }
    this.getRNTMaster();
    this.getProductMaster();

  }

  ngOnInit() { }
  submit() {
    if (this.__amcForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/amcAddEdit', this.__amcForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      console.log(res);
      if (res == 1) {
        this.dialogRef.close(this.__amcForm.value);
      }
    })
  }
  getRNTMaster() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__RntMaster = res;
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__ProductMaster = res;
    })
  }
}
