import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-query-given',
  templateUrl: './query-given.component.html',
  styleUrls: ['./query-given.component.css']
})
export class QueryGivenComponent implements OnInit {
  __isVisible:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<QueryGivenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private DbIntr:DbIntrService,
    private utils:UtiliService
  ) { }

  queryGivenByForm = new FormGroup({
    id:new FormControl(this.data.data ? this.data.data?.id : 0),
    name: new FormControl(this.data.data ? this.data.data?.name : '',[Validators.required])
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
  submitQueryGivenBy(){
    const payload = {
      ...this.queryGivenByForm.value,
      id:this.queryGivenByForm.value.id.toString()
    }
    this.DbIntr.api_call(1,'/cusService/queryGivenByAddEdit',this.utils.convertFormData(payload))
    .subscribe(res => {
      this.utils.showSnackbar(`Query given by ${this.queryGivenByForm.value.id > 0 ? 'updated' : 'added'} successfully`,1);
        this.dialogRef.close({
          response:res
        });
    })
  }


}
