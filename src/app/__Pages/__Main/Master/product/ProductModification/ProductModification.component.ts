import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'product-ProductModification',
  templateUrl: './ProductModification.component.html',
  styleUrls: ['./ProductModification.component.css']
})
export class ProductModificationComponent implements OnInit {
  __prdForm = new FormGroup({
    product_name:new FormControl('',[Validators.required]),
    id: new FormControl(0)
})
constructor(
  public dialogRef:MatDialogRef<ProductModificationComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr:DbIntrService,
  public __dialog: MatDialog) {
   if(this.data.id > 0){
    this.__prdForm.setValue({
       product_name: this.data.product_name,
       id:this.data.id
    });
   }
 }

ngOnInit() {
}
submit(){
  if(this.__prdForm.invalid){
    return;
  }
  console.log(this.__prdForm.value);
  this.__dbIntr.api_call(1,'/productAddEdit',this.__prdForm.value).pipe(map((x:any) => x.suc)).subscribe(res =>{
    if(res == 1){
        this.dialogRef.close(this.__prdForm.value);
    }
  })
  
}

}
