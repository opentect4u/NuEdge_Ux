import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.css']
})
export class ManualEntryComponent implements OnInit {
  __isVisible:boolean = false;
  swpForm = new FormGroup({
    swp_type_name: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.swp_type_name) : '',[Validators.required]),
    id:new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<ManualEntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
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
  submitSwpType(){
    const swpType = new FormData();
    swpType.append('swp_type_name',this.swpForm.value.swp_type_name);
    swpType.append('id',this.swpForm.value.id);
    swpType.append('product_id',this.data.product_id);

    this.__dbIntr.api_call(1,'/swpTypeAddEdit',swpType).subscribe((res: any) =>{
      this.dialogRef.close({id:this.data.id,data:res.data});
      this.__utility.showSnackbar(res.suc == 1 ? 'SWP type submitted successfully' : res.msg,res.suc);
    })

  }
}