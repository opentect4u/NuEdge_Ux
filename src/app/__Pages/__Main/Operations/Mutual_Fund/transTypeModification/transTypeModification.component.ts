import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import { bank } from 'src/app/__Model/__bank';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import buisnessType from '../../../../../../assets/json/buisnessType.json';
import { CmnDialogForDtlsViewComponent } from '../common/cmnDialogForDtlsView/cmnDialogForDtlsView.component';
import KycMst from '../../../../../../assets/json/kyc.json';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-transTypeModification',
  templateUrl: './transTypeModification.component.html',
  styleUrls: ['./transTypeModification.component.css']
})
export class TransTypeModificationComponent implements OnInit {
   
  __SecondClient: client;
  __ThirdClient: client;
  __sec_clientMst: client[] = [];
  __third_clientMst: client[] = [];

  __dialogDtForBnk: bank;
  __kycMst: any[] = KycMst;
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __buisness_type: any = buisnessType;
  __schemeMst: any=[];
  __clientMst: client[] = [];
  __bnkMst: bank[] = [];
  __euinMst: any=[];
  __dialogDtForClient: any;
  __dialogDtForScheme: any;
  OptionMst: option[];
  PlanMst:plan[]
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('schemeRes') __schemeRes: ElementRef;
  @ViewChild('searchResult') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('searchbnk') __searchbnk: ElementRef;
  @ViewChild('secondclientCd') __secondCl: ElementRef;
  @ViewChild('thirdclientCd') __thirdCl: ElementRef;



  __transType: any=[];
  __temp_tinMst: any=[];
  __product_id: string  = atob(this.__rtDt.snapshot.queryParamMap.get('product_id'));
  __product_type: string = atob(this.__rtDt.snapshot.queryParamMap.get('product_type'));
  __traxForm = new FormGroup({
    kyc_status: new FormControl('',[Validators.required]),
    first_kyc: new FormControl('',[Validators.required]),
    tin_status: new FormControl('Y',[Validators.required]),
    temp_tin_no: new FormControl('',[Validators.required]),
    bu_type: new FormControl('',[Validators.required]),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    euin_no: new FormControl('', [Validators.required]),
    inv_type: new FormControl('',[Validators.required]),
    application_no: new FormControl(''),
    recv_from: new FormControl(''),
    folio_number:new FormControl(''),
    scheme_id: new FormControl('',[Validators.required]),
    scheme_name:new FormControl('',[Validators.required]),
    client_id: new FormControl('',[Validators.required]),
    client_name: new FormControl('',[Validators.required]),
    client_code: new FormControl('',[Validators.required]),
    option: new FormControl('',[Validators.required]),
    plan: new FormControl('',[Validators.required]),
    amount: new FormControl('',[Validators.required]),
    chq_no: new FormControl('',[Validators.required]),
    chq_bank: new FormControl('',[Validators.required]),
    ack_filePreview: new FormControl(''),
    filePreview: new FormControl(''),
    app_form_scan: new FormControl(''),
    file: new FormControl('',[Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
    remarks: new FormControl(''),
    trans_id: new FormControl('',[Validators.required]),
    form_scan_status: new FormControl(''),
    bank_id: new FormControl('',[Validators.required]),
    mode_of_holding: new FormControl(''),

    second_client_name:new FormControl(''),
    second_client_code:new FormControl(''),
    second_client_pan:new FormControl(''),
    second_client_id:new FormControl(''),

    third_client_name:new FormControl(''),
    third_client_code:new FormControl(''),
    third_client_pan:new FormControl(''),
    third_client_id:new FormControl(''),

  })
  constructor(
    private __utility: UtiliService,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute,
    private __dbIntr: DbIntrService) {
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')));
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('product_type')));
   }

  ngOnInit() {
    this.getOptionMst();
    this.getPlanMst();
    // this.getBnkMst();
    this.getTransactionType();

  }

