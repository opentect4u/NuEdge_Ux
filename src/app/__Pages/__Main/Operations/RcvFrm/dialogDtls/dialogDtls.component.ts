import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-dialogDtls',
  templateUrl: './dialogDtls.component.html',
  styleUrls: ['./dialogDtls.component.css']
})
export class DialogDtlsComponent implements OnInit {
   __frmDtls =new FormGroup({
       client_code: new FormControl(this.data.flag == 'C' ? this.data.dt.client_code: ''),
       client_name: new FormControl(this.data.flag == 'C' ? this.data.dt.client_name: ''),
       dob: new FormControl(this.data.flag == 'C' ? this.data.dt.dob: ''),
       pan: new FormControl(this.data.flag == 'C' ? this.data.dt.pan: ''),
       mobile: new FormControl(this.data.flag == 'C' ? this.data.dt.mobile: ''),
       sec_mobile: new FormControl(this.data.flag == 'C' ? this.data.dt.sec_mobile: ''),
       email: new FormControl(this.data.flag == 'C' ? this.data.dt.email: ''),
       sec_email: new FormControl(this.data.flag == 'C' ? this.data.dt.sec_email: ''),
       add_line_1: new FormControl(this.data.flag == 'C' ? this.data.dt.add_line_1: ''),
       add_line_2: new FormControl(this.data.flag == 'C' ? this.data.dt.add_line_2: ''),
       state: new FormControl(this.data.flag == 'C' ? this.data.dt.state: ''),
       dist: new FormControl(this.data.flag == 'C' ? this.data.dt.dist: ''),
       city: new FormControl(this.data.flag == 'C' ? this.data.dt.city: ''),
       pincode: new FormControl(this.data.flag == 'C' ? this.data.dt.pincode : ''),
       amc: new FormControl(this.data.flag == 'C' ? this.data.dt.state: ''),
       rnt: new FormControl(this.data.flag == 'C' ? this.data.dt.dist: ''),
       cat: new FormControl(this.data.flag == 'C' ? this.data.dt.city: ''),
       sub_cat: new FormControl(this.data.flag == 'C' ? this.data.dt.pincode : ''),

   })
  constructor(
    public dialogRef: MatDialogRef<DialogDtlsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit() {    
    if(this.data.flag == 'S'){
     this.getscmDtls();
    }
  }
  getscmDtls(){
   this.__dbIntr.api_call(0,'/scheme','scheme_id='+this.data.dt.id).pipe(pluck("data")).subscribe(res =>{
    console.log(res);
    this.__frmDtls.patchValue({
      amc:res[0]?.amc_name,
      rnt:res[0]?.rnt_name,
      cat:res[0]?.cat_name,
      sub_cat:res[0]?.subcate_name,
    })
   })
  }
  

}
