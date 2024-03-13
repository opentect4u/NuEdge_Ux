import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, delay, map, pluck, skip, tap } from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';
import relation from '../../../../../../../../../../../assets/json/Master/relationShip.json';
import maritialStatus from '../../../../../../../../../../../assets/json/Master/maritialStatus.json';
import CLIENTTYPE from '../../../../../../../../../../../assets/json/Master/clientType.json';
import { Observable, of } from 'rxjs';
import { client } from 'src/app/__Model/__clientMst';
@Component({
  selector: 'app-clModifcation',
  templateUrl: './clModifcation.component.html',
  styleUrls: ['./clModifcation.component.css']
})
export class ClModifcationComponent implements OnInit {

  CL_TYPE = CLIENTTYPE.filter((el) => (el.type != 'E' && el.type != 'MC' && el.type != 'PHWC'));
  countryMst:any =[];
  pincodeMst: any=[];
  MaritialStatus = maritialStatus
  __relation = relation;
  __clTypeMst: any=[];
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
    type: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items?.client_type) : '',[Validators.required]),
    mar_status: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items?.mar_status) : ''),
    anniversary_date: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.anniversary_date) : ''),
    client_name: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.client_name) : '', [Validators.required]),
    dob: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.dob) : ''),
    pan: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.pan) : '',
      {
          validators:[Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
          Validators.minLength(10),
          Validators.maxLength(10)],
          updateOn:'blur'
      },
    ),
    dob_actual: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.dob_actual) : ''),
    // mobile: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.mobile) : '',
    //   this.data?.cl_type == 'E' ? [] : [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]
    // ),
    mobile: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.mobile) : ''),
    same_as_above: new FormControl(this.data.id > 0 ?  (this.data.items.dob == this.data.items.dob_actual) : false),
    // sec_mobile: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.sec_mobile) : '', this.data?.cl_type == 'E' ? [] : [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    sec_mobile: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.sec_mobile) : ''),
    email: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.email) : ''),
    // email: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.email) : '', this.data?.cl_type == 'E' ? [] : [Validators.email]),
    // sec_email: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.sec_email) : '', this.data?.cl_type == 'E' ? [] : [Validators.email]),
    sec_email: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.sec_email) : ''),
    add_line_1: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.add_line_1) : ''),
    add_line_3: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items?.add_line_3) : ''),

    // add_line_1: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.add_line_1) : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    add_line_2: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.add_line_2) : ''),
    // state: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.state) : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    state: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.state) : '',{
      updateOn:'blur'
    }),

    dist: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.dist) : '',{
      updateOn:'blur'
    }),
    city: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.city) : '',{
      updateOn:'blur'
    }),

    // dist: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.dist) : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    // city: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.city) : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    // pincode: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.pincode) : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    id: new FormControl(this.data.id),
    // gurdians_pan: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.guardians_pan) : '', this.data?.cl_type == 'E' ? [] : [Validators.required,
    //   Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
    //   Validators.minLength(10),
    //   Validators.maxLength(10)]),
    gurdians_pan: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.guardians_pan) : ''),
    gurdians_name: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.guardians_name) : ''),
    // gurdians_name: new FormControl(this.data.id > 0 ?  global.getActualVal(this.data.items.guardians_name) : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    // relations: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.relation)  : '', this.data?.cl_type == 'E' ? [] : [Validators.required]),
    relations: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.relation)  : ''),

    doc_dtls: new FormArray([]),
    client_type: new FormControl((this.data?.cl_type == 'P' || this.data?.cl_type == 'M' || this.data?.cl_type == 'N') ?  global.getActualVal(this.data.items?.client_type_mode) : ''),

    // client_type: new FormControl((this.data?.cl_type == 'P' || this.data?.cl_type == 'M' || this.data?.cl_type == 'N') ?  global.getActualVal(this.data.items?.client_type_mode) : '',(this.data?.cl_type == 'P' || this.data?.cl_type == 'M' || this.data?.cl_type == 'N') ? [Validators.required] : []),
    proprietor_name: new FormControl(global.getActualVal(this.data.items?.proprietor_name)),
    date_of_incorporation: new FormControl(global.getActualVal(this.data.items?.date_of_incorporation)),
    karta_name: new FormControl(global.getActualVal(this.data.items?.karta_name)),
    inc_date: new FormControl(global.getActualVal(this.data.items?.inc_date)),
    pertner_dtls: new FormArray([]),
    identification_number: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.identification_number)  : ''),
    // country: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.country_id)  : '',(this.data?.cl_type == 'P' || this.data?.cl_type == 'M' || this.data?.cl_type == 'N') ? [Validators.required] : [])
    country: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.country_id)  : '',
    {
      updateOn:'blur'
    }
    ),
    pincode: new FormControl('')
  })
  constructor(
    private sanitizer: DomSanitizer,
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
    console.log(this.data);
    this.setfrmCtrlValidatior();
    this.getCountryMaster();
    this.getDocumnetTypeMaster();
    if(this.data.id > 0 ){
      this.getDistrict_city();
      if(this.data.items.client_doc.length > 0){
        this.data.items.client_doc.forEach(element => {
            this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name, element.client_id));
         });
      }
      else{
        this.addItem();
      }
      this.getPertnerDtls(this.data.items.pertner_details);
      this.getClientType(this.data?.cl_type);
        this.__clientForm.get('pincode').setValue(this.data.items.pincode);
    }
    else{
      this.addItem();
      if(this.data?.cl_type == 'P' || this.data?.cl_type == 'N' || this.data?.cl_type == 'E')
      this.addPertner();
    }

  }

  getPertnerDtls(pertner_details){
    if(this.data?.cl_type == 'P' || this.data?.cl_type == 'N' || this.data?.cl_type == 'E')
    {
    if(pertner_details.length > 0){
      pertner_details.forEach(element =>{
        this.pertner_dtls.push(this.setPertner(element));
        })
    }
    else{
      this.addPertner();
    }
  }

  }
  getCountryMaster(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck('data')).subscribe(res =>{
      this.countryMst = res;
    })
  }
  getClientType(cl_type:string | null = 'P'){
    console.log(cl_type)
    if(cl_type){
      // this.__dbIntr.api_call(0,'/clientType','flag=' + (this.data?.cl_type == 'M' ? this.data?.cl_type : 'P')).pipe(pluck("data")).subscribe(res =>{
      //   console.log(res);
      // this.__clTypeMst = res;
      // })
        this.__dbIntr.api_call(0,'/clientType',`flag=${cl_type == 'N' ? 'P' : cl_type}`).pipe(pluck("data")).subscribe(res =>{
          console.log(res);
        this.__clTypeMst = res;
        })
    }
    else{
      this.__clTypeMst = []
    }

  }
  getDistrict_city(){
    if(this.data.id > 0 && this.data.client_type != 'E'){

      this.getDistrict(this.data.items.state);
      this.getCity(this.data.items.dist);
      this.getStateMaster(this.data.items.country_id);

      setTimeout(() => {
        this.getPinCode(this.data.items.city);
      }, 500);
    }
  }

  setValidatorsDependOnType = (formControls:{formControlName:string,validators:ValidatorFn[],asyncValidators?:AsyncValidatorFn[]}[],type:string) =>{
        formControls.forEach(element => {
          if(type == 'P' || type == 'N' || type == 'M'){
            if(element.formControlName === 'pan' && (type == 'M' || type == 'N')){
                  this.__clientForm.get(element.formControlName).removeValidators(element.validators);
                  this.__clientForm.get(element.formControlName).clearAsyncValidators();
            }
            else if((element.formControlName === 'gurdians_name' || element.formControlName === 'gurdians_pan' || element.formControlName === 'relations') && type != 'M'){
              this.__clientForm.get(element.formControlName).removeValidators(element.validators);
            }
            else{
              this.__clientForm.get(element.formControlName).setValidators(element.validators)
                if(element.asyncValidators.length > 0){
                  this.__clientForm.get(element.formControlName).setAsyncValidators(element.asyncValidators);
                }
            }
          }
          else{
            this.__clientForm.get(element.formControlName).removeValidators(element.validators);
            if(element.asyncValidators.length > 0){
              this.__clientForm.get(element.formControlName).removeAsyncValidators(element.asyncValidators);
            }
          }
          this.__clientForm.get(element.formControlName).updateValueAndValidity({emitEvent:false});
        });
  }

  ngAfterViewInit() {
  this.__clientForm.get('type').valueChanges.subscribe(res =>{
        this.getClientType(res);

        this.__clientForm.get('client_type').setValue('',{emitEvent:true});
        this.setValidatorsDependOnType(
          [
            {formControlName:'pan',
            validators:[Validators.required,Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
            Validators.minLength(10), Validators.maxLength(10)],
            // asyncValidators:[this.PANValidators()],
            asyncValidators:[],
          },
            {formControlName:'client_type',validators: [Validators.required],asyncValidators:[]},
            {formControlName:'country',validators: [Validators.required],asyncValidators:[]},
            {formControlName:'relations',validators: [Validators.required],asyncValidators:[]},
            {formControlName:'gurdians_name',validators: [Validators.required],asyncValidators:[]},
            {formControlName:'gurdians_pan',validators: [Validators.required,
              Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)],asyncValidators:[]},
            {formControlName:'state',validators:[Validators.required],asyncValidators:[]},
            {formControlName:'dist',validators:[Validators.required],asyncValidators:[]},
            {formControlName:'city',validators:[Validators.required],asyncValidators:[]},
            {formControlName:'pincode',validators:[Validators.required],asyncValidators:[]},
            {formControlName:'add_line_1',validators:[Validators.required],asyncValidators:[]},
            {formControlName:'email',validators:[Validators.email],asyncValidators:[]},
            {formControlName:'sec_email',validators:[Validators.email],asyncValidators:[]},
            {formControlName:'mobile',validators:[Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")],asyncValidators:[]},
            {formControlName:'sec_mobile',validators:[Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")],asyncValidators:[]},
          ],res);
  })

  /** Trigger on Change on Country  */
  this.__clientForm.get('country').valueChanges.subscribe(res =>{
           this.getStateMaster(res);
  })

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

    /** Trigger On Change on City */
    this.__clientForm.get('city').valueChanges.subscribe(res =>{
      if (this.data.client_type == 'E' && this.data.id == 0) {
        //Nothing to deal with
      }
      else {
         this.getPinCode(res);
      }
    })
    /* End */

    this.__clientForm.get('same_as_above').valueChanges.subscribe(res => {
        this.__clientForm.controls['dob_actual'].setValue(res ? this.__clientForm.value.dob : '');
    })

    /** Client Type Change */
    this.__clientForm.get('client_type').valueChanges.subscribe(res =>{
      this.__clientForm.get('proprietor_name').setValidators(res == 7 ? [Validators.required] : null);
      this.__clientForm.get('dob').setValidators((res == 2 || res == 5 || res == 6 || res == 7 || res == 1 || res == 3 || res == 4 || res == 30 || res == 14) ?  [Validators.required] : null);
      // this.__clientForm.get('dob_actual').setValidators(res == 7 ?  [Validators.required] : null);
      this.__clientForm.get('karta_name').setValidators(res == 8 ? [Validators.required] : null);
      this.__clientForm.get('inc_date').setValidators(res == 8 ? [Validators.required] : null);
      // this.__clientForm.get('dob_actual').updateValueAndValidity();
      this.__clientForm.get('mar_status').setValidators((res == 1 || res == 3 || res == 4 || res == 30) ? [Validators.required] : null)
      this.__clientForm.get('dob').updateValueAndValidity();
      this.__clientForm.get('proprietor_name').updateValueAndValidity();
      this.__clientForm.get('inc_date').updateValueAndValidity();
      this.__clientForm.get('karta_name').updateValueAndValidity();
      this.__clientForm.get('identification_number').setValidators((
        res == 10|| res == 11|| res == 12|| res == 13
        || res == 15|| res == 16|| res == 17|| res == 18|| res == 9|| res == 23|| res == 21
        || res == 22|| res == 24|| res == 25|| res == 26|| res == 28|| res == 20|| res == 29
        || res == 30|| res == 27|| res == 19) ? [Validators.required] : null);
      this.__clientForm.get('date_of_incorporation').setValidators((res == 10|| res == 11|| res == 12|| res == 13
        || res == 15|| res == 16|| res == 17|| res == 18|| res == 9|| res == 23|| res == 21
        || res == 22|| res == 24|| res == 25|| res == 26|| res == 28|| res == 20|| res == 29
        || res == 30|| res == 27|| res == 19) ? [Validators.required] : null);
      this.__clientForm.get('date_of_incorporation').updateValueAndValidity();
      this.__clientForm.get('identification_number').updateValueAndValidity();
      this.__clientForm.get('mar_status').updateValueAndValidity();
    })
    /** End */


  }

  get pertner_dtls(): FormArray{
    return this.__clientForm.get('pertner_dtls') as FormArray;
  }
  addPertner(){
    this.pertner_dtls.push(this.setPertner(null));
  }
  setPertner(pertnerDtls){


    return new FormGroup({
        id:new FormControl(global.getActualVal(pertnerDtls) ? pertnerDtls.id : 0),
        name: new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.name : ''),
        mobile: new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.mobile : '',[Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
        email:new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.email : '',[Validators.email]),
        dob:new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.dob : ''),
        pan:new FormControl(global.getActualVal(pertnerDtls) ?  pertnerDtls.pan : '',[Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),

    })

  }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  getStateMaster(country_id) {
    this.__dbIntr.api_call(0, '/states', 'country_id='+ country_id).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__stateMaster = res;
    })
  }
  reset(){
    this.__clientForm.reset();
  }
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
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
    console.log(this.__clientForm);
    // return;
    if (this.__clientForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __client = new FormData();

    if(this.__clientForm.value.type == 'P'){
      __client.append("pan", this.__clientForm.value.pan);
    }
    else if(this.__clientForm.value.type == 'M'){
      __client.append("client_name", this.__clientForm.value.client_name);
      __client.append("relation", this.__clientForm.value.relations ? this.__clientForm.value.relations : '');
      __client.append("guardians_pan", this.__clientForm.value.gurdians_pan ? this.__clientForm.value.gurdians_pan : '');
      __client.append("guardians_name", this.__clientForm.value.gurdians_name ? this.__clientForm.value.gurdians_name : '');
    }
    __client.append("mobile", this.__clientForm.value.mobile);
    __client.append("sec_mobile", this.__clientForm.value.sec_mobile);
    __client.append("email", this.__clientForm.value.email);
    __client.append("sec_email", this.__clientForm.value.sec_email);
    __client.append("add_line_1", this.__clientForm.value.add_line_1);
    __client.append("add_line_2", this.__clientForm.value.add_line_2);
    __client.append("add_line_3", this.__clientForm.value.add_line_3);
    __client.append("city", this.__clientForm.value.city);
    __client.append("dist", this.__clientForm.value.dist);
    __client.append("state", this.__clientForm.value.state);
    __client.append("pincode", this.__clientForm.value.pincode);
    __client.append("country_id", this.__clientForm.value.country);

    __client.append("id", this.__clientForm.value.id);
    // __client.append("client_type", this.data?.cl_type);
    __client.append("client_type", this.__clientForm.value.type);

        if(this.__clientForm.value.type == 'P'  || this.__clientForm.value.type == 'M' ||  this.__clientForm.value.type == 'N'){
          __client.append("client_type_mode", this.__clientForm.value.client_type);
        }
    for (let i = 0; i < this.__clientForm.value.doc_dtls.length; i++) {
      if (typeof (this.__clientForm.value.doc_dtls[i].file) != 'string') {
        __client.append("file[]", this.__clientForm.value.doc_dtls[i].file);
        __client.append("doc_type_id[]", this.__clientForm.value.doc_dtls[i].doc_type_id);
        __client.append("row_id[]", this.__clientForm.value.doc_dtls[i].id);
      }
    }

    if(this.__clientForm.value.client_type == 14){
      /** If Client Type is Pertnership Form */
      __client.append("client_name", this.__clientForm.value.client_name); /** Firm Name */
      __client.append("pertner_details", JSON.stringify(this.__clientForm.value.pertner_dtls));
      __client.append("dob", this.__clientForm.value.dob);
    }
    else if(this.__clientForm.get('client_type').value == 7
    ){
      /** If Client Type is Sole Proprietor */
    __client.append("date_of_incorporation", this.__clientForm.value.date_of_incorporation);
    __client.append("proprietor_name", this.__clientForm.value.proprietor_name); /** Proprietor Name */
    __client.append("client_name", this.__clientForm.value.client_name); /** Proprietor ship Name */
    __client.append("dob", this.__clientForm.value.dob);
    __client.append("dob_actual", this.__clientForm.value.dob_actual);
    __client.append("anniversary_date", this.__clientForm.value.anniversary_date);

    }
    else if(this.__clientForm.get('client_type').value == 10
    || this.__clientForm.get('client_type').value == 11
    || this.__clientForm.get('client_type').value == 12
    || this.__clientForm.get('client_type').value == 13
    || this.__clientForm.get('client_type').value == 15
    || this.__clientForm.get('client_type').value == 16
    || this.__clientForm.get('client_type').value == 17
    || this.__clientForm.get('client_type').value == 18
    || this.__clientForm.get('client_type').value == 9
    || this.__clientForm.get('client_type').value == 23
    || this.__clientForm.get('client_type').value == 21
    || this.__clientForm.get('client_type').value == 22
    || this.__clientForm.get('client_type').value == 24
    || this.__clientForm.get('client_type').value == 25
    || this.__clientForm.get('client_type').value == 26
    || this.__clientForm.get('client_type').value == 28
    || this.__clientForm.get('client_type').value == 20
    || this.__clientForm.get('client_type').value == 29
    || this.__clientForm.get('client_type').value == 27
    || this.__clientForm.get('client_type').value == 19
    ){
    __client.append("client_name", this.__clientForm.value.client_name); /** Establishment Name */
    __client.append("date_of_incorporation", this.__clientForm.value.date_of_incorporation);
    __client.append("identification_number", this.__clientForm.value.identification_number);
    }
    else if(this.__clientForm.get('client_type').value == 8){
      /** IF CLIENT TYPE IS  HUF (8)*/
    __client.append("karta_name", this.__clientForm.value.karta_name);
    __client.append("inc_date", this.__clientForm.value.inc_date);
    __client.append("client_name", this.__clientForm.value.client_name); /** HUF Name */
    __client.append("dob", this.__clientForm.value.dob);
    __client.append("dob_actual", this.__clientForm.value.dob_actual);
    __client.append("anniversary_date", this.__clientForm.value.anniversary_date);
    }
    else if(this.__clientForm.get('client_type').value == 1
    || this.__clientForm.get('client_type').value == 3
    || this.__clientForm.get('client_type').value == 4
    || this.__clientForm.get('client_type').value == 30
    ){
      /** If Cleint Type is NRI(non-repartiable - 4),NRI(Repartiable - 3),Residential Inidividual(1) */
      __client.append("client_name", this.__clientForm.value.client_name);
      __client.append("dob", this.__clientForm.value.dob);
      __client.append("dob_actual", this.__clientForm.value.dob_actual);
      __client.append("anniversary_date", this.__clientForm.value.anniversary_date);
      __client.append("maritial_status", this.__clientForm.value.mar_status);
    }
    else if(this.__clientForm.get('client_type').value == 2
    ||this.__clientForm.get('client_type').value == 5
    ||this.__clientForm.get('client_type').value == 6){
      /** If Cleint Type is NRI-Minor(non-repartiable - 6),NRI-Minor(Repartiable - 5),Residential Minor(2) */
      __client.append("client_name", this.__clientForm.value.client_name);
      __client.append("dob", this.__clientForm.value.dob);
      __client.append("dob_actual", this.__clientForm.value.dob_actual);
    }
    this.__dbIntr.api_call(1, '/clientAddEdit', __client).subscribe((res: any) => {
      if (res.suc == 1) {
          if (this.data.id > 0) {
            this.dialogRef.close({
              id : this.data.id,
              cl_type:res.data.previous_type,
              data:res.data.data
            })
          }
          else {this.dialogRef.close({id:this.data.id,data:res.data.data});}
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Client updated successfully' : 'Client added successfully') : res.msg, res.suc);
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
    this.__dbIntr.api_call(0, '/districts', 'state_id=' + __state_id).pipe(pluck("data")).subscribe(res => {
      this.__district = res;
    })
  }
  getCity(__district_id) {
    this.__dbIntr.api_call(0, '/city', 'district_id=' + __district_id).pipe(pluck("data")).subscribe(res => {
      this.__city = res;
    })
  }
  getPinCode(city_id){
    console.log(city_id);
    this.__dbIntr.api_call(0, '/pincode', 'city_id=' + city_id).pipe(pluck("data")).subscribe(res => {
      this.pincodeMst = res;
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
    console.log(__ev.target.files[0]);

    this.__docs.controls[index].get('doc_name').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.__docs.controls[index].get('doc_name').updateValueAndValidity();
    if (this.__docs.controls[index].get('doc_name').status == 'VALID') {
      // if(__ev.target.files[0].type == 'application/pdf'){
        this.__docs.controls[index].get('file_preview')?.patchValue(this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL( __ev.target.files[0])));
      // }
      // else{
      //  const file = __ev.target.files[0];
      // const reader = new FileReader();
      // reader.onload = e => this.__docs.controls[index].get('file_preview')?.patchValue(reader.result);
      // reader.readAsDataURL(file);
      // }
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
    switch (this.data?.cl_type) {
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
              name: "country",
              validators: [Validators.required]
            }
            ,

            {
              name: "pincode",
              validators: [Validators.required]
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
  deletePertner(index){
    this.pertner_dtls.removeAt(index);

  }


   /**** checkIf Pan Exist or not */
    PANValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
       if(control.value){
          return  this.__dbIntr.api_call(0,'/client',`pan=${control.value}`,true).pipe(
                    map((res: any) =>
                      res?.data?.find(
                        (client: client) => client.pan === control.value
                      ) ? { panExists: true } : null
                      )
                  )
            }
          return null;
          }
    }
}
