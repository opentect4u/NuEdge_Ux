import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-mftrax-modification',
  templateUrl: './mftrax-modification.component.html',
  styleUrls: ['./mftrax-modification.component.css']
})
export class MftraxModificationComponent implements OnInit {

  __isVisible: boolean = false;

  mfTraxFrm = new FormGroup({
    mf_trax:new FormControl('',[Validators.required]),
    id: new FormControl(0),
  })

  constructor(
    public dialogRef: MatDialogRef<MftraxModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data,
    public __dialog: MatDialog
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }

  ngOnInit(): void {
  }

  minimize = () => {
    this.__isVisible = !this.__isVisible;
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize = () => {
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen = () => {
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }

  saveMFTrax = () =>{
      console.log(this.mfTraxFrm.value);
      this.__dialog.closeAll();
  }

}
