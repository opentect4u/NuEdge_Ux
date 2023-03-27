import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  allowedExtensions = ['pdf'];
  __medicalStatus: any= [];
  __isVisible:boolean = false;
  __manualUpdateForm = new FormGroup({
    medical_status: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.medical_status) : ''),
    medical_trigger: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.medical_trigger) : '',[Validators.required]),
    policy_status: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.policy_status) : '',[Validators.required]),
    policy_issue_dt: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.policy_issue_dt ) : ''),
    risk_dt: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.risk_dt ) : ''),
    maturity_dt: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.maturity_dt ) : ''),
    next_renewal_dt: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.next_renewal_dt ) : ''),
    policy_no: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.policy_no ) : ''),
    reject_remarks: new FormControl(this.data.data.form_status == 'M' ? global.getActualVal(this.data.data.reject_remarks ) : ''),
    filePreview: new FormControl(this.data.data.form_status == 'M' ? `${environment.manual_update_formUrl_for_ins + this.data.data.policy_copy_scan}` : ''),
    policy_copy_scan: new FormControl(''),
    file: new FormControl('', [
      fileValidators.fileExtensionValidator(this.allowedExtensions),
    ]),
  })
  constructor(
    public dialogRef: MatDialogRef<EntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMedicalStatus();
    this.disabledFields();
    console.log(this.data.data.mode_of_premium);

  }
  disabledFields(){
    if(this.data.data.form_status == 'M'){
      this.__manualUpdateForm.controls['medical_trigger'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['medical_status'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['policy_status'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['policy_issue_dt'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['risk_dt'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['maturity_dt'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['next_renewal_dt'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['policy_no'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['reject_remarks'].disable({onlySelf:true,emitEvent:false});
    }
  }
  ngAfterViewInit(){

    this.__manualUpdateForm.controls['policy_status'].valueChanges.subscribe(res =>{
      console.log(res);
      this.__manualUpdateForm.controls['policy_issue_dt'].setValidators(res == 'I' ? [Validators.required] : null);
      this.__manualUpdateForm.controls['risk_dt'].setValidators(res == 'I' ? [Validators.required] : null);
      this.__manualUpdateForm.controls['maturity_dt'].setValidators(res == 'I' ? [Validators.required] : null);
      this.__manualUpdateForm.controls['next_renewal_dt'].setValidators(
        (res == 'I' && this.data.data.mode_of_premium != 'S') ? [Validators.required] : null);
      this.__manualUpdateForm.controls['policy_no'].setValidators(res == 'I' ? [Validators.required] : null);
      this.__manualUpdateForm.get('file').setValidators(
        res == 'I' ? [
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions)
      ] : null);
      this.__manualUpdateForm
      .get('file').updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.controls['policy_issue_dt'].updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.controls['risk_dt'].updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.controls['maturity_dt'].updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.controls['next_renewal_dt'].updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.controls['policy_no'].updateValueAndValidity({emitEvent:false});
    })
    this.__manualUpdateForm.controls['policy_issue_dt'].valueChanges.subscribe(res =>{
        let dt =new Date(res);
        let calculateDT = new Date(dt.setFullYear(dt.getFullYear() + Number(this.data.data.policy_term)))
        this.__manualUpdateForm.controls['risk_dt'].setValue(res,{emitEvent:true});
        this.__manualUpdateForm.controls['maturity_dt'].setValue(calculateDT.toISOString().substring(0,10),{emitEvent:false});
    })
    this.__manualUpdateForm.controls['risk_dt'].valueChanges.subscribe(res =>{
      this.setRenewalDate(res,this.data.data.mode_of_premium);
    })
    this.__manualUpdateForm.controls['medical_trigger'].valueChanges.subscribe(res =>{
          this.__manualUpdateForm.controls['medical_status'].setValidators(res == 'Y' ? [Validators.required] : null);
          this.__manualUpdateForm.controls['medical_status'].updateValueAndValidity({emitEvent:false});
    })
  }
  setRenewalDate(__dt,mode_of_premium){
    let dt =new Date(__dt);
    var calculateDT;
    switch(mode_of_premium){
      case 'M':  calculateDT= new Date(dt.setMonth(dt.getMonth() + 1));break;
      case 'Q':  calculateDT= new Date(dt.setMonth(dt.getMonth() + 3));break;
      case 'H':  calculateDT= new Date(dt.setMonth(dt.getMonth() + 6));break;
      case 'A':  calculateDT= new Date(dt.setMonth(dt.getMonth() + 12));break;
      case 'S':  break;
      default: break;
    }
    this.__manualUpdateForm.controls['next_renewal_dt'].setValue(calculateDT.toISOString().substring(0,10),{emitEvent:false});
  }
  getMedicalStatus(){
    this.__dbIntr.api_call(0,'/ins/medicalStatus',null).pipe(pluck("data")).subscribe(res =>{
     this.__medicalStatus = res;
    })
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("50%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  getFIle(__ev) {
    this.__manualUpdateForm
      .get('file')
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
    this.__manualUpdateForm.get('file').updateValueAndValidity();
    if (
      this.__manualUpdateForm.get('file').status == 'VALID' &&
      __ev.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onload = (e) => this.setFormControl('filePreview', reader.result);
      reader.readAsDataURL(__ev.files[0]);
      this.setFormControl('policy_copy_scan', __ev.files[0]);
    } else {
      this.setFormControl('filePreview', '');
      this.setFormControl('policy_copy_scan', '');
    }
    console.log(this.__manualUpdateForm.get('policy_copy_scan'));
  }
  setFormControl(formcontrlname, __val) {
    this.__manualUpdateForm.get(formcontrlname).patchValue(__val);
  }
  manualUpdate(){
    console.log(this.__manualUpdateForm);

   if(this.__manualUpdateForm.invalid){
    this.__utility.showSnackbar('Validation Error!!',0);
    return ;
   }
   const __fb = new FormData();
   __fb.append('medical_trigger',this.__manualUpdateForm.value.medical_trigger);
   if(this.__manualUpdateForm.value.medical_trigger == 'Y'){
    __fb.append('medical_status',this.__manualUpdateForm.value.medical_status);
   }
   __fb.append('policy_status',this.__manualUpdateForm.value.policy_status);
   __fb.append('tin_no',this.data.data.tin_no);
   __fb.append('reject_remarks',this.__manualUpdateForm.value.reject_remarks);
   if(this.__manualUpdateForm.value.policy_status == 'I'){
    __fb.append('policy_issue_dt',this.__manualUpdateForm.value.policy_issue_dt);
    __fb.append('risk_dt',this.__manualUpdateForm.value.risk_dt);
    __fb.append('maturity_dt',this.__manualUpdateForm.value.maturity_dt);
    __fb.append('policy_no',this.__manualUpdateForm.value.policy_no);
    __fb.append('policy_copy_scan',this.__manualUpdateForm.value.policy_copy_scan);
    if(this.data.data.mode_of_premium != 'S'){
      __fb.append('next_renewal_dt',this.__manualUpdateForm.value.next_renewal_dt);
    }
   }
   this.__dbIntr.api_call(1,'/ins/manualUpdate',__fb).subscribe((res: any) =>{

      this.__utility.showSnackbar(res.suc == 1 ? 'Form Submitted Successfully' : res.message,res.suc);
      if(res.suc == 1){
        this.dialogRef.close({tin_no:res.tin_no,data:res.data});
      }
   })
  }
}
