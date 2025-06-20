import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-tat-remarks',
  templateUrl: './tat-remarks.component.html',
  styleUrls: ['./tat-remarks.component.css']
})
export class TatRemarksComponent implements OnInit {
  __isVisible:boolean = false;

  constructor(  public dialogRef: MatDialogRef<TatRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbIntr:DbIntrService,
    private utility:UtiliService
  ) { }

    tatRmks = new FormGroup({
        tat_remarks:new FormControl(this.data?.trxn.tat_remarks,[Validators.required]),
        id:new FormControl(this.data.trxn.id)
    })

  ngOnInit(): void {
  }

  /**
   * @description This function is used to close the dialog
   * It updates the size of the dialog to 30% width and 47px height,
   * and positions it at the bottom right corner of the screen.
   */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * @description This function is used to maximize the dialog
   * It updates the size of the dialog to 40% width and toggles the visibility state of the dialog.
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * @description This function is used to toggle the full screen mode of the dialog
   * It updates the size of the dialog to 60% width and toggles the visibility state of the dialog.
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }

  /**
   * @description This function is used to submit the TAT remarks
   * It logs the value of the tatRmks form control and makes an API call to save the remarks.
   * If the API call is successful, it shows a success message and closes the dialog with the response data.
   * If there is an error, it shows an error message.
   */
  submitTATS = () =>{
      console.log(this.tatRmks.value);
      this.dbIntr.api_call(1,'/cus_service/addTatRemarks',this.utility.convertFormData(this.tatRmks.value))
      .subscribe((res:any) =>{
        console.log(res);
        this.utility.showSnackbar(res.suc == 1 ? 'TAT Remarks saved successfully' : 'ERR!! Simething went wrong',res.suc)
        if(res.suc == 1){
          this.dialogRef.close(res.data);
        }
      })
  }

}
