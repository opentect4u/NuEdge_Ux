import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import { fdScm } from 'src/app/__Model/fdScm';
import { DialogDtlsComponent } from '../dialog-dtls/dialog-dtls.component';
import { CreateInvComponent } from '../create-inv/create-inv.component';

@Component({
  selector: 'app-rcv-form-crud',
  templateUrl: './rcv-form-crud.component.html',
  styleUrls: ['./rcv-form-crud.component.css']
})
export class RcvFormCrudComponent implements OnInit {
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;

  __isClientPending: boolean = false;
  __isEuinPending: boolean = false;
  __isSubArnPending: boolean = false;
  __euinMst: any= [];
  __subbrkArnMst: any=[];
  __isVisible:boolean = true;
  __bu_type = buType;
  __clientMst: client[] = [];
  __dialogDtForClient: any;
  __isCldtlsEmpty: boolean = false;
  __mcOptionMenu: any=[
    // {"flag":"M","name":"Minor","icon":"person_pin"},
    {"flag":"P","name":"Pan Holder","icon":"credit_card"},
    {"flag":"N","name":"Non Pan Holder","icon":"credit_card_off"}
   ]
  constructor(
  public dialogRef: MatDialogRef<RcvFormCrudComponent>,
  private __utility: UtiliService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr: DbIntrService,
  public __dialog: MatDialog,
  private overlay: Overlay
  ) { }
  __fdComp: any=[];
  __fdScm: fdScm[]=[];
  __rcvForm = new FormGroup({
    bu_type: new FormControl('',[Validators.required]),
    euin_no: new FormControl('',
    {
      validators:[Validators.required],
      asyncValidators:[this.EmpValidators()]
    }
    ),
    // sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    fd_bu_type_id: new FormControl('',[Validators.required]),
    company_id: new FormControl('',[Validators.required]),
    scheme_id: new FormControl('',[Validators.required]),
    investor_code: new FormControl('',{
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }),
    investor_id: new FormControl('',[Validators.required]),
    investor_name: new FormControl(''),
    recv_from: new FormControl(''),
    id: new FormControl('')
  })

  ngOnInit(): void {

    this.getCmpMst();
    if(this.data.temp_tin_no){
      this.setRcvFormDtls();
    }
  }
  setRcvFormDtls(){
    this.__dbIntr.api_call(0,'/fd/formreceived','temp_tin_no='+ this.data.temp_tin_no).pipe(pluck("data")).subscribe(res =>{
      console.log(res);
      this.__rcvForm.patchValue({
          bu_type:res[0].bu_type ,
          id:res[0].id ,
          investor_id:res[0].investor_id ,
          investor_name:res[0].investor_name,
          company_id:res[0].comp_id,
          recv_from:res[0].recv_from ,
          scheme_id: res[0].scheme_id,
          fd_bu_type_id: res[0].fd_bu_type
      })
      this.__dialogDtForClient = {id:res[0].investor_id,
         client_type:res[0].investor_type,
        client_name:res[0].investor_name,
        client_code: res[0].investor_code
      };
      this.__clientMst.push(this.__dialogDtForClient);
      this.__rcvForm.controls['investor_code'].reset(res[0].investor_code,{ onlySelf: true, emitEvent: false });
      this.__rcvForm.controls['euin_no'].reset(res[0].euin_no +' - '+res[0].emp_name,{ onlySelf: true, emitEvent: false });
      this.__euinMst.push({euin_no:res[0].euin_no,emp_name:res[0].emp_name});

      if(res[0].bu_type == 'B'){
        this.__rcvForm.controls['sub_arn_no'].reset(res[0].sub_arn_no,{ onlySelf: true, emitEvent: false });
        this.__subbrkArnMst.push({code:res[0].sub_arn_no,arn_no:res[0].arn_no,bro_name:res[0].broker_name});
       }
    })
  }
  ngAfterViewInit(){

    // EUIN NUMBER SEARCH
  this.__rcvForm.controls['euin_no'].valueChanges.
  pipe(
    tap(()=> this.__isEuinPending = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/employee',
      global.containsSpecialChars(dt) ? dt.split(' ')[0] : dt
      +
      (
        this.__rcvForm.controls['bu_type'].value == 'B'?
        (this.__rcvForm.controls['sub_arn_no'].value ?
        '&sub_arn_no=' + this.__rcvForm.controls['sub_arn_no'].value : '') : ''
      )

      )
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      console.log(value);
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
    tap(()=> this.__isSubArnPending = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/showsubbroker', dt)
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      // this.__rcvForm.controls['sub_brk_cd'].setValue('');
      this.__subbrkArnMst = value
      this.searchResultVisibilityForSubBrkArn('block');
      this.__isSubArnPending = false;
    },
    complete: () => console.log(''),
    error: (err) => {
      this.__isSubArnPending = false;
    }
  })

