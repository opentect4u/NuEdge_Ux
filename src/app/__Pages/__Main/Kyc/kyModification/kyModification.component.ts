import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { environment } from 'src/environments/environment';
import kycType from '../../../../../assets/json/kycMaster.json';
import kycLoginType from '../../../../../assets/json/kycloginType.json';
import kycLoginAt from '../../../../../assets/json/kycLoginAt.json';
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';
import { docType } from 'src/app/__Model/__docTypeMst';
import buisnessType from '../../../../../assets/json/buisnessType.json';
import { Overlay } from '@angular/cdk/overlay';
import { DialogfrclientComponent } from '../dialogForClient/dialogFrClient.component';
import { DialogfrclientviewComponent } from '../dialogFrClientView/dialogFrClientView.component';
import { amc } from 'src/app/__Model/amc';
import { fileValidators } from 'src/app/__Utility/fileValidators';
@Component({
  selector: 'kyc-kyModification',
  templateUrl: './kyModification.component.html',
  styleUrls: ['./kyModification.component.css']
})
export class KyModificationComponent implements OnInit {
  allowedExtensions = ['pdf'];

  __subbrkArnMst: any=[];
  __clientMst: client[] =[];
  __euinMst: any=[];
  __amcMst: amc[]= [];
  __isVisible:boolean = false;
  __buisness_type: any = buisnessType;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('searchResult') __searchRlt: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;

  __dialogDtForClient: any;
  __isCldtlsEmpty: boolean = false;
  __isclientVisible: boolean = false;
  __mcOptionMenu: any = [
    { flag: 'M', name: 'Minor', icon: 'person_pin' },
    { flag: 'P', name: 'Pan Holder', icon: 'credit_card' },
    { flag: 'N', name: 'Non Pan Holder', icon: 'credit_card_off' },
  ];
  __kycLoginAt: any = [];
  __kycLoginType = kycLoginType;
  __kycType = kycType;
  __noImg: string = '../../../../../../assets/images/noimg.jpg';
  __isvisible: boolean = false;
  __selectFiles: any = [];
  __clMaster: client[];
  __docTypeMaster: docType[];
  __clientForm = new FormGroup({
    bu_type: new FormControl('',[Validators.required]),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    euin_no: new FormControl('', [Validators.required]),
    client_id: new FormControl('', [Validators.required]),
    client_code: new FormControl('', [Validators.required]),
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
    preview_scaned_file: new FormControl('')
  })
  constructor(
    public dialogRef: MatDialogRef<KyModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {
    // this.getDocumnetTypeMaster();
  }

  ngOnInit() {
    console.log(this.data.items);

    if (this.data.items != '') {
      this.__clientForm.patchValue({
        client_id: this.data.items.id,
        client_code: this.data.items.client_code,
        // pan_no: this.data.items.pan,
        // _client_code: this.data.items.client_code,
        // _pan_no: this.data.items.pan,
        // mobile: this.data.items.mobile,
        client_name: this.data.items.client_name,
        // email: this.data.items.email,
        // temp_tin_id: this.data.kyc_data.temp_tin_id,
        kyc_type: this.data.kyc_data.kyc_type,
        kyc_login_type: this.data.kyc_data.kyc_login_type,
        kyc_login_at: this.data.kyc_data.kyc_login_at,
        remarks:this.data.kyc_data.remarks,
        scaned_file: this.data.kyc_data.scaned_form ? `${environment.kyc_formUrl + this.data.kyc_data.scaned_form}` : '',
        preview_scaned_file: this.data.kyc_data.scaned_form ? `${environment.kyc_formUrl + this.data.kyc_data.scaned_form}` : ''
      })
      this.setFormControl(this.data.items);
      this.__clientForm.controls['scaned_form'].setValidators(this.data.kyc_data.scaned_form ?
        [] :
        [Validators.required,fileValidators.fileExtensionValidator(this.allowedExtensions)]);
      this.getKycLoginAtMaster(this.data.kyc_data.kyc_login_type);
    }
    else{
      this.getKycLoginAtMaster('R');
    }
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
    },
    complete: () => console.log(''),
    error: (err) => console.log()
  })

  //SUB BROKER ARN SEARCH
  this.__clientForm.controls['sub_arn_no'].valueChanges.
  pipe(
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
    },
    complete: () => console.log(''),
    error: (err) => console.log()
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
  }
  else{
    this.__clientForm.controls['sub_arn_no'].removeValidators([Validators.required]);
    this.__clientForm.controls['sub_brk_cd'].removeValidators([Validators.required]);
  }
  this.__clientForm.controls['sub_arn_no'].reset('',{ onlySelf: true, emitEvent: false });
  this.__clientForm.controls['euin_no'].reset('',{ onlySelf: true, emitEvent: false });
  this.__clientForm.controls['sub_brk_cd'].reset('',{ onlySelf: true, emitEvent: false });
})



    this.__clientForm.get('kyc_login_type').valueChanges.subscribe(res => {
      switch (res) {
        case 'R':
        this.getKycLoginAtMaster(res); break;
        case 'A':
        this.getKycLoginAtMaster(res); break;
        case 'N':
        this.__kycLoginAt = kycLoginAt;
        console.log(this.__kycLoginAt);
         break;
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
      // if(kyc_login_type == 'R'){
      //   this.__kycLoginAt = res;
      // }
      // else{
      //   this.__amcMst =res;
      // }
      this.__kycLoginAt = res;
    })
  }

  setFormControl(res) {
    this.__isvisible = true;
    res.client_doc.forEach(element => {
      this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name));
    })
  }
  outsideClickforSubBrkArn(__ev){
    if(__ev){
        this.searchResultVisibilityForSubBrkArn('none');
    }
  }
  outsideClickforClient(__ev){
    if(__ev){
      this.searchResultVisibilityForClient('none');
  }
  }
  //first client Search Resullt off
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForSubBrkArn(display_mode){
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  searchResultVisibility(display_mode){
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  getItems(__items,mode){
    switch(mode){
      case 'S':this.__clientForm.controls['sub_arn_no'].reset(__items.arn_no+' - '+__items.bro_name,{ onlySelf: true, emitEvent: false });
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
  outsideClick(__ev){
    if(__ev){
      this.searchResultVisibility('none');
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
      const dialogref = this.__dialog.open(
        DialogfrclientComponent,
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
      const dialogref = this.__dialog.open(
        DialogfrclientviewComponent,
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
      const reader = new FileReader();
      reader.onload = e => this.__clientForm.controls['preview_scaned_file'].patchValue(reader.result);
      reader.readAsDataURL(file);
    }
    else{
      this.__clientForm.controls['scaned_file'].setValue('');
      this.__clientForm.controls['preview_scaned_file'].setValue('');
    }

  }
}
