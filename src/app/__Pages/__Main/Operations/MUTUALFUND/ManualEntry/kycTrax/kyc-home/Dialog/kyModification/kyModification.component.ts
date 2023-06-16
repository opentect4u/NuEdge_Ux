import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { environment } from 'src/environments/environment';
import kycfresh from '../../../../../../../../../../assets/json/kycFresh.json';
import kycModification from '../../../../../../../../../../assets/json/kycModificatiotype.json';
import kycLoginType from '../../../../../../../../../../assets/json/kycloginType.json';
import kycLoginAt from '../../../../../../../../../../assets/json/kycLoginAt.json';
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';
import { docType } from 'src/app/__Model/__docTypeMst';
import buisnessType from '../../../../../../../../../../assets/json/buisnessType.json';
import { Overlay } from '@angular/cdk/overlay';
// import { DialogfrclientComponent } from '../dialogForClient/dialogFrClient.component';
// import { DialogfrclientviewComponent } from '../dialogFrClientView/dialogFrClientView.component';
import { amc } from 'src/app/__Model/amc';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
import clTypeMst from '../../../../../../../../../../assets/json/clientTypeMenu.json';
import { Observable, of } from 'rxjs';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'kyc-kyModification',
  templateUrl: './kyModification.component.html',
  styleUrls: ['./kyModification.component.css']
})
export class KyModificationComponent implements OnInit {


  displayMode_forClient: string;
  displayMode_forEuin: string;
  displayMode_forSubArnNo:string;
  __kycfresh_mod: any=[];
  allowedExtensions = ['pdf'];
  __subbrkArnMst: any=[];
  __clientMst: client[] =[];
  __euinMst: any=[];
  __amcMst: amc[]= [];
  __isVisible:boolean = false;
  __buisness_type: any = buisnessType;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;

  __dialogDtForClient: any;
  __isCldtlsEmpty: boolean = false;
  __isclientVisible: boolean = false;
  __isEuinVisible: boolean = false;
  __issubBrkArnVisible: boolean = false;

  __clTypeMaster = clTypeMst;
  __kycLoginAt: any = [];
  __kycLoginType = kycLoginType;
  __kycType: any=[];
  __noImg: string = '../../../../../../assets/images/noimg.jpg';
  __isvisible: boolean = false;
  __selectFiles: any = [];
  __clMaster: client[];
  __docTypeMaster: docType[];
  __clientForm = new FormGroup({
    bu_type: new FormControl('',[Validators.required]),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    euin_no: new FormControl('', {
      validators:[Validators.required],
      asyncValidators:[this.EUINValidators()]
    }),
    client_id: new FormControl('', [Validators.required]),
    client_code: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }),
    // amc_id: new FormControl(''),
    // pan_no: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    // _client_code: new FormControl('', [Validators.required]),
    // _pan_no: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    // mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    client_name: new FormControl('', [Validators.required]),
    // email: new FormControl('', [Validators.required, Validators.email]),
    // doc_dtls: new FormArray([]),

    // temp_tin_id: new FormControl('', [Validators.required]),
    kyc_type: new FormControl('', [Validators.required]),
    kyc_login_type: new FormControl('', [Validators.required]),
    kyc_login_at: new FormControl('', [Validators.required]),
    remarks: new FormControl(''),
    scaned_form: new FormControl('',[Validators.required,fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    scaned_file: new FormControl(''),
    preview_scaned_file: new FormControl(''),
    kyc_fresh_modification: new FormControl('',[Validators.required]),

  })
  constructor(
    public dialogRef: MatDialogRef<KyModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay,
    private sanitizer: DomSanitizer
  ) {
    // this.getDocumnetTypeMaster();
  }

