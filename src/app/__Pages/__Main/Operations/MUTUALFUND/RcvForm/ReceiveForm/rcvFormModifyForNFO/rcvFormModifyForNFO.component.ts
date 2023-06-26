import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, skip, switchMap, tap } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
// import { CreateClientComponent } from '../../../../../shared/create-client/create-client.component';
import { global } from 'src/app/__Utility/globalFunc';
import { Observable, of } from 'rxjs';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import ClientType from '../../../../../../../../assets/json/clientTypeMenu.json';

@Component({
selector: 'rcvFormModifyForNFO-component',
templateUrl: './rcvFormModifyForNFO.component.html',
styleUrls: ['./rcvFormModifyForNFO.component.css']
})
export class RcvformmodifyfornfoComponent implements OnInit {
  displayMode_forClient:string;
  displayMode_forScm:string;
  displayMode_forEuin: string;
  displayMode_forSub_arn_no: string;
  displayMode_forScmTo: string ;

  __isClientPending: boolean = false;
  __isEuinPending: boolean = false;
  __isSchemePending: boolean = false;
  __isschemetoSpinner: boolean  = false;
  __isSubBrkArnSpinner: boolean = false;

  __trans_types: any=[]
  __isVisible:boolean = true;
  __isEntryDTGreater: boolean = false;
  __isCldtlsEmpty: boolean = false;
   __dialogDtForClient: any;
   __dialogDtForScheme: any;
   __dialogDtForSchemeTo: any;

   __clTypeMenu = ClientType;
   __mcOptionMenu: any=[
    {"flag":"M","name":"Minor","icon":"person_pin"},
    {"flag":"P","name":"Pan Holder","icon":"credit_card"},
    {"flag":"N","name":"Non Pan Holder","icon":"credit_card_off"}
   ]
  __transType: any=[];
  __clientMst: any =[];
  __euinMst: any=[];
  __subbrkArnMst: any=[];
  __schemeMst: any=[];
  __schemeMstforSwitchTo: any=[];
  __buisness_type: any = buisnessType;
  __rcvForm = new FormGroup({
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    bu_type: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', {
      validators:[Validators.required],
      asyncValidators:[this.EUINValidators()]
    }),
    application_no: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    id: new FormControl(''),
    client_code: new FormControl('',{
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }),
    client_id: new FormControl('',[Validators.required]),
    client_name: new FormControl(''),
    scheme_id: new FormControl('',[Validators.required]),
    scheme_name: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.SchemeValidators()]
    }),
    recv_from: new FormControl(''),
    inv_type: new FormControl('',[Validators.required]),
    kyc_status: new FormControl(''),
    switch_scheme_to: new FormControl(''),
    scheme_id_to: new FormControl(''),
    folio_no: new FormControl('')
  });
constructor(
  public dialogRef: MatDialogRef<RcvformmodifyfornfoComponent>,
  private __utility: UtiliService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr: DbIntrService,
  public __dialog: MatDialog,
  private overlay: Overlay,

) {
  this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
    if(this.data.id == res.id && this.data.flag == res.flag){
      this.__isVisible = res.isVisible
    }
  })
}

