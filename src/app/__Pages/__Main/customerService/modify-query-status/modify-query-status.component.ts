import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IQueryStatus } from '../../Master/queryDesk/query-desk-report/query-desk-report.component';
import { pluck } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-query-status',
  templateUrl: './modify-query-status.component.html',
  styleUrls: ['./modify-query-status.component.css']
})
export class ModifyQueryStatusComponent implements OnInit {
  __isVisible:boolean = false;
  md_queryStatus:Partial<IQueryStatus>[] = [];
 
  StatusForm = new FormGroup({
    query_id:new FormControl(this.data.data?.query_id),
    id:new FormControl(this.data.data?.id),
    query_status_id:new FormControl(this.data.data?.query_status_id ? this.data.data?.query_status_id : '',[Validators.required]),
    query_feedback:new FormControl(this.data.data?.query_feedback ? this.data.data?.query_feedback : '',[Validators.required]),
    overall_feedback:new FormControl(this.data.data?.overall_feedback ? this.data.data?.overall_feedback : '',[Validators.required]),
    expected_close_date:new FormControl(this.data.data?.expected_close_date ? this.data.data?.expected_close_date : '',[Validators.required]),
  })

  constructor(
    private __dbIntr:DbIntrService,
    public dialogRef: MatDialogRef<ModifyQueryStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils:UtiliService
  ) { }

  ngOnInit(): void {
    console.log(this.data.data);
    this.fetchQueryStatus();
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
   * @description This function fetches the query status from the server
   * and updates the `md_queryStatus` array with the response data.
   * It uses the `pluck` operator to extract the `data` property from the response.
   * The fetched data is of type `Partial<IQueryStatus>[]`, which is an array of objects
   * that may contain partial properties of the `IQueryStatus` interface.
   */
  fetchQueryStatus = () =>{
    this.__dbIntr.api_call(0,'/cus_service/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
      this.md_queryStatus = res;
  })
  }
  /**
   * @description This function is used to submit the query status form.
   * It converts the form data to a format suitable for the API call
   * and makes a POST request to the server to update the query status.
   * If the response indicates success, it closes the dialog with the response data
   * and shows a success message using the utility service.
   */
  submitQuery = () =>{
      this.__dbIntr.api_call(1,'/cus_service/queryAdd',this.utils.convertFormData(this.StatusForm.value))
      .subscribe((res:any) =>{
        if(res.suc == 1){
          const product_name = this.data.data.product_id == 3 ? 'INSURANCE' : (this.data.data.product_id == 4 ? 'FD' : 'MUTUAL FUND')
            this.dialogRef.close({response:res?.data})
            this.utils.showSnackbar(`Query Status with id ${this.data.data?.query_id} has been updated successfully for ${product_name}`,1)
          }
      })
  }
}
