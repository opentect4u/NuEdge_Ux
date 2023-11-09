import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-prd-type-crud',
  templateUrl: './prd-type-crud.component.html',
  styleUrls: ['./prd-type-crud.component.css']
})
export class PrdTypeCrudComponent implements OnInit {
  instTypeMst: any=[];
  __isVisible:boolean = false;
  __prdType = new FormGroup({
    id: new FormControl(this.data.id),
    ins_type_id: new FormControl(this.data.id > 0 ? this.data.Product_type.ins_type_id : '',[Validators.required]),
    product_type: new FormControl(this.data.id > 0 ? this.data.Product_type.product_type : '',[Validators.required])
  })
  constructor(
    public dialogRef: MatDialogRef<PrdTypeCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInsType();
  }
  getInsType(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
       this.instTypeMst = res;
    })
  }
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("50%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  submit(){
    const fb = new FormData();
    fb.append('ins_type_id',global.getActualVal(this.__prdType.value.ins_type_id));
    fb.append('product_type',global.getActualVal(this.__prdType.value.product_type));
    fb.append('id',global.getActualVal(this.__prdType.value.id));

    this.__dbIntr.api_call(1, '/ins/productTypeAddEdit', fb).subscribe((res: any) => {
      this.__utility.showSnackbar(res.suc ==1 ? 'Product Type Submitted Successfully' :  res.msg, res.suc);
      this.reset();
      this.dialogRef.close({ id: this.data.id, data: res.data })
    })
  }
  reset(){
    this.__prdType.reset({emitEvent: false});
  }
}
