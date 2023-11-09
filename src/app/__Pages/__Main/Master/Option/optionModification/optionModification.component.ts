import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-optionModification',
  templateUrl: './optionModification.component.html',
  styleUrls: ['./optionModification.component.css']
})
export class OptionModificationComponent implements OnInit {
  __isVisible:boolean= false;
  __optForm = new FormGroup({
    opt_name: new FormControl(this.data.id > 0 ? this.data.items.opt_name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<OptionModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }

  ngOnInit() {
  }
  reset(){
    this.__optForm.reset();
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
  submit(){
    if (this.__optForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __plan = new FormData();
    __plan.append("opt_name", this.__optForm.value.opt_name);
    __plan.append("id", this.__optForm.value.id);
    this.__dbIntr.api_call(1, '/optionAddEdit', __plan).subscribe((res: any) => {
      if (res.suc == 1) {
        this.reset();
        this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Option updated successfully' : 'Option added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();

    })
  }
}