ngOnInit(){
  this.getTransactionTypeDtls();
  this.getTransactionType();
}
getTransactionTypeDtls(){
  this.__dbIntr.api_call(0,'/formreceivedshow','product_id='+this.data.product_id + '&trans_type_id='+this.data.trans_type_id).pipe(pluck("data")).subscribe(res => {
      this.__trans_types = res;
  })
}
getTransactionType(){
  this.__dbIntr.api_call(0,'/showTrans','trans_type_id='+this.data.trans_type_id).pipe(pluck("data")).subscribe((res:any) => {
    console.log(res);
    this.__transType = res;
  })
}
setRcvFormDtls(){
  this.__dbIntr.api_call(0,'/formreceived','temp_tin_no='+ this.data.temp_tin_no).pipe(pluck("data")).subscribe(res =>{
    this.__rcvForm.patchValue({
        bu_type:res[0].bu_type,
        trans_id:res[0].trans_id ,
        id:res[0].id ,
        recv_from:res[0].recv_from ,
        inv_type:res[0].inv_type ,
        kyc_status:res[0].kyc_status,
        product_id:res[0].product_id,
        application_no:global.getActualVal(res[0].application_no),
        folio_no:res[0].inv_type == 'A' ? global.getActualVal(res[0].folio_no) : ''
    })

    setTimeout(() => {
      /** EUIN BINDING */
      this.__euinMst.push({euin_no:res[0].euin_no,emp_name:res[0].emp_name,});
      this.getItems(this.__euinMst[0],'E');
      /** END */

    /** Sub Broker Binding */
    if(res[0].bu_type == 'B'){
      this.__subbrkArnMst.push({arn_no: res[0].sub_arn_no,code:res[0].sub_brk_cd});
      this.getItems(this.__subbrkArnMst[0],'S');
    }
    /** End */

    /** Client Code Binding */
    this.__clientMst.push({client_code:res[0].client_code,id: res[0].client_id,client_name: res[0].client_name,client_type:res[0].client_type});
    this.getItems(this.__clientMst[0],'C');
    /** End  */

    /** Scheme Binding */
    this.__schemeMst.push({id: res[0].scheme_id,scheme_name: res[0].scheme_name,nfo_entry_date:res[0].nfo_entry_date});
    this.getItems(this.__schemeMst[0],'SC');
    /** End */

    /** Scheme To Binding */
    if(res[0].trans_id == 6){
      this.__schemeMstforSwitchTo.push(
        {id: res[0].scheme_id_to,scheme_name: res[0].scheme_name_to}
      );
      this.getItems(this.__schemeMst[0],'ST');

    }

    /** End */

  }, 500);
  })
}

