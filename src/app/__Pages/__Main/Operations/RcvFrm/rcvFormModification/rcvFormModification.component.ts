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
import { createClientComponent } from '../createClient/createClient\'.component';

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
    

  __isCldtlsEmpty: boolean = false;
   __dialogDtForClient: any;
   __dialogDtForScheme: any;
   __mcOptionMenu: any=[
    {"flag":"M","name":"Minor"},
    {"flag":"P","name":"Pan Holder"},
    {"flag":"N","name":"Non Pan Holder"}
   ]
  __transType: any=[];
  __clientMst: client[] =[];
  __euinMst: any=[];
  __subbrkArnMst: any=[];
  __schemeMst: any=[];
  __buisness_type: any = buisnessType;
  __rcvForm = new FormGroup({
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    bu_type: new FormControl('', [Validators.required]),
    euin_no: new FormControl('', [Validators.required]),
    application_no: new FormControl(''),
    trans_id: new FormControl('', [Validators.required]),
    id: new FormControl(''),
    client_code: new FormControl(''),
    client_id: new FormControl(''),
    client_name: new FormControl(''),
    scheme_id: new FormControl(''),
    scheme_name: new FormControl(''),
    recv_from: new FormControl(''),
    inv_type: new FormControl(''),
    kyc_status: new FormControl('')
  });
  constructor(
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,private __utility: UtiliService,private __rtDt: ActivatedRoute) { }

  ngOnInit() {
    this.getTransactionType();
  }
  getTransactionType(){
    this.__dbIntr.api_call(0,'/showTrans','trans_type_id='+atob(this.__rtDt.snapshot.queryParamMap.get('type_id'))).pipe(pluck("data")).subscribe((res:any) => {
      console.log(res);
      this.__transType = res;
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
        console.log(value.data);
        this.__clientMst = value.data;
        this.__isCldtlsEmpty = value.data.length > 0 ? false : true;
        this.searchResultVisibilityForClient('block');
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
            this.__schemeMst = value.data
            this.searchResultVisibilityForScheme('block');
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
  search
  getItems(__euinDtls,__type){
    console.log(__euinDtls);
    
    switch(__type){
      case 'E':    this.__rcvForm.controls['euin_no'].reset(__euinDtls.euin_no,{ onlySelf: true, emitEvent: false });
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

      case 'SC':    this.__dialogDtForScheme = __euinDtls;
                    this.__rcvForm.controls['scheme_name'].reset(__euinDtls.scheme_name,{ onlySelf: true, emitEvent: false }) 
                    this.__rcvForm.patchValue({scheme_id:__euinDtls.id});
                    this.searchResultVisibilityForScheme('none');
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
  recieveForm(){
    if(this.__rcvForm.invalid){
      this.__utility.showSnackbar('Forms can not be submitted, please try again later',0);
      return
    }
    const __rcvForm = new FormData();
    __rcvForm.append("bu_type",this.__rcvForm.value.bu_type);
    __rcvForm.append("euin_no",this.__rcvForm.value.euin_no);
    __rcvForm.append("sub_arn_no",this.__rcvForm.value.sub_arn_no);
    __rcvForm.append("sub_brk_cd",this.__rcvForm.value.sub_brk_cd);
    __rcvForm.append("client_id",this.__rcvForm.value.client_id);
    __rcvForm.append("product_id",atob(this.__rtDt.snapshot.queryParamMap.get('product_id')));
    __rcvForm.append("trans_id",this.__rcvForm.value.trans_id);
    __rcvForm.append("scheme_id",this.__rcvForm.value.scheme_id);
    __rcvForm.append("recv_from",this.__rcvForm.value.recv_from);
    __rcvForm.append("inv_type",this.__rcvForm.value.inv_type);
    __rcvForm.append("application_no",this.__rcvForm.value.application_no);
    __rcvForm.append("kyc_status",this.__rcvForm.value.kyc_status);
   __rcvForm.append("id",this.__rcvForm.value.id)
    this.__dbIntr.api_call(1,'/formreceivedAdd',__rcvForm).subscribe((res: any) =>{
      this.__utility.navigatewithqueryparams('/main/rcvForm',{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}})
      this.__utility.showSnackbar(res.suc == 1 ? 'Form with temporary TIN number ' + res.data.temp_tin_no + ' has been received successfully'  : 'Something went wrong! Plase try again later ' , res.suc)
      
    })
  }
  openDialog(__type){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "50%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:__type,
      title:  __type == 'C' ?  this.__dialogDtForClient.client_name :  this.__dialogDtForScheme.scheme_name,
      dt: __type == 'C' ? this.__dialogDtForClient :  this.__dialogDtForScheme 
    }
    try{
      const dialogref = this.__dialog.open(DialogDtlsComponent, dialogConfig);
    }
    catch(ex){
    }
  }
  createClientCode(){
    console.log('assa');
    
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
    dialogConfig.width = "80%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:'CL',
      id:0,
      items:null,
      title:  'Create ' + (__menu.flag == 'M' ? 'Minor' : (__menu.flag == 'P' ? 'PAN Holder' : (__menu.flag == 'N' ? 'Non Pan Holder' : 'Existing'))),
      cl_type:__menu.flag
    }
    try{
      const dialogref = this.__dialog.open(createClientComponent, dialogConfig);
    }
    catch(ex){
    }
  }
}
