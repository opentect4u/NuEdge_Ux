import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mf-ack-entry',
  templateUrl: './mf-ack-entry.component.html',
  styleUrls: ['./mf-ack-entry.component.css']
})
export class MfAckEntryComponent implements OnInit {
  allowedExtensions = ['pdf'];

  __ackUpload = new FormGroup({
    login_cutt_off: new FormControl(this.data.data.rnt_login_cutt_off ? this.data.data.rnt_login_cutt_off : ''),
    rnt_login_dt: new FormControl(this.data.data.rnt_login_dt ? this.data.data.rnt_login_dt.split(' ')[0] : '',[Validators.required]),
    ack_file: new FormControl('',[Validators.required,fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    rnt_login_time: new FormControl(this.data.data.rnt_login_dt ? this.data.data.rnt_login_dt.split(' ')[1] : '',[Validators.required]),
    remarks: new FormControl(this.data.data.ack_remarks ? this.data.data.ack_remarks : ''),
    file: new FormControl(this.data.data.ack_copy_scan ? `${environment.ack_formUrl + this.data.data.ack_copy_scan}` : '')
  })
  __isVisible: boolean =false;
  constructor(
    private overlay: Overlay,
  private __utility: UtiliService,
  private __dbIntr: DbIntrService,
  private __dialog: MatDialog,
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<MfAckEntryComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(){}

  getcurrenctDatetime(){
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return  now.toISOString().slice(0,10);
    }
    UploadAcknowledgement(){
      console.log(this.__ackUpload.value);
      const __ackUpload =  new FormData();
      __ackUpload.append('tin_no',this.data.tin_no);
      __ackUpload.append('rnt_login_dt',this.__ackUpload.value.rnt_login_dt);
      __ackUpload.append('ack_copy_scan',this.__ackUpload.value.file);
      __ackUpload.append('rnt_login_time',this.__ackUpload.value.rnt_login_time);
      __ackUpload.append('ack_remarks',this.__ackUpload.value.remarks);

      this.__dbIntr.api_call(1,'/ackUpload',__ackUpload).subscribe((res: any) =>{
        this.dialogRef.close({tin_no:this.data.tin_no,data:res.data});
        this.__utility.showSnackbar(res.suc == 1 ? 'Acknowledgement Uploaded Successfully' : "Error in acknowledgement uploading" ,res.suc)
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
    getFile(__ev){
      this.__ackUpload.controls['file'].setValue(__ev.target.files[0]);

      this.__ackUpload.controls['ack_file'].setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
      this.__ackUpload.controls['ack_file'].updateValueAndValidity();
      if (this.__ackUpload.controls['ack_file'].status == 'VALID' && __ev.target.files.length > 0) {
        // this.__docs.controls[index].get('file_preview')?.patchValue(this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL( __ev.target.files[0])));
        this.__ackUpload.controls['file'].setValue(__ev.target.files[0]);
      }
      else {
        this.__ackUpload.controls['file'].setValue('');
      }
    }
}