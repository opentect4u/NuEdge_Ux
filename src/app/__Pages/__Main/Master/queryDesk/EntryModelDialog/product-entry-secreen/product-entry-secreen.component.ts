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
