import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import fdmanualUpdateTrnstatus from '../../../assets/json/Master/fdmanualUpdateTrnstatus.json';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { global } from 'src/app/__Utility/globalFunc';
import { dates } from 'src/app/__Utility/disabledt';
@Component({
  selector: 'app-manual-update-entry-for-mf',
  templateUrl: './manual-update-entry-for-mf.component.html',
  styleUrls: ['./manual-update-entry-for-mf.component.css']
})
export class ManualUpdateEntryForMFComponent implements OnInit {
  rejectReason: any = [];
  allowedExtensions=['pdf']
  __trns_status = fdmanualUpdateTrnstatus;
  __isVisible:boolean = false;
  __manualUpdateForm = new FormGroup({
    manual_trans_status: new FormControl(this.data.data.form_status == 'M' ?  this.data.data.manual_trans_status : '',[Validators.required]),
    process: new FormGroup({
      process_date: new FormControl(this.data.data.form_status == 'M' ?  this.data.data.process_date : ''),
       folio_no: new FormControl(this.data.data.form_status == 'M' ?  global.getActualVal(this.data.data.folio_no) : ''),
       ckyc_no: new FormControl(''),
       upload_soa: new FormControl('', [
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        ]),
        fdr_copy_scan: new FormControl(''),
        file: new FormControl(
          this.data.data.form_status == 'M'
          ? `${(this.data.data.manual_trans_status == 'P' ?
               (environment.soa_copy_url+this.data.data.upload_soa)
               : this.data.data.manual_trans_status == 'R' ?
               (environment.reject_memo+this.data.data.reject_memo)
               : ''
               )}`
               : ''),


          upload_scan: new FormControl('', [
            fileValidators.fileExtensionValidator(this.allowedExtensions),
            ]),
            kyc_scan_copy: new FormControl(''),
            file_scan: new FormControl(
              this.data.data.form_status == 'M'
              ? `${(this.data.data.manual_trans_status == 'P' ?
                   (environment.kyc_scan_copy+this.data.data.upload_scan)
                   : this.data.data.manual_trans_status == 'R' ?
                   (environment.kyc_reject_memo+this.data.data.reject_memo)
                   : ''
                   )}`
                   : ''

            ),
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
      reject_memo_file: new FormControl(this.data.data.form_status == 'M'
      ? `${(this.data?.mode == 'K' ? environment.kyc_reject_memo : environment.reject_memo) + this.data.data.reject_memo}`
      : ''),
      reject_reason_id: new FormControl(this.data.data.form_status == 'M' ? this.data.data.reject_reason_id : '')
    }),
    pending: new FormGroup({
      pending_reason: new FormControl(this.data.data.form_status == 'M' ? this.data.data.pending_reason : '')
    }),
    manual_update_remarks: new FormControl(this.data.data.form_status == 'M' ? this.data.data.manual_update_remarks : '')

  })
  constructor(
    public dialogRef: MatDialogRef<ManualUpdateEntryForMFComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRejectReason();
    console.log(this.data);

  }

