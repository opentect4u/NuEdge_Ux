import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-product-entry-secreen',
  templateUrl: './product-entry-secreen.component.html',
  styleUrls: ['./product-entry-secreen.component.css']
})
export class ProductEntrySecreenComponent implements OnInit {
  __isVisible:boolean = false;
  constructor(
    private __dbIntr:DbIntrService,
    public dialogRef: MatDialogRef<ProductEntrySecreenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils:UtiliService
  ) { }

  productForm = new FormGroup({
    id:new FormControl(this.data.data ? this.data.data?.id : ''),
    product_name: new FormControl(this.data.data ? this.data.data?.product_name : '',[Validators.required])
  })

  ngOnInit(): void {
    console.log(this.data);
  }
  /**
   *  * * This function is used to toggle the visibility of the dialog.
   *  * * @returns void
   *  * * @memberof ProductEntrySecreenComponent
   */
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   */
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to toggle the full screen mode of the dialog.
   * * * @returns void
   * * * @memberof ProductEntrySecreenComponent
   */
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to submit the product form.
   * * * It sends the form data to the server and closes the dialog with a success message.
   * * * @returns void
   * * * @memberof ProductEntrySecreenComponent
   */
  submitProduct(){
    const payload = {
      ...this.productForm.value,
      id:this.productForm.value.id.toString()
    }
    this.__dbIntr.api_call(1,'/productAddEdit',this.utils.convertFormData(payload))
    .subscribe(res =>{
      console.log(res);
      this.utils.showSnackbar(`Product ${this.productForm.value.id > 0 ? 'updated' : 'added'} successfully`,1)
      this.dialogRef.close({
        response:res
      })
    })
  }
}