  ngOnInit() {
    console.log(this.data);

    if (this.data.items != '') {
      this.setKycFreshModificationTypeMst(this.data.kyc_data.kyc_type.toString());
      this.__euinMst.push({euin_no:this.data.kyc_data.euin_no,emp_name:this.data.kyc_data.emp_name})
      this.__clientMst.push({client_name:this.data.items.client_name,id:this.data.items.id,client_code: this.data.items.client_code});
      this.__clientForm.patchValue({
        bu_type:this.data.kyc_data.bu_type,
        kyc_type: this.data.kyc_data.kyc_type,
        kyc_login_type: this.data.kyc_data.kyc_login_type,
        kyc_login_at: this.data.kyc_data.kyc_login_at,
        remarks:this.data.kyc_data.remarks,
        kyc_fresh_modification:this.data.kyc_data.present_kyc_status,
        scaned_file: this.data.kyc_data.scaned_form ? `${environment.kyc_formUrl + this.data.kyc_data.scaned_form}` : '',
        preview_scaned_file: this.data.kyc_data.scaned_form ? `${environment.kyc_formUrl + this.data.kyc_data.scaned_form}` : ''
      })

      setTimeout(() => {

        this.getItems({euin_no:this.data.kyc_data.euin_no,emp_name:this.data.kyc_data.emp_name},'E');
        this.getItems({client_name:this.data.items.client_name,id:this.data.items.id,client_code: this.data.items.client_code},'C');
        if(this.data.kyc_data.bu_type == 'B'){
          this.__subbrkArnMst.push({arn_no:this.data.kyc_data.sub_arn_no,code:this.data.kyc_data.sub_brk_cd})
           this.getItems({arn_no:this.data.kyc_data.sub_arn_no,code:this.data.kyc_data.sub_brk_cd},'S');
        }
      }, 200);
       if(this.data.mode == 'V'){
        this.__clientForm.get('bu_type').disable();
        this.__clientForm.get('euin_no').disable();
        this.__clientForm.get('sub_brk_cd').disable();
        this.__clientForm.get('sub_arn_no').disable();
        this.__clientForm.get('client_name').disable();
        this.__clientForm.get('client_code').disable();
        this.__clientForm.get('remarks').disable();
        this.__clientForm.get('kyc_login_at').disable();
        this.__clientForm.get('kyc_login_type').disable();
        this.__clientForm.get('kyc_type').disable();
        this.__clientForm.get('kyc_fresh_modification').disable();
        this.__clientForm.get('scaned_form').disable();

       }
      this.__clientForm.controls['scaned_form'].setValidators(this.data.kyc_data.scaned_form ?
        [] :
        [Validators.required,fileValidators.fileExtensionValidator(this.allowedExtensions)]);
      this.getKycLoginAtMaster(this.data.kyc_data.kyc_login_type);
    }
    else{
      this.getKycLoginAtMaster('R');
    }
    this.getKycType();
  }
  getKycType(){
    this.__dbIntr.api_call(0,'/showTrans','trans_type_id=2').pipe(pluck("data")).subscribe(res =>{
      console.log(res);

      this.__kycType = res;
    })
  }
  ngAfterViewInit() {

  //  this.__clientForm.controls['kyc_login_at'].valueChanges.subscribe(res =>{
  //   console.log(res);

  //   if(res == '3'){
  //      this.getKycLoginAtMaster('A');
  //      this.__clientForm.controls['amc_id'].setValidators([Validators.required]);
  //   }
  //   else{
  //     this.__clientForm.controls['amc_id'].removeValidators([Validators.required]);
  //   }
  //  })

  // EUIN NUMBER SEARCH
  this.__clientForm.controls['euin_no'].valueChanges.
  pipe(
    tap(()=> this.__isEuinVisible = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/employee', dt + (this.__clientForm.controls['sub_arn_no'].value ? '&sub_arn_no=' + this.__clientForm.controls['sub_arn_no'].value.split(' ')[0] : ''))
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      console.log(value);
      this.__euinMst = value
      this.searchResultVisibility('block');
      this.__isEuinVisible = false;
    },
    complete: () => this.__isEuinVisible = false,
    error: (err) => this.__isEuinVisible = false
  })

