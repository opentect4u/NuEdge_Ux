import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-query-recieve-given-through',
  templateUrl: './query-recieve-given-through.component.html',
  styleUrls: ['./query-recieve-given-through.component.css']
})
export class QueryRecieveGivenThroughComponent implements OnInit {
  __isVisible:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<QueryRecieveGivenThroughComponent>,
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
  /**
   * * * This function is used to toggle the visibility of the dialog.
   * * * @returns void
   * * * @memberof QueryRecieveGivenThroughComponent
   */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof QueryRecieveGivenThroughComponent
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to toggle the full screen mode of the dialog.
   * * * @returns void
   * * * @memberof QueryRecieveGivenThroughComponent  
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to submit the query receive/given through form.
   * * * It sends the form data to the server and closes the dialog with a success message.
   * * * @returns void
   * * * @memberof QueryRecieveGivenThroughComponent
   */
  submitQueryGivenBy(){
    const payload = {
      ...this.queryGivenByForm.value,
      id:this.queryGivenByForm.value.id.toString()
    }
    this.DbIntr.api_call(1,'/cus_service/queryGivenThroughAddEdit',this.utils.convertFormData(payload))
    .subscribe(res => {
      this.utils.showSnackbar(`Query receive/given through ${this.queryGivenByForm.value.id > 0 ? 'updated' : 'added'} successfully`,1);
        this.dialogRef.close({
          response:res
        });
    })
  }
}
