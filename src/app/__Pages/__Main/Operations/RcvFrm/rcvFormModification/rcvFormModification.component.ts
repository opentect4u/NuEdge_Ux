import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import buisnessType from '../../../../../../assets/json/buisnessType.json';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { responseDT } from 'src/app/__Model/__responseDT';
import { client } from 'src/app/__Model/__clientMst';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogDtlsComponent } from '../dialogDtls/dialogDtls.component';
import { Overlay } from '@angular/cdk/overlay';
import { createClientComponent } from '../createClient/createClient.component';

@Component({
  selector: 'app-rcvFormModification',
  templateUrl: './rcvFormModification.component.html',
  styleUrls: ['./rcvFormModification.component.css']
})
export class RcvFormModificationComponent implements OnInit {
  @ViewChild('searchResult') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('schemeRes') __scheme: ElementRef;
  @ViewChild('schemeswitchTo') __scheme_swicth_to: ElementRef;

  __trans_types: any=[]

  __isCldtlsEmpty: boolean = false;
   __dialogDtForClient: any;
   __dialogDtForScheme: any;
   __dialogDtForSchemeTo: any;
   __mcOptionMenu: any=[
    {"flag":"M","name":"Minor","icon":"person_pin"},
    {"flag":"P","name":"Pan Holder","icon":"credit_card"},
    {"flag":"N","name":"Non Pan Holder","icon":"credit_card_off"}
   ]
  __transType: any=[];
  __clientMst: client[] =[];
  __euinMst: any=[];
  __subbrkArnMst: any=[];
  __schemeMst: any=[];
  __schemeMstforSwitchTo: any=[];
  __buisness_type: any = buisnessType;
  __rcvForm = new FormGroup({
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    bu_type: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', [Validators.required]),
    application_no: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    id: new FormControl(''),
    client_code: new FormControl('',[Validators.required]),
    client_id: new FormControl('',[Validators.required]),
    client_name: new FormControl(''),
    scheme_id: new FormControl('',[Validators.required]),
    scheme_name: new FormControl('',[Validators.required]),
    recv_from: new FormControl('',[Validators.required]),
    inv_type: new FormControl('',[Validators.required]),
    kyc_status: new FormControl(''),
    switch_scheme_to: new FormControl(''),
    scheme_id_to: new FormControl('')
  });
  constructor(
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,private __utility: UtiliService,private __rtDt: ActivatedRoute) { }

