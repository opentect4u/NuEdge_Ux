import { Component, OnInit ,Inject, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'rnt-rntModification',
  templateUrl: './rntModification.component.html',
  styleUrls: ['./rntModification.component.css']
})
export class RntModificationComponent implements OnInit {
  __isVisible:boolean = false;
  __rntForm = new FormGroup({
    rnt_name: new FormControl(this.data.id > 0 ? this.data.__rnt.rnt_name : '', [Validators.required]),
    id: new FormControl(this.data.id),
    ofc_address: new FormControl(this.data.id > 0 ? this.data.__rnt.ofc_addr : ''),
    cust_care_no: new FormControl(this.data.id > 0 ? this.data.__rnt.cus_care_no : '', [Validators.pattern("^[0-9]*$")]),
    cust_care_email: new FormControl(this.data.id > 0 ? this.data.__rnt.cus_care_email : '', [Validators.email]),
    web_site: new FormControl(this.data.id > 0 ? this.data.__rnt.website : ''),

    head_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.__rnt.head_ofc_contact_per : ''),
    head_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.__rnt.head_contact_per_mob : '',[Validators.pattern("^[0-9]*$")]),
    head_contact_per_email: new FormControl(this.data.id > 0 ? this.data.__rnt.head_contact_per_email : '',[Validators.email]),
    head_ofc_addr: new FormControl(this.data.id > 0 ? this.data.__rnt.head_ofc_addr : ''),

    local_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.__rnt.local_ofc_contact_per : ''),
    local_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.__rnt.local_contact_per_mob : '',[Validators.pattern("^[0-9]*$")]),
    local_contact_per_email: new FormControl(this.data.id > 0 ? this.data.__rnt.local_contact_per_email : '',[Validators.email]),
    local_ofc_addr: new FormControl(this.data.id > 0 ? this.data.__rnt.local_ofc_addr : ''),
  })
  constructor(
    public dialogRef: MatDialogRef<RntModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      console.log(res);
      // this.__isVisible = res;
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }

  ngOnInit() {}
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }

  submit() {
    const fb = new FormData();
    fb.append("rnt_name", this.__rntForm.value.rnt_name);
    fb.append("id", this.__rntForm.value.id);
    fb.append("cus_care_no", this.__rntForm.value.cust_care_no > 0 ? this.__rntForm.value.cust_care_no : '');
    fb.append("ofc_addr", this.__rntForm.value.ofc_address);
    fb.append("cus_care_email", this.__rntForm.value.cust_care_email);
    fb.append("website", this.__rntForm.value.web_site);
    fb.append("head_ofc_contact_per",this.__rntForm.value.head_ofc_contact_per);
    fb.append("head_contact_per_mob",this.__rntForm.value.head_contact_per_mob);
    fb.append("head_contact_per_email",this.__rntForm.value.head_contact_per_email);
    fb.append("head_ofc_addr",this.__rntForm.value.head_ofc_addr);
    fb.append("local_ofc_contact_per",this.__rntForm.value.local_ofc_contact_per);
    fb.append("local_contact_per_mob",this.__rntForm.value.local_contact_per_mob);
    fb.append("local_contact_per_email",this.__rntForm.value.local_contact_per_email);
    fb.append("local_ofc_addr",this.__rntForm.value.local_ofc_addr);
    this.__dbIntr.api_call(1, '/rntAddEdit', fb).subscribe((res: any) => {
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'RNT updated successfully' : 'RNT added successfully') : 'Something went wrong! please try again later', res.suc);
      this.reset();
      this.dialogRef.close({ id: this.data.id, data: res.data })
    })
  }
  reset(){this.__rntForm.reset();}
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
}
