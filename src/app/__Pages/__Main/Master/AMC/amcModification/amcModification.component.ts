import { Component, OnInit ,Inject} from '@angular/core';
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
  selector: 'app-amcModification',
  templateUrl: './amcModification.component.html',
  styleUrls: ['./amcModification.component.css']
})
export class AmcModificationComponent implements OnInit {
  __isVisible:boolean= false;
  __RntMaster: rnt[] = [];
  __ProductMaster: product[] = [];
  __amcForm = new FormGroup({
    rnt_id: new FormControl(this.data.id > 0 ? (this.data.amc.rnt_id ? this.data.amc.rnt_id : '') : '', [Validators.required]),
    product_id: new FormControl(this.data.id > 0 ? (this.data.amc.product_id ? this.data.amc.product_id : '') : '', [Validators.required]),
    amc_name: new FormControl(this.data.id > 0 ? (this.data.amc.amc_name ? this.data.amc.amc_name : '') : '', [Validators.required]),
    ofc_address: new FormControl(this.data.id > 0 ? (this.data.amc.ofc_addr ? this.data.amc.ofc_addr : '') : '', [Validators.required]),
    cust_care_no: new FormControl(this.data.id > 0 ? (this.data.amc.cus_care_no ? this.data.amc.cus_care_no : '') : '', [Validators.required, Validators.pattern("^[0-9]*$")]),
    cust_care_email: new FormControl(this.data.id > 0 ? (this.data.amc.cus_care_email ? this.data.amc.cus_care_email : '') : '', [Validators.required, Validators.email]),
    web_site: new FormControl(this.data.id > 0 ? (this.data.amc.website  ? this.data.amc.website  : ''): '', [Validators.required]),
    l1_name: new FormControl(this.data.id > 0 ? (this.data.amc.l1_name!="null"  ? this.data.amc.l1_name  : ''): '', [Validators.required]),
    l1_email: new FormControl(this.data.id > 0 ? (this.data.amc.l1_email!="null" ? this.data.amc.l1_email : '') : '', [Validators.required, Validators.email]),
    l1_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l1_contact_no> 0 ? this.data.amc.l1_contact_no : '') : '', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l2_name: new FormControl(this.data.id > 0 ? (this.data.amc.l2_name!="null"  ? this.data.amc.l2_name  : ''): '', [Validators.required]),
    l2_email: new FormControl(this.data.id > 0 ? (this.data.amc.l2_email!="null" ? this.data.amc.l2_email : '') : '', [Validators.required, Validators.email]),
    l2_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l2_contact_no> 0 ? this.data.amc.l2_contact_no : '') : '', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l3_name: new FormControl(this.data.id > 0 ? (this.data.amc.l3_name!="null"  ? this.data.amc.l3_name  : ''): '', [Validators.required]),
    l3_email: new FormControl(this.data.id > 0 ? (this.data.amc.l3_email!="null" ? this.data.amc.l3_email : '') : '', [Validators.required, Validators.email]),
    l3_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l3_contact_no> 0 ? this.data.amc.l3_contact_no : '') : '', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l4_name: new FormControl(this.data.id > 0 ? (this.data.amc.l4_name!="null"  ? this.data.amc.l4_name  : ''): '', [Validators.required]),
    l4_email: new FormControl(this.data.id > 0 ? (this.data.amc.l4_email!="null" ? this.data.amc.l4_email : '') : '', [Validators.required, Validators.email]),
    l4_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l4_contact_no> 0 ? this.data.amc.l4_contact_no : '') : '', [Validators.required, Validators.pattern("^[0-9]*$")]),
    l5_name: new FormControl(this.data.id > 0 ? (this.data.amc.l5_name!="null"  ? this.data.amc.l5_name  : ''): ''),
    l5_email: new FormControl(this.data.id > 0 ? (this.data.amc.l5_email!="null" ? this.data.amc.l5_email : '') : ''),
    l5_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l5_contact_no> 0 ? this.data.amc.l5_contact_no : '') : ''),
    l6_name: new FormControl(this.data.id > 0 ? (this.data.amc.l6_name!="null"  ? this.data.amc.l6_name  : ''): ''),
    l6_email: new FormControl(this.data.id > 0 ? (this.data.amc.l6_email!="null" ? this.data.amc.l6_email : '') : ''),
    l6_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l6_contact_no> 0 ? this.data.amc.l6_contact_no : '') : ''),
    id: new FormControl(this.data.id),
    sip_start_date: new FormControl(this.data.id > 0 ? this.data.amc.sip_start_date : '', [Validators.required]),
    sip_end_date: new FormControl(this.data.id > 0 ? this.data.amc.sip_end_date : '', [Validators.required])
  })
  constructor(
    public dialogRef: MatDialogRef<AmcModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { 

  }

  ngOnInit() {
    this.getRNTMaster();
    this.getProductMaster();
  }
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }

  getProductMaster() {
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
  getRNTMaster() {
    this.__dbIntr.api_call(0, '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe((res: rnt[]) => {
      this.__RntMaster = res;
    })
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev);
  }
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
    __amc.append("sip_start_date", this.__amcForm.value.sip_start_date);
    __amc.append("sip_end_date", this.__amcForm.value.sip_end_date);

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
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'AMC updated successfully' : 'AMC added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
      this.dialogRef.close({ id: this.data.id, data: res.data }) 
    }
    })
  }
  reset(){
    this.__amcForm.reset();
  }

}
