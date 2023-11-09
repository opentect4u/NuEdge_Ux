import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-product-crud',
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.css']
})
export class ProductCrudComponent implements OnInit {
  __cmpMst : insComp[] = [];
  __prdTypeMst: insPrdType[] = [];
  __isVisible:boolean = false;
  __prdForm = new FormGroup({
    product_name: new FormControl(this.data.id > 0 ? this.data.product.product_name : '',[Validators.required]),
    id: new FormControl(this.data.id),
    product_type_id: new FormControl(this.data.id > 0 ? this.data.product.product_type_id : ''
    ,[Validators.required]),
    company_id:new FormControl(this.data.id > 0 ? this.data.product.company_id : '',[Validators.required]),
    ins_type_id: new FormControl(this.data.id > 0 ? this.data.product.ins_type_id : '',[Validators.required]),
  })
  __insTypeMst: any= [];
  constructor(
    public dialogRef: MatDialogRef<ProductCrudComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInsuranceType();
    if(this.data.id > 0){
      this.getCompanyType(this.data.product.ins_type_id);
      this.getProductType(this.data.product.ins_type_id);
   }
  }


  ngAfterViewInit(){

    this.__prdForm.controls['ins_type_id'].valueChanges.subscribe(res =>{
      console.log(res);

      this.__prdForm.controls['company_id'].setValue('',{emitEvent:false});
      this.__prdForm.controls['product_type_id'].setValue('',{emitEvent:false});
      this.getCompanyType(res);
      this.getProductType(res);

    })
  }
  getCompanyType(__res){
    this.__dbIntr.api_call(0,'/ins/company','ins_type_id='+__res).pipe(pluck("data")).subscribe((res: insComp[]) =>{
      this.__cmpMst = res;
    })
  }
  getProductType(__res){
    this.__dbIntr.api_call(0,'/ins/productType','ins_type_id='+__res).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
      this.__prdTypeMst = res;
    })
  }
  getInsuranceType(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
       this.__insTypeMst=res;
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
  submitProduct(){
      if(this.__prdForm.invalid){
        this.__utility.showSnackbar('Error! Please fill up form correctly',0);
        return;
      }
       const __prd = new FormData();
       __prd.append('product_name',this.__prdForm.value.product_name);
       __prd.append('company_id',this.__prdForm.value.company_id);
       __prd.append('ins_type_id',this.__prdForm.value.ins_type_id);
       __prd.append('product_type_id',this.__prdForm.value.product_type_id);

       __prd.append('id',this.__prdForm.value.id);

       this.__dbIntr.api_call(1,'/ins/productAddEdit',__prd).subscribe((res: any) =>{
        this.__utility.showSnackbar(res.suc == 1 ? (this.data.id  > 0 ? 'Product Updated Successfully' : 'Product Added Successfully') : 'Error!! Something went wrong, please try again later',res.suc)
                if(res.suc == 1){
                     this.dialogRef.close({id:this.data.id,data:res.data});
                }
       })

  }
}
