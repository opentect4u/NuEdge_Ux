import { Component, OnInit ,Inject, SimpleChanges, ElementRef, ViewChild} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'rnt-rntModification',
  templateUrl: './rntModification.component.html',
  styleUrls: ['./rntModification.component.css']
})
export class RntModificationComponent implements OnInit {
  allowedExtensions= ['jpeg','jpg','png']
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
    distributor_care_email: new FormControl(this.data.id > 0 ? this.data.__rnt.distributor_care_email : '',[Validators.email]),
    distributor_care_no: new FormControl(this.data.id > 0 ? this.data.__rnt.distributor_care_no : '',
    [
    Validators.pattern("^[0-9]*$")
    ]),
    level_1:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.__rnt.l1_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.__rnt.l1_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.__rnt.l1_email : '',[Validators.email])
    }),
    level_2:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.__rnt.l2_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.__rnt.l2_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.__rnt.l2_email : '',[Validators.email])
    }),
    level_3:new FormGroup({
      is_same: new FormControl(false),
      name:new FormControl(this.data.id > 0 ? this.data.__rnt.l3_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.__rnt.l3_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.__rnt.l3_email : '',[Validators.email])
    }),
    level_4:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.__rnt.l4_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.__rnt.l4_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.__rnt.l4_email : '',[Validators.email])
    }),
    level_5:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.__rnt.l5_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.__rnt.l5_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.__rnt.l5_email : '',[Validators.email])
    }),
    level_6:new FormGroup({
      name:new FormControl(this.data.id > 0 ? this.data.__rnt.l6_name : ''),
      contact:new FormControl(this.data.id > 0 ? this.data.__rnt.l6_contact : '',
      [
      //   Validators.minLength(10),
      //  Validators.maxLength(10),
       Validators.pattern("^[0-9]*$")
      ]),
      email:new FormControl(this.data.id > 0 ? this.data.__rnt.l6_email : '',[Validators.email]),

    }),
    rnt_logo_upload:new FormControl(''),
    rnt_logo_file: new FormControl(this.data.id > 0 ? (global.getActualVal(this.data.__rnt.logo) ? `${environment.commonURL + 'rnt-logo/' + this.data.__rnt.logo }` : '') : ''),
    rnt_logo_preview:new FormControl(this.data.id > 0 ? (global.getActualVal(this.data.__rnt.logo) ? `${environment.commonURL + 'rnt-logo/' + this.data.__rnt.logo }` : '') : '')
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
    this.addSecurityQuesAns(this.data.id > 0 ?
      (this.data.__rnt.security_qus_ans
        ? JSON.parse(this.data.__rnt.security_qus_ans) : [])
        : []);
  }
  ngAfterViewInit(){
    this.__rntForm.get(['level_3','is_same']).valueChanges.subscribe(res =>{
      this.__rntForm.get(['level_3','name']).setValue(res ? this.__rntForm.get('local_ofc_contact_per').value : '');
      this.__rntForm.get(['level_3','contact']).setValue(res ? this.__rntForm.get('local_contact_per_mob').value : '');
      this.__rntForm.get(['level_3','email']).setValue(res ? this.__rntForm.get('local_contact_per_email').value : '');
    })
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
    const rnt = new FormData();
    rnt.append("l1_name", global.getActualVal(this.__rntForm.get(['level_1','name']).value));
    rnt.append("l1_contact_no", global.getActualVal(this.__rntForm.get(['level_1','contact']).value));
    rnt.append("l1_email", global.getActualVal(this.__rntForm.get(['level_1','email']).value));

    rnt.append("l2_name", global.getActualVal(this.__rntForm.get(['level_2','name']).value));
    rnt.append("l2_contact_no", global.getActualVal(this.__rntForm.get(['level_2','contact']).value));
    rnt.append("l2_email", global.getActualVal(this.__rntForm.get(['level_2','email']).value));

    rnt.append("l3_name", global.getActualVal(this.__rntForm.get(['level_3','name']).value));
    rnt.append("l3_contact_no", global.getActualVal(this.__rntForm.get(['level_3','contact']).value));
    rnt.append("l3_email", global.getActualVal(this.__rntForm.get(['level_3','email']).value));

    rnt.append("l4_name", global.getActualVal(this.__rntForm.get(['level_4','name']).value));
    rnt.append("l4_contact_no", global.getActualVal(this.__rntForm.get(['level_4','contact']).value));
    rnt.append("l4_email", global.getActualVal(this.__rntForm.get(['level_4','email']).value));

    rnt.append("l5_name", global.getActualVal(this.__rntForm.get(['level_5','name']).value));
    rnt.append("l5_contact_no", global.getActualVal(this.__rntForm.get(['level_5','contact']).value));
    rnt.append("l5_email", global.getActualVal(this.__rntForm.get(['level_5','email']).value));

    rnt.append("l6_name", global.getActualVal(this.__rntForm.get(['level_6','name']).value));
    rnt.append("l6_contact_no", global.getActualVal(this.__rntForm.get(['level_6','contact']).value));
    rnt.append("l6_email", global.getActualVal(this.__rntForm.get(['level_6','email']).value));

    rnt.append("distributor_care_no", this.__rntForm.value.distributor_care_no);
    rnt.append("distributor_care_email", this.__rntForm.value.distributor_care_email);
    rnt.append('login_pass',global.getActualVal(this.__rntForm.value.login_pass));
    rnt.append('login_id',global.getActualVal(this.__rntForm.value.login_id));
    rnt.append('login_url',global.getActualVal(this.__rntForm.value.login_url));
    rnt.append('sec_qus_ans',JSON.stringify(this.__rntForm.value.sec_qusAns));
     rnt.append('rnt_full_name',global.getActualVal(this.__rntForm.value.rnt_full_name));
     rnt.append("rnt_name", global.getActualVal(this.__rntForm.value.rnt_name));
    rnt.append("gstin", global.getActualVal(this.__rntForm.value.gstin));
    rnt.append('cus_care_whatsapp_no',global.getActualVal(this.__rntForm.value.cus_care_whatsapp_no));
    rnt.append("id", this.__rntForm.value.id);
    rnt.append("cus_care_no", this.__rntForm.value.cust_care_no > 0 ? this.__rntForm.value.cust_care_no : '');
    rnt.append("ofc_addr", global.getActualVal(this.__rntForm.value.ofc_address));
    rnt.append("cus_care_email", global.getActualVal(this.__rntForm.value.cust_care_email));
    rnt.append("website", global.getActualVal(this.__rntForm.value.web_site));
    rnt.append("head_ofc_contact_per",global.getActualVal(this.__rntForm.value.head_ofc_contact_per));
    rnt.append("head_contact_per_mob",global.getActualVal(this.__rntForm.value.head_contact_per_mob));
    rnt.append("head_contact_per_email",global.getActualVal(this.__rntForm.value.head_contact_per_email));
    rnt.append("head_ofc_addr",global.getActualVal(this.__rntForm.value.head_ofc_addr));
    rnt.append("local_ofc_contact_per",global.getActualVal(this.__rntForm.value.local_ofc_contact_per));
    rnt.append("local_contact_per_mob",global.getActualVal(this.__rntForm.value.local_contact_per_mob));
    rnt.append("local_contact_per_email",global.getActualVal(this.__rntForm.value.local_contact_per_email));
    rnt.append("local_ofc_addr",global.getActualVal(this.__rntForm.value.local_ofc_addr));
    rnt.append("logo",global.getActualVal(this.__rntForm.value.rnt_logo_file))
    this.__dbIntr.api_call(1, '/rntAddEdit', rnt).subscribe((res: any) => {
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
  addSecurityQuesAns(secQusAns : {id:number,sec_qus:string | null,sec_ans:string | null}[] | undefined | null = []): void {
      if(secQusAns.length == 0){
        this.sec_qusAns.push(this.SecurityQuesAns());
      }
      else{
        secQusAns.forEach(el =>{
           this.sec_qusAns.push(this.SecurityQuesAns(el.id,el.sec_qus,el.sec_ans));
        })
      }

    try {
      if(this.__ScrollContainer){
      this.__ScrollContainer.nativeElement.scrollTop = this.__ScrollContainer.nativeElement.scrollHeight;}
  } catch(err) {
    console.log('error' + err)
   }
  }
  SecurityQuesAns(id: number | null = 0,
    sec_qus:string | null = '',
    sec_ans: string | null = '') : FormGroup{
      console.log("ID:"+ id);
    return new FormGroup({
      id: new FormControl(id),
      sec_qus: new FormControl(sec_qus),
      sec_ans: new FormControl(sec_ans)
    })
  }
  removeSecurityQuesAns(index){
    this.sec_qusAns.removeAt(index);
  }
  getFile(event){
    this.__rntForm.controls['rnt_logo_upload'].setValidators([fileValidators.fileSizeValidator(event.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.__rntForm.controls['rnt_logo_upload'].updateValueAndValidity();
    if (this.__rntForm.controls['rnt_logo_upload'].status == 'VALID' && event.target.files.length > 0) {
      this.__rntForm.controls['rnt_logo_file'].setValue(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.__rntForm.controls['rnt_logo_preview'].patchValue(reader.result);
      reader.readAsDataURL(file);
    }
    else {
      this.__rntForm.controls['rnt_logo_file'].setValue('');
      this.__rntForm.controls['rnt_logo_preview'].patchValue('');
    }
  }
  clearImage(){
    this.__rntForm.controls['rnt_logo_file'].setValue('');
    this.__rntForm.controls['rnt_logo_preview'].patchValue('');
    this.__rntForm.controls['rnt_logo_upload'].patchValue(null);
  }
}
