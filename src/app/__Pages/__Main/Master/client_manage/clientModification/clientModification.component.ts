import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'master-clientModification',
  templateUrl: './clientModification.component.html',
  styleUrls: ['./clientModification.component.css']
})
export class ClientModificationComponent implements OnInit {
  __maxDt = dates.disabeldDates();
  __stateMaster: any=[];
  __clientForm = new FormGroup({
    client_name: new FormControl('', [Validators.required]),
    dob: new FormControl('', Validators.required),
    pan: new FormControl('', [Validators.required,Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),Validators.minLength(10),Validators.maxLength(10)]),
    mobile: new FormControl('', 
    [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]
    ),
    sec_mobile: new FormControl('',[Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
    email: new FormControl('', [Validators.required, Validators.email]),
    sec_email: new FormControl('',[Validators.email]),
    add_line_1: new FormControl('', [Validators.required]),
    add_line_2: new FormControl(''),
    city: new FormControl('', Validators.required),
    dist: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    pincode: new FormControl('', [Validators.required,Validators.minLength(6),Validators.maxLength(6)]),
    id: new FormControl(0)
  })
  constructor(
    public dialogRef: MatDialogRef<ClientModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    public __dialog: MatDialog) {
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
    this.getStateMaster();
  }
  submit() {
    if (this.__clientForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
        const __client = new FormData();
        __client.append("client_name",this.__clientForm.value.client_name);
        __client.append("dob",this.__clientForm.value.dob);
        __client.append("pan",this.__clientForm.value.pan);
        __client.append("mobile",this.__clientForm.value.mobile);
        __client.append("sec_mobile",this.__clientForm.value.sec_mobile);
        __client.append("email",this.__clientForm.value.email);
        __client.append("sec_email",this.__clientForm.value.sec_email);
        __client.append("add_line_1",this.__clientForm.value.add_line_1);
        __client.append("add_line_2",this.__clientForm.value.add_line_2);
        __client.append("city",this.__clientForm.value.city);
        __client.append("dist",this.__clientForm.value.dist);
        __client.append("state",this.__clientForm.value.state);
        __client.append("pincode",this.__clientForm.value.pincode);
        __client.append("id",this.__clientForm.value.id);
    this.__dbIntr.api_call(1, '/clientAddEdit', this.__clientForm.value).subscribe((res: any) => {
      if (res.suc == 1) {
        this.dialogRef.close(res.data);
        this.__utility.showSnackbar(res.suc == 1 ? this.data.id > 0 ? 'Client with code '+ res.data.client_code +' has been updated successfully' : 'Client with code '+ res.data.client_code +' has been added successfully' : 'Something went wrong! Please try again later',res.suc);
      }
    })
  }
  preventNonumeric(__ev){
    dates.numberOnly(__ev);
  }
  getStateMaster(){
    this.__dbIntr.api_call(0,'/states',null).pipe(map((x: responseDT) => x.data)).subscribe(res =>{
      this.__stateMaster = res;
    })
  }

}
