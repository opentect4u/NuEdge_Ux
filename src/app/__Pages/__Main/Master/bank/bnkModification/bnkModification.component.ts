import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { skip } from 'rxjs/operators';
@Component({
  selector: 'app-bnkModification',
  templateUrl: './bnkModification.component.html',
  styleUrls: ['./bnkModification.component.css']
})
export class BnkModificationComponent implements OnInit {
  __isVisible:boolean = false;
  __bankForm = new FormGroup({
    ifs_code: new FormControl(this.data.id > 0 ? this.data.items.ifs_code :'', [Validators.required]),
    bank_name: new FormControl(this.data.id > 0 ? this.data.items.bank_name :'', [Validators.required]),
    id: new FormControl(this.data.id),
    branch_name: new FormControl(this.data.id > 0 ? this.data.items.branch_name :'',[Validators.required]), 
    micr_code:new FormControl(this.data.id > 0 ? this.data.items.micr_code :'',[Validators.required]), 
    branch_addr:new FormControl(this.data.id > 0 ? this.data.items.branch_addr :'', [Validators.required])
  })
  constructor(
    public dialogRef: MatDialogRef<BnkModificationComponent>,
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
  submit() {
    if (this.__bankForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __bank = new FormData();
    __bank.append("ifs_code",this.__bankForm.value.ifs_code);
    __bank.append("bank_name",this.__bankForm.value.bank_name);
    __bank.append("id",this.__bankForm.value.id);
    __bank.append("branch_name",this.__bankForm.value.branch_name);
    __bank.append("micr_code",this.__bankForm.value.micr_code);  
    __bank.append("branch_addr",this.__bankForm.value.branch_addr);


    this.__dbIntr.api_call(1, '/depositbankAddEdit', __bank).subscribe((res: any) => {
      if (res.suc == 1) {
        this.reset();
        this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Bank updated successfully' : 'Bank added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
    })

  }
  reset(){
    this.__bankForm.reset();
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
}
