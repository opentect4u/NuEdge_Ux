import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-query-type-sub-type',
  templateUrl: './query-type-sub-type.component.html',
  styleUrls: ['./query-type-sub-type.component.css']
})
export class QueryTypeSubTypeComponent implements OnInit {

  md_product:Required<{id:number,product_name:string}>[] = [];
  queryTypeSubTypeForm = new FormGroup({
    id:new FormControl(this.data.data ? this.data.data?.id : 0),
    product_id: new FormControl(this.data.data ? this.data.data?.product_id : '',[Validators.required]),
    query_type: new FormControl(this.data.data ? this.data.data?.query_type : '',[Validators.required]),
    query_subtype: new FormControl(this.data.data ? this.data.data?.query_subtype : '',[Validators.required]),
    query_tat: new FormControl(this.data.data ? this.data.data?.query_tat : '',[Validators.required,Validators.pattern('^[0-9]*$')])
  })
  __isVisible:boolean = false;

  constructor(private DbIntr:DbIntrService,
    public dialogRef: MatDialogRef<QueryTypeSubTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils:UtiliService

  ) { }

  ngOnInit(): void {
    this.fetchProduct();
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

  fetchProduct(){
      this.DbIntr.api_call(0,'/product',null).pipe(pluck('data')).subscribe((res:Required<{id:number,product_name:string}>[]) =>{
        this.md_product = res;
      })
  }
  submitQueryTypeSubType(){
    const payload = {
      ...this.queryTypeSubTypeForm.value,
      id:this.queryTypeSubTypeForm.value.id.toString()
    }
    this.DbIntr.api_call(1,'/cusService/queryTypeSubtypeAddEdit',this.utils.convertFormData(payload))
    .subscribe(res =>{
      console.log(res);
      this.utils.showSnackbar(`Query type & subtype ${this.queryTypeSubTypeForm.value.id > 0 ? 'updated' : 'added'} successfully`,1)
      this.dialogRef.close({
        response:res
      })
    })
  }
}