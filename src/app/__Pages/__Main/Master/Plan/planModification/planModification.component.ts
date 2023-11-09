import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-planModification',
  templateUrl: './planModification.component.html',
  styleUrls: ['./planModification.component.css']
})
export class PlanModificationComponent implements OnInit {
  __isVisible:boolean = false;
  __plnForm = new FormGroup({
    plan_name: new FormControl(this.data.id > 0 ? this.data.items.plan_name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<PlanModificationComponent>,
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
    this.__plnForm.reset();
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
    if (this.__plnForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __plan = new FormData();
    __plan.append("plan_name", this.__plnForm.value.plan_name);
    __plan.append("id", this.__plnForm.value.id);
    this.__dbIntr.api_call(1, '/planAddEdit', __plan).subscribe((res: any) => {
      if (res.suc == 1) {
        this.reset();
        this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'PLAN updated successfully' : 'PLAN added successfully') : 'Something went wrong! please try again later', res.suc);
      // this.reset();

    })
  }
}
