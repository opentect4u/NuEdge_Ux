import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { bank } from 'src/app/__Model/__bank';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { trnsType } from 'src/app/__Model/__transTypeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import KycMst from '../../../../../../../assets/json/kyc.json';
@Component({
  selector: 'mf-common-cmn_dialog',
  templateUrl: './cmn_dialog.component.html',
  styleUrls: ['./cmn_dialog.component.css']
})
export class Cmn_dialogComponent implements OnInit {
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __kycMst: any[] = KycMst;
  __transTypeMst: trnsType[];
  __schemeMst: scheme[];
  __amcMst: amc[];
  __catMst: category[];
  __subCatMst: subcat[];
  __bankMst: bank[];
  __financialForm = new FormGroup({
    id: new FormControl(this.data.id),
    sip_to: new FormControl(''),
    sip_from: new FormControl(''),
    temp_tin_id: new FormControl(this.data.id ? this.data.data.temp_tin_id : '', [Validators.required]),
    bu_type: new FormControl('', [Validators.required]),
    arn_no: new FormControl('', [Validators.required]),
    euin_from: new FormControl('', [Validators.required]),
    euin_to: new FormControl('', [Validators.required]),
    entry_date: new FormControl(this.datePipe.transform(new Date(), 'dd-MM-YYYY')),
    login_at: new FormControl(this.data.id ? this.data.data.rnt_login_at : '', [Validators.required]),
    remarks: new FormControl(this.data.id ? (this.data.data.remarks != null ? this.data.data.remarks : '') : ''),
    app_form_scan_status: new FormControl(this.data.id ? (this.data.data.form_scan_status == "true") : false, [Validators.requiredTrue]),
    file: new FormControl('', this.data.id ? [fileValidators.fileExtensionValidator(this.allowedExtensions)]  : [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    app_form_scan: new FormControl('', this.data.id ? [] : [Validators.required]),
    frm_rec_dateTime: new FormControl(''),
    sub_arn_no: new FormControl(''),
    sub_brk_cd: new FormControl(''),
    first_client_code: new FormControl(this.data.id ? this.data.data.first_client_code : '', [Validators.required]),
    first_client_name: new FormControl('', [Validators.required]),
    first_pan: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    first_kyc: new FormControl('', [Validators.required]),
    first_email: new FormControl('', [Validators.required, Validators.email]),
    first_mobile: new FormControl('', [Validators.required]),

    second_kyc: new FormControl( ''),
    second_client_code: new FormControl(this.data.id ? this.data.data.second_client_code : ''),
    second_client_name: new FormControl(''),
    second_pan: new FormControl('', [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    second_email: new FormControl('', [Validators.email]),
    second_mobile: new FormControl(''),

    third_client_code: new FormControl(this.data.id ? this.data.data.third_client_code : ''),
    third_client_name: new FormControl(''),
    third_pan: new FormControl('', [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    third_email: new FormControl('', [Validators.email]),
    third_mobile: new FormControl(''),
    third_kyc: new FormControl(''),

    scheme_name: new FormControl('', [Validators.required]),
    trans_catg: new FormControl(this.data.id ? this.data.data.trans_catg : '', [Validators.required]),
    trans_scheme_from: new FormControl(''),
    trans_scheme_to: new FormControl(''),
    amount: new FormControl(this.data.id ? this.data.data.amount : '', [Validators.required]),
    trans_type: new FormControl('', [Validators.required]),
    chq_no: new FormControl(this.data.id ? this.data.data.chq_no : '', [Validators.required]),
    trans_subcatg: new FormControl(this.data.id ? this.data.data.trans_subcat : '', [Validators.required]),
    chq_bank: new FormControl(this.data.id ? this.data.data.chq_bank : '', [Validators.required]),
    amc_id: new FormControl(this.data.id ? this.data.data.amc_id : '', [Validators.required]),
    trans_type_id: new FormControl(this.data.parent_id),
    filePreview: new FormControl(this.data.id ? `${environment.app_formUrl + this.data.data.app_form_scan}` : '')
  })
  constructor(
    public dialogRef: MatDialogRef<Cmn_dialogComponent>,
    private datePipe: DatePipe,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
  ) {
    console.log(data);
    this.getTransactionTypeMasterAccordingTotransType();
    this.getAmcMaster();
    this.getCatgoryMaster();
    this.getBankMaster();
  }

  ngOnInit() {
    if (this.data.id) { 
      this.populateRCVforDtls();
      this.getSubcategoryAccordingToCategory(this.data.data.trans_catg);
      this.getSchemeMaster(this.data.data.trans_catg, this.data.data.trans_subcat);
      this.setCLDtls(this.data.data.first_client_code,1);
      if(this.data.data.second_client_code){
        this.setCLDtls(this.data.data.second_client_code, 2);
      }
      if(this.data.data.third_client_code){
        this.setCLDtls(this.data.data.third_client_code,3);
      }
      setTimeout(() => {
        if(this.__financialForm.get('trans_type').value == '1' || this.__financialForm.get('trans_type').value == '6'){
        this.setFormControl('scheme_name',this.data.data.trans_scheme_to);}
        else if(this.__financialForm.get('trans_type').value == '3' 
                || this.__financialForm.get('trans_type').value == '4' 
                ||  this.__financialForm.get('trans_type').value == '5'){   
                  console.log('sss');
                  
          this.setFormControl('trans_scheme_from',this.data.data.trans_scheme_from);
          this.setFormControl('trans_scheme_to',this.data.data.trans_scheme_to);
        }
        else{
          this.setFormControl('sip_from',this.data.data.sip_from);
          this.setFormControl('sip_to',this.data.data.sip_to);
        }
        }, 1000);
    }
  }
  ngAfterViewInit() {

    /***** event emit on category change*/
    this.__financialForm.get('trans_catg').valueChanges.subscribe(res => {
      console.log(res);
      
      if (res) {
        this.getSubcategoryAccordingToCategory(res);
      }
      this.callSchememaster(res, this.__financialForm.get('trans_subcatg').value)
    })
    /****** event emit on subcategory change*/
    this.__financialForm.get('trans_subcatg').valueChanges.subscribe(res => {
      this.callSchememaster(this.__financialForm.get('trans_catg').value, res);
    })

    /****** event emit on transtype change*/
    this.__financialForm.get('trans_type').valueChanges.subscribe(res => {
      console.log(res);
      
      switch (Number(res)) {
        case 2:
          this.setValidators(['sip_from', 'sip_to', 'scheme_name'], 'A');
          this.setValidators(['trans_scheme_from', 'trans_scheme_to'], 'R');
          break;
        case 3:
          this.setValidators(['trans_scheme_from', 'trans_scheme_to'], 'A');
          this.setValidators(['scheme_name', 'sip_to', 'sip_from'], 'R');
          break;
        case 4:
          this.setValidators(['trans_scheme_from', 'trans_scheme_to'], 'A');
          this.setValidators(['scheme_name', 'sip_to', 'sip_from'], 'R'); break;
        case 5:
          this.setValidators(['trans_scheme_from', 'trans_scheme_to'], 'A');
          this.setValidators(['scheme_name', 'sip_to', 'sip_from'], 'R'); break;
        case 7:
          this.setValidators(['trans_scheme_from', 'trans_scheme_to'], 'R');
          this.setValidators(['sip_to', 'sip_from', 'scheme_name'], 'A'); break;
        default:
          this.setValidators(['sip_from', 'sip_to', 'trans_scheme_from', 'trans_scheme_to'], 'R');
          this.setValidators(['scheme_name',], 'A');
          break;
      }
    })
    /****** */
  }
  submitMF() {
    if (this.__financialForm.invalid) {
      this.__utility.showSnackbar('Error!! Form submition failed due to some error', 0)
      return;
    }
    const fb = new FormData();
    fb.append('id', this.__financialForm.value.id);
    fb.append('sip_end_date', this.__financialForm.value.sip_to);
    fb.append('sip_start_date', this.__financialForm.value.sip_from);
    fb.append('temp_tin_id', this.__financialForm.value.temp_tin_id);
    fb.append('rnt_login_at', this.__financialForm.value.login_at);
    fb.append('remarks', this.__financialForm.value.remarks);
    fb.append('form_scan_status', this.__financialForm.value.app_form_scan_status);
    fb.append('first_client_code', this.__financialForm.value.first_client_code?.toString().toUpperCase());
    fb.append('first_client_name', this.__financialForm.value.first_client_name);
    fb.append('first_pan', this.__financialForm.value.first_pan);
    fb.append('first_kyc', this.__financialForm.value.first_kyc);
    fb.append('first_email', this.__financialForm.value.first_email);
    fb.append('first_mobile', this.__financialForm.value.first_mobile);
    fb.append('second_kyc', this.__financialForm.value.second_kyc);
    fb.append('second_client_code', this.__financialForm.value.second_client_code?.toString().toUpperCase());
    fb.append('second_client_name', this.__financialForm.value.second_client_name);
    fb.append('second_pan', this.__financialForm.value.second_pan);
    fb.append('second_email', this.__financialForm.value.second_email);
    fb.append('second_mobile', this.__financialForm.value.second_mobile);
    fb.append('third_client_code', this.__financialForm.value.third_client_code?.toString().toUpperCase());
    fb.append('third_client_name', this.__financialForm.value.third_client_name);
    fb.append('third_pan', this.__financialForm.value.third_pan);
    fb.append('third_email', this.__financialForm.value.third_email);
    fb.append('third_mobile', this.__financialForm.value.third_mobile);
    fb.append('third_kyc', this.__financialForm.value.third_kyc);
    fb.append('scheme_name', this.__financialForm.value.scheme_name);
    fb.append('trans_catg', this.__financialForm.value.trans_catg);
    fb.append('trans_scheme_from', this.__financialForm.value.trans_scheme_from);
    fb.append('trans_scheme_to', this.__financialForm.value.trans_scheme_to);
    fb.append('amount', this.__financialForm.value.amount);
    fb.append('trans_type', this.__financialForm.value.trans_type);
    fb.append('chq_no', this.__financialForm.value.chq_no);
    fb.append('trans_subcatg', this.__financialForm.value.trans_subcatg);
    fb.append('chq_bank', this.__financialForm.value.chq_bank);
    fb.append('amc_id', this.__financialForm.value.amc_id);
    fb.append('trans_type_id', this.data.trans_type == 'F' ? '1' : this.data.trans_type == 'N' ? '3' : '4');
    console.log(this.__financialForm.value.app_form_scan);
    
    fb.append('app_form_scan', this.__financialForm.value.app_form_scan);
    fb.append('entry_date', this.__financialForm.value.entry_date);
    fb.append('tin_no',this.data.id);
    this.__dbIntr.api_call(1, this.data.id ? '/mfTraxUpdate' :  '/mfTraxCreate', fb).subscribe((res: any) => {
      this.dialogRef.close({ id: this.data.id, data: res.data })
      this.__utility.showSnackbar(res.suc == 1 ? 'Form Submitted Successfully' : res.msg, res.suc)
    })
  }

  getTransactionTypeMasterAccordingTotransType() {
    this.__dbIntr.api_call(0, '/showTrans', "trans_type_id=" + (this.data.trans_type == 'F' ? 1 : (this.data.trans_type == 'N' ? 3 : 4))).pipe(map((x: responseDT) => x.data)).subscribe((res: trnsType[]) => {
      this.__transTypeMst = res;
    })
  }
  getSchemeMaster(cat_id, subcat_id) {
    console.log(cat_id + '' + subcat_id);
    
    this.__dbIntr.api_call(0, '/scheme', "product_id=" + this.data.parent_id + '&category_id=' + cat_id + "&subcategory_id=" + subcat_id).pipe(map((x: responseDT) => x.data)).subscribe((res: scheme[]) => {
     console.log(res);
     
      this.__schemeMst = res;
    })
  }
  getAmcMaster() {
    this.__dbIntr.api_call(0, '/amc', "product_id=" + this.data.parent_id).pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.__amcMst = res;
    })
  }
  getCatgoryMaster() {
    this.__dbIntr.api_call(0, '/category', "product_id=" + this.data.parent_id).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.__catMst = res;
    })
  }
  getSubcategoryAccordingToCategory(__cat_id) {
    this.__dbIntr.api_call(0, '/subcategory', "category_id=" + __cat_id).pipe(map((x: responseDT) => x.data)).subscribe((res: subcat[]) => {
      this.__subCatMst = res;
    })
  }
  getClDtlsAccordingtoClCode(__clcode, index) {
     this.setCLDtls(__clcode.value,index);
  }

 setCLDtls(__clCode,index){
  if(__clCode != ''){
    this.__dbIntr.api_call(0, '/client', 'client_code=' + __clCode.toString().toUpperCase()).subscribe((res: responseDT) => {
      console.log(res);
      console.log(index);
      switch (index) {
        case 2: this.setValidators(['second_email', 'second_mobile', 'second_client_name', 'second_kyc', 'second_pan'], res.data.length > 0 ? 'A' : 'R'); break;
        case 3: this.setValidators(['third_email', 'third_mobile', 'third_client_name', 'third_kyc', 'third_pan'], res.data.length > 0 ? 'A' : 'R'); break;
        default: break;
      }
      this.setFormControl(index == 1 ? 'first_pan' : (index == 2 ? 'second_pan' : 'third_pan'), res.data[0]?.pan);
      this.setFormControl(index == 1 ? 'first_client_name' : (index == 2 ? 'second_client_name' : 'third_client_name'), res.data[0]?.client_name);
      this.setFormControl(index == 1 ? 'first_kyc' : (index == 2 ? 'second_kyc' : 'third_kyc'), res.data[0]?.final_kyc_status ? res.data[0]?.final_kyc_status : '');
      this.setFormControl(index == 1 ? 'first_email' : (index == 2 ? 'second_email' : 'third_email'), res.data[0]?.email ? res.data[0]?.email : '');
      this.setFormControl(index == 1 ? 'first_mobile' : (index == 2 ? 'second_mobile' : 'third_mobile'), res.data[0]?.mobile ? res.data[0]?.mobile : '');
    })
  }
  else{
    switch (index) {
      case 2: this.setValidators(['second_email', 'second_mobile', 'second_client_name', 'second_kyc', 'second_pan'], 'R'); break;
      case 3: this.setValidators(['third_email', 'third_mobile', 'third_client_name', 'third_kyc', 'third_pan'], 'R'); break;
      default: break;
    }
    this.setFormControl(index == 1 ? 'first_pan' : (index == 2 ? 'second_pan' : 'third_pan'), '');
    this.setFormControl(index == 1 ? 'first_client_name' : (index == 2 ? 'second_client_name' : 'third_client_name'), '');
    this.setFormControl(index == 1 ? 'first_kyc' : (index == 2 ? 'second_kyc' : 'third_kyc'), '');
    this.setFormControl(index == 1 ? 'first_email' : (index == 2 ? 'second_email' : 'third_email'), '');
    this.setFormControl(index == 1 ? 'first_mobile' : (index == 2 ? 'second_mobile' : 'third_mobile'), '');
  }

 }

  getRcvFromDtls(_ev) {
    if (this.__financialForm.get('temp_tin_id').value != '') {
      this.populateRCVforDtls();
    }
    else {
      //pod marao
    }

  }
  getBankMaster() {
    this.__dbIntr.api_call(0, '/depositbank', null).pipe(map((x: responseDT) => x.data)).subscribe((res: bank[]) => {
      this.__bankMst = res;
    })
  }
  setFormControl(formcontrlname, __val) {
    this.__financialForm.get(formcontrlname).patchValue(__val);
  }
  setValidators(__formCtrl, __type) {
    __formCtrl.forEach(element => {
      if (__type == 'A') {
        this.__financialForm.get(element).setValidators(Validators.required);
      }
      else {
        this.__financialForm.get(element).clearValidators();
      }
      this.__financialForm.get(element).updateValueAndValidity();
      this.__financialForm.get(element).reset('', { olySelf: true, emitEvent: false });
    });
  }
  callSchememaster(_cat, _subcat) {
    if (_cat && _subcat) {  
      this.getSchemeMaster(this.__financialForm.get('trans_catg').value, this.__financialForm.get('trans_subcatg').value);
    }

  }
  getFIle(__ev) {
    this.__financialForm.get('file').setValidators(
      this.data.id ? 
      [fileValidators.fileExtensionValidator(this.allowedExtensions), fileValidators.fileSizeValidator(__ev.files)] 
      :[Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions), fileValidators.fileSizeValidator(__ev.files)]
      );
    this.__financialForm.get('file').updateValueAndValidity();
    if (this.__financialForm.get('file').status == 'VALID' && __ev.files.length > 0) {
      const reader = new FileReader();
      reader.onload = e => this.setFormControl('filePreview', reader.result);
      reader.readAsDataURL(__ev.files[0]);
      this.setFormControl('app_form_scan', __ev.files[0]);
    }
    else {
      this.setFormControl('filePreview', '');
      this.setFormControl('app_form_scan', '');
    }
    console.log(this.__financialForm.get('app_form_scan'));
  }
  populateRCVforDtls() {
    this.__dbIntr.api_call(0, '/formreceived', 
    "temp_tin_id=" + this.__financialForm.get('temp_tin_id').value.toString().toUpperCase() + 
    '&trans_type_id=' + (this.data.trans_type == 'F' ? 1 : (this.data.trans_type == 'N' ? 3 : 4)) +
    '&flag=' + (this.data.id ? 'U' : 'C')
    ).subscribe((res: responseDT) => {
      if (res.suc == 1 && res.data.length > 0) {
        this.setFormControl('trans_type', res.data[0]?.trans_id);
        this.setFormControl('arn_no', res.data[0]?.arn_no);
        this.setFormControl('bu_type', res.data[0]?.bu_type == 'D' ? 'B2C Direct' : res.data[0]?.bu_type == 'I' ? 'B2c - Indirct' : 'B2B');
        this.setFormControl('euin_from', res.data[0]?.euin_from_name + ' (' + res.data[0]?.euin_from + ')');
        this.setFormControl('euin_to', res.data[0]?.euin_to_name + ' (' + res.data[0]?.euin_to + ')');
        this.setFormControl('frm_rec_dateTime', res.data[0]?.rec_datetime);
        this.setFormControl('sub_arn_no', res.data[0]?.sub_arn_no);
        this.setFormControl('sub_brk_cd', res.data[0]?.sub_bro_name ? res.data[0]?.sub_bro_name + ' (' + res.data[0]?.sub_brk_cd + ')' : '');
      }
      else {
        this.__utility.showSnackbar('Either Temporary TIN Number does not exist or does not support for this transaction', 0)
        this.setFormControl('arn_no', '');
        this.setFormControl('bu_type', '');
        this.setFormControl('euin_from', '');
        this.setFormControl('euin_to', '');
        this.setFormControl('frm_rec_dateTime', '');
        this.setFormControl('sub_arn_no', '');
        this.setFormControl('sub_brk_cd', '');
        this.setFormControl('trans_type', '');
      }
    })
  }
}
