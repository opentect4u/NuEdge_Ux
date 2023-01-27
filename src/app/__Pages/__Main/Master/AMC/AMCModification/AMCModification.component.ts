import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

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
    ofc_address: new FormControl('', [Validators.required]),
    cust_care_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    cust_care_email: new FormControl('', [Validators.required, Validators.email]),
    web_site: new FormControl('', [Validators.required]),
    l1_name: new FormControl('', [Validators.required]),
    l1_email: new FormControl('', [Validators.required, Validators.email]),
    l1_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l2_name: new FormControl('', [Validators.required]),
    l2_email: new FormControl('', [Validators.required, Validators.email]),
    l2_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l3_name: new FormControl('', [Validators.required]),
    l3_email: new FormControl('', [Validators.required, Validators.email]),
    l3_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l4_name: new FormControl('', [Validators.required]),
    l4_email: new FormControl('', [Validators.required, Validators.email]),
    l4_contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l5_name: new FormControl(''),
    l5_email: new FormControl(''),
    l5_contact_no: new FormControl(''),
    l6_name: new FormControl(''),
    l6_email: new FormControl(''),
    l6_contact_no: new FormControl(''),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<AMCModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__amcForm.patchValue({
        amc_name: this.data.items.amc_name,
        product_id: this.data.items.product_id,
        rnt_id: this.data.items.rnt_id,
        id: this.data.id,
        web_site: this.data.items.website,
        ofc_address: this.data.items.ofc_addr,
        cust_care_no: this.data.items.cus_care_no > 0 ? this.data.items.cus_care_no : '',
        cust_care_email: this.data.items.cus_care_email,

        l1_name: this.data.items.l1_name,
        l1_email: this.data.items.l1_email,
        l1_contact_no: this.data.items.l1_contact_no > 0 ? this.data.items.l1_contact_no : '',

        l2_name: this.data.items.l2_name,
        l2_email: this.data.items.l2_email,
        l2_contact_no: this.data.items.l2_contact_no > 0 ? this.data.items.l2_contact_no : '',

        l3_name: this.data.items.l3_name,
        l3_email: this.data.items.l3_email,
        l3_contact_no: this.data.items.l3_contact_no > 0 ? this.data.items.l3_contact_no : '',

        l4_name: this.data.items.l4_name,
        l4_email: this.data.items.l3_email,
        l4_contact_no: this.data.items.l4_contact_no > 0 ? this.data.items.l4_contact_no : '',

        l5_name: this.data.items.l5_name,
        l5_email: this.data.items.l5_email,
        l5_contact_no: this.data.items.l5_contact_no > 0 ? this.data.items.l5_contact_no : '',

        l6_name: this.data.items.l6_name,
        l6_email: this.data.items.l6_email,
        l6_contact_no: this.data.items.l6_contact_no > 0 ? this.data.items.l6_contact_no : ''
      });
    }
    this.getRNTMaster();
    this.getProductMaster();

  }

  ngOnInit() { }
  submit() {
    if (this.__amcForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __amc = new FormData();
    __amc.append("amc_name", this.__amcForm.value.amc_name);
    __amc.append("product_id", this.__amcForm.value.product_id);
    __amc.append("rnt_id", this.__amcForm.value.rnt_id);
    __amc.append("cus_care_no", this.__amcForm.value.cust_care_no > 0 ? this.__amcForm.value.cust_care_no : '');
    __amc.append("ofc_addr", this.__amcForm.value.ofc_address);
    __amc.append("cus_care_email", this.__amcForm.value.cust_care_email);
    __amc.append("website", this.__amcForm.value.web_site);


    __amc.append("l1_name", this.__amcForm.value.l1_name);
    __amc.append("l1_email", this.__amcForm.value.l1_email);
    __amc.append("l1_contact_no", this.__amcForm.value.l1_contact_no > 0 ? this.__amcForm.value.l1_contact_no : '');


    __amc.append("l2_name", this.__amcForm.value.l2_name);
    __amc.append("l2_email", this.__amcForm.value.l2_email);
    __amc.append("l2_contact_no", this.__amcForm.value.l2_contact_no > 0 ? this.__amcForm.value.l2_contact_no : '');

    __amc.append("l3_name", this.__amcForm.value.l3_name);
    __amc.append("l3_email", this.__amcForm.value.l3_email);
    __amc.append("l3_contact_no", this.__amcForm.value.l3_contact_no > 0 ? this.__amcForm.value.l3_contact_no : '');

    __amc.append("l4_name", this.__amcForm.value.l4_name);
    __amc.append("l4_email", this.__amcForm.value.l4_email);
    __amc.append("l4_contact_no", this.__amcForm.value.l4_contact_no > 0 ? this.__amcForm.value.l4_contact_no : '');

    __amc.append("l5_name", this.__amcForm.value.l5_name);
    __amc.append("l5_email", this.__amcForm.value.l5_email);
    __amc.append("l5_contact_no", this.__amcForm.value.l5_contact_no > 0 ? this.__amcForm.value.l5_contact_no : '');

    __amc.append("l6_name", this.__amcForm.value.l6_name);
    __amc.append("l6_email", this.__amcForm.value.l6_email);
    __amc.append("l6_contact_no", this.__amcForm.value.l6_contact_no > 0 ? this.__amcForm.value.l6_contact_no : '');

    __amc.append("id", this.__amcForm.value.id);

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
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
}
