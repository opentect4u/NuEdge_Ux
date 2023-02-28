import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-clModifcation',
  templateUrl: './clModifcation.component.html',
  styleUrls: ['./clModifcation.component.css']
})
export class ClModifcationComponent implements OnInit {
  __isVisible:boolean =false;
  _clId: number = 0;
  __district: any = [];
  __city: any = [];
  __docTypeMaster: docType[];
  __noImg: string = '../../../../../../assets/images/noimg.png';
  // allowedExtensions = ['jpg', 'png', 'jpeg'];
  allowedExtensions = ['pdf'];

  __maxDt = dates.disabeldDates();
  __stateMaster: any = [];
  __clientForm = new FormGroup({
    anniversary_date: new FormControl('',this.data.cl_type == 'P' || this.data.cl_type == 'N' ? [Validators.required]:[]),
    client_name: new FormControl(this.data.id > 0 ? this.data.items.client_name : '', [Validators.required]),
    dob: new FormControl(this.data.id > 0 ? this.data.items.dob : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    pan: new FormControl(this.data.id > 0 ? this.data.items.pan : '', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]
    ),
    dob_actual: new FormControl(this.data.id > 0 ? this.data.items.pan : '',this.data.cl_type == 'E' ? [] : [Validators.required]),
    mobile: new FormControl(this.data.id > 0 ? this.data.items.mobile : '',
      this.data.cl_type == 'E' ? [] : [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]
    ),
    same_as_above: new FormControl(''),
    sec_mobile: new FormControl(this.data.id > 0 ? this.data.items.sec_mobile : '', this.data.cl_type == 'E' ? [] : [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    email: new FormControl(this.data.id > 0 ? this.data.items.email : '', this.data.cl_type == 'E' ? [] : [Validators.email]),
    sec_email: new FormControl(this.data.id > 0 ? this.data.items.sec_email : '', this.data.cl_type == 'E' ? [] : [Validators.email]),
    add_line_1: new FormControl(this.data.id > 0 ? this.data.items.add_line_1 : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    add_line_2: new FormControl(this.data.id > 0 ? this.data.items.add_line_2 : ''),
    state: new FormControl(this.data.id > 0 ? this.data.items.state : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    dist: new FormControl(this.data.id > 0 ? this.data.items.dist : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    city: new FormControl(this.data.id > 0 ? this.data.items.city : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    pincode: new FormControl(this.data.id > 0 ? this.data.items.pincode : '', this.data.cl_type == 'E' ? [] : [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    id: new FormControl(this.data.id),
    gurdians_pan: new FormControl(this.data.id > 0 ? this.data.items.gurdians_pan : '', this.data.cl_type == 'E' ? [] : [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    gurdians_name: new FormControl(this.data.id > 0 ? this.data.items.gurdians_name : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    relations: new FormControl(this.data.id > 0 ? this.data.items.relations : '', this.data.cl_type == 'E' ? [] : [Validators.required]),
    doc_dtls: new FormArray([])
  })
  constructor(
    public dialogRef: MatDialogRef<ClModifcationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.setfrmCtrlValidatior();
    this.getStateMaster();
    this.getDocumnetTypeMaster();
    if(this.data.id > 0 ){
      this.getDistrict_city();
      console.log(this.data.items);

      if(this.data.items.client_doc.length > 0){
        this.data.items.client_doc.forEach(element => {
            this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name, element.client_id));
         });
      }
      else{
        this.addItem();
      }
    }
    else{
      this.addItem();
    }

  }

  getDistrict_city(){
    if(this.data.id > 0 && this.data.client_type != 'E'){
      this.getDistrict(this.data.items.state);
      this.getCity(this.data.items.dist);
    }
  }

  ngAfterViewInit() {
    /** Trigger on Change on State */
    this.__clientForm.get('state').valueChanges.subscribe(res => {
      console.log(res);
      if (this.data.client_type == 'E' && this.data.id == 0) {
        //Nothing to deal with
      }
      else {
        this.getDistrict(res);
      }
    })
    /**End */
    /** Trigger on Change on District */
    this.__clientForm.get('dist').valueChanges.subscribe(res => {
      if (this.data.client_type == 'E' && this.data.id == 0) {
        //Nothing to deal with
      }
      else {
        this.getCity(res);
      }
    })
    /**End */
    this.__clientForm.get('same_as_above').valueChanges.subscribe(res => {
        this.__clientForm.controls['dob_actual'].setValue(res ? this.__clientForm.value.dob : '');
    })


  }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  getStateMaster() {
    this.__dbIntr.api_call(0, '/states', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__stateMaster = res;
    })
  }
  reset(){
    this.__clientForm.reset();
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("100%");
    this.__isVisible = !this.__isVisible;
  }
  submit(){
    console.log(this.__clientForm.value);

    if (this.__clientForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __client = new FormData();
    __client.append("dob_actual", this.__clientForm.value.dob_actual);
    __client.append("anniversary_date", this.__clientForm.value.anniversary_date);
    __client.append("client_name", this.__clientForm.value.client_name);
    __client.append("dob", this.__clientForm.value.dob);
    __client.append("pan", this.__clientForm.value.pan);
    __client.append("mobile", this.__clientForm.value.mobile);
    __client.append("sec_mobile", this.__clientForm.value.sec_mobile);
    __client.append("email", this.__clientForm.value.email);
    __client.append("sec_email", this.__clientForm.value.sec_email);
    __client.append("add_line_1", this.__clientForm.value.add_line_1);
    __client.append("add_line_2", this.__clientForm.value.add_line_2);
    __client.append("city", this.__clientForm.value.city);
    __client.append("dist", this.__clientForm.value.dist);
    __client.append("state", this.__clientForm.value.state);
    __client.append("pincode", this.__clientForm.value.pincode);
    __client.append("guardians_pan", this.__clientForm.value.gurdians_pan ? this.__clientForm.value.gurdians_pan : '');
    __client.append("guardians_name", this.__clientForm.value.gurdians_name ? this.__clientForm.value.gurdians_name : '');
    __client.append("relation", this.__clientForm.value.relations ? this.__clientForm.value.relations : '');
    __client.append("id", this.__clientForm.value.id);
    __client.append("client_type", this.data.cl_type);

    for (let i = 0; i < this.__clientForm.value.doc_dtls.length; i++) {
      if (typeof (this.__clientForm.value.doc_dtls[i].file) != 'string') {
        __client.append("file[]", this.__clientForm.value.doc_dtls[i].file);
        __client.append("doc_type_id[]", this.__clientForm.value.doc_dtls[i].doc_type_id);
        __client.append("row_id[]", this.__clientForm.value.doc_dtls[i].id);
      }
    }
    this.__dbIntr.api_call(1, '/clientAddEdit', __client).subscribe((res: any) => {
      if (res.suc == 1) {
          if (this.data.cl_type == 'E' && this.data.id > 0) {this.dialogRef.close({id : this.data.id,cl_type:this.data.cl_type});}
          else {this.dialogRef.close({id:this.data.id,data:res.data});}
          this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Client updated successfully' : 'Client added successfully') : 'Something went wrong! please try again later', res.suc);
      }
    })
  }
  checkPanExistornot(_pan){
    if(_pan.target.value != ''){
      this.__dbIntr.api_call(0,'/client','pan='+_pan.target.value).subscribe((res: responseDT) =>{
        if(res.data.length > 0){this.__utility.showSnackbar('Pan Number already exist! please try with another one',0);}
      })
    }
  }
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }
  getDistrict(__state_id) {
    this.__dbIntr.api_call(0, '/districts', 'state_id=' + __state_id).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__district = res;
    })
  }
  getCity(__district_id) {
    this.__dbIntr.api_call(0, '/city', 'district_id=' + __district_id).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__city = res;
    })
  }
  addItem(): void {
    this.__docs.push(this.createItem());
    // if (this.__docs.length > 1) {
    //   setTimeout(() => {
    //     this.__scroll.nativeElement.scroll({
    //       top: this.__scroll.nativeElement.scrollHeight,
    //       left: 0,
    //       behaviour: 'smooth'
    //     });
    //   }, 50);
    // }
  }
  createItem(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      doc_type_id: new FormControl('', []),
      doc_name: new FormControl('', [fileValidators.fileExtensionValidator(this.allowedExtensions)]),
      file_preview: new FormControl(''),
      file: new FormControl('')
    });
  }
  removeDocument(__index) {
    this.__docs.removeAt(__index);
  }
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  setItem(id, type_id, doc, cl_id) {
    console.log(doc);
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id, [Validators.required]),
      doc_name: new FormControl(''),
      file_preview: new FormControl(doc ? `${environment.clientdocUrl}` + cl_id + '/' + doc : this.__noImg),
      file: new FormControl(doc ? `${environment.clientdocUrl}` + cl_id + '/' + doc : this.__noImg)
    });
  }
  getFiles(__ev, index, __type_id) {
    this.__docs.controls[index].get('doc_name').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.__docs.controls[index].get('doc_name').updateValueAndValidity();
    if (this.__docs.controls[index].get('doc_name').status == 'VALID') {
      const file = __ev.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.__docs.controls[index].get('file_preview')?.patchValue(reader.result);
      reader.readAsDataURL(file);
      this.__docs.controls[index].get('file')?.patchValue(__ev.target.files[0]);
    }
    else {
      this.setFileValue(index)
    }
  }
  setFileValue(index) {
    this.__docs.controls[index].get('file_preview')?.reset();
    this.__docs.controls[index].get('file')?.reset();
  }
  setfrmCtrlValidatior() {
    switch (this.data.cl_type) {
      case 'M': this.removeValidators(['pan']); break;
      case 'N': this.removeValidators(['pan', 'gurdians_pan', 'gurdians_name', 'relations']); break;
      case 'P': this.removeValidators(['gurdians_pan', 'gurdians_name', 'relations']); break;
      case 'E': if (this.data.id > 0) {
        this.setValidators(
          [
            {
              name: "email",
              validators: [Validators.required, Validators.email]
            },
            {
              name: "add_line_1",
              validators: [Validators.required]
            },
            {
              name: "dist",
              validators: [Validators.required]
            }
            ,
            {
              name: "state",
              validators: [Validators.required]
            }
            ,
            {
              name: "city",
              validators: [Validators.required]
            }
            ,

            {
              name: "pincode",
              validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
            },
            {
              name: "dob",
              validators: [Validators.required]
            },
            {
              name: "mobile",
              validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]
            }
          ]);
      }
        break;
      default: break;
    }
  }
  setValidators(__frmCtrl) {
    __frmCtrl.forEach(element => {
      console.log(element);

      this.__clientForm.get(element.name).setValidators(element.validators);
      this.__clientForm.get(element.name).updateValueAndValidity();
    });
    console.log(this.__clientForm.status);

  }
  removeValidators(__frmCtrl) {
    __frmCtrl.forEach(element => {
      this.__clientForm.get(element).clearValidators();
      this.__clientForm.get(element).updateValueAndValidity();
    });
  }

}
