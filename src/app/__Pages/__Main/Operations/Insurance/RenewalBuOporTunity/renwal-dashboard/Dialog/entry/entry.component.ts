import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild, ElementRef} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, pluck, skip, switchMap, tap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import buisnessType from '../../../../../../../../../assets/json/buisnessType.json';
import { responseDT } from 'src/app/__Model/__responseDT';
import { global } from 'src/app/__Utility/globalFunc';
import { Observable, of } from 'rxjs';
import ClientType from '../../../../../../../../../assets/json/clientTypeMenu.json';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { CreateClientComponent } from 'src/app/shared/create-client/create-client.component';
import { DialogForViewComponent } from '../../../../ManualEntry/Dialog/dialog-for-view/dialog-for-view.component';
import { PreviewdtlsDialogComponent } from 'src/app/shared/core/previewdtls-dialog/previewdtls-dialog.component';
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  @ViewChild('insure_person') insure_person:ElementRef;
  allowedExtensions= ['pdf']
  __isVisible: boolean = true;
  __isEmpSpinner:boolean =false;
  __isSubArnNoSpinner:boolean = false;
  __isProposerPending:boolean = false;
  __isinsuredPersonPending:boolean = false;

  __isCldtlsEmpty: boolean = false;
  displayMode_for_emp:string;
  displayMode_for_sub_arn_no:string;
  displayMode_for_proposer:string;
  displayMode_for_ins_person:string;

  singleProposerDtls:any;
  __clTypeMenu = ClientType;
  __buType = buisnessType;
    renewal_bu_oportunity = new FormGroup({
      temp_tin_no:new FormControl(''),
    same_as_above:new FormControl(false),
    bu_type:new FormControl('',[Validators.required]),
    sub_brk_cd: new FormControl(''),
    sub_arn_no: new FormControl(''),
    euin_no: new FormControl('',{
      validators: [Validators.required],
      asyncValidators: this.EUINValidators(),
    }),
    ins_type_id: new FormControl('',[Validators.required]),
    proposer_code: new FormControl('', {
      validators:[Validators.required],
      asyncValidators:[this.ClientValidators()]
    }),
    proposer_name: new FormControl(''),
    proposer_id: new FormControl('',[Validators.required]),
    ins_person_name: new FormControl('',[Validators.required]),
    insured_person_id: new FormControl(''),
    ins_person_code: new FormControl(''),
    ins_person_pan: new FormControl('',
    [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'),
    Validators.minLength(10),
    Validators.maxLength(10)]),
    ins_person_dob: new FormControl('',[Validators.required]),
    comp_id: new FormControl('',[Validators.required]),
    product_type_id: new FormControl('',[Validators.required]),
    product_id: new FormControl('',[Validators.required]),
    sum_insured: new FormControl('',[Validators.required]),
    renewal_dt: new FormControl('',[Validators.required]),
    upload_scan: new FormControl(''),
    preview_file: new FormControl(''),
    upload_file: new FormControl(''),
    remarks: new FormControl('')
  })

  __empMst:any=[];
  __subArnMst:any=[];
  __insTypeMst:any=[];
  __clientMst:any=[];
  __insuredPersonMst:any=[];
  __cmpMst: insComp[] = [];
  __prdTypeMst: insPrdType[] = [];
  __prdMst: insProduct[] = [];

  constructor(
    public dialogRef: MatDialogRef<EntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe((res) => {
      if (this.data.id == res.id && this.data.flag == res.flag) {
        this.__isVisible = res.isVisible;
      }
    });
  }

  ngOnInit(): void {
    this.getInsTypeMst();
  }
  ngAfterViewInit(){
    this.renewal_bu_oportunity.controls['bu_type'].valueChanges.subscribe(res =>{
      this.renewal_bu_oportunity.controls['sub_arn_no'].setValidators(res == 'B' ? [Validators.required] : null);
      this.renewal_bu_oportunity.controls['sub_arn_no'].setAsyncValidators(res == 'B' ? [this.SubBrokerValidators()] : null);
      this.renewal_bu_oportunity.controls['sub_arn_no'].updateValueAndValidity({emitEvent:false});
    })

    this.renewal_bu_oportunity.controls['same_as_above'].valueChanges.subscribe(res =>{
         this.getItems(res ? this.singleProposerDtls : '','I')
    })

    this.renewal_bu_oportunity.controls['euin_no'].valueChanges.pipe(
      tap(() => (this.__isEmpSpinner = true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
      dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/employee',
                (global.containsSpecialChars(dt) ? dt.split(' ')[0] : dt)
                +
                (this.renewal_bu_oportunity.value.bu_type == 'B' ?
                (this.renewal_bu_oportunity.controls['sub_arn_no'].value
                ?
                '&sub_arn_no=' + this.renewal_bu_oportunity.controls['sub_arn_no'].value.split(' ')[0]
                : '') : '')
              )
            : []
      ),
      map((x: responseDT) => x.data)
    )
    .subscribe({
      next: (value) => {
        this.__empMst = value;
        this.searchResultVisibilityForEmployee('block');
        this.__isEmpSpinner = false;
      },
      complete: () => console.log(''),
      error: (err) => {
        this.__isEmpSpinner = false;
      },
    });

    //SUB BROKER ARN SEARCH
    this.renewal_bu_oportunity.controls['sub_arn_no'].valueChanges
      .pipe(
        tap(() => (this.__isSubArnNoSpinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__subArnMst = value;
          this.searchResultVisibilityForSubBrkArn('block');
          this.__isSubArnNoSpinner = false;
          this.getItems(null, 'E');
        },
        complete: () => {},
        error: (err) => {
          this.__isSubArnNoSpinner = false;
        },
      });
      // Proposer Search
      /**Change Event of Proposer Code */
    this.renewal_bu_oportunity.controls['proposer_code'].valueChanges
    .pipe(
      tap(() => (this.__isProposerPending = true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        this.__clientMst = value.data;
        this.__isCldtlsEmpty = this.__clientMst.length > 0 ? false : true;
        this.renewal_bu_oportunity.controls['proposer_name'].reset('',{emitEvent:false});
        this.renewal_bu_oportunity.controls['proposer_id'].reset('',{emitEvent:false});
        this.searchResultVisibilityForClient('block');
        this.__isProposerPending = false;
      },
      complete: () => console.log(''),
      error: (err) => {
        this.__isProposerPending = false;
      },
    });

    this.renewal_bu_oportunity.controls['ins_person_code'].valueChanges.pipe(
      tap(() => (this.__isProposerPending = true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
      ),
      map((x: any) => x.data)
    ).subscribe({
      next: (value) => {
        this.__insuredPersonMst = value.data;
        this.renewal_bu_oportunity.controls['ins_person_name'].reset('',{emitEvent:false});
        this.renewal_bu_oportunity.controls['insured_person_id'].reset('',{emitEvent:false});
        this.renewal_bu_oportunity.controls['ins_person_pan'].reset('',{emitEvent:false});
        this.renewal_bu_oportunity.controls['ins_person_dob'].reset('',{emitEvent:false});
        this.searchResultVisibilityForInsured('block');
        this.__isProposerPending = false;
      },
      complete: () => console.log(''),
      error: (err) => {
        this.__isProposerPending = false;
      },
    });

    this.renewal_bu_oportunity.controls['ins_type_id'].valueChanges.subscribe((res) => {
       this.getCompany(res);
    })
    this.renewal_bu_oportunity.controls['comp_id'].valueChanges.subscribe(res=>{
      this.getProductType(res);
    })
    this.renewal_bu_oportunity.controls['product_type_id'].valueChanges.subscribe(res =>{
      this.getProductName(res);
    })
  }

  /** Employee Search result hide and show */
  searchResultVisibilityForEmployee(display_mode){
     this.displayMode_for_emp = display_mode;
  }
  /*** Sub Broker Result Hide Show */
  searchResultVisibilityForSubBrkArn(display_mode){
    this.displayMode_for_sub_arn_no = display_mode;
  }
  /*** Proposer Result Hide Show */
  searchResultVisibilityForClient(display_mode){
    this.displayMode_for_proposer = display_mode;
  }
  /*** Insured Person Result Hide Show */
  searchResultVisibilityForInsured(display_mode){
    this.displayMode_for_ins_person = display_mode;
  }
  minimize() {
    this.dialogRef.updateSize('40%', '40px');
    this.dialogRef.updatePosition({ bottom: '0px', right: '0px' });
  }
  maximize() {
    this.dialogRef.updateSize('40%');
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.updateSize('60%');
    this.__isVisible = !this.__isVisible;
  }
  getItems(item,flag){
    switch(flag){
      case 'E':
          this.renewal_bu_oportunity.controls['euin_no'].reset(item ? (item.emp_name+'-'+item.euin_no) : '',{emitEvent:false});
          this.searchResultVisibilityForEmployee('none');
          break;
      case 'S':
          this.renewal_bu_oportunity.controls['sub_arn_no'].reset( item ? item.arn_no : '',{emitEvent:false});
          this.searchResultVisibilityForSubBrkArn('none');
          break;
      case 'C':
          this.singleProposerDtls = item;
          this.renewal_bu_oportunity.controls['proposer_code'].reset(item ? item.client_code : '',{emitEvent:false});
          this.renewal_bu_oportunity.controls['proposer_name'].reset(item ? item.client_name : '');
          this.renewal_bu_oportunity.controls['proposer_id'].reset(item ? item.id : '');
          this.searchResultVisibilityForClient('none');
          break;
      case 'I':
          this.renewal_bu_oportunity.controls['ins_person_code'].reset(item ? item.client_code : '',{emitEvent:false});
          this.renewal_bu_oportunity.controls['ins_person_name'].reset(item ? item.client_name : '');
          this.renewal_bu_oportunity.controls['insured_person_id'].reset(item ? item.id : '');
          this.renewal_bu_oportunity.controls['ins_person_dob'].reset(item ? item.dob : '');
          this.renewal_bu_oportunity.controls['ins_person_pan'].reset(item ? item.pan : '');
          this.searchResultVisibilityForInsured('none');
          break;
    }
  }
  getSelectedItemsFromParent(ev){
    console.log(ev);

   this.getItems(ev.item,ev.flag);
  }
  checkIfEuinExists(emp_name: string): Observable<boolean> {
    if (global.containsSpecialChars(emp_name)) {
      return of(
        this.__empMst.findIndex((x) => x.euin_no == emp_name.split('-')[1]) !=
          -1
      );
    } else {
      return of(this.__empMst.findIndex((x) => x.emp_name == emp_name) != -1);
    }
  }
  EUINValidators(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEuinExists(control.value).pipe(
        map((res) => {
          if (control.value) {
            // if res is true, sip_date exists, return true
            return res ? null : { empExists: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }
  checkIfSubBrokerExist(subBrk: string): Observable<boolean> {
    return of(this.__subArnMst.findIndex((x) => x.arn_no == subBrk) != -1);
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
   /**Get Insurance Type */
   getInsTypeMst() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__insTypeMst = res;
      });
  }
  navigateTo(ev){
   this.createCl(ev,'C');
  }
  checkIfclientExist(cl_code: string): Observable<boolean> {
    return of(this.__clientMst.findIndex((x) => x.client_code == cl_code) != -1);
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
  getCompany(__res) {
    if(__res){
      this.__dbIntr
      .api_call(0, '/ins/company', 'ins_type_id=' + __res)
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__cmpMst = res;
      });
    }
    else{
      this.renewal_bu_oportunity.controls['comp_id'].setValue('',{emitEvent:true});
      this.__cmpMst.length = 0;
    }

  }
  getProductType(__res) {
    if(__res){
      this.__dbIntr
      .api_call(0, '/ins/productType', 'ins_type_id=' + __res)
      .pipe(pluck('data'))
      .subscribe((res: insPrdType[]) => {
        this.__prdTypeMst = res;
      });
    }
    else{
      this.renewal_bu_oportunity.controls['product_type_id'].setValue('',{emitEvent:true});
      this.__prdTypeMst.length = 0;
    }
  }
  getProductName(__prd_type_id) {
    if (__prd_type_id) {
      this.__dbIntr
        .api_call(
          0,
          '/ins/product',
          + '&product_type_id=' + __prd_type_id
        )
        .pipe(pluck('data'))
        .subscribe((res: insProduct[]) => {
          this.__prdMst = res;
        });
    } else {
      this.renewal_bu_oportunity.controls['product_id'].setValue('',{emitEvent:true});
      this.__prdMst = [];
    }
  }
  getFile(ev){
    this.renewal_bu_oportunity
    .get('upload_scan')
    .setValidators([
      Validators.required,
      fileValidators.fileExtensionValidator(this.allowedExtensions),
      fileValidators.fileSizeValidator(ev.files),
    ]);
  this.renewal_bu_oportunity.get('upload_scan').updateValueAndValidity();
  if (this.renewal_bu_oportunity.get('upload_scan').status == 'VALID' && ev.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => this.renewal_bu_oportunity.get('preview_file').patchValue(reader.result);
    reader.readAsDataURL(ev.files[0]);
    this.renewal_bu_oportunity.get('upload_file').patchValue(ev.files[0]);
  } else {
    this.renewal_bu_oportunity.get('upload_file').patchValue('');
    this.renewal_bu_oportunity.get('preview_file').patchValue('');
  }
  }
  submitRenewal(){
     let res = this.renewal_bu_oportunity.value;
     res['euin_no']=this.renewal_bu_oportunity.value.euin_no.split('-')[1];
     this.__dbIntr.api_call(1,'/ins/businessOpportunityAddEdit',this.convertFormData(res)).subscribe((res: any) =>{
      if (res.suc == 1) {
        // this.dialogRef.close({ data: res.data });
      }
      this.__utility.showSnackbar(
        res.suc == 1 ? 'Form Submitted Successfully' : res.msg,
        res.suc
      );

     })
  }
  convertFormData(obj){
    const formData = new FormData();
    Object.keys(obj).forEach(key => formData.append(key, obj[key]));
    return formData;
  }
  existingClient() {
    this.getItems('', 'I');
    this.renewal_bu_oportunity.controls['same_as_above'].setValue(false, { emitEvent: false });
    this.insure_person.nativeElement.focus();
  }
  createInsured(ev){
    this.createCl(ev,'I')
  }
  createCl(__menu,__mode){
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
      const dialogref = this.__dialog.open(CreateClientComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          this.getItems(dt.data, __mode);
        }
      });
    } catch (ex) {}
  }
  openDialog(__type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = __type == 'C' ? '100%' : '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: __type,
      title:
        __type == 'C'
          ? this.singleProposerDtls.client_name
            :'',
      dt:
        __type == 'C'
          ? this.singleProposerDtls
          : '',
    };
    try {
      const dialogref = this.__dialog.open(
        PreviewdtlsDialogComponent,
        dialogConfig
      );
    } catch (ex) { }
  }
}