  ngOnInit() {
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('type_id')));
    this.getTransactionTypeDtls();
    this.getTransactionType();
    console.log(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no'));
    if(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no')!= null){
      this.setRcvFormDtls();
    }
  }
  getTransactionTypeDtls(){
    this.__dbIntr.api_call(0,'/formreceivedshow','product_id='+atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) + '&trans_type_id='+atob(this.__rtDt.snapshot.queryParamMap.get('type_id'))).pipe(pluck("data")).subscribe(res => {
        console.log(res);
        this.__trans_types = res;

    })
  }
  getTransactionType(){
    this.__dbIntr.api_call(0,'/showTrans','trans_type_id='+atob(this.__rtDt.snapshot.queryParamMap.get('type_id'))).pipe(pluck("data")).subscribe((res:any) => {
      console.log(res);
      this.__transType = res;
    })
  }
  setRcvFormDtls(){
    this.__dbIntr.api_call(0,'/formreceived','temp_tin_no='+atob(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no'))).pipe(pluck("data")).subscribe(res =>{
      console.log(res);
      this.__rcvForm.patchValue({
          sub_brk_cd:res[0].sub_brk_cd ,
          bu_type:res[0].bu_type ,
          application_no:res[0].application_no ,
          trans_id:res[0].trans_id ,
          id:res[0].id ,
          client_id:res[0].client_id ,
          client_name:res[0].client_name,
          scheme_id:res[0].scheme_id ,
          recv_from:res[0].recv_from ,
          inv_type:res[0].inv_type ,
          kyc_status:res[0].kyc_status,
          product_id:res[0].kyc_status
      })
      this.__rcvForm.controls['client_code'].reset(res[0].client_code,{ onlySelf: true, emitEvent: false });
      this.__rcvForm.controls['euin_no'].reset(res[0].euin_no,{ onlySelf: true, emitEvent: false });
      this.__rcvForm.controls['scheme_name'].reset(res[0].scheme_name,{ onlySelf: true, emitEvent: false });
      this.__rcvForm.controls['sub_arn_no'].reset(res[0].sub_arn_no,{ onlySelf: true, emitEvent: false });
      this.__dialogDtForClient = {id:res[0].client_id,client_type:res[0].client_type,client_name:res[0].client_name};
      this.__dialogDtForScheme = {id:res[0].scheme_id,scheme_name:res[0].scheme_name};
      this.__clientMst.push(this.__dialogDtForClient);

    })
  }
  outsideClick(__ev){
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  ngAfterViewInit() {
    // EUIN NUMBER SEARCH
    this.__rcvForm.controls['euin_no'].valueChanges.
    pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchItems('/employee', dt + (this.__rcvForm.controls['sub_arn_no'].value ? '&sub_arn_no=' + this.__rcvForm.controls['sub_brk_cd'].value : ''))
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

    this.__rcvForm.controls['sub_arn_no'].valueChanges.
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
    this.__rcvForm.controls['client_code'].valueChanges.
    pipe(
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
        })
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })

        //Scheme Search
        this.__rcvForm.controls['scheme_name'].valueChanges.
        pipe(
          debounceTime(200),
          distinctUntilChanged(),
          switchMap(dt => dt?.length > 1 ?
            this.__dbIntr.searchItems('/scheme', dt)
            : []),
          map((x: any) => x.data)
        ).subscribe({
          next: (value) => {
            this.__schemeMst = value;
            this.searchResultVisibilityForScheme('block');
          },
          complete: () => console.log(''),
          error: (err) => console.log()
        })
 

         //switch Scheme Search
         this.__rcvForm.controls['switch_scheme_to'].valueChanges.
        pipe(
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
            console.log(this.__schemeMstforSwitchTo);
            
            this.searchResultVisibilityForSchemeSwicthTo('block');
          },
          complete: () => console.log(''),
          error: (err) => console.log()
        })


   //On Change on buisness type
    this.__rcvForm.controls["bu_type"].valueChanges.subscribe(res => {
        this.__rcvForm.controls['sub_arn_no'].reset('',{ onlySelf: true, emitEvent: false });
        this.__rcvForm.controls['euin_no'].reset('',{ onlySelf: true, emitEvent: false });
        this.__rcvForm.controls['sub_brk_cd'].reset('',{ onlySelf: true, emitEvent: false });
    })
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForSubBrkArn(display_mode){
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForClient(display_mode){
   this.__clientCode.nativeElement.style.display= display_mode;
  }
  searchResultVisibilityForScheme(display_mode){
    this.__scheme.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForSchemeSwicthTo(display_mode){
     this.__scheme_swicth_to.nativeElement.style.display = display_mode;
   }
  getItems(__euinDtls,__type){
    console.log(__euinDtls);

    switch(__type){
      case 'E':    this.__rcvForm.controls['euin_no'].reset(__euinDtls.euin_no+' - '+__euinDtls.emp_name,{ onlySelf: true, emitEvent: false });
                   this.searchResultVisibility('none');
                   break;
      case 'S':     this.__rcvForm.controls['sub_arn_no'].reset(__euinDtls.arn_no+' - '+__euinDtls.bro_name,{ onlySelf: true, emitEvent: false });
                    this.__rcvForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
                    this.searchResultVisibilityForSubBrkArn('none');
                    break;

      case 'C':    this.__dialogDtForClient = __euinDtls;
                   this.__rcvForm.controls['client_code'].reset(__euinDtls.client_code,{ onlySelf: true, emitEvent: false })
                   this.__rcvForm.patchValue({client_name:__euinDtls.client_name,client_id:__euinDtls.id});
                   this.searchResultVisibilityForClient('none');
                   break;

      case 'SC':    this.__dialogDtForScheme = __euinDtls;
                    this.__rcvForm.controls['scheme_name'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false })
                    this.__rcvForm.patchValue({scheme_id:__euinDtls.id});
                    this.searchResultVisibilityForScheme('none');
      break;

      case 'ST':  this.__dialogDtForSchemeTo = __euinDtls;
                   console.log(this.__dialogDtForSchemeTo);

                  this.__rcvForm.controls['switch_scheme_to'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false });
                  this.__rcvForm.patchValue({scheme_id_to : __euinDtls.id});
                  this.searchResultVisibilityForSchemeSwicthTo('none');
                  break;

      default: break;
    }

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
  outsideClickforScheme(__ev){
        if(__ev){
          this.searchResultVisibilityForScheme('none');
        }
  }
 

  outsideClickForSchemeSwitchTo(__ev){
    if(__ev){
         this.searchResultVisibilityForSchemeSwicthTo('none');
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
    __rcvForm.append("sub_arn_no",this.__rcvForm.value.sub_arn_no ? this.__rcvForm.value.sub_arn_no.split(' ')[0] : '');
    __rcvForm.append("sub_brk_cd",this.__rcvForm.value.sub_brk_cd ? this.__rcvForm.value.sub_brk_cd : '');
    __rcvForm.append("client_id",this.__rcvForm.value.client_id);
    __rcvForm.append("product_id",atob(this.__rtDt.snapshot.queryParamMap.get('product_id')));
    __rcvForm.append("trans_id",this.__rcvForm.value.trans_id);
    __rcvForm.append("scheme_id",this.__rcvForm.value.scheme_id);
    __rcvForm.append("recv_from",this.__rcvForm.value.recv_from);
    __rcvForm.append("inv_type",this.__rcvForm.value.inv_type);
    __rcvForm.append("application_no",this.__rcvForm.value.application_no ? this.__rcvForm.value.application_no : '');
    __rcvForm.append("kyc_status",this.__rcvForm.value.kyc_status);
   __rcvForm.append("id",this.__rcvForm.value.id)
   __rcvForm.append("temp_tin_no",this.__rtDt.snapshot.queryParamMap.get('temp_tin_no') ? atob(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no')) : this.__rtDt.snapshot.queryParamMap.get('temp_tin_no'));
   if(this.__rcvForm.value.trans_id == 3){
   __rcvForm.append("scheme_id_to",this.__rcvForm.get('scheme_id_to').value);

   }
    this.__dbIntr.api_call(1,this.__rtDt.snapshot.queryParamMap.get('temp_tin_no') ? '/formreceivedEdit' : '/formreceivedAdd',__rcvForm).subscribe((res: any) =>{
      if(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no')){
        this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN number ' + res.data.temp_tin_no + ' has been updated successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
      }
      else{
      this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN number ' + res.data.temp_tin_no + ' has been received successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
      }
      this.settransTypeCount(this.__rcvForm.value.trans_id == 1 ? 0 : (this.__rcvForm.value.trans_id == 2 ? 1 : 2));

      this.__rcvForm.reset();
    })
  }
  openDialog(__type){
    console.log(this.__dialogDtForClient);

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
    // dialogConfig.disableClose = true;
    // dialogConfig.hasBackdrop = false;
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
      const dialogref = this.__dialog.open(createClientComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        console.log(dt);
               if(dt){
                 this.getItems(dt.data,'C')
               }
      })
    }
    catch(ex){
    }
  }
  navigateTODashboard(__type_id){
    this.__utility.navigatewithqueryparams('main/rcvForm',{queryParams:{
      product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
      type_id: this.__rtDt.snapshot.queryParamMap.get('type_id'),
       trans_id: btoa(__type_id)
    }})
  }
  settransTypeCount(__index) {
    this.__trans_types[__index].count = this.__trans_types[__index].count + 1
  }
}