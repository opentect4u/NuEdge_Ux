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
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';
import { docType } from 'src/app/__Model/__docTypeMst';
@Component({
  selector: 'kyc-kyModification',
  templateUrl: './kyModification.component.html',
  styleUrls: ['./kyModification.component.css']
})
export class KyModificationComponent implements OnInit {
  __kycLoginAt: any = [];
  __kycLoginType = kycLoginType;
  __kycType = kycType;
  __noImg: string = '../../../../../../assets/images/noimg.jpg';
  __isvisible: boolean = false;
  __selectFiles: any = [];
  __clMaster: client[];
  __docTypeMaster: docType[];
  __clientForm = new FormGroup({
    client_id: new FormControl('', [Validators.required]),
    client_code: new FormControl('', [Validators.required]),
    pan_no: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    _client_code: new FormControl('', [Validators.required]),
    _pan_no: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    client_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    doc_dtls: new FormArray([]),
    temp_tin_id: new FormControl('', [Validators.required]),
    kyc_type: new FormControl('', [Validators.required]),
    kyc_login_type: new FormControl('', [Validators.required]),
    kyc_login_at: new FormControl('', [Validators.required]),
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
    if (this.data.items != '') {
      this.__clientForm.patchValue({
        client_id: this.data.items.id,
        client_code: this.data.items.client_code,
        pan_no: this.data.items.pan,
        _client_code: this.data.items.client_code,
        _pan_no: this.data.items.pan,
        mobile: this.data.items.mobile,
        client_name: this.data.items.client_name,
        email: this.data.items.email,
        temp_tin_id: this.data.kyc_data.temp_tin_id,
        kyc_type: this.data.kyc_data.kyc_type,
        kyc_login_type: this.data.kyc_data.kyc_login_type,
        kyc_login_at: this.data.kyc_data.kyc_login_at,
      })
      this.setFormControl(this.data.items);
      this.getKycLoginAtMaster(this.data.kyc_data.kyc_login_type);
    }
  }
  ngAfterViewInit() {
    this.__clientForm.get('kyc_login_type').valueChanges.subscribe(res => {
      switch (res) {
        case 'R': this.getKycLoginAtMaster(res); break;
        case 'A': this.getKycLoginAtMaster(res); break;
        case 'N': this.__kycLoginAt = kycLoginAt; break;
        default: break;
      }
    })
  }
  getClientMaster() {
    this.__dbIntr.api_call(0, '/client', null).pipe(map((x: responseDT) => x.data)).subscribe((res: client[]) => {
      this.__clMaster = res;
    })
  }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  submit() {
    if (this.__clientForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
      const __kyc = new FormData();
    __kyc.append("client_id",this.__clientForm.value.client_id);
    __kyc.append("client_code",this.__clientForm.value.client_code);
    __kyc.append("pan_no",this.__clientForm.value.pan_no);
    __kyc.append("_client_code",this.__clientForm.value._client_code);
    __kyc.append("_pan_no",this.__clientForm.value._pan_no);
    __kyc.append("mobile",this.__clientForm.value.mobile);
    __kyc.append("client_name",this.__clientForm.value.client_name);
    __kyc.append("email",this.__clientForm.value.email);
    __kyc.append("doc_dtls",this.__clientForm.value.doc_dtls);
    __kyc.append("temp_tin_id",this.__clientForm.value.temp_tin_id);
    __kyc.append("kyc_type",this.__clientForm.value.kyc_type);
    __kyc.append("kyc_login_type",this.__clientForm.value.kyc_login_type);
    __kyc.append("kyc_login_at",this.__clientForm.value.kyc_login_at);

    this.__dbIntr.api_call(1, '/kycAddEdit', __kyc).pipe((map((x: responseDT) => x.suc))).subscribe((res: number) => {
      if (res == 1) {
        this.dialogRef.close(res);
      }
      this.__utility.showSnackbar(res == 1 ? 'Kyc submitted Successfully' : 'Something went wrong! Please try again later', res);
    })

  }

  setItem(id, type_id, doc) {
    console.log(this.__clientForm.get('client_id').value)
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl({ value: type_id, disabled: true }),
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
    if (__ev.flag == 'F') {
      this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __ev.item.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
        this.__clientForm.patchValue({
          client_id: res[0].id,
          client_code: res[0].client_code,
          pan_no: res[0].pan,
          _client_code: res[0].client_code,
          _pan_no: res[0].pan,
          mobile: res[0].mobile,
          client_name: res[0].client_name,
          email: res[0].email,
        })
        this.setFormControl(res[0]);
      })
    }
  }

  getKycLoginAtMaster(kyc_login_type) {
    this.__dbIntr.api_call(0, kyc_login_type == 'R' ? '/rnt' : '/amc', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__kycLoginAt = res;
    })
  }

  setFormControl(res) {
    this.__isvisible = true;
    res.client_doc.forEach(element => {
      this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name));
    })
  }

}
