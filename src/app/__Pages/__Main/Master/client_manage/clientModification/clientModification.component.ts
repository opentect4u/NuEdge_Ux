import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-clientModification',
  templateUrl: './clientModification.component.html',
  styleUrls: ['./clientModification.component.css']
})
export class ClientModificationComponent implements OnInit {
  __clientForm = new FormGroup({
    client_name: new FormControl('', [Validators.required]),
    dob: new FormControl('', Validators.required),
    pan: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    sec_mobile: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    sec_email: new FormControl('', [Validators.email]),
    add_line_1: new FormControl('', [Validators.required]),
    add_line_2: new FormControl(''),
    city: new FormControl('', Validators.required),
    dist: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    pincode: new FormControl('', Validators.required),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<ClientModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
    console.log(this.data);
    if (this.data.id > 0) {
      this.__clientForm.setValue({
        client_name: this.data.items.client_name,
        dob: this.data.items.dob,
        pan: this.data.items.pan,
        mobile: this.data.items.mobile,
        sec_mobile: this.data.items.sec_mobile,
        email: this.data.items.email,
        sec_email: this.data.items.sec_email,
        add_line_1: this.data.items.add_line_1,
        add_line_2: this.data.items.add_line_2,
        city: this.data.items.city,
        dist: this.data.items.dist,
        state: this.data.items.state,
        pincode: this.data.items.pincode,
        id: this.data.items.id
      });
    }
  }

  ngOnInit() {
  }
  submit() {
    if (this.__clientForm.invalid) {
      return;
    }
    this.__dbIntr.api_call(1, '/clientAddEdit', this.__clientForm.value).pipe(map((x: any) => x.suc)).subscribe(res => {
      console.log(res);
      if (res == 1) {
        this.dialogRef.close(this.__clientForm.value);
      }
    })

  }


}