  getTransactionType(){
    this.__dbIntr.api_call(0,'/showTrans',
    'trans_type_id='+atob(this.__rtDt.snapshot.queryParamMap.get('product_type'))).pipe(pluck("data"))
    .subscribe((res:any) => {
      this.__transType = res;
    })
  }
  getOptionMst(){
    this.__dbIntr.api_call(0,'/option',null).pipe(pluck("data")).subscribe((res: option[]) => {
     this.OptionMst = res
    })
  }
  // getBnkMst(){
  //   this.__dbIntr.api_call(0,'/depositbank',null).pipe(pluck("data")).subscribe((res: bank[]) =>{
  //      this.__bnkMst = res;    
  //     })
  // }
  getPlanMst(){
    this.__dbIntr.api_call(0,'/plan',null).pipe(pluck("data")).subscribe((res: plan[]) => {
      this.PlanMst = res
     })
  }
  ngAfterViewInit(){
    this.__traxForm.controls['temp_tin_no'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchTin('/formreceived', 
        dt + '&trans_type_id='+atob(this.__rtDt.snapshot.queryParamMap.get('product_type')) + '&flag=C')
        : []),
      map((x: responseDT) => x.data)
    ).subscribe({
      next: (value) => {
        console.log(value);
        this.__temp_tinMst = value
        this.searchResultVisibility('block');
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })
    //Scheme Search
    this.__traxForm.controls['scheme_name'].valueChanges.
    pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchItems('/scheme', dt)
        : []),
      map((x: any) => x.data)
    ).subscribe({
      next: (value) => {
        this.__schemeMst = value.data
        this.searchResultVisibilityForScheme('block');
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })

    //Client Code Search
    this.__traxForm.controls['client_code'].valueChanges.
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
        // this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
        this.searchResultVisibilityForClient('block');
        // this.__traxForm.patchValue({
        //   client_id:'',
        //   client_name:''
        // })
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })

     //Second Client Code Search
     this.__traxForm.controls['second_client_code'].valueChanges.
     pipe(
       debounceTime(200),
       distinctUntilChanged(),
       switchMap(dt => dt?.length > 1 ?
         this.__dbIntr.searchItems('/client', dt)
         : []),
       map((x: any) => x.data)
     ).subscribe({
       next: (value) => {
         this.__sec_clientMst = value.data;
         // this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
         this.searchResultVisibilityForSecondClient('block');
         // this.__traxForm.patchValue({
         //   client_id:'',
         //   client_name:''
         // })
       },
       complete: () => console.log(''),
       error: (err) => console.log()
     })

          //Second Client Code Search
          this.__traxForm.controls['third_client_code'].valueChanges.
          pipe(
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(dt => dt?.length > 1 ?
              this.__dbIntr.searchItems('/client', dt)
              : []),
            map((x: any) => x.data)
          ).subscribe({
            next: (value) => {
              this.__third_clientMst = value.data;
              // this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
              this.searchResultVisibilityForThirdClient('block');
              // this.__traxForm.patchValue({
              //   client_id:'',
              //   client_name:''
              // })
            },
            complete: () => console.log(''),
            error: (err) => console.log()
          })

    //Mode Of Holding
    this.__traxForm.controls['mode_of_holding'].valueChanges.subscribe(res => {
      console.log(res);
      
    })



    // EUIN NUMBER SEARCH
    this.__traxForm.controls['euin_no'].valueChanges.
    pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchItems('/employee', dt + (this.__traxForm.controls['sub_arn_no'].value ? '&sub_arn_no=' + this.__traxForm.controls['sub_brk_cd'].value : ''))
        : []),
      map((x: responseDT) => x.data)
    ).subscribe({
      next: (value) => {
        console.log(value);
        this.__euinMst = value
        this.searchResultVisibilityForEuin('block');
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })


    
    // Bank SEARCH
    this.__traxForm.controls['chq_bank'].valueChanges.
    pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(dt => dt?.length > 1 ?
        this.__dbIntr.searchItems('/depositbank', dt)
        : []),
      map((x: responseDT) => x.data)
    ).subscribe({
      next: (value) => {
        console.log(value);
        this.__bnkMst = value
        this.searchResultVisibilityForBnk('block');
      },
      complete: () => console.log(''),
      error: (err) => console.log()
    })



    
  }

  getItems(__items){
    console.log(__items);
    this.searchResultVisibility('none');
    this.__traxForm.patchValue({
      bu_type:__items.bu_type,
      sub_brk_cd:__items.sub_brk_cd,
      sub_arn_no:__items.sub_arn_no,
      application_no:__items.application_no,
      recv_from:__items.recv_from,
      inv_type:__items.inv_type,
      trans_id: __items.trans_id,
      kyc_status: __items.kyc_status
    })
    this.__traxForm.controls['client_code'].reset(__items.client_code,{ onlySelf: true, emitEvent: false }) 
    this.__traxForm.controls['euin_no'].reset(__items.euin_no+'-'+__items.emp_name,{ onlySelf: true, emitEvent: false }) 
     this.__traxForm.patchValue({client_name:__items.client_name,client_id:__items.client_id});
    this.__traxForm.controls['scheme_name'].reset(__items.scheme_name,{ onlySelf: true, emitEvent: false }) 
    this.__traxForm.patchValue({scheme_id:__items.scheme_id});
    this.__dialogDtForClient = {id:__items.client_id,client_type:__items.client_type,client_name:__items.client_name};
    this.__dialogDtForScheme = {id:__items.scheme_id,scheme_name:__items.scheme_name};
    this.__clientMst.push(this.__dialogDtForClient);



  }
  searchResultVisibility(display_mode){
    this.__searchTin.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForScheme(display_mode){
    this.__schemeRes.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForClient(display_mode){
    this.__clientCode.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForEuin(display_mode){
    this.__searchRlt.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForBnk(display_mode){
    this.__searchbnk.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForSecondClient(display_mode){
    this.__secondCl.nativeElement.style.display= display_mode;
   }
   searchResultVisibilityForThirdClient(display_mode){
    this.__thirdCl.nativeElement.style.display= display_mode;
   }
   getItemsDtls(__euinDtls,__type){
      console.log(__euinDtls.emp_name);
      
      switch(__type){
        case 'E':    this.__traxForm.controls['euin_no'].reset(__euinDtls.euin_no+' - '+__euinDtls.emp_name,{ onlySelf: true, emitEvent: false });
                     this.searchResultVisibilityForEuin('none');
                     break;
        case 'S':    
        //  this.__traxForm.controls['sub_arn_no'].reset(__euinDtls.arn_no+' - '+__euinDtls.bro_name,{ onlySelf: true, emitEvent: false });
                      this.__traxForm.controls['sub_brk_cd'].setValue(__euinDtls.code);
                      // this.searchResultVisibilityForSubBrkArn('none');
                      break;
  
        case 'C':    
                     this.__dialogDtForClient = __euinDtls;
                     this.__traxForm.controls['client_code'].reset(__euinDtls.client_code,{ onlySelf: true, emitEvent: false }) 
                     this.__traxForm.patchValue({client_name:__euinDtls.client_name,client_id:__euinDtls.id});
                     this.searchResultVisibilityForClient('none');
                     break;
  
        case 'SC':   this.__dialogDtForScheme = __euinDtls;
                      this.__traxForm.controls['scheme_name'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false }) 
                      this.__traxForm.patchValue({scheme_id:__euinDtls.id});
                      this.searchResultVisibilityForScheme('none');
                      break;

        case 'B' :    this.__dialogDtForBnk = __euinDtls;
                       this.__traxForm.controls['chq_bank'].reset(__euinDtls.bank_name,{ onlySelf: true, emitEvent: false }) 
                      this.__traxForm.controls['bank_id'].setValue(__euinDtls.id)
                      this.searchResultVisibilityForBnk('none');
                      break;
        default: break;
      }
   }
   outsideClickforScheme(__ev){
     if(__ev){
      this.searchResultVisibilityForScheme('none');
     }
   }
   outsideClick(__ev){
    if(__ev){
      this.searchResultVisibilityForScheme('none');
     }
   }
   outsideClickforClient(__ev){
    if(__ev){
      this.searchResultVisibilityForClient('none');
    }
  }
  outsideClickforbank(__ev){
    if(__ev){
      this.searchResultVisibilityForBnk('none');
    }
  }
  outsideClickforSecondClient(__ev){
    if(__ev){
      this.searchResultVisibilityForSecondClient('none');
    }
  }
  outsideClickforThirdClient(__ev){
    if(__ev){
      this.searchResultVisibilityForThirdClient('none');
    }
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
      title:  __type == 'C' ?  this.__dialogDtForClient.client_name :  ( __type == 'S' ? this.__dialogDtForScheme.scheme_name : this.__dialogDtForBnk.bank_name),
      dt: __type == 'C' ? this.__dialogDtForClient :  ( __type == 'S' ? this.__dialogDtForScheme : this.__dialogDtForBnk) 
    }
    try{
      const dialogref = this.__dialog.open(CmnDialogForDtlsViewComponent, dialogConfig);
    }
    catch(ex){
    }
  }
  openDialogForAdditionalApplicant(__type){
    console.log(this.__SecondClient);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = "100%";
    if(__type == 'C'){dialogConfig.panelClass="fullscreen-dialog";}
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:__type,
      title:  __type == 'FC' ?  this.__SecondClient.client_name :  this.__ThirdClient.client_name,
      dt: __type == 'FC' ?  this.__SecondClient :  this.__ThirdClient 
    }
    try{
      const dialogref = this.__dialog.open(CmnDialogForDtlsViewComponent, dialogConfig);
    }
    catch(ex){
    }
  }
  getFIle(__ev) {
    console.log(__ev);
    
    this.__traxForm.get('file').setValidators( [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions), 
          fileValidators.fileSizeValidator(__ev.files)]
    );
    this.__traxForm.get('file').updateValueAndValidity();
    if (this.__traxForm.get('file').status == 'VALID' && __ev.files.length > 0) {
      const reader = new FileReader();
      reader.onload = e => this.setFormControl('filePreview', reader.result);
      reader.readAsDataURL(__ev.files[0]);
      this.setFormControl('app_form_scan', __ev.files[0]);
    }
    else {
      this.setFormControl('filePreview', '');
      this.setFormControl('app_form_scan', '');
    }
    console.log(this.__traxForm.get('app_form_scan'));
  }
  setFormControl(formcontrlname, __val) {
    console.log(formcontrlname);
    
    this.__traxForm.get(formcontrlname).patchValue(__val);
  }
  submit(){
    if (this.__traxForm.invalid) {
      this.__utility.showSnackbar('Error!! Form submition failed due to some error', 0)
      return;
    }
    const fb = new FormData();
    // fb.append('id', this.__traxForm.value.id);
    // fb.append('sip_end_date', this.__traxForm.value.sip_to);
    // fb.append('sip_start_date', this.__traxForm.value.sip_from);
    fb.append('temp_tin_no', this.__traxForm.value.temp_tin_no);
    // fb.append('rnt_login_at', this.__traxForm.value.login_at);
    fb.append('remarks', this.__traxForm.value.remarks);
    fb.append('form_scan_status', "true");
    fb.append('first_client_id', this.__traxForm.value.client_id?.toString().toUpperCase());
    // fb.append('first_client_name', this.__traxForm.value.client_name);
    // fb.append('first_pan', this.__traxForm.value.first_pan);
    fb.append('first_kyc', this.__traxForm.value.first_kyc);
    // fb.append('first_email', this.__traxForm.value.first_email);
    // fb.append('first_mobile', this.__traxForm.value.first_mobile);
    // fb.append('second_kyc', this.__traxForm.value.second_kyc);
    fb.append('second_client_id', this.__traxForm.value.second_client_id?.toString().toUpperCase());
    fb.append('second_client_kyc', '');
    fb.append('third_client_id', this.__traxForm.value.third_client_id?.toString().toUpperCase());
    fb.append('third_client_kyc', '');

    // fb.append('second_client_name', this.__traxForm.value.second_client_name);
    // fb.append('second_pan', this.__traxForm.value.second_pan);
    // fb.append('second_email', this.__traxForm.value.second_email);
    // fb.append('second_mobile', this.__traxForm.value.second_mobile);
    // fb.append('third_client_code', this.__traxForm.value.third_client_code?.toString().toUpperCase());
    // fb.append('third_client_name', this.__traxForm.value.third_client_name);
    // fb.append('third_pan', this.__traxForm.value.third_pan);
    // fb.append('third_email', this.__traxForm.value.third_email);
    // fb.append('third_mobile', this.__traxForm.value.third_mobile);
    // fb.append('third_kyc', this.__traxForm.value.third_kyc);
    fb.append('scheme_id', this.__traxForm.value.scheme_id);
    // fb.append('trans_catg', this.__traxForm.value.trans_catg);
    // fb.append('trans_scheme_from', this.__traxForm.value.trans_scheme_from);
    // fb.append('trans_scheme_to', this.__traxForm.value.trans_scheme_to);
    fb.append('amount', this.__traxForm.value.amount);
    fb.append('trans_id', this.__traxForm.value.trans_id);
    fb.append('chq_no', this.__traxForm.value.chq_no);
    // fb.append('trans_subcatg', this.__traxForm.value.trans_subcatg);
    fb.append('chq_bank', this.__traxForm.value.bank_id);
    // fb.append('amc_id', this.__traxForm.value.amc_id);
    fb.append('trans_type_id', this.__product_type);
    fb.append('app_form_scan', this.__traxForm.value.app_form_scan);
    fb.append('tin_status', this.__traxForm.value.tin_status);


    // fb.append('entry_date', this.__traxForm.value.entry_date);
    // fb.append('tin_no', this.data.id);
    // if(this.data.id){
    //   fb.append('rnt_login_cutt_off', this.__traxForm.value.cut_off_time);
    //   fb.append('rnt_login_date', this.__traxForm.value.login_date);
    //   fb.append('ack_copy_scan', this.__traxForm.value.ack_file);
    // }
    this.__dbIntr.api_call(1, '/mfTraxCreate', fb).subscribe((res: any) => {
      // this.dialogRef.close({ id: this.data.id, data: res.data })
      this.__utility.showSnackbar(res.suc == 1 ? 'Form Submitted Successfully' : res.msg, res.suc)
    })
  }
  getadditionalApplicant(__items,__type){
    switch(__type){
      case 'FC': 
                 this.__SecondClient = __items;
                 this.__traxForm.controls['second_client_code'].reset(__items.client_code,{ onlySelf: true, emitEvent: false });
                 this.__traxForm.patchValue({
                  second_client_name:__items.client_name,
                  second_client_id:__items.id,
                  second_client_pan:__items.pan
                 })
                 this.searchResultVisibilityForSecondClient('none');
                 break;
      case 'TC': 
                 this.__ThirdClient = __items;
                 this.__traxForm.controls['third_client_code'].reset(__items.client_code,{ onlySelf: true, emitEvent: false });
                 this.__traxForm.patchValue({
                 third_client_name:__items.client_name,
                 third_client_id:__items.id,
                 third_client_pan:__items.pan
                 })
                 this.searchResultVisibilityForThirdClient('none');
                 break;
      default: break;
    }

  }
}
