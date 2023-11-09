import { Component, ElementRef, OnInit, ViewChild,Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
  @ViewChild('scrollCompany') private __ScrollContainer: ElementRef;

  __isVisible:boolean = false;
  __cmpForm = new FormGroup({
    com_type_id: new FormControl(this.data.id > 0 ? this.data.cmp.comp_type_id : '', [Validators.required]),
    comp_short_name: new FormControl(this.data.id > 0 ? this.data.cmp.comp_short_name : '', [Validators.required]),
    comp_full_name: new FormControl(this.data.id > 0 ? this.data.cmp.comp_full_name : '', [Validators.required]),
    login_url: new FormControl(this.data.id > 0 ? this.data.cmp.login_url : ''),
    login_pass: new FormControl(this.data.id > 0 ? this.data.cmp.login_pass : ''),
    login_id: new FormControl(this.data.id > 0 ? this.data.cmp.login_id : ''),
    sec_qusAns: new FormArray([]),
    id: new FormControl(this.data.id),
    ofc_address: new FormControl(this.data.id > 0 ? this.data.cmp.ofc_addr : ''),
    cust_care_no: new FormControl(this.data.id > 0 ? this.data.cmp.cus_care_no : '',
    [Validators.pattern("^[0-9]*$")]
    ),
    cust_care_email: new FormControl(this.data.id > 0 ? this.data.cmp.cus_care_email : '', [Validators.email]),
    web_site: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.cmp.website) : ''),
    gstin: new FormControl(this.data.id > 0 ? this.data.cmp.gstin : ''),
    head_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.cmp.head_ofc_contact_per : ''),
    head_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.cmp.head_contact_per_mob : '',
    [Validators.pattern("^[0-9]*$")]
    ),
    head_contact_per_email: new FormControl(this.data.id > 0 ? this.data.cmp.head_contact_per_email : '',[Validators.email]),
    head_ofc_addr: new FormControl(this.data.id > 0 ? this.data.cmp.head_ofc_addr : ''),
    cus_care_whatsapp_no: new FormControl(this.data.id > 0 ? this.data.cmp.cus_care_whatsapp_no : '',
    [Validators.pattern("^[0-9]*$")]
    ),
    local_ofc_contact_per: new FormControl(this.data.id > 0 ? this.data.cmp.local_ofc_contact_per : ''),
    local_contact_per_mob: new FormControl(this.data.id > 0 ? this.data.cmp.local_contact_per_mob : '',
    [Validators.pattern("^[0-9]*$")]
    ),
    local_contact_per_email: new FormControl(this.data.id > 0 ? this.data.cmp.local_contact_per_email : '',[Validators.email]),
    local_ofc_addr: new FormControl(this.data.id > 0 ? this.data.cmp.local_ofc_addr : ''),
    distributor_care_email: new FormControl(this.data.id > 0 ? this.data.cmp.distributor_care_email : '',[Validators.email]),
    distributor_care_no: new FormControl(this.data.id > 0 ? this.data.cmp.distributor_care_no : '',
    [
    Validators.pattern("^[0-9]*$")
    ]),
    level_1:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.cmp.l1_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.cmp.l1_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.cmp.l1_email : '',[Validators.email])
    }),
    level_2:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.cmp.l2_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.cmp.l2_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.cmp.l2_email : '',[Validators.email])
    }),
    level_3:new FormGroup({
      is_same: new FormControl(false),
      name:new FormControl(this.data.id > 0 ? this.data.cmp.l3_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.cmp.l3_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.cmp.l3_email : '',[Validators.email])
    }),
    level_4:new FormGroup({

      name:new FormControl(this.data.id > 0 ? this.data.cmp.l4_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.cmp.l4_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.cmp.l4_email : '',[Validators.email])
    }),
    level_5:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.cmp.l5_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.cmp.l5_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.cmp.l5_email : '',[Validators.email])
    }),
    level_6:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.cmp.l6_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.cmp.l6_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.cmp.l6_email : '',[Validators.email])
    }),
  })
  __CmpTypeMst: any=[];
  constructor(
    public dialogRef: MatDialogRef<CrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.addSecurityQuesAns(this.data.id > 0 ? (this.data.cmp.security_qus_ans ? JSON.parse(this.data.cmp.security_qus_ans) : []) : []);
     this.getCmpType();
  }
  getCmpType(){
    this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe(res =>{
      this.__CmpTypeMst = res;
   })
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
      // this.__ScrollContainer.nativeElement.scrollTop = this.__ScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  get sec_qusAns(): FormArray {
    return this.__cmpForm.get("sec_qusAns") as FormArray;
  }
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  submit(){
    const fb = new FormData();
    fb.append("l1_name", global.getActualVal(this.__cmpForm.get(['level_1','name']).value));
    fb.append("l1_contact_no", global.getActualVal(this.__cmpForm.get(['level_1','contact']).value));
    fb.append("l1_email", global.getActualVal(this.__cmpForm.get(['level_1','email']).value));

    fb.append("l2_name", global.getActualVal(this.__cmpForm.get(['level_2','name']).value));
    fb.append("l2_contact_no", global.getActualVal(this.__cmpForm.get(['level_2','contact']).value));
    fb.append("l2_email", global.getActualVal(this.__cmpForm.get(['level_2','email']).value));

    fb.append("l3_name", global.getActualVal(this.__cmpForm.get(['level_3','name']).value));
    fb.append("l3_contact_no", global.getActualVal(this.__cmpForm.get(['level_3','contact']).value));
    fb.append("l3_email", global.getActualVal(this.__cmpForm.get(['level_3','email']).value));

    fb.append("l4_name", global.getActualVal(this.__cmpForm.get(['level_4','name']).value));
    fb.append("l4_contact_no", global.getActualVal(this.__cmpForm.get(['level_4','contact']).value));
    fb.append("l4_email", global.getActualVal(this.__cmpForm.get(['level_4','email']).value));

    fb.append("l5_name", global.getActualVal(this.__cmpForm.get(['level_5','name']).value));
    fb.append("l5_contact_no", global.getActualVal(this.__cmpForm.get(['level_5','contact']).value));
    fb.append("l5_email", global.getActualVal(this.__cmpForm.get(['level_5','email']).value));

    fb.append("l6_name", global.getActualVal(this.__cmpForm.get(['level_6','name']).value));
    fb.append("l6_contact_no", global.getActualVal(this.__cmpForm.get(['level_6','contact']).value));
    fb.append("l6_email", global.getActualVal(this.__cmpForm.get(['level_6','email']).value));
    fb.append('login_pass',global.getActualVal(this.__cmpForm.value.login_pass));
    fb.append('login_id',global.getActualVal(this.__cmpForm.value.login_id));
    fb.append('login_url',global.getActualVal(this.__cmpForm.value.login_url));
    fb.append('sec_qus_ans',JSON.stringify(this.__cmpForm.value.sec_qusAns));
    fb.append('comp_type_id',global.getActualVal(this.__cmpForm.value.com_type_id));
     fb.append("comp_full_name", global.getActualVal(this.__cmpForm.value.comp_full_name));
     fb.append("comp_short_name", global.getActualVal(this.__cmpForm.value.comp_short_name));
    fb.append("gstin", global.getActualVal(this.__cmpForm.value.gstin));
    fb.append('cus_care_whatsapp_no',global.getActualVal(this.__cmpForm.value.cus_care_whatsapp_no));
    fb.append("id", this.__cmpForm.value.id);
    fb.append("cus_care_no", this.__cmpForm.value.cust_care_no > 0 ? this.__cmpForm.value.cust_care_no : '');
    fb.append("ofc_addr", global.getActualVal(this.__cmpForm.value.ofc_address));
    fb.append("cus_care_email", global.getActualVal(this.__cmpForm.value.cust_care_email));
    fb.append("website", global.getActualVal(this.__cmpForm.value.web_site));
    fb.append("head_ofc_contact_per",global.getActualVal(this.__cmpForm.value.head_ofc_contact_per));
    fb.append("head_contact_per_mob",global.getActualVal(this.__cmpForm.value.head_contact_per_mob));
    fb.append("head_contact_per_email",global.getActualVal(this.__cmpForm.value.head_contact_per_email));
    fb.append("head_ofc_addr",global.getActualVal(this.__cmpForm.value.head_ofc_addr));
    fb.append("local_ofc_contact_per",global.getActualVal(this.__cmpForm.value.local_ofc_contact_per));
    fb.append("local_contact_per_mob",global.getActualVal(this.__cmpForm.value.local_contact_per_mob));
    fb.append("local_contact_per_email",global.getActualVal(this.__cmpForm.value.local_contact_per_email));
    fb.append("local_ofc_addr",global.getActualVal(this.__cmpForm.value.local_ofc_addr));
    this.__dbIntr.api_call(1, '/fd/companyAddEdit', fb).subscribe((res: any) => {
      this.__utility.showSnackbar(res.suc ==1 ? 'Company Submitted Successfully' :  res.msg, res.suc);
      this.reset();
      this.dialogRef.close({ id: this.data.id, data: res.data })
    })
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  reset(){
    this.__cmpForm.reset();
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
  ngAfterViewInit(){
    this.__cmpForm.get(['level_3','is_same']).valueChanges.subscribe(res =>{
      this.__cmpForm.get(['level_3','name']).setValue(res ? this.__cmpForm.get('local_ofc_contact_per').value : '');
      this.__cmpForm.get(['level_3','contact']).setValue(res ? this.__cmpForm.get('local_contact_per_mob').value : '');
      this.__cmpForm.get(['level_3','email']).setValue(res ? this.__cmpForm.get('local_contact_per_email').value : '');
    })
  }


}