  disabledFields(){
    if(this.data.data.form_status == 'M'){
      this.__manualUpdateForm.controls['manual_trans_status'].disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['process','process_date']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['process','folio_no']).disable({onlySelf:true,emitEvent:false});
      this.__manualUpdateForm.get(['process','upload_soa']).disable({onlySelf:true,emitEvent:false});
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
       this.__manualUpdateForm.get(['process','folio_no']).setValidators((res == 'P' && this.data?.mode != 'K') ? [Validators.required] : null);
      //  this.__manualUpdateForm.get(['process','ckyc_no']).setValidators((res == 'P' && this.data?.mode == 'K') ? [Validators.required] : null);

       this.__manualUpdateForm.get(['process','process_date']).setValidators(res == 'P' ? [Validators.required] : null);
       this.__manualUpdateForm.get(['process','upload_soa']).setValidators((res == 'P'  && this.data?.mode != 'K') ? [fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
       this.__manualUpdateForm.get(['process','upload_scan']).setValidators((res == 'P'  && this.data?.mode == 'K') ? [fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);


       this.__manualUpdateForm.get('contact_to_comp').setValidators((res == 'N' || res == 'R') ? [Validators.required] : null);
       this.__manualUpdateForm.get(['rejected','reject_memo']).setValidators((res == 'R' && this.data?.mode != 'K') ? [ fileValidators.fileExtensionValidator(this.allowedExtensions),Validators.required] : null);
       this.__manualUpdateForm.get(['pending','pending_reason']).setValidators(res == 'N' ? [Validators.required] : null);

       this.__manualUpdateForm.get(['pending','pending_reason']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['rejected','reject_memo']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get('contact_to_comp').updateValueAndValidity({emitEvent:true});
       this.__manualUpdateForm.get(['process','folio_no']).updateValueAndValidity({emitEvent:false});
      //  this.__manualUpdateForm.get(['process','ckyc_no']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['process','process_date']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['process','upload_soa']).updateValueAndValidity({emitEvent:false});
       this.__manualUpdateForm.get(['process','upload_scan']).updateValueAndValidity({emitEvent:false});
    })

    this.__manualUpdateForm.controls['contact_to_comp'].valueChanges.subscribe(res =>{
      this.__manualUpdateForm.get('contact_via').setValidators(res == 'Y' ? [Validators.required] : null);
      this.__manualUpdateForm.get('contact_via').updateValueAndValidity({emitEvent:true});
    })


    this.__manualUpdateForm.controls['contact_via'].valueChanges.subscribe(res =>{
      this.__manualUpdateForm.get('contact_per_name').setValidators((res == 'E' || res == 'P') ? [Validators.required] : null);
      this.__manualUpdateForm.get('contact_per_email').setValidators(res == 'E' ? [Validators.required,Validators.email] : null);
      this.__manualUpdateForm.get('contact_per_phone').setValidators(res == 'P' ? [Validators.required,Validators.minLength(10),Validators.maxLength(10), Validators.pattern("^[0-9]*$")] : null);
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
  getFIle(__ev,mode) {
    if(mode == 'M'){
    this.__manualUpdateForm
      .get(['process','upload_soa'])
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
    this.__manualUpdateForm.get(['process','upload_soa']).updateValueAndValidity();
    if (
      this.__manualUpdateForm.get(['process','upload_soa']).status == 'VALID' &&
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
  else{
    this.__manualUpdateForm
    .get(['process','upload_scan'])
    .setValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
      fileValidators.fileSizeValidator(__ev.files),
    ]);
  this.__manualUpdateForm.get(['process','upload_scan']).updateValueAndValidity();
  if (
    this.__manualUpdateForm.get(['process','upload_scan']).status == 'VALID' &&
    __ev.files.length > 0
  ) {
    const reader = new FileReader();
    reader.onload = (e) => this.__manualUpdateForm.get(['process','file_scan']).patchValue(reader.result);
    reader.readAsDataURL(__ev.files[0]);
    this.__manualUpdateForm.get(['process','kyc_scan_copy']).patchValue(__ev.files[0]);
  } else {
    this.__manualUpdateForm.get(['process','file_scan']).patchValue('');
    this.__manualUpdateForm.get(['process','kyc_scan_copy']).patchValue('');
  }
  }
  }


  getFIleForMemo(__ev) {
    this.__manualUpdateForm
      .get(['rejected','reject_memo'])
      .setValidators(
        this.data.mode == 'K' ? [
          fileValidators.fileExtensionValidator(this.allowedExtensions),
          fileValidators.fileSizeValidator(__ev.files)
        ] : [
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
    if(this.__manualUpdateForm.invalid){
     this.__utility.showSnackbar('Validation Error!!',0);
     return ;
    }
    const __fb = new FormData();
    __fb.append('tin_no',this.data.tin_no);

    __fb.append('manual_trans_status',this.__manualUpdateForm.value.manual_trans_status);
    __fb.append('manual_update_remarks',this.__manualUpdateForm.value.manual_update_remarks);
    if(this.__manualUpdateForm.value.manual_trans_status == 'P'){
    __fb.append('process_date',this.__manualUpdateForm.get(['process','process_date']).value);
    if(this.data?.mode != 'K'){
      __fb.append('folio_no',this.__manualUpdateForm.get(['process','folio_no']).value);
    __fb.append('upload_soa',this.__manualUpdateForm.get(['process','fdr_copy_scan']).value);
    }
    else{
      __fb.append('ckyc_no',this.__manualUpdateForm.get(['process','ckyc_no']).value);
    __fb.append('upload_scan',this.__manualUpdateForm.get(['process','kyc_scan_copy']).value);
    }
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
    this.__dbIntr.api_call(1,(this.data?.mode == 'K'  ? '/kycManualUpdate' : '/manualUpdate'),__fb).subscribe((res: any) =>{

       this.__utility.showSnackbar(res.suc == 1 ? 'Form Submitted Successfully' : res.msg,res.suc);
       if(res.suc == 1){
         this.dialogRef.close({tin_no:res.tin_no,data:res.data});
       }
    })
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
}
