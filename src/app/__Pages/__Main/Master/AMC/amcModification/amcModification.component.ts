import { Component, OnInit ,Inject} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';

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

    login_url: new FormControl(this.data.id > 0 ? this.data.amc.login_url : ''),
    login_pass: new FormControl(this.data.id > 0 ? this.data.amc.login_pass : ''),
    login_id: new FormControl(this.data.id > 0 ? this.data.amc.login_id : ''),
    head_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.amc.head_ofc_contact_per : ''),
    head_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.amc.head_contact_per_mob : '',[Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]),
    head_contact_per_email: new FormControl(this.data.id > 0 ? this.data.amc.head_contact_per_email : '',[Validators.email]),
    head_ofc_addr: new FormControl(this.data.id > 0 ? this.data.amc.head_ofc_addr : ''),
    is_same: new FormControl(false),
    local_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.amc.local_ofc_contact_per : ''),
    local_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.amc.local_contact_per_mob : '',[Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]),
    local_contact_per_email: new FormControl(this.data.id > 0 ? this.data.amc.local_contact_per_email : '',[Validators.email]),
    local_ofc_addr: new FormControl(this.data.id > 0 ? this.data.amc.local_ofc_addr : ''),
    cus_care_whatsapp_no: new FormControl(this.data.id > 0 ? this.data.amc.cus_car_whatsapp_no : '',[Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]),
    sec_qusAns: new FormArray([]),
    amc_name: new FormControl(this.data.id > 0 ? (this.data.amc.amc_name ? this.data.amc.amc_name : '') : '', [Validators.required]),
    amc_short_name: new FormControl(this.data.id > 0 ? (this.data.amc.amc_short_name ? this.data.amc.amc_short_name : '') : '',[Validators.required]),
    ofc_address: new FormControl(this.data.id > 0 ? (this.data.amc.ofc_addr ? this.data.amc.ofc_addr : '') : ''),
    cust_care_no: new FormControl(this.data.id > 0 ? (this.data.amc.cus_care_no ? this.data.amc.cus_care_no : '') : '', [Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]),
    cust_care_email: new FormControl(this.data.id > 0 ? (this.data.amc.cus_care_email ? this.data.amc.cus_care_email : '') : '', [Validators.email]),
    web_site: new FormControl(this.data.id > 0 ? (this.data.amc.website  ? this.data.amc.website  : ''): ''),
    l1_name: new FormControl(this.data.id > 0 ? (this.data.amc.l1_name!="null"  ? this.data.amc.l1_name  : ''): ''),
    l1_email: new FormControl(this.data.id > 0 ? (this.data.amc.l1_email!="null" ? this.data.amc.l1_email : '') : '', [Validators.email]),
    l1_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l1_contact_no> 0 ? this.data.amc.l1_contact_no : '') : '',
    [Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]
    ),
    l2_name: new FormControl(this.data.id > 0 ? (this.data.amc.l2_name!="null"  ? this.data.amc.l2_name  : ''): ''),
    l2_email: new FormControl(this.data.id > 0 ? (this.data.amc.l2_email!="null" ? this.data.amc.l2_email : '') : '', [Validators.email]),
    l2_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l2_contact_no> 0 ? this.data.amc.l2_contact_no : '') : '',
    [Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]),
    l3_name: new FormControl(this.data.id > 0 ? (this.data.amc.l3_name!="null"  ? this.data.amc.l3_name  : ''): ''),
    l3_email: new FormControl(this.data.id > 0 ? (this.data.amc.l3_email!="null" ? this.data.amc.l3_email : '') : '', [Validators.email]),
    l3_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l3_contact_no> 0 ? this.data.amc.l3_contact_no : '') : '',
    [Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]
    ),
    l4_name: new FormControl(this.data.id > 0 ? (this.data.amc.l4_name!="null"  ? this.data.amc.l4_name  : ''): ''),
    l4_email: new FormControl(this.data.id > 0 ? (this.data.amc.l4_email!="null" ? this.data.amc.l4_email : '') : '', [Validators.email]),
    l4_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l4_contact_no> 0 ? this.data.amc.l4_contact_no : '') : '',
    [Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]
    ),
    l5_name: new FormControl(this.data.id > 0 ? (this.data.amc.l5_name!="null"  ? this.data.amc.l5_name  : ''): ''),
    l5_email: new FormControl(this.data.id > 0 ? (this.data.amc.l5_email!="null" ? this.data.amc.l5_email : '') : '',[Validators.email]),
    l5_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l5_contact_no> 0 ? this.data.amc.l5_contact_no : '') : '',
    [Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]
    ),
    l6_name: new FormControl(this.data.id > 0 ? (this.data.amc.l6_name!="null"  ? this.data.amc.l6_name  : ''): ''),
    l6_email: new FormControl(this.data.id > 0 ? (this.data.amc.l6_email!="null" ? this.data.amc.l6_email : '') : '',[Validators.email]),
    l6_contact_no: new FormControl(this.data.id > 0 ? (this.data.amc.l6_contact_no> 0 ? this.data.amc.l6_contact_no : '') : '',
    [Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]
    ),
    id: new FormControl(this.data.id),
    gstin:new FormControl(this.data.id > 0 ? this.data.amc.gstin : '',[Validators.required]),
    distributor_care_email: new FormControl(this.data.id > 0 ? this.data.amc.distributor_care_email : '',[Validators.email]),
    distributor_care_no: new FormControl(this.data.id > 0 ? this.data.amc.distributor_care_no : '',[Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]),

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
    this.addSecurityQuesAns(this.data.id > 0 ? (this.data.amc.security_qus_ans ? JSON.parse(this.data.amc.security_qus_ans) : []) : []);
  }
  ngAfterViewInit(){
    this.__amcForm.controls['is_same'].valueChanges.subscribe(res =>{
          this.__amcForm.controls['l4_name'].setValue(res ? global.getActualVal(this.__amcForm.controls['local_ofc_contact_per'].value) : '');
          this.__amcForm.controls['l4_contact_no'].setValue(res ? global.getActualVal(this.__amcForm.controls['local_contact_per_mob'].value) : '');
          this.__amcForm.controls['l4_email'].setValue(res ? global.getActualVal(this.__amcForm.controls['local_contact_per_email'].value) : '');
    })
  }
  get sec_qusAns(): FormArray {
    return this.__amcForm.get("sec_qusAns") as FormArray;
  }
  addSecurityQuesAns(secQusAns : any | undefined | null = []): void {
    console.log(secQusAns);

    if(secQusAns.length == 0){
      this.sec_qusAns.push(this.SecurityQuesAns());
    }
    else{
      secQusAns.forEach(el =>{
         this.sec_qusAns.push(this.SecurityQuesAns(el.id,el.sec_qus,el.sec_ans));
      })
    }
  }
  SecurityQuesAns(id: number | null = 0,
    sec_qus:string | null = '',
    sec_ans: string | null = '') : FormGroup{
    return new FormGroup({
      id: new FormControl(id),
      sec_qus: new FormControl(sec_qus),
      sec_ans: new FormControl(sec_ans)
    })
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

  // getProductMaster() {
  //   this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
  //     this.__ProductMaster = res;
  //   })
  // }
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
    __amc.append("amc_short_name", this.__amcForm.value.amc_short_name);
    __amc.append("product_id", this.data.product_id);
    __amc.append("rnt_id", this.__amcForm.value.rnt_id);
    __amc.append("cus_care_no", this.__amcForm.value.cust_care_no > 0 ? this.__amcForm.value.cust_care_no : '');
    __amc.append("ofc_addr", this.__amcForm.value.ofc_address);
    __amc.append("cus_care_email", this.__amcForm.value.cust_care_email);
    __amc.append("website", this.__amcForm.value.web_site);
    __amc.append("distributor_care_no", this.__amcForm.value.distributor_care_no);
    __amc.append("distributor_care_email", this.__amcForm.value.distributor_care_email);
    __amc.append("login_url", this.__amcForm.value.login_url);
    __amc.append("login_pass", this.__amcForm.value.login_pass);
    __amc.append("login_id", this.__amcForm.value.login_id);
    __amc.append("cus_care_whatsapp_no", this.__amcForm.value.cus_care_whatsapp_no);
    __amc.append('security_qus_ans',JSON.stringify(this.__amcForm.value.sec_qusAns));


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

    __amc.append("head_ofc_contact_per",this.__amcForm.value.head_ofc_contact_per);
    __amc.append("head_contact_per_mob",this.__amcForm.value.head_contact_per_mob);
    __amc.append("head_contact_per_email",this.__amcForm.value.head_contact_per_email);
    __amc.append("head_ofc_addr",this.__amcForm.value.head_ofc_addr);
    __amc.append("local_ofc_contact_per",this.__amcForm.value.local_ofc_contact_per);
    __amc.append("local_contact_per_mob",this.__amcForm.value.local_contact_per_mob);
    __amc.append("local_contact_per_email",this.__amcForm.value.local_contact_per_email);
    __amc.append("local_ofc_addr",this.__amcForm.value.local_ofc_addr);
    __amc.append("gstin",this.__amcForm.value.gstin);

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
  removeSecurityQuesAns(index){
    this.sec_qusAns.removeAt(index);
  }
}
