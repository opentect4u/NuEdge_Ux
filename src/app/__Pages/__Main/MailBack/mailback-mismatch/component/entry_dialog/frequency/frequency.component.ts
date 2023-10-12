import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {

  frequency = new FormGroup({
    rnt_id:new FormControl('2'),
    freq_name:new FormControl('',[Validators.required]),
    freq_code: new FormControl('',[Validators.required])
  })

  constructor(
    public dialogRef: MatDialogRef<FrequencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    private utility:UtiliService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
  }
  addFrequency = () =>{
   this.__dbIntr.api_call(1,'/rntSystematicFrequencyAddEdit',this.utility.convertFormData(this.frequency.value))
   .pipe(pluck("data"))
   .subscribe((res: any) =>{
         if (res.suc == 1) {
         this.dialogRef.close(res.suc);
       }
       this.utility.showSnackbar(res.suc ? 'Frequency Added Successfully' : res.msg, res.suc);
   })
  }
}
