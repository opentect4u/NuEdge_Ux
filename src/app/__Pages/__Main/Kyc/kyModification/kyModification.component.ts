import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { environment } from 'src/environments/environment';
import kycType from '../../../../../assets/json/kycMaster.json';
import kycLoginType from '../../../../../assets/json/kycloginType.json';
import kycLoginAt from '../../../../../assets/json/kycLoginAt.json';
@Component({
  selector: 'kyc-kyModification',
  templateUrl: './kyModification.component.html',
  styleUrls: ['./kyModification.component.css']
})
export class KyModificationComponent implements OnInit {
  __kycLoginAt: any=[];
  __kycLoginType = kycLoginType;
  __kycType = kycType;
  __noImg: string = '../../../../../../assets/images/noimg.jpg';
  __isvisible: boolean = false;
  __selectFiles: any = [];
  // __docs:FormArray;
  __clMaster: any = [];
  __docTypeMaster; any = [];
  __clientForm = new FormGroup({
    client_id: new FormControl(''),
    client_code:new FormControl(''),
    pan_no:new FormControl(''),
    _client_code: new FormControl({ value: '', disabled: true },[Validators.required]),
    _pan_no: new FormControl({ value: '', disabled: true },[Validators.required]),
    mobile: new FormControl({ value: '', disabled: true },[Validators.required]),
    client_name: new FormControl({ value: '', disabled: true },[Validators.required]),
    email: new FormControl({ value: '', disabled: true },[Validators.required]),
    doc_dtls: new FormArray([]),
    temp_tin_id: new FormControl('',[Validators.required]),
    kyc_type:new FormControl('',[Validators.required]),
    kyc_login_type:new FormControl('',[Validators.required]),
    kyc_login_at:new FormControl('',[Validators.required]),
  })
  constructor(
    public dialogRef: MatDialogRef<KyModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
  ) {
    this.getDocumnetTypeMaster();
  }

  ngOnInit() {
    if (this.data.items !='') {
      this.__clientForm.patchValue({
        client_id:this.data.items.id,
        client_code: this.data.items.client_code,
        pan_no:  this.data.items.pan,
        _client_code: this.data.items.client_code,
        _pan_no:  this.data.items.pan,
        mobile: this.data.items.mobile,
        client_name: this.data.items.client_name,
        email: this.data.items.email,
        temp_tin_id:this.data.kyc_data.temp_tin_id,
        kyc_type:this.data.kyc_data.kyc_type,
        kyc_login_type:this.data.kyc_data.kyc_login_type,
        kyc_login_at:this.data.kyc_data.kyc_login_at,
      })
      this.setFormControl(this.data.items);
      this.getKycLoginAtMaster(this.data.kyc_data.kyc_login_type);
    }
  }
  ngAfterViewInit(){
    this.__clientForm.get('kyc_login_type').valueChanges.subscribe(res =>{
          switch(res){
            case 'R':this.getKycLoginAtMaster(res);break;
            case 'A':this.getKycLoginAtMaster(res);break;
            case 'N':this.__kycLoginAt = kycLoginAt;break;
            default:break;
          }
    })
  }
  getClientMaster() {
    this.__dbIntr.api_call(0, '/client', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__clMaster = res;
    })
  }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__docTypeMaster = res;
    })
  }
  submit() {
    if (this.__clientForm.invalid) {
      return;
    }
    console.log(this.__clientForm.value);
    
    this.__dbIntr.api_call(1,'/kycAddEdit',this.__clientForm.value).pipe((map((x: any) => x.suc))).subscribe(res => {
      this.__utility.showSnackbar(res == 1 ? 'Kyc Added Successfully' : 'Something went wrong', '');
      if (res == 1) {
        this.dialogRef.close(res);
      }
    })

  }

  setItem(id, type_id, doc) {
    console.log(this.__clientForm.get('client_id').value)
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl({value: type_id, disabled: true }),
      file_preview: new FormControl(`${environment.clientdocUrl}` + this.__clientForm.get('client_id').value + '/' + doc),
    });
  }

  removeDocument(__index) {
    this.__docs.removeAt(__index);
  }
  getFiles(__ev, index, __type_id) {
    this.__docs.controls[index].get('file')?.patchValue(__ev.target.files[0]);
    const file = __ev.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.__docs.controls[index].get('file_preview')?.patchValue(reader.result);
    reader.readAsDataURL(file);
  }
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  getSearchItem(__ev) {
    console.log(__ev);
    if (__ev.flag == 'F') {
      this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __ev.item.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
        console.log(res);
        this.__clientForm.patchValue({
          client_id:res[0].id,
          client_code: res[0].client_code,
          pan_no:  res[0].pan,
          _client_code: res[0].client_code,
          _pan_no:  res[0].pan,
          mobile: res[0].mobile,
          client_name: res[0].client_name,
          email: res[0].email,
        })
        this.setFormControl(res[0]);
      })
    }
  }

  getKycLoginAtMaster(kyc_login_type){
    this.__dbIntr.api_call(0,kyc_login_type == 'R' ? '/rnt' : '/amc',null).pipe(map((x: any) => x.data)).subscribe(res =>{
      this.__kycLoginAt = res;
    })
  }

  setFormControl(res){
    this.__isvisible =true;
    res.client_doc.forEach(element =>{
      this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name));
    })
  }

}
