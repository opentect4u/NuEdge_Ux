import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, pluck } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-dtls',
  templateUrl: './dialog-dtls.component.html',
  styleUrls: ['./dialog-dtls.component.css']
})
export class DialogDtlsComponent implements OnInit {
  __docTypeMaster:docType[] =[];
  __noImg: string = '../../../../../../assets/images/noimg.png';
   __frmDtls =new FormGroup({
       client_code: new FormControl(''),
       client_name: new FormControl(''),
       dob: new FormControl(''),
       pan: new FormControl(''),
       mobile: new FormControl(''),
       sec_mobile: new FormControl(''),
       email: new FormControl(''),
       sec_email: new FormControl(''),
       add_line_1: new FormControl(''),
       add_line_2: new FormControl(''),
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
       gurdians_pan: new FormControl(''),
       gurdians_name: new FormControl(''),
       relations: new FormControl('')
   })
  constructor(
    public dialogRef: MatDialogRef<DialogDtlsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit() {
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
              state:res[0].state_name,
              dist:res[0].district_name,
              city:res[0].city_name,
              pincode:res[0].pincode,
              client_type: res[0].client_type == 'P' ? 'Pan Holder' : res[0].client_type == 'N' ? 'Non Pan Holder' : 'Minor',
              gurdians_pan:res[0].guardians_pan ,
              gurdians_name:res[0].guardians_name ,
              relations:res[0].relation
            });
            res[0].client_doc.forEach(element =>{
                this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name, element.client_id));
            })
        })
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

}
