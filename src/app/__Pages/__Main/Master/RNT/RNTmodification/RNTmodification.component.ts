import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'master-RNTmodification',
  templateUrl: './RNTmodification.component.html',
  styleUrls: ['./RNTmodification.component.css']
})
export class RNTmodificationComponent implements OnInit {
  __rntForm = new FormGroup({
    rnt_name: new FormControl('', [Validators.required]),
    id: new FormControl(0),
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
    l6_contact_no: new FormControl('')
  })
  constructor(
    public dialogRef: MatDialogRef<RNTmodificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    if (this.data.id > 0) {
      this.__rntForm.patchValue({
        rnt_name: this.data.rnt_name,
        id: this.data.id,
        ofc_address: this.data.items.ofc_addr,
        cust_care_no: this.data.items.cus_care_no > 0 ? this.data.items.cus_care_no : '',
        cust_care_email: this.data.items.cus_care_email,
        web_site: this.data.items.website,

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
  }

  ngOnInit() {
  }
  submit() {
    if (this.__rntForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const fb = new FormData();
    fb.append("rnt_name", this.__rntForm.value.rnt_name);
    fb.append("id", this.__rntForm.value.id);
    fb.append("cus_care_no", this.__rntForm.value.cust_care_no > 0 ? this.__rntForm.value.cust_care_no : '');
    fb.append("ofc_addr", this.__rntForm.value.ofc_address);
    fb.append("cus_care_email", this.__rntForm.value.cust_care_email);
    fb.append("website", this.__rntForm.value.web_site);


    fb.append("l1_name", this.__rntForm.value.l1_name);
    fb.append("l1_email", this.__rntForm.value.l1_email);
    fb.append("l1_contact_no", this.__rntForm.value.l1_contact_no > 0 ? this.__rntForm.value.l1_contact_no : '');


    fb.append("l2_name", this.__rntForm.value.l2_name);
    fb.append("l2_email", this.__rntForm.value.l2_email);
    fb.append("l2_contact_no", this.__rntForm.value.l2_contact_no > 0 ? this.__rntForm.value.l2_contact_no : '');

    fb.append("l3_name", this.__rntForm.value.l3_name);
    fb.append("l3_email", this.__rntForm.value.l3_email);
    fb.append("l3_contact_no", this.__rntForm.value.l3_contact_no > 0 ? this.__rntForm.value.l3_contact_no : '');

    fb.append("l4_name", this.__rntForm.value.l4_name);
    fb.append("l4_email", this.__rntForm.value.l4_email);
    fb.append("l4_contact_no", this.__rntForm.value.l4_contact_no > 0 ? this.__rntForm.value.l4_contact_no : '');

    fb.append("l5_name", this.__rntForm.value.l5_name);
    fb.append("l5_email", this.__rntForm.value.l5_email);
    fb.append("l5_contact_no", this.__rntForm.value.l5_contact_no > 0 ? this.__rntForm.value.l5_contact_no : '');

    fb.append("l6_name", this.__rntForm.value.l6_name);
    fb.append("l6_email", this.__rntForm.value.l6_email);
    fb.append("l6_contact_no", this.__rntForm.value.l6_contact_no > 0 ? this.__rntForm.value.l6_contact_no : '');


    this.__dbIntr.api_call(1, '/rntAddEdit', fb).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close({ id: this.data.id, data: res.data });
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id == 1 ? 'RNT updated successfully' : 'RNT added successfully') : 'Something went wrong! please try again later', res.suc);
    })

  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
}
