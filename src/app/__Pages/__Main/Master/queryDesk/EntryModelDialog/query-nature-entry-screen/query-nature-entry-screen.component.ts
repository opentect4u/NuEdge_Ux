import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-query-nature-entry-screen',
  templateUrl: './query-nature-entry-screen.component.html',
  styleUrls: ['./query-nature-entry-screen.component.css']
})
export class QueryNatureEntryScreenComponent implements OnInit {
  __isVisible:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<QueryNatureEntryScreenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private DbIntr:DbIntrService,
    private utils:UtiliService
  ) { }

  queryNatureForm = new FormGroup({
    id:new FormControl(this.data.data ? this.data.data?.id : 0),
    query_nature: new FormControl(this.data.data ? this.data.data?.query_nature : '',[Validators.required])
  })

  ngOnInit(): void {
    // console.log(this.data)
  }
  /**
   * * * This function is used to toggle the visibility of the dialog.
   */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof QueryNatureEntryScreenComponent
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to toggle the full screen mode of the dialog.
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to submit the query nature form.
   * * * It sends the form data to the server and closes the dialog with a success message.
   * * * @returns void
   * * * @memberof QueryNatureEntryScreenComponent
   */
  submitQueryNature(){
    console.log(this.queryNatureForm.value)
    const payload = {
      ...this.queryNatureForm.value,
      id:this.queryNatureForm.value.id.toString()
    }
    this.DbIntr.api_call(1,'/cus_service/queryNatureAddEdit',this.utils.convertFormData(payload))
    .subscribe(res => {
      this.utils.showSnackbar(`Query nature ${this.queryNatureForm.value.id > 0 ? 'updated' : 'added'} successfully`,1);
        this.dialogRef.close({
          response:res
        });
    })
  }

}