  //SUB BROKER ARN SEARCH
  this.__clientForm.controls['sub_arn_no'].valueChanges.
  pipe(
    tap(()=> this.__issubBrkArnVisible = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/showsubbroker', dt)
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      console.log(value);
      this.__subbrkArnMst = value
      this.searchResultVisibilityForSubBrkArn('block');
      this.__issubBrkArnVisible = false;
    },
    complete: () =>this.__issubBrkArnVisible = false,
    error: (err) => this.__issubBrkArnVisible = false

  })
 //Client Code Search
 this.__clientForm.controls['client_code'].valueChanges
 .pipe(
   tap(() => this.__isclientVisible = true),
   debounceTime(200),
   distinctUntilChanged(),
   switchMap((dt) =>
     dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
   ),
   map((x: any) => x.data),
 )
 .subscribe({
   next: (value) => {
     this.__clientMst = value.data;
     this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
     this.searchResultVisibilityForClient('block');
     this.__clientForm.patchValue({
       client_id: '',
       client_name: '',
     });
   this.__isclientVisible = false;
   },
   complete: () => console.log(''),
   error: (err) => console.log(),
 });

 //On Change on buisness type
 this.__clientForm.controls["bu_type"].valueChanges.subscribe(res => {
  if(res == 'B'){
    this.__clientForm.controls['sub_arn_no'].setValidators([Validators.required]);
    this.__clientForm.controls['sub_brk_cd'].setValidators([Validators.required]);
    this.__clientForm.controls['sub_arn_no'].setAsyncValidators([this.SubBrokerValidators()]);

  }
  else{
    this.__clientForm.controls['sub_arn_no'].removeValidators([Validators.required]);
    this.__clientForm.controls['sub_brk_cd'].removeValidators([Validators.required]);
    this.__clientForm.controls['sub_arn_no'].removeAsyncValidators([this.SubBrokerValidators()]);
  }
  this.__clientForm.controls['sub_arn_no'].reset('',{ onlySelf: true, emitEvent: false });
  this.__clientForm.controls['euin_no'].reset('',{ onlySelf: true, emitEvent: false });
  this.__clientForm.controls['sub_brk_cd'].reset('',{ onlySelf: true, emitEvent: false });
})



    this.__clientForm.get('kyc_login_type').valueChanges.subscribe(res => {
      switch (res) {
        case 'N':
        case 'R':
        this.getKycLoginAtMaster(res); break;
        case 'A':
        this.getKycLoginAtMaster(res); break;
        // case 'N':
        // // this.__kycLoginAt = kycLoginAt;
        // // console.log(this.__kycLoginAt);
        //  break;
        default: break;
      }
    })

    this.__clientForm.controls['kyc_type'].valueChanges.subscribe(res =>{
     this.setKycFreshModificationTypeMst(res);
    })
  }

   setKycFreshModificationTypeMst(res){
    // console.log(res);

    switch(res){
      case '13': this.__kycfresh_mod = kycfresh;break;
      case '12': this.__kycfresh_mod = kycModification;break;
      default:
      this.__kycfresh_mod = [];break;
    }
   }
  // getfreshOrModificationTypeMst()

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
      __kyc.append("euin_no",this.__clientForm.value.euin_no.split(' ')[0]);
      __kyc.append("sub_arn_no",this.__clientForm.value.sub_arn_no ? this.__clientForm.value.sub_arn_no.split(' ')[0] : '');
      __kyc.append("sub_brk_cd",this.__clientForm.value.sub_brk_cd ? this.__clientForm.value.sub_brk_cd : '');
    __kyc.append("client_id",this.__clientForm.value.client_id);
    __kyc.append("client_code",this.__clientForm.value.client_code);
    // __kyc.append("pan_no",this.__clientForm.value.pan_no);
    // __kyc.append("_client_code",this.__clientForm.value._client_code);
    // __kyc.append("_pan_no",this.__clientForm.value._pan_no);
    // __kyc.append("mobile",this.__clientForm.value.mobile);
    __kyc.append("client_name",this.__clientForm.value.client_name);
    // __kyc.append("email",this.__clientForm.value.email);
    // __kyc.append("doc_dtls",this.__clientForm.value.doc_dtls);
    // __kyc.append("temp_tin_id",this.__clientForm.value.temp_tin_id);
    __kyc.append("kyc_type",this.__clientForm.value.kyc_type);
    __kyc.append("kyc_login_type",this.__clientForm.value.kyc_login_type);
    __kyc.append("kyc_login_at",this.__clientForm.value.kyc_login_at);
    // __kyc.append("amc_id",this.__clientForm.value.amc_id);
    __kyc.append("bu_type",this.__clientForm.value.bu_type);
    __kyc.append("remarks",this.__clientForm.value.remarks);
    __kyc.append("scaned_form",this.__clientForm.value.scaned_file);
      __kyc.append("present_kyc_status",this.__clientForm.value.kyc_fresh_modification);

    // if(this.__clientForm.value.kyc_type == '13'){
    //   __kyc.append("fresh_type",this.__clientForm.value.kyc_fresh_modification);
    // }
    // else{
    //   __kyc.append("modification_type",this.__clientForm.value.kyc_fresh_modification);
    // }
    this.__dbIntr.api_call(1, '/kycAddEdit', __kyc).subscribe((res: any) => {
      if (res == 1) {
        this.dialogRef.close(res.suc);
      }
      this.__utility.showSnackbar(res.suc == 1 ? 'Kyc submitted Successfully' : res.msg, res.suc);
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
    this.__dbIntr.api_call(0, kyc_login_type == 'A' ? '/amc' : '/rnt', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.setKycLoginAtAccordingToKycLogin(kyc_login_type,res)
    })
  }
  setKycLoginAtAccordingToKycLogin(kyc_login_type,res){
      if(res.length > 0){
         switch(kyc_login_type){
          case 'R' : this.__kycLoginAt = res.filter(x => ([1,2]).includes(x.id));
          break;
          case 'A' : this.__kycLoginAt = res;
          break;
          default:this.__kycLoginAt = res.filter(x => x.id >= 39);
          break;
         }
      }
      else{
       this.__kycLoginAt = res;
      }
  }

  setFormControl(res) {
    this.__isvisible = true;
    res.client_doc.forEach(element => {
      this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name));
    })
  }

  //first client Search Resullt off
  searchResultVisibilityForClient(display_mode) {
    // this.__clientCode.nativeElement.style.display = display_mode;
    this.displayMode_forClient = display_mode
  }
  searchResultVisibilityForSubBrkArn(display_mode){
    // this.__subBrkArn.nativeElement.style.display = display_mode;
    this.displayMode_forSubArnNo =display_mode
  }
  searchResultVisibility(display_mode){
    // this.__searchRlt.nativeElement.style.display = display_mode;
    this.displayMode_forEuin = display_mode;
  }
  getItems(__items,mode){
    console.log(__items);

    switch(mode){
      case 'S':this.__clientForm.controls['sub_arn_no'].reset(__items.arn_no,{ onlySelf: true, emitEvent: false });
               this.__clientForm.controls['sub_brk_cd'].setValue(__items.code);
               this.searchResultVisibilityForSubBrkArn('none');
               break;
      case 'E':this.__clientForm.controls['euin_no'].reset(__items.euin_no+' - '+__items.emp_name,{ onlySelf: true, emitEvent: false });
               this.searchResultVisibility('none');
               break;
      case 'C':this.__dialogDtForClient = __items;
        this.__clientForm.controls['client_code'].reset(__items.client_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.__clientForm.patchValue({
          client_name: __items.client_name,
          client_id: __items.id,
        });
        this.searchResultVisibilityForClient('none');
        break;
      default: break;
    }
  }
  openDialogForclientcreation(__menu,__mode){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = {
      flag: 'CL',
      id: 0,
      items: null,
      title:
        'Create ' +
        (__menu.flag == 'M'
          ? 'Minor'
          : __menu.flag == 'P'
            ? 'PAN Holder'
            : __menu.flag == 'N'
              ? 'Non Pan Holder'
              : 'Existing'),
      cl_type: __menu.flag,
    };
    try {
      // const dialogref = this.__dialog.open(
      //   DialogfrclientComponent,
      //   dialogConfig
      // );

      const dialogref = this.__dialog.open(
        CreateClientComponent,
        dialogConfig
      );

      dialogref.afterClosed().subscribe((dt) => {
        console.log(dt);
        if (dt) {
          switch (__mode) {
            case 'F':
              this.__isCldtlsEmpty = false;
              this.getItems(dt.data, 'C');
              break;
            default:
              break;
          }
        }
      });
    } catch (ex) { }
  }
  openDialog(__type){
    console.log(this.__dialogDtForClient);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = __type == 'C' ? '100%' : '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: __type,
      title:this.__dialogDtForClient.client_name,
      dt:this.__dialogDtForClient
    };
    try {
      // const dialogref = this.__dialog.open(
      //   DialogfrclientviewComponent,
      //   dialogConfig
      // );
      const dialogref = this.__dialog.open(
        PreviewdtlsDialogComponent,
        dialogConfig
      );
    } catch (ex) { }

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
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  getFile(__ev){
    if(this.__clientForm.controls['scaned_form'].status == 'VALID' && __ev.target.files.length > 0){
      this.__clientForm.controls['scaned_file'].patchValue(__ev.target.files[0]);
      const file = __ev.target.files[0];
      // const reader = new FileReader();
      // reader.onload = e => this.__clientForm.controls['preview_scaned_file'].patchValue(reader.result);
      // reader.readAsDataURL(file);
      this.__clientForm.controls['preview_scaned_file'].patchValue(this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL( __ev.target.files[0])));
    }
    else{
      this.__clientForm.controls['scaned_file'].setValue('');
      this.__clientForm.controls['preview_scaned_file'].setValue('');
    }

  }
  getSelectedItemsFromParent(event){
      this.getItems(event.item,event.flag);
  }

  checkIfclientExist(cl_code: string): Observable<boolean> {
    return of(this.__clientMst.findIndex((x) => (x.client_code == cl_code)) != -1);
  }
  ClientValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfclientExist(control.value).pipe(
        map((res) => {

          if (control.value) {
            return res ? null : { ClientExists: true };
          }
          return null;
        })
      );
    };
  }

  checkIfEuinExists(emp_name: string): Observable<boolean> {
    if (global.containsSpecialChars(emp_name)) {
      return of(
        this.__euinMst.findIndex((x) => x.euin_no == emp_name.split(' ')[0]) !=
          -1
      );
    } else {
      return of(this.__euinMst.findIndex((x) => x.euin_no == emp_name) != -1);
    }
  }
  EUINValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEuinExists(control.value).pipe(
        map((res) => {
          if (control.value) {
            // if res is true, sip_date exists, return true
            return res ? null : { euinExists: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }
  checkIfSubBrokerExist(subBrk: string): Observable<boolean> {
    // if (global.containsSpecialChars(subBrk)) {
    // return of(this.__subbrkArnMst.findIndex((x) => x.arn_no == subBrk.split(' ')[0]) != -1);
    // } else {
      return of(this.__subbrkArnMst.findIndex((x) => x.arn_no == subBrk)!= -1);
    // }
  }
  SubBrokerValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfSubBrokerExist(control.value).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { subBrkExists: true };
          }
          return null;
        })
      );
    };
  }
}
