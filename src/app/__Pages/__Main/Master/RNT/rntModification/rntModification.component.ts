import { Component, OnInit ,Inject, SimpleChanges, ElementRef, ViewChild} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'rnt-rntModification',
  templateUrl: './rntModification.component.html',
  styleUrls: ['./rntModification.component.css']
})
export class RntModificationComponent implements OnInit {
  @ViewChild('scrollContainer') private __ScrollContainer: ElementRef;
  __isVisible:boolean = false;
  __rntForm = new FormGroup({
    rnt_name: new FormControl(this.data.id > 0 ? this.data.__rnt.rnt_name : '', [Validators.required]),
    rnt_full_name: new FormControl(this.data.id > 0 ? this.data.__rnt.rnt_full_name : '',[Validators.required]),
    login_url: new FormControl(this.data.id > 0 ? this.data.__rnt.login_url : ''),
    login_pass: new FormControl(this.data.id > 0 ? this.data.__rnt.login_pass : ''),
    login_id: new FormControl(this.data.id > 0 ? this.data.__rnt.login_id : ''),
    sec_qusAns: new FormArray([]),
    id: new FormControl(this.data.id),
    ofc_address: new FormControl(this.data.id > 0 ? this.data.__rnt.ofc_addr : ''),
    cust_care_no: new FormControl(this.data.id > 0 ? this.data.__rnt.cus_care_no : '', [Validators.pattern("^[0-9]*$")]),
    cust_care_email: new FormControl(this.data.id > 0 ? this.data.__rnt.cus_care_email : '', [Validators.email]),
    web_site: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.__rnt.website) : ''),
    gstin: new FormControl(this.data.id > 0 ? this.data.__rnt.gstin : ''),
    head_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.__rnt.head_ofc_contact_per : ''),
    head_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.__rnt.head_contact_per_mob : '',[Validators.pattern("^[0-9]*$")]),
    head_contact_per_email: new FormControl(this.data.id > 0 ? this.data.__rnt.head_contact_per_email : '',[Validators.email]),
    head_ofc_addr: new FormControl(this.data.id > 0 ? this.data.__rnt.head_ofc_addr : ''),
    cus_care_whatsapp_no: new FormControl(this.data.id > 0 ? this.data.__rnt.cus_care_whatsapp_no : '',[Validators.pattern("^[0-9]*$")]),
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
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }

  ngOnInit() {
    console.log(this.data.__rnt);

    this.addSecurityQuesAns(this.data.id > 0 ? (this.data.__rnt.security_qus_ans ? JSON.parse(this.data.__rnt.security_qus_ans) : []) : []);
  }
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
    fb.append('login_pass',global.getActualVal(this.__rntForm.value.login_pass));
    fb.append('login_id',global.getActualVal(this.__rntForm.value.login_id));
    fb.append('login_url',global.getActualVal(this.__rntForm.value.login_url));
    fb.append('sec_qus_ans',JSON.stringify(this.__rntForm.value.sec_qusAns));
     fb.append('rnt_full_name',global.getActualVal(this.__rntForm.value.rnt_full_name));
     fb.append("rnt_name", global.getActualVal(this.__rntForm.value.rnt_name));
    fb.append("gstin", global.getActualVal(this.__rntForm.value.gstin));
    fb.append('cus_care_whatsapp_no',global.getActualVal(this.__rntForm.value.cus_care_whatsapp_no));
    fb.append("id", this.__rntForm.value.id);
    fb.append("cus_care_no", this.__rntForm.value.cust_care_no > 0 ? this.__rntForm.value.cust_care_no : '');
    fb.append("ofc_addr", global.getActualVal(this.__rntForm.value.ofc_address));
    fb.append("cus_care_email", global.getActualVal(this.__rntForm.value.cust_care_email));
    fb.append("website", global.getActualVal(this.__rntForm.value.web_site));
    fb.append("head_ofc_contact_per",global.getActualVal(this.__rntForm.value.head_ofc_contact_per));
    fb.append("head_contact_per_mob",global.getActualVal(this.__rntForm.value.head_contact_per_mob));
    fb.append("head_contact_per_email",global.getActualVal(this.__rntForm.value.head_contact_per_email));
    fb.append("head_ofc_addr",global.getActualVal(this.__rntForm.value.head_ofc_addr));
    fb.append("local_ofc_contact_per",global.getActualVal(this.__rntForm.value.local_ofc_contact_per));
    fb.append("local_contact_per_mob",global.getActualVal(this.__rntForm.value.local_contact_per_mob));
    fb.append("local_contact_per_email",global.getActualVal(this.__rntForm.value.local_contact_per_email));
    fb.append("local_ofc_addr",global.getActualVal(this.__rntForm.value.local_ofc_addr));
    this.__dbIntr.api_call(1, '/rntAddEdit', fb).subscribe((res: any) => {
      this.__utility.showSnackbar(res.suc ==1 ? 'R&T Submitted Successfully' :  res.msg, res.suc);
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
  get sec_qusAns(): FormArray {
    return this.__rntForm.get("sec_qusAns") as FormArray;
  }
  addSecurityQuesAns(secQusAns : any | undefined | null = []): void {
    console.log(secQusAns);

    if(secQusAns.length == 0){
      this.sec_qusAns.push(this.SecurityQuesAns());
    }
    else{
      secQusAns.forEach(el =>{
         this.sec_qusAns.push(this.SecurityQuesAns(el.id,el.sec_qus,el.sec_ans));
      })
    }
    try {
      this.__ScrollContainer.nativeElement.scrollTop = this.__ScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }
  }
  SecurityQuesAns(id: number | null = 0,
    sec_qus:string | null = '',
    sec_ans: string | null = '') : FormGroup{
    return new FormGroup({
      id: new FormControl(id),
      sec_qus: new FormControl(sec_qus),
      sec_ans: new FormControl(sec_ans)
    })
  }
  removeSecurityQuesAns(index){
    this.sec_qusAns.removeAt(index);
  }

}
