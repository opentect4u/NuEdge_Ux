import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import fdmanualUpdateTrnstatus from '../../../../../../../../assets/json/Master/fdmanualUpdateTrnstatus.json';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  __isVisible:boolean = false;
  allowedExtensions = ['pdf'];
  __fdCertDelForm = new FormGroup({
    certificate_delivery_opt: new FormControl(
      {value:this.data.data.certificate_delivery_opt,disabled:true}
      ),
    hand_delivery: new FormGroup({
      certificate_collected_from: new FormGroup({
        collected_from_company: new FormControl({value:global.getActualVal(this.data.data.cert_collect_from_comp),
          disabled: this.data.data.cert_delivery_flag != 'P'}),
        remarks: new FormControl({value:global.getActualVal(this.data.data.cert_pending_remarks),
          disabled: this.data.data.cert_delivery_flag != 'P'}),
        date: new FormControl({value:global.getActualVal(this.data.data.cert_collect_by_dt),
          disabled: this.data.data.cert_delivery_flag != 'P'}),
        collected_by: new FormControl({value:global.getActualVal(this.data.data.cert_collect_by),
          disabled: this.data.data.cert_delivery_flag != 'P'}),
      }),
       certificate_delivery_by:new FormGroup({
            delivery_by: new FormControl({value:global.getActualVal(this.data.data.cert_delivery_by),
              disabled: (this.data.data.cert_delivery_flag == 'C' || this.data.data.cert_delivery_flag == 'B')}),
            date: new FormControl({value:global.getActualVal(this.data.data.cert_delivery_dt),
              disabled: (this.data.data.cert_delivery_flag == 'C' || this.data.data.cert_delivery_flag == 'B')}),
            name: new FormControl({value:global.getActualVal(this.data.data.cert_delivery_name),
              disabled: (this.data.data.cert_delivery_flag == 'C' || this.data.data.cert_delivery_flag == 'B')}),
            contact_no: new FormControl({value:global.getActualVal(this.data.data.cert_delivery_contact_no),
              disabled: (this.data.data.cert_delivery_flag == 'C' || this.data.data.cert_delivery_flag == 'B')}),
            comp_name: new FormControl({value:global.getActualVal(this.data.data.cert_delivery_cu_comp_name),
              disabled: (this.data.data.cert_delivery_flag == 'C' || this.data.data.cert_delivery_flag == 'B')}),
            pod_no: new FormControl({value:global.getActualVal(this.data.data.cert_delivery_cu_pod),
              disabled: (this.data.data.cert_delivery_flag == 'C' || this.data.data.cert_delivery_flag == 'B')}),
            pod_scan: new FormControl(''),
            filePreview: new FormControl(
              this.data.data.cert_delivery_cu_pod_scan
              ? `${environment.cert_delivery_cu_pod + this.data.data.cert_delivery_cu_pod_scan}`
              : ''),
            file: new FormControl('', [
              fileValidators.fileExtensionValidator(this.allowedExtensions),
            ]),
       }),
       certificate_received_by: new FormGroup({
        date: new FormControl({value:global.getActualVal(this.data.data.cert_rec_by_dt),
          disabled: this.data.data.cert_delivery_flag != 'B'}),
        recv_by: new FormControl({value:global.getActualVal(this.data.data.cert_rec_by_name),
          disabled: this.data.data.cert_delivery_flag != 'B'}),
        ack_scan: new FormControl(''),
        ackfilePreview: new FormControl(
          this.data.data.cert_rec_by_scan
              ? `${environment.cert_delivery_recv_ack + this.data.data.cert_rec_by_scan}`
              : ''
        ),
        ack_file: new FormControl('', [
          fileValidators.fileExtensionValidator(this.allowedExtensions),
        ]),
       })
    }),
  })

  constructor(
    public dialogRef: MatDialogRef<EntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {


    console.log(this.__fdCertDelForm.getRawValue().hand_delivery.certificate_received_by.ackfilePreview);


  }

  ngOnInit(): void {

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
  submitCertificate(){
     const __fd = new FormData();
     __fd.append('cert_delivery_flag',
     this.data.data.cert_delivery_flag);
     __fd.append('tin_no',this.data.tin_no);
     __fd.append('certificate_delivery_opt',this.__fdCertDelForm.getRawValue().certificate_delivery_opt);
     if(this.data.data.certificate_delivery_opt == 'H'){
     if(this.data.data.cert_delivery_flag == 'P'){
      __fd.append('cert_collect_from_comp',
      this.__fdCertDelForm.get(['hand_delivery','certificate_collected_from','collected_from_company']).value
      );
      if(this.__fdCertDelForm.get(['hand_delivery','certificate_collected_from','collected_from_company']).value == 'Y'){
      __fd.append('cert_collect_by_dt',this.__fdCertDelForm.get(['hand_delivery','certificate_collected_from','date']).value);
      __fd.append('cert_collect_by',this.__fdCertDelForm.get(['hand_delivery','certificate_collected_from','collected_by']).value);
      }
      else{
      __fd.append('cert_pending_remarks',this.__fdCertDelForm.get(['hand_delivery','certificate_collected_from','remarks']).value);
      }
     }
     else if(this.data.data.cert_delivery_flag == 'A'){
      __fd.append('cert_delivery_by',
      this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','delivery_by']).value);
      __fd.append('cert_delivery_dt',
      this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','date']).value);
       if(this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','delivery_by']).value == 'I'){
        __fd.append('cert_delivery_name',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','name']).value);
        __fd.append('cert_delivery_contact_no',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','contact_no']).value);
       }
       else{
        __fd.append('cert_delivery_cu_comp_name',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','comp_name']).value);
        __fd.append('cert_delivery_cu_pod',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','pod_no']).value);
        __fd.append('cert_delivery_cu_pod_scan',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','pod_scan']).value);
       }

     }
     else{
      __fd.append('cert_rec_by_dt',this.__fdCertDelForm.get(['hand_delivery','certificate_received_by','date']).value);
      __fd.append('cert_rec_by_name',this.__fdCertDelForm.get(['hand_delivery','certificate_received_by','recv_by']).value);
      __fd.append('cert_rec_by_scan',this.__fdCertDelForm.get(['hand_delivery','certificate_received_by','ack_scan']).value);

     }
    }
    else{
       if(this.data.data.cert_delivery_flag == 'P'){
        __fd.append('cert_delivery_by',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','delivery_by']).value);
        __fd.append('cert_delivery_dt',
        this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','date']).value);
          __fd.append('cert_delivery_cu_comp_name',
          this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','comp_name']).value);
          __fd.append('cert_delivery_cu_pod',
          this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','pod_no']).value);
          __fd.append('cert_delivery_cu_pod_scan',
          this.__fdCertDelForm.get(['hand_delivery','certificate_delivery_by','pod_scan']).value);
       }
       else{
        __fd.append('cert_rec_by_dt',this.__fdCertDelForm.get(['hand_delivery','certificate_received_by','date']).value);
        __fd.append('cert_rec_by_name',this.__fdCertDelForm.get(['hand_delivery','certificate_received_by','recv_by']).value);
       }
    }
     this.__dbIntr.api_call(1,'/fd/deliveryUpdate',__fd).subscribe((res: any) =>{
              this.__utility.showSnackbar(res.suc == 1 ? 'Form Submitted Successfully' : res.msg,res.suc);
              if(res.suc == 1){
                this.dialogRef.close({tin_no:res.tin_no,data:res.data});
              }

     })
  }
  getFIle(__ev){
    this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','file'])
      .setValidators([
        Validators.required,
        fileValidators.fileExtensionValidator(this.allowedExtensions),
        fileValidators.fileSizeValidator(__ev.files),
      ]);
      this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','file'])
      .updateValueAndValidity();
    if (
      this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','file']).status == 'VALID' &&
      __ev.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onload = (e) =>  this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','filePreview']).patchValue(reader.result);
      reader.readAsDataURL(__ev.files[0]);
      this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','pod_scan']).patchValue(__ev.files[0]);
    } else {
      this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','filePreview']).patchValue('');
      this.__fdCertDelForm
      .get(['hand_delivery','certificate_delivery_by','pod_scan']).patchValue('');
    }
  }
  getAckFile(__ev){
    this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ack_file'])
    .setValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
      fileValidators.fileSizeValidator(__ev.files),
    ]);
    this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ack_file'])
    .updateValueAndValidity();
  if (
    this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ack_file']).status == 'VALID' &&
    __ev.files.length > 0
  ) {
    const reader = new FileReader();
    reader.onload = (e) =>  this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ackfilePreview']).patchValue(reader.result);
    reader.readAsDataURL(__ev.files[0]);
    this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ack_scan']).patchValue(__ev.files[0]);
  } else {
    this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ackfilePreview']).patchValue('');
    this.__fdCertDelForm
    .get(['hand_delivery','certificate_received_by','ack_scan']).patchValue('');
  }
  }
}
