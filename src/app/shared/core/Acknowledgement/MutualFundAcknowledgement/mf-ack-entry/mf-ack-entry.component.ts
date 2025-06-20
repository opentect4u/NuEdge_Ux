import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';
import fdmanualUpdateTrnstatus from '../../../../../../assets/json/Master/fdmanualUpdateTrnstatus.json';

@Component({
  selector: 'app-mf-ack-entry',
  templateUrl: './mf-ack-entry.component.html',
  styleUrls: ['./mf-ack-entry.component.css']
})
export class MfAckEntryComponent implements OnInit {
  allowedExtensions = ['pdf'];
  __trns_status = fdmanualUpdateTrnstatus;
  __ackUpload = new FormGroup({
    ack_status: new FormControl({value:this.data.data.ack_status ? this.data.data.ack_status : '',disabled:this.data.isViewMode},[Validators.required]),
    login_cutt_off: new FormControl(this.data.data.rnt_login_cutt_off ? this.data.data.rnt_login_cutt_off : ''),
    rnt_login_dt: new FormControl(this.data.data.rnt_login_dt ? this.data.data.rnt_login_dt.split(' ')[0] : ''),
    ack_file: new FormControl(''),
    rnt_login_time: new FormControl(this.data.data.rnt_login_dt ? this.data.data.rnt_login_dt.split(' ')[1] : ''),
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

  ngAfterViewInit(){
        this.__ackUpload.get('ack_status').valueChanges.subscribe(res=> {
              this.__ackUpload.get('rnt_login_dt').setValidators(res == 'P' ? [Validators.required] : null);
              this.__ackUpload.get('rnt_login_time').setValidators(res == 'P' ? [Validators.required] : null);
              this.__ackUpload.get('ack_file').setValidators(res == 'P' ? [Validators.required,fileValidators.fileExtensionValidator(this.allowedExtensions)] : null);
              this.__ackUpload.get('rnt_login_dt').updateValueAndValidity();
              this.__ackUpload.get('rnt_login_time').updateValueAndValidity();
              this.__ackUpload.get('ack_file').updateValueAndValidity();
        })
  }
  /**
   * @description This function is used to get the current date in ISO format
   * It creates a new Date object, adjusts the minutes to account for the timezone offset,
   * and returns the date in ISO format (YYYY-MM-DD).
   * 
   * @returns {string} The current date in ISO format (YYYY-MM-DD).
   */
  getcurrenctDatetime(){
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return  now.toISOString().slice(0,10);
    }
    /**
     * @description This function is used to upload the acknowledgement file
     * It creates a new FormData object, appends the necessary fields,
     * and makes an API call to upload the acknowledgement.
     */
    UploadAcknowledgement(){
      console.log(this.__ackUpload.value);
      const __ackUpload =  new FormData();
      __ackUpload.append('tin_no',this.data.tin_no);
      __ackUpload.append('rnt_login_dt',this.__ackUpload.value.rnt_login_dt);
      __ackUpload.append('ack_copy_scan',this.__ackUpload.value.file);
      __ackUpload.append('rnt_login_time',this.__ackUpload.value.rnt_login_time);
      __ackUpload.append('ack_remarks',this.__ackUpload.value.remarks);
      __ackUpload.append('ack_status',this.__ackUpload.value.ack_status);


      this.__dbIntr.api_call(1,'/ackUpload',__ackUpload).subscribe((res: any) =>{
        this.dialogRef.close({tin_no:this.data.tin_no,data:res.data});
        this.__utility.showSnackbar(res.suc == 1 ? 'Acknowledgement Uploaded Successfully' : "Error in acknowledgement uploading" ,res.suc)
      })
    }
    /**
     * @description This function is used to close the dialog
     * It checks if the form is valid, and if so, it calls the UploadAcknowledgement function.
     * If the form is invalid, it shows a snackbar message indicating that submission failed due to some error.
     */
    minimize(){
      this.dialogRef.updateSize("30%",'55px');
      this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
    }
    /**
     * @description This function is used to maximize the dialog
     * It updates the size of the dialog to 50% of the screen width
     * and toggles the visibility state of the dialog.
     * 
     * @returns void
     */
    maximize(){
      this.dialogRef.updateSize("50%");
      this.__isVisible = !this.__isVisible;
    }
    /** 
     * @description This function is used to toggle the full screen mode of the dialog
     * It updates the size of the dialog to 60% of the screen width
     * and toggles the visibility state of the dialog.
     * 
     * @returns void
     */
    fullScreen(){
      this.dialogRef.updateSize("60%");
      this.__isVisible = !this.__isVisible;
    }
    /**
     * @description This function is used to get the file from the input event
     * It sets the value of the 'file' control in the form group to the selected file,
     * and applies validators for file size and file extension.
     */
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
