import { Component, OnInit ,Inject} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, pluck } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { environment } from 'src/environments/environment';
import relation from '../../../../assets/json/Master/relationShip.json';
import { global } from 'src/app/__Utility/globalFunc';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-previewdtls-dialog',
  templateUrl: './previewdtls-dialog.component.html',
  styleUrls: ['./previewdtls-dialog.component.css']
})
export class PreviewdtlsDialogComponent implements OnInit {

  isEditable: boolean = false;
  __relation = relation;
  __docTypeMaster:docType[] =[];
  __noImg: string = '../../../../../../assets/images/noimg.png';
   __frmDtls =new FormGroup({
       client_code: new FormControl(''),
       client_name: new FormControl(''),
       dob: new FormControl(''),
       dob_actual: new FormControl(''),
       pan: new FormControl(''),
       mobile: new FormControl(''),
       sec_mobile: new FormControl(''),
       email: new FormControl(''),
       sec_email: new FormControl(''),
       add_line_1: new FormControl(''),
       add_line_2: new FormControl(''),
       anniversary_date: new FormControl(''),
       state: new FormControl(''),
       dist: new FormControl(''),
       city: new FormControl(''),
       pincode: new FormControl(''),
       amc: new FormControl(''),
       rnt: new FormControl(''),
       cat: new FormControl(''),
       sub_cat: new FormControl(''),
       doc_dtls: new FormArray([]),
       client_type:new FormControl(''),
       client_type_name: new FormControl(''),
       client_type_id: new FormControl(''),
       gurdians_pan: new FormControl(''),
       gurdians_name: new FormControl(''),
       relations: new FormControl(''),
       mar_status: new FormControl(''),
       /** New Form Control */
        proprietor_name: new FormControl(''),
        date_of_incorporation: new FormControl(''),
        karta_name: new FormControl(''),
        inc_date: new FormControl(''),
        pertner_dtls: new FormArray([]),
        identification_number: new FormControl(),
        country: new FormControl(),
        pertner_details: new FormArray([]),
       /** END */

       /** Form Control Form Bank */
       bank_name: new FormControl(
        {value: (this.data.flag == 'B'
        || this.data.flag == 'NB'
        || this.data.flag == 'OB') ? this.data.dt.bank_name : '',disabled:!this.isEditable},
        [Validators.required]),
       ifs_code:new FormControl(
        {value: (this.data.flag == 'B'
        || this.data.flag == 'NB'
        || this.data.flag == 'OB') ? this.data.dt.ifs_code : '',
        disabled:!this.isEditable},
        [Validators.required]),
       micr_code: new FormControl(
        {value:(this.data.flag == 'B' || this.data.flag == 'NB' || this.data.flag == 'OB')
        ? this.data.dt.micr_code : '',disabled:!this.isEditable},
        [Validators.required]),
       branch_name:new FormControl(
        {value:(this.data.flag == 'B' || this.data.flag == 'NB' || this.data.flag == 'OB')
        ? this.data.dt.branch_name : '',disabled:!this.isEditable},
        [Validators.required]),
       branch_addr: new FormControl(
        {value:(this.data.flag == 'B' || this.data.flag == 'NB' || this.data.flag == 'OB')
        ? this.data.dt.branch_addr : '',disabled:!this.isEditable},
        [Validators.required]),
        bank_id:new FormControl((this.data.flag == 'B' || this.data.flag == 'NB' || this.data.flag == 'OB') ? this.data.dt.id : '')
       /** End */

   })
  constructor(
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<PreviewdtlsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit() {
     console.log(this.data);
    if(this.data.flag == 'S' || this.data.flag == 'ST' || this.data.flag == 'NST'){
     this.getscmDtls();
    }
    if(this.data.flag == 'C'|| this.data.flag == 'ESC' || this.data.flag == 'NTC' || this.data.flag == 'NSC' || this.data.flag == 'ETC' || this.data.flag == 'C1' || this.data.flag == 'FC' || this.data.flag == 'TC'){
      this.getDocumnetTypeMaster();
      this.__dbIntr.api_call(0,'/client','client_id='+this.data.dt.id).pipe(pluck("data")).subscribe(res =>{
            console.log(res);
            this.__frmDtls.patchValue({
              client_code:res[0].client_code,
              client_name:res[0].client_name,
              dob:res[0].dob,
              pan:res[0].pan,
              mobile:res[0].mobile,
              sec_mobile:res[0].sec_mobile,
              email:res[0].email,
              sec_email:res[0].sec_email,
              add_line_1:res[0].add_line_1 == 'null' ? '' : res[0].add_line_1,
              add_line_2:res[0].add_line_2  == 'null' ? '' :  res[0].add_line_2,
              country: res[0].country_name,
              state:res[0].state_name,
              dist:res[0].district_name,
              anniversary_date:res[0].anniversary_date,
              dob_actual:res[0].dob_actual,
              city:res[0].city_name,
              pincode:res[0].pincode_name,
              client_type: res[0].client_type == 'P' ? 'Pan Holder' : res[0].client_type == 'N' ? 'Non Pan Holder' : 'Minor',
              client_type_name:res[0].client_type_name,
              client_type_id: res[0].client_type_mode,
              gurdians_pan:res[0].guardians_pan ,
              gurdians_name:res[0].guardians_name ,
              relations:res[0].relation,
              proprietor_name:res[0].proprietor_name,
              date_of_incorporation:res[0].date_of_incorporation,
              karta_name: res[0].karta_name,
              inc_date:res[0].inc_date,
              identification_number: res[0].identification_number,
              mar_status: res[0].mar_status
            });
            res[0].client_doc.forEach(element =>{
                this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name, element.client_id));
            })
            res[0].pertner_details.forEach(element =>{
                   this.pertner_dtls.push(this.setPertner(element));
            })
        })
    }
  }
  get __docs(): FormArray {
    return this.__frmDtls.get("doc_dtls") as FormArray;
  }
  setItem(id, type_id, doc, cl_id) {
    console.log(doc);
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id),
      doc_name: new FormControl(''),
      file_preview: new FormControl(doc ? `${environment.clientdocUrl}` + cl_id + '/' + doc : this.__noImg),
      file: new FormControl(doc ? `${environment.clientdocUrl}` + cl_id + '/' + doc : this.__noImg)
    });
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
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }

  getExtension(fileName){
    const ext = fileName.split('.');
    return fileName ? ext[ext.length - 1] : ''
  }
  get pertner_dtls(): FormArray{
    return this.__frmDtls.get('pertner_dtls') as FormArray;
  }
  setPertner(pertnerDtls){
    return new FormGroup({
        id:new FormControl(global.getActualVal(pertnerDtls) ? pertnerDtls.id : 0),
        name: new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.name : ''),
        mobile: new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.mobile : ''),
        email:new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.email : ''),
        dob:new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.dob : ''),
        pan:new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.pan : ''),
    })
  }

  makeBankEditableorDisabled(){
    this.isEditable = !this.isEditable;
     if(!this.isEditable){
      this.__frmDtls.get('bank_name').disable();
      this.__frmDtls.get('ifs_code').disable();
      this.__frmDtls.get('micr_code').disable();
      this.__frmDtls.get('branch_name').disable();
      this.__frmDtls.get('branch_addr').disable();
     }
     else{
      this.__frmDtls.get('bank_name').enable();
      this.__frmDtls.get('ifs_code').enable();
      this.__frmDtls.get('micr_code').enable();
      this.__frmDtls.get('branch_name').enable();
      this.__frmDtls.get('branch_addr').enable();
     }
  }
  Update(){
    console.log(this.__frmDtls.value);
     const bank = new FormData();
     bank.append("ifs_code",this.__frmDtls.value.ifs_code);
    bank.append("bank_name",this.__frmDtls.value.bank_name);
    bank.append("id",this.__frmDtls.value.bank_id);
    bank.append("branch_name",this.__frmDtls.value.branch_name);
    bank.append("micr_code",this.__frmDtls.value.micr_code);
    bank.append("branch_addr",this.__frmDtls.value.branch_addr);
    this.__dbIntr.api_call(1, '/depositbankAddEdit', bank).subscribe((res: any) => {
      if (res.suc == 1) {
        // this.reset();
        this.dialogRef.close({id:this.__frmDtls.value.bank_id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.__frmDtls.value.bank_id > 0 ? 'Bank updated successfully' : 'Bank added successfully') : 'Something went wrong! please try again later', res.suc);
      // this.reset();
    })
  }

}