ngAfterViewInit() {
  // Getting Data from Report on click on particular ROW
  if(this.data.temp_tin_no){
    this.setRcvFormDtls();
  }
  // End

  // EUIN NUMBER SEARCH
  this.__rcvForm.controls['euin_no'].valueChanges.
  pipe(
    tap(()=> this.__isEuinPending = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/employee', dt + (this.__rcvForm.controls['sub_arn_no'].value ? '&sub_arn_no=' + this.__rcvForm.controls['sub_arn_no'].value.split(' ')[0] : ''))
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      this.__euinMst = value
      this.searchResultVisibility('block');
      this.__isEuinPending = false;
    },
    complete: () => console.log(''),
    error: (err) => {
      this.__isEuinPending = false;
    }
  })

  //SUB BROKER ARN SEARCH

  this.__rcvForm.controls['sub_arn_no'].valueChanges.
  pipe(
    tap(()=> this.__isSubBrkArnSpinner = true),
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
      this.__isSubBrkArnSpinner = false;
    },
    complete: () => console.log(''),
    error: (err) =>{
      this.__isSubBrkArnSpinner = false;
    }
  })

  //Client Code Search
  this.__rcvForm.controls['client_code'].valueChanges.
  pipe(
    tap(() => this.__isClientPending = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/client', dt)
      : []),
    map((x: any) => x.data)
  ).subscribe({
    next: (value) => {
      this.__clientMst = value.data;
      this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
      this.searchResultVisibilityForClient('block');
      this.__rcvForm.patchValue({
        client_id:'',
        client_name:''
      });
      this.__isClientPending = false;
    },
    complete: () => {},
    error: (err) => {this.__isClientPending = false;}
  })

      //Scheme Search
      this.__rcvForm.controls['scheme_name'].valueChanges.
      pipe(
        tap(() => this.__isSchemePending = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/scheme', (dt + '&scheme_type='+ (this.data.trans_type_id == '4' ? 'N' : 'O')))
          : []),
        map((x: any) => x.data)
      ).subscribe({
        next: (value) => {
          this.__schemeMst = value;
          this.searchResultVisibilityForScheme('block');
          this.__isSchemePending = false;
        },
        complete: () => {},
        error: (err) => {this.__isSchemePending = false;
        }
      })


       //switch Scheme Search
       this.__rcvForm.controls['switch_scheme_to'].valueChanges.
      pipe(
        tap(()=> this.__isschemetoSpinner = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/scheme', dt + '&amc_id='+ this.__dialogDtForScheme?.amc_id)
          : []),
        map((x: any) => x.data)
      ).subscribe({
        next: (value) => {
          // this.__schemeMst = value.data
          console.log(value);
          this.__schemeMstforSwitchTo = value;
          this.__isschemetoSpinner = false;
          this.searchResultVisibilityForSchemeSwicthTo('block');
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isschemetoSpinner = false;
        }
      })

      this.__rcvForm.controls['inv_type'].valueChanges.subscribe(res =>{
        if(res == 'F'){
          this.__rcvForm.controls['application_no'].setValue('');
        }
        else{
          this.__rcvForm.controls['folio_no'].setValue('')
        }
      })


 //On Change on buisness type
  this.__rcvForm.controls["bu_type"].valueChanges.subscribe(res => {
      this.__rcvForm.controls['sub_arn_no'].reset('',{ onlySelf: true, emitEvent: false });
      this.__rcvForm.controls['euin_no'].reset('',{ onlySelf: true, emitEvent: false });
      this.__rcvForm.controls['sub_brk_cd'].reset('',{ onlySelf: true, emitEvent: false });
      if(res == 'B'){
        this.__rcvForm.controls['sub_arn_no'].setValidators([Validators.required]);
        this.__rcvForm.controls['sub_arn_no'].setAsyncValidators([this.SubBrokerValidators()]);
        this.__rcvForm.controls['sub_brk_cd'].setValidators([Validators.required]);
      }
      else{
        this.__rcvForm.controls['sub_arn_no'].removeValidators([Validators.required]);
        this.__rcvForm.controls['sub_arn_no'].removeAsyncValidators([this.SubBrokerValidators()]);
        this.__rcvForm.controls['sub_brk_cd'].removeValidators([Validators.required]);
      }
      this.__rcvForm.controls['sub_arn_no'].updateValueAndValidity({emitEvent:false});
      this.__rcvForm.controls['sub_brk_cd'].updateValueAndValidity({emitEvent: false});

  })

  this.__rcvForm.controls["inv_type"].valueChanges.subscribe(res =>{
    if(res == 'A'){
         this.__rcvForm.controls['folio_no'].setValidators([Validators.required]);
         this.__rcvForm.controls['folio_no'].updateValueAndValidity();
    }
    else{
      this.__rcvForm.controls['folio_no'].removeValidators([Validators.required]);
      this.__rcvForm.controls['folio_no'].updateValueAndValidity();
    }
  })

  //trans_id change
  this.__rcvForm.controls['trans_id'].valueChanges.subscribe((res) => {
    console.log(res);

    if (res == '6' || res == '35') {
      this.__rcvForm.controls['scheme_id_to'].setValidators([
        Validators.required,
      ]);
      this.__rcvForm.controls['switch_scheme_to'].setValidators([
        Validators.required,
      ]);
      this.__rcvForm.get('switch_scheme_to').setAsyncValidators([
        this.SchemeToValidators()
     ]);
      this.__rcvForm.controls['scheme_id_to'].updateValueAndValidity({emitEvent:false});
    this.__rcvForm.controls['switch_scheme_to'].updateValueAndValidity({emitEvent:false});
    } else {
      this.__rcvForm.controls['scheme_id_to'].removeValidators([
        Validators.required,
      ]);
      this.__rcvForm.controls['switch_scheme_to'].removeValidators([
        Validators.required,
      ]);
      this.__rcvForm.get('switch_scheme_to').removeAsyncValidators([this.SchemeToValidators()]);
      this.__rcvForm.controls['switch_scheme_to'].updateValueAndValidity({emitEvent:false});
      this.__rcvForm.controls['scheme_id_to'].updateValueAndValidity({emitEvent:false});
    }

  });
}
searchResultVisibility(display_mode) {
   this.displayMode_forEuin = display_mode;
}
searchResultVisibilityForSubBrkArn(display_mode){
  // if(this.__subBrkArn)
  // this.__subBrkArn.nativeElement.style.display = display_mode;
  this.displayMode_forSub_arn_no = display_mode;
}
searchResultVisibilityForClient(display_mode){
  this.displayMode_forClient = display_mode;
}
searchResultVisibilityForScheme(display_mode){
  this.displayMode_forScm = display_mode;
 }
 searchResultVisibilityForSchemeSwicthTo(display_mode){
  this.displayMode_forScmTo = display_mode;
 }
 getItems(__euinDtls,__type){
  console.log(__euinDtls);

  switch(__type){
    case 'E':    this.__rcvForm.controls['euin_no'].reset(__euinDtls.euin_no+' - '+__euinDtls.emp_name,{ onlySelf: true, emitEvent: false });
                 this.searchResultVisibility('none');
                 break;
    case 'S':     this.__rcvForm.controls['sub_arn_no'].reset(__euinDtls.arn_no,{ onlySelf: true, emitEvent: false });
                  this.__rcvForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
                  this.searchResultVisibilityForSubBrkArn('none');
                  break;

    case 'C':    this.__dialogDtForClient = __euinDtls;
                 this.__rcvForm.controls['client_code'].reset(__euinDtls.client_code,{ onlySelf: true, emitEvent: false })
                 this.__rcvForm.patchValue({client_name:__euinDtls.client_name,client_id:__euinDtls.id});
                 this.searchResultVisibilityForClient('none');
                 break;

    case 'SC':
                    this.__rcvForm.controls['scheme_name'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false })
                    if(this.checkWhetherNfoEntryDateisgreaterornot(__euinDtls.nfo_entry_date)){
                    this.__rcvForm.patchValue({scheme_id:__euinDtls.id});
                    this.searchResultVisibilityForScheme('none');
                    this.__dialogDtForScheme = __euinDtls;
                  }
                  else{
                    this.__rcvForm.patchValue({scheme_id:''});
                    this.searchResultVisibilityForScheme('none');
                    this.__dialogDtForScheme = null;
                  }
    break;

    case 'ST':  this.__dialogDtForSchemeTo = __euinDtls;
                this.__rcvForm.controls['switch_scheme_to'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false });
                this.__rcvForm.patchValue({scheme_id_to : __euinDtls.id});
                this.searchResultVisibilityForSchemeSwicthTo('none');
                break;

    default: break;
  }

}

