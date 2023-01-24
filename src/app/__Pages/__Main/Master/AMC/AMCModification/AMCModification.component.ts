import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-AMCModification',
  templateUrl: './AMCModification.component.html',
  styleUrls: ['./AMCModification.component.css']
})
export class AMCModificationComponent implements OnInit {
  __RntMaster: rnt[] = [];
  __ProductMaster: product[] = [];
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
    private __utility: UtiliService,
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
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __amc = new FormData();
    __amc.append("amc_name",this.__amcForm.value.amc_name);
    __amc.append("product_id",this.__amcForm.value.product_id);
    __amc.append("rnt_id",this.__amcForm.value.rnt_id);
    __amc.append("id",this.__amcForm.value.id);

    this.__dbIntr.api_call(1, '/amcAddEdit', __amc).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'AMC updated successfully' : 'AMC added successfully') : 'Something went wrong! please try again later', res.suc);
    })
  }
  getRNTMaster() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe((res: rnt[]) => {
      this.__RntMaster = res;
    })
  }
  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
}
