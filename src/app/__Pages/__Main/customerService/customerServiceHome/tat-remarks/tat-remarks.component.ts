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

  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }

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