  //  Change Of Buisness
  this.__rcvForm.controls['bu_type'].valueChanges.subscribe(res =>{
    this.__rcvForm.controls['sub_arn_no'].setValidators(res == 'B' ? [Validators.required] : null);
    this.__rcvForm.controls['sub_arn_no'].setAsyncValidators(res == 'B' ? [this.SubBrokerValidators()] : null);
    this.__rcvForm.controls['sub_arn_no'].updateValueAndValidity({emitEvent:false});
    if(res == 'B'){
      this.__rcvForm.controls['euin_no'].reset('',{emitEvent: false});
    }
  })

  // Change of Proposer code
  this.__rcvForm.controls['investor_code'].valueChanges.
  pipe(
    tap(()=> this.__isClientPending = true),
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
        proposer_id:'',
        proposer_name:''
      });
      this.__isClientPending = false;
    },
    complete: () => console.log(''),
    error: (err) => {
      this.__isClientPending = false;
    }
  })

  this.__rcvForm.controls['company_id'].valueChanges.subscribe(res =>{
    console.log(res);
    if(res){
     this.getSchemeMst(res);
    }
    else{
      this.__fdScm.length = 0;
    }
   })
   /**change Event of sub Broker Arn Number */
   this.__rcvForm.controls['sub_brk_cd']?.valueChanges
   .pipe(
     tap(() => (this.__isSubArnPending = true)),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((dt) =>
       dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
     ),
     map((x: responseDT) => x.data)
   )
   .subscribe({
     next: (value) => {
       this.__subbrkArnMst = value;
       this.searchResultVisibilityForSubBrkArn('block');
       this.__isSubArnPending = false;
     },
     complete: () => console.log(''),
     error: (err) => {
       this.__isSubArnPending = false;
     },
   });


  }
  getCmpMst(){
    this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe(res =>{
       this.__fdComp = res;
    })
  }
  getSchemeMst(__cmp_id){
    this.__dbIntr.api_call(0,'/fd/scheme','comp_id='+__cmp_id).pipe(pluck("data")).subscribe((res: fdScm[]) =>{
      this.__fdScm = res;
   })

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
  recieveForm(){
    if(this.__rcvForm.invalid){
      this.__utility.showSnackbar('Forms can not be submitted, please try again later',0);
      return
    }
    const __rcvForm = new FormData();
    __rcvForm.append("bu_type",this.__rcvForm.value.bu_type);
    __rcvForm.append("euin_no",this.__rcvForm.value.euin_no.split(' ')[0]);
    __rcvForm.append("investor_id",this.__rcvForm.value.investor_id);
    __rcvForm.append("recv_from",this.__rcvForm.value.recv_from);
    __rcvForm.append('company_id',this.__rcvForm.value.company_id);
    __rcvForm.append('scheme_id',this.__rcvForm.value.scheme_id);
    __rcvForm.append('temp_tin_no',this.data ? this.data.temp_tin_no : '');
    __rcvForm.append('fd_bu_type',this.data ? this.__rcvForm.value.fd_bu_type_id : '');


    if(this.__rcvForm.value.bu_type == 'B'){
      __rcvForm.append("sub_arn_no",this.__rcvForm.value.sub_arn_no ? this.__rcvForm.value.sub_arn_no : '');
      // __rcvForm.append("sub_brk_cd",this.__rcvForm.value.sub_brk_cd ? this.__rcvForm.value.sub_brk_cd : '');
    }

  //  __rcvForm.append("id",this.__rcvForm.value.id)

    this.__dbIntr.api_call(1,this.data.temp_tin_no ? '/fd/formreceivedEdit' : '/fd/formreceivedAdd',__rcvForm).subscribe((res: any) =>{
      if(this.data.temp_tin_no){
        this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN number ' + res.data.temp_tin_no + ' has been updated successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
        this.dialogRef.close({temp_tin_no: res.data.temp_tin_no,data:res.data});
      }
      else{
      this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN number ' + res.data.temp_tin_no + ' has been received successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
      this.dialogRef.close({temp_tin_no: null,data:res.data});
      }
      // this.__rcvForm.reset();
    })
  }
  outsideClick(__ev){
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  outsideClickforClient(__ev){
    if(__ev){
      this.searchResultVisibilityForClient('none');
    }
  }
  getItems(__euinDtls,__mode){
    switch(__mode){
      case 'E' :
                this.__rcvForm.controls['euin_no'].setValue(__euinDtls.euin_no+' - '+__euinDtls.emp_name,{emitEvent: false});
                this.searchResultVisibility('none');
                break
      case 'S' : this.__rcvForm.controls['sub_arn_no'].reset(__euinDtls.code,{ onlySelf: true, emitEvent: false });
                  // this.__rcvForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
                  this.searchResultVisibilityForSubBrkArn('none');
                  break;
      case 'C':    this.__dialogDtForClient = __euinDtls;
      console.log(__euinDtls);

                  this.__rcvForm.controls['investor_code'].reset(__euinDtls.client_code,{ onlySelf: true, emitEvent: false })
                  this.__rcvForm.patchValue({investor_name:__euinDtls.client_name,investor_id:__euinDtls.id});
                  this.searchResultVisibilityForClient('none');
                  break;
    }
  }
  outsideClickforSubBrkArn(__ev){
    if(__ev){
      this.searchResultVisibilityForSubBrkArn('none');
    }
  }
  searchResultVisibilityForSubBrkArn(display_mode){
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForClient(display_mode){
    this.__clientCode.nativeElement.style.display= display_mode;
   }
   openDialog(__type){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = "100%";
    dialogConfig.panelClass="fullscreen-dialog";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:__type,
      title:  this.__dialogDtForClient.client_name,
      dt:  this.__dialogDtForClient
    }
    try{
      const dialogref = this.__dialog.open(DialogDtlsComponent, dialogConfig);
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
      const dialogref = this.__dialog.open(CreateInvComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        console.log(dt);
               if(dt){
               this.__clientMst.push(dt.data);
               this.getItems(dt.data,'C');

               }
      })
    }
    catch(ex){
    }
  }

  checkIfEmpExists(emp_name: string): Observable<boolean> {
        if(global.containsSpecialChars(emp_name)){
          return of(
            this.__euinMst.findIndex((x) => x.euin_no == emp_name.split(' ')[0])!= -1);
        }
        else{
          return of(this.__euinMst.findIndex((x) => x.euin_no == emp_name)!= -1);

        }
  }
  EmpValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEmpExists(control.value).pipe(
        map(res => {
           if(control.value){
            console.log(res);

          // if res is true, sip_date exists, return true
             return res ?  null : { empExists: true };
          // NB: Return null if there is no error
           }
           return null

        })
      );
    };
  }

  checkIfSubBrokerExist(subBrk: string): Observable<boolean> {
      return of(this.__subbrkArnMst.findIndex((x) => x.code == subBrk)!= -1);
  }
  SubBrokerValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfSubBrokerExist(control.value).pipe(
        map(res => {
           if(control.value){
            console.log(res);

          // if res is true, sip_date exists, return true
             return res ?  null : { empExists: true };
          // NB: Return null if there is no error
           }
           return null

        })
      );
    };
  }

  checkIfClientExist(clientDtls: string): Observable<boolean> {
    return of(this.__clientMst.findIndex((x) => x.client_code == clientDtls)!= -1);
  }
 ClientValidators(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.checkIfClientExist(control.value).pipe(
      map(res => {
         if(control.value){
           return res ?  null : { proposerExists: true };
         }
         return null

      })
    );
  };
}



}