checkWhetherNfoEntryDateisgreaterornot(__entrDt){
  console.log(__entrDt);
        this.__isEntryDTGreater = __entrDt >= new Date().toISOString().substring(0,10) ? false : true;
        return !this.__isEntryDTGreater;
}

outsideClickforClient(__ev){
  if(__ev){
    this.searchResultVisibilityForClient('none');
  }
}

recieveForm(){
  if(this.__rcvForm.invalid){
    this.__utility.showSnackbar('Forms can not be submitted, please try again later',0);
    return
  }
  const __rcvForm = new FormData();
  __rcvForm.append("bu_type",this.__rcvForm.value.bu_type);
  __rcvForm.append("euin_no",this.__rcvForm.value.euin_no.split(' ')[0]);
  __rcvForm.append("sub_arn_no",this.__rcvForm.value.sub_arn_no ? this.__rcvForm.value.sub_arn_no : '');
  __rcvForm.append("sub_brk_cd",this.__rcvForm.value.sub_brk_cd ? this.__rcvForm.value.sub_brk_cd : '');
  __rcvForm.append("client_id",this.__rcvForm.value.client_id);
  __rcvForm.append("product_id",this.data.product_id);
  __rcvForm.append("trans_id",this.__rcvForm.value.trans_id);
  __rcvForm.append("scheme_id",this.__rcvForm.value.scheme_id);
  __rcvForm.append("recv_from",this.__rcvForm.value.recv_from);
  __rcvForm.append("inv_type",this.__rcvForm.value.inv_type);
  __rcvForm.append("kyc_status",this.__rcvForm.value.kyc_status);
  __rcvForm.append("id",this.__rcvForm.value.id);
  if(this.__rcvForm.value.inv_type == 'A'){
    __rcvForm.append("folio_no",this.__rcvForm.value.folio_no ? this.__rcvForm.value.folio_no : '')
  }
  else{
    __rcvForm.append("application_no",this.__rcvForm.value.application_no ? this.__rcvForm.value.application_no : '');
  }

 __rcvForm.append("temp_tin_no",this.data.temp_tin_no ? atob(this.data.temp_tin_no) : this.data.temp_tin_no);
 if(this.__rcvForm.value.trans_id == 6 || this.__rcvForm.value.trans_id == 35){
 __rcvForm.append("scheme_id_to",this.__rcvForm.get('scheme_id_to').value);

 }
  this.__dbIntr.api_call(1,this.data.temp_tin_no ? '/formreceivedEdit' : '/formreceivedAdd',__rcvForm).subscribe((res: any) =>{
    if(this.data.temp_tin_no){
      this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN ' + res.data.temp_tin_no + ' has been updated successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
    }
    else{
    this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN ' + res.data.temp_tin_no + ' has been received successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
     this.dialogRef.close({trans_id: this.__rcvForm.value.trans_id == 1 ? 0 : (this.__rcvForm.value.trans_id == 2 ? 1 : 2)})
    }
    // this.settransTypeCount(this.__rcvForm.value.trans_id == 1 ? 0 : (this.__rcvForm.value.trans_id == 2 ? 1 : 2));

    // this.__rcvForm.reset();
  })
}
openDialog(__type){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  // dialogConfig.disableClose = true;
  // dialogConfig.hasBackdrop = false;
  dialogConfig.width =  __type == 'C'  ? "100%" : "50%";
  if(__type == 'C'){dialogConfig.panelClass="fullscreen-dialog";}
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data ={
    flag:__type,
    title:  __type == 'C' ?  this.__dialogDtForClient.client_name :  (__type == 'ST' ? this.__dialogDtForSchemeTo.scheme_name :   this.__dialogDtForScheme.scheme_name),
    dt: __type == 'C' ? this.__dialogDtForClient : (__type == 'ST' ? this.__dialogDtForSchemeTo : this.__dialogDtForScheme)
  }
  try{
    const dialogref = this.__dialog.open(PreviewdtlsDialogComponent, dialogConfig);
  }
  catch(ex){
  }
}
navigateTo(menu){
  console.log(menu);

  this.openDialogforClient(menu);
}
openDialogforClient(__menu){
  console.log(__menu);

  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = true;
  dialogConfig.disableClose = false;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = "100%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.panelClass="fullscreen-dialog"
  dialogConfig.data ={
    flag:'CL',
    id:0,
    items:null,
    title:  'Create ' + (__menu.flag == 'M' ? 'Minor' : (__menu.flag == 'P' ? 'PAN Holder' : (__menu.flag == 'N' ? 'Non Pan Holder' : 'Existing'))),
    cl_type:__menu.flag
  }
  try{
    const dialogref = this.__dialog.open(CreateClientComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
             if(dt){
              this.__clientMst.push(dt.data);
              this.__isCldtlsEmpty = false;
               this.getItems(dt.data,'C');
             }
    })
  }
  catch(ex){
  }
}
minimize(){
  this.dialogRef.updateSize("40%",'60px');
  this.dialogRef.updatePosition({bottom: '0px', right: '0px' });
}
maximize(){
  this.dialogRef.updateSize("60%");
  this.__isVisible = !this.__isVisible;
}
fullScreen(){
  this.dialogRef.updateSize("80%");
  this.__isVisible = !this.__isVisible;
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
          return res ? null : { euinExists: true };
        }
        return null;
      })
    );
  };
}
checkIfSubBrokerExist(subBrk: string): Observable<boolean> {
  return of(this.__subbrkArnMst.findIndex((x) => x.arn_no == subBrk) != -1);
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

checkIfscmExist(scm_name: string): Observable<boolean> {
  return of(this.__schemeMst.findIndex((x) => (x.scheme_name == scm_name)) != -1);
}
SchemeValidators(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.checkIfscmExist(control.value).pipe(
      map((res) => {
        if (control.value) {
          return res ? null : { ScmExists: true };
        }
        return null;
      })
    );
  };
}
checkIfscmToExist(scm_name: string): Observable<boolean> {
  console.log(scm_name);

  return of(this.__schemeMstforSwitchTo.findIndex((x) => (x.scheme_name == scm_name)) != -1);
}
SchemeToValidators(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.checkIfscmToExist(control.value).pipe(
      map((res) => {
        if (control.value) {
          return res ? null : { ScmToExists: true };
        }
        return null;
      })
    );
  };
}
getSelectedItemsFromParent(event){
  console.log(event.item);

  this.getItems(event.item,event.flag);
}
}
