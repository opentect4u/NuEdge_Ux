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
  fetchProduct(){
    this.DbIntr.api_call(0,'/product',null).pipe(pluck('data')).subscribe((res:Required<{id:number,product_name:string}>[]) =>{
      this.md_product = res;
    })
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
  submitQueryType(){
      // console.log(this.queryTypeForm.value);
      this.DbIntr.api_call(1,'/cusService/queryTypeAddEdit',this.utils.convertFormData(this.queryTypeForm.value))
      .subscribe(res =>{
        console.log(res);
        this.utils.showSnackbar(`Query type ${this.queryTypeForm.value.id > 0 ? 'updated' : 'added'} successfully`,1)
        this.dialogRef.close({
          response:res
        })
      })
  }
}
