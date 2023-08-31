import { Component, OnInit ,Inject} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-amc-dtls-preview',
  templateUrl: './amc-dtls-preview.component.html',
  styleUrls: ['./amc-dtls-preview.component.css']
})
export class AmcDtlsPreviewComponent implements OnInit {
  __isVisible:boolean= false;

  __amcForm = new FormGroup({
    rnt_id: new FormControl({value:this.data.id > 0 ? (this.data.amc.rnt_id ? this.data.amc.rnt_id : '') : '',disabled:true}),
    amc_code:new FormControl({value:this.data.id > 0 ? this.data.amc.amc_code : '',disabled:true}),
    login_url: new FormControl({value:this.data.id > 0 ? this.data.amc.login_url : '',disabled:true}),
    login_pass: new FormControl({value:this.data.id > 0 ? this.data.amc.login_pass : '',disabled:true}),
    login_id: new FormControl({value:this.data.id > 0 ? this.data.amc.login_id : '',disabled:true}),
    head_ofc_contact_per: new FormControl({value:this.data.id > 0 ? this.data.amc.head_ofc_contact_per : '',disabled:true}),
    head_contact_per_mob: new FormControl({value:this.data.id > 0 ? this.data.amc.head_contact_per_mob : '',disabled:true}),
    head_contact_per_email: new FormControl({value:this.data.id > 0 ? this.data.amc.head_contact_per_email : '',disabled:true}),
    head_ofc_addr: new FormControl({value:this.data.id > 0 ? this.data.amc.head_ofc_addr : '',disabled:true}),
    is_same: new FormControl({value:false,disabled:true}),
    local_ofc_contact_per: new FormControl({value:this.data.id > 0 ? this.data.amc.local_ofc_contact_per : '',disabled:true}),
    local_contact_per_mob: new FormControl({value:this.data.id > 0 ? this.data.amc.local_contact_per_mob : '',disabled:true}),
    local_contact_per_email: new FormControl({value:this.data.id > 0 ? this.data.amc.local_contact_per_email : '',disabled:true}),
    local_ofc_addr: new FormControl({value:this.data.id > 0 ? this.data.amc.local_ofc_addr : '',disabled:true}),
    cus_care_whatsapp_no: new FormControl({value:this.data.id > 0 ? this.data.amc.cus_car_whatsapp_no : '',disabled:true}),
    sec_qusAns: new FormArray([]),
    amc_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.amc_name ? this.data.amc.amc_name : '') : '',disabled:true}),
    amc_short_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.amc_short_name ? this.data.amc.amc_short_name : '') : '',disabled:true}),
    ofc_address: new FormControl({value:this.data.id > 0 ? (this.data.amc.ofc_addr ? this.data.amc.ofc_addr : '') : '',disabled:true}),
    cust_care_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.cus_care_no ? this.data.amc.cus_care_no : '') : '',disabled:true}),
    cust_care_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.cus_care_email ? this.data.amc.cus_care_email : '') : '',disabled:true}),
    web_site: new FormControl({value:this.data.id > 0 ? (this.data.amc.website  ? this.data.amc.website  : ''): '',disabled:true}),
    l1_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.l1_name!="null"  ? this.data.amc.l1_name  : ''): '',disabled:true}),
    l1_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.l1_email!="null" ? this.data.amc.l1_email : '') : '',disabled:true}),
    l1_contact_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.l1_contact_no> 0 ? this.data.amc.l1_contact_no : '') : '',disabled:true}
    ),
    l2_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.l2_name!="null"  ? this.data.amc.l2_name  : ''): '',disabled:true}),
    l2_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.l2_email!="null" ? this.data.amc.l2_email : '') : '',disabled:true}),
    l2_contact_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.l2_contact_no> 0 ? this.data.amc.l2_contact_no : '') : '',disabled:true}),
    l3_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.l3_name!="null"  ? this.data.amc.l3_name  : ''): '',disabled:true}),
    l3_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.l3_email!="null" ? this.data.amc.l3_email : '') : '',disabled:true}),
    l3_contact_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.l3_contact_no> 0 ? this.data.amc.l3_contact_no : '') : '',disabled:true}
    ),
    l4_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.l4_name!="null"  ? this.data.amc.l4_name  : ''): '',disabled:true}),
    l4_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.l4_email!="null" ? this.data.amc.l4_email : '') : '',disabled:true}),
    l4_contact_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.l4_contact_no> 0 ? this.data.amc.l4_contact_no : '') : '',disabled:true}
    ),
    l5_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.l5_name!="null"  ? this.data.amc.l5_name  : ''): '',disabled:true}),
    l5_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.l5_email!="null" ? this.data.amc.l5_email : '') : '',disabled:true}),
    l5_contact_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.l5_contact_no> 0 ? this.data.amc.l5_contact_no : '') : '',disabled:true}
    ),
    l6_name: new FormControl({value:this.data.id > 0 ? (this.data.amc.l6_name!="null"  ? this.data.amc.l6_name  : ''): '',disabled:true}),
    l6_email: new FormControl({value:this.data.id > 0 ? (this.data.amc.l6_email!="null" ? this.data.amc.l6_email : '') : '',disabled:true}),
    l6_contact_no: new FormControl({value:this.data.id > 0 ? (this.data.amc.l6_contact_no> 0 ? this.data.amc.l6_contact_no : '') : '',disabled:true}
    ),
    id: new FormControl(this.data.id),
    gstin:new FormControl({value:this.data.id > 0 ? this.data.amc.gstin : '',disabled:true}),
    distributor_care_email: new FormControl({value:this.data.id > 0 ? this.data.amc.distributor_care_email : '',disabled:true}),
    distributor_care_no: new FormControl({value:this.data.id > 0 ? this.data.amc.distributor_care_no : '',disabled:true}),
    logo_preview_file: new FormControl(this.data.id > 0 ? `${environment.amc_logo_url+this.data.amc.logo}` : ''),

  })
  constructor(
    public dialogRef: MatDialogRef<AmcDtlsPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public __dialog: MatDialog,
    private __utility:UtiliService
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
   }

  ngOnInit(): void {
    this.addSecurityQuesAns(this.data.id > 0 ? (this.data.amc.security_qus_ans ? JSON.parse(this.data.amc.security_qus_ans) : []) : []);
  }
  get sec_qusAns(): FormArray {
    return this.__amcForm.get("sec_qusAns") as FormArray;
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
      sec_qus: new FormControl({value:sec_qus,disabled:true}),
      sec_ans: new FormControl({value:sec_ans,disabled:true})
    })
  }
}
