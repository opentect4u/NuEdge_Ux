import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-query-status',
  templateUrl: './query-status.component.html',
  styleUrls: ['./query-status.component.css']
})
export class QueryStatusComponent implements OnInit {
  __isVisible:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<QueryStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private DbIntr:DbIntrService,
    private utils:UtiliService
  ) { }

  queryStatusForm = new FormGroup({
    id:new FormControl(this.data.data ? this.data.data?.id : 0),
    status_name: new FormControl(this.data.data ? this.data.data?.status_name : '',[Validators.required]),
    color_code: new FormControl(this.data.data ? this.data.data?.color_code : '#000000',[Validators.required]),
  })

  ngOnInit(): void {
    // console.log(this.data)
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
  submitQueryStatus(){
    console.log(this.queryStatusForm.value)
    const payload = {
      ...this.queryStatusForm.value,
      id:this.queryStatusForm.value.id.toString()
    }
    console.log(payload)
    this.DbIntr.api_call(1,'/cusService/queryStatusAddEdit',this.utils.convertFormData(payload))
    .subscribe(res => {
      this.utils.showSnackbar(`Query status ${this.queryStatusForm.value.id > 0 ? 'updated' : 'added'} successfully`,1);
        this.dialogRef.close({
          response:res
        });
    })
  }

}
