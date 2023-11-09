import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-trnstypeModification',
  templateUrl: './trnstypeModification.component.html',
  styleUrls: ['./trnstypeModification.component.css']
})
export class TrnstypeModificationComponent implements OnInit {
  // __ProductMaster: any = [];
  __isVisible:boolean = false;

  __trns_type = new FormGroup({
    product_id: new FormControl(''),
    trns_type: new FormControl('', [Validators.required]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<TrnstypeModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __dialog: MatDialog) {

     this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
    if (this.data.id > 0) {
       console.log(this.data);

      this.__trns_type.patchValue({
        product_id: this.data.items.product_id,
        trns_type: this.data.items.trns_type,
        id: this.data.id
      });
    }
    // this.getProductMaster();

  }

  ngOnInit() { }
  submit() {
    if (this.__trns_type.invalid) {
      return;
    }

    const __trnsTYpe = new FormData();
    __trnsTYpe.append('trns_type',this.__trns_type.value.trns_type);
    __trnsTYpe.append('product_id',this.data.product_id);
    __trnsTYpe.append('id',this.data.id);


    this.__dbIntr.api_call(1, '/transctiontypeAddEdit', __trnsTYpe).subscribe((res: any) => {
      if (res.suc == 1) {
        // this.reset();
        this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Transaction Type updated successfully' : 'Transaction Type added successfully') : 'Something went wrong! please try again later', res.suc);
      // this.reset();
    })
  }
  // getProductMaster() {
  //   this.__dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
  //     this.__ProductMaster = res;
  //   })
  // }
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
}
