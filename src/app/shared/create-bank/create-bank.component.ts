import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.css']
})
export class CreateBankComponent implements OnInit {
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
    public dialogRef: MatDialogRef<CreateBankComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {}

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
}
