import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import fdmanualUpdateTrnstatus from '../../../../../../../../assets/json/Master/fdmanualUpdateTrnstatus.json';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  rejectReason: any = [];
  allowedExtensions=['pdf']
  __trns_status = fdmanualUpdateTrnstatus;
  __isVisible:boolean = false;
  __manualUpdateForm = new FormGroup({
    manual_trans_status: new FormControl(this.data.data.form_status == 'M' ?  this.data.data.manual_trans_status : '',[Validators.required]),
    process: new FormGroup({
      logged_in: new FormControl(this.data.data.form_status == 'M' ?  this.data.data.logged_in : ''),
       fdr_no: new FormControl(this.data.data.form_status == 'M' ? this.data.data.fdr_no : ''),
       fdr_scan: new FormControl('', [
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        ]),
      //  filePreview: new FormControl(this.data.data.data.data.form_status == 'M' ? `${environment.manual_update_formUrl_for_ins + this.data.data.data.data.policy_copy_scan}` : ''),
        fdr_copy_scan: new FormControl(''),
        file: new FormControl(this.data.data.form_status == 'M' ? `${environment.manual_update_formUrl_for_fd + this.data.data.fdr_scan}` : ''),
    }),
    contact_to_comp: new FormControl(this.data.data.form_status == 'M' ? this.data.data.contact_to_comp : ''),
    contact_via: new FormControl(this.data.data.form_status == 'M' ? this.data.data.contact_via : ''),
    contact_per_name: new FormControl(this.data.data.form_status == 'M' ? this.data.data.contact_per_name : ''),
    contact_per_phone: new FormControl(this.data.data.form_status == 'M' ? this.data.data.contact_per_phone : ''),
    contact_per_email: new FormControl(this.data.data.form_status == 'M' ? this.data.data.contact_per_email : ''),
    rejected: new FormGroup({
      reject_memo: new FormControl('', [
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        ]),
      reject_memo_scan: new FormControl(''),
      reject_memo_file: new FormControl(this.data.data.form_status == 'M' ? `${environment.manual_update_formUrl_for_fd + this.data.data.reject_memo}` : ''),
      reject_reason_id: new FormControl(this.data.data.form_status == 'M' ? this.data.data.reject_reason_id : '')
    }),
    pending: new FormGroup({
      pending_reason: new FormControl(this.data.data.form_status == 'M' ? this.data.data.pending_reason : '')
    }),
    manual_update_remarks: new FormControl(this.data.data.form_status == 'M' ? this.data.data.manual_update_remarks : '')

  })
  constructor(
    public dialogRef: MatDialogRef<EntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRejectReason();
  }

  disabledFields(){
    if(this.data.data.form_status == 'M'){
      this.__manualUpdateForm.controls['manual_trans_status'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['process','logged_in']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['process','fdr_no']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['process','fdr_scan']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['contact_to_comp'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['contact_via'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['contact_per_name'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['contact_per_phone'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.controls['contact_per_email'].disable({onlySelf:true,emitEvent:false});

      this.__manualUpdateForm.get(['rejected','reject_memo']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['rejected','reject_reason_id']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['pending','pending_reason']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get('manual_update_remarks').disable({onlySelf:true,emitEvent:false});


    }
  }
  getRejectReason(){
    this.__dbIntr.api_call(0,'/fd/rejectReason',null).pipe(pluck("data")).subscribe(res =>{
            this.rejectReason = res;
    })
  }

  ngAfterViewInit(){
    this.__manualUpdateForm.controls['manual_trans_status'].valueChanges.subscribe(res =>{
       this.__manualUpdateForm.get(['process','fdr_no']).setValidators(res == 'P' ? [Validators.required] : null);
       this.__manualUpdateForm.get(['process','logged_in']).setValidators(res == 'P' ? [Validators.required] : null);
       this.__manualUpdateForm.get(['process','fdr_scan']).setValidators(res == 'P' ? [fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
       this.__manualUpdateForm.get('contact_to_comp').setValidators((res == 'N' || res == 'R') ? [Validators.required] : null);
       this.__manualUpdateForm.get(['rejected','reject_memo']).setValidators(res == 'R' ? [ fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
       this.__manualUpdateForm.get(['pending','pending_reason']).setValidators(res == 'N' ? [Validators.required] : null);

       this.__manualUpdateForm.get(['pending','pending_reason']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['rejected','reject_memo']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get('contact_to_comp').updateValueAndValidity({emitEvent:true});
       this.__manualUpdateForm.get(['process','fdr_no']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['process','logged_in']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['process','fdr_scan']).updateValueAndValidity({emitEvent:false});

    })

    this.__manualUpdateForm.controls['contact_to_comp'].valueChanges.subscribe(res =>{
      this.__manualUpdateForm.get('contact_via').setValidators(res == 'Y' ? [Validators.required] : null);
      this.__manualUpdateForm.get('contact_via').updateValueAndValidity({emitEvent:true});
    })


    this.__manualUpdateForm.controls['contact_via'].valueChanges.subscribe(res =>{
      this.__manualUpdateForm.get('contact_per_name').setValidators((res == 'E' || res == 'P') ? [fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
      this.__manualUpdateForm.get('contact_per_email').setValidators(res == 'E' ? [fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
      this.__manualUpdateForm.get('contact_per_phone').setValidators(res == 'P' ? [fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
      this.__manualUpdateForm.get('contact_per_name').updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.get('contact_per_email').updateValueAndValidity({emitEvent:false});
      this.__manualUpdateForm.get('contact_per_phone').updateValueAndValidity({emitEvent:false});
    })
    this.disabledFields();

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
      .get(['process','fdr_scan'])
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
    this.__manualUpdateForm.get(['process','fdr_scan']).updateValueAndValidity();
    if (
      this.__manualUpdateForm.get(['process','fdr_scan']).status == 'VALID' &&
      __ev.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onload = (e) => this.__manualUpdateForm.get(['process','file']).patchValue(reader.result);
      reader.readAsDataURL(__ev.files[0]);
      this.__manualUpdateForm.get(['process','fdr_copy_scan']).patchValue(__ev.files[0]);
    } else {
      this.__manualUpdateForm.get(['process','file']).patchValue('');
      this.__manualUpdateForm.get(['process','fdr_copy_scan']).patchValue('');
    }
  }


  getFIleForMemo(__ev) {
    this.__manualUpdateForm
      .get(['rejected','reject_memo'])
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
    this.__manualUpdateForm.get(['rejected','reject_memo']).updateValueAndValidity();
    if (
      this.__manualUpdateForm.get(['rejected','reject_memo']).status == 'VALID' &&
      __ev.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onload = (e) =>
      this.__manualUpdateForm.get(['rejected','reject_memo_file']).patchValue(reader.result);
      reader.readAsDataURL(__ev.files[0]);
      this.__manualUpdateForm.get(['rejected','reject_memo_scan']).patchValue(__ev.files[0]);
    } else {
      this.__manualUpdateForm.get(['rejected','reject_memo_file']).patchValue('');
      this.__manualUpdateForm.get(['rejected','reject_memo_scan']).patchValue('');
    }
  }
  submitManualUpdate(){
    console.log(this.__manualUpdateForm);

    if(this.__manualUpdateForm.invalid){
     this.__utility.showSnackbar('Validation Error!!',0);
     return ;
    }
    const __fb = new FormData();
    __fb.append('tin_no',this.data.tin_no);

    __fb.append('manual_trans_status',this.__manualUpdateForm.value.manual_trans_status);
    __fb.append('manual_update_remarks',this.__manualUpdateForm.value.manual_update_remarks);
    if(this.__manualUpdateForm.value.manual_trans_status == 'P'){
    __fb.append('logged_in',this.__manualUpdateForm.get(['process','logged_in']).value);
    __fb.append('fdr_no',this.__manualUpdateForm.get(['process','fdr_no']).value);
    __fb.append('fdr_scan',this.__manualUpdateForm.get(['process','fdr_copy_scan']).value);
    }
    else{
        if(this.__manualUpdateForm.value.manual_trans_status == 'R'){
          __fb.append('reject_reason_id',this.__manualUpdateForm.get(['rejected','reject_reason_id']).value);
          __fb.append('reject_memo',this.__manualUpdateForm.get(['rejected','reject_memo_scan']).value);
        }
        else{
          __fb.append('pending_reason',this.__manualUpdateForm.get(['pending','pending_reason']).value);
        }
      __fb.append('contact_to_comp',this.__manualUpdateForm.value.contact_to_comp);
      if(this.__manualUpdateForm.value.contact_to_comp == 'Y'){
      __fb.append('contact_via',this.__manualUpdateForm.value.contact_via);
      __fb.append('contact_per_name',this.__manualUpdateForm.value.contact_per_name);
         if(this.__manualUpdateForm.value.contact_via == 'E'){
          __fb.append('contact_per_email',this.__manualUpdateForm.value.contact_per_email);
         }
         else{
          __fb.append('contact_per_email',this.__manualUpdateForm.value.contact_per_phone);
         }
      }
    }
    this.__dbIntr.api_call(1,'/fd/manualUpdate',__fb).subscribe((res: any) =>{

       this.__utility.showSnackbar(res.suc == 1 ? 'Form Submitted Successfully' : res.msg,res.suc);
       if(res.suc == 1){
         this.dialogRef.close({tin_no:res.tin_no,data:res.data});
       }
    })
  }
}
