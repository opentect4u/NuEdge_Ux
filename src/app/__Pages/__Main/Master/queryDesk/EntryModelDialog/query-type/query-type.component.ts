import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-query-type',
  templateUrl: './query-type.component.html',
  styleUrls: ['./query-type.component.css']
})
export class QueryTypeComponent implements OnInit {

  queryTypeForm = new FormGroup({
    id:new FormControl(this.data.data ? this.data.data?.id : 0),
    product_id:new FormControl(this.data.data ? this.data.data?.product_id : '',[Validators.required]),
    query_type:new FormControl(this.data.data ? this.data.data?.query_type : '',[Validators.required])
  })
  __isVisible:boolean = false;
  md_product:Required<{id:number,product_name:string}>[] = [];


  constructor(
    public dialogRef: MatDialogRef<QueryTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private DbIntr:DbIntrService,
    private utils:UtiliService
  ) { }

  ngOnInit(): void {
    this.fetchProduct();
  }
  /**
   * * * This function is used to toggle the visibility of the dialog.
   * * * @returns void
   * * * @memberof QueryTypeComponent
   * * * @description
   * * * This function is responsible for toggling the visibility of the dialog.
   * * * It updates the size and position of the dialog based on the current visibility state.
   */
  fetchProduct(){
    this.DbIntr.api_call(0,'/product',null).pipe(pluck('data')).subscribe((res:Required<{id:number,product_name:string}>[]) =>{
      this.md_product = res;
    })
}
/**
 * * * This function is used to minimize the dialog.
 * * * @returns void
 * * * @memberof QueryTypeComponent
 * * * @description
 * * * This function is responsible for minimizing the dialog by updating its size and position.
 * * * It sets the dialog to a smaller size and positions it at the bottom right corner of the screen.
 * * * @example
 * * * // Usage: Call this function when the user clicks the minimize button on the dialog. 
 */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof QueryTypeComponent
   * * * @description
   * * * This function is responsible for maximizing the dialog by updating its size and toggling the visibility state.
   * * * It sets the dialog to a larger size and updates the visibility state.
   * * * @example
   * * * // Usage: Call this function when the user clicks the maximize button on the dialog.
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * * This function is used to toggle the full screen mode of the dialog.
   * * * * @returns void
   * * * * @memberof QueryTypeComponent
   * * * * @description
   * * * This function is responsible for toggling the full screen mode of the dialog.
   * * It updates the size of the dialog to 60% and toggles the visibility state.
   * * @example
   * // Usage: Call this function when the user clicks the full screen button on the dialog.
   * * @returns {void}
   * * @memberof QueryTypeComponent
   * * @description
   * This function is responsible for toggling the full screen mode of the dialog.
   * It updates the size of the dialog to 60% and toggles the visibility state.
   * @example
   * // Usage: Call this function when the user clicks the full screen button on the dialog.
   * @returns {void}
   * @memberof QueryTypeComponent
   * @description
   * This function is responsible for toggling the full screen mode of the dialog.
   * It updates the size of the dialog to 60% and toggles the visibility state.
   * @example
   * // Usage: Call this function when the user clicks the full screen button on the dialog.
   * @returns {void}  
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to submit the query type form data.
   * * * @returns void
   * * * @memberof QueryTypeComponent
   * * * @description
   * * This function is responsible for submitting the query type form data.
   * It makes an API call to add or edit the query type based on the form values.
   * If the submission is successful, it shows a success message and closes the dialog.
   * @example
   * // Usage: Call this function when the user clicks the submit button on the dialog. 
   */
  submitQueryType(){
      // console.log(this.queryTypeForm.value);
      this.DbIntr.api_call(1,'/cus_service/queryTypeAddEdit',this.utils.convertFormData(this.queryTypeForm.value))
      .subscribe(res =>{
        console.log(res);
        this.utils.showSnackbar(`Query type ${this.queryTypeForm.value.id > 0 ? 'updated' : 'added'} successfully`,1)
        this.dialogRef.close({
          response:res
        })
      })
  }
}
