import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'share-holder-entry',
  templateUrl: './share-holder-entry.component.html',
  styleUrls: ['./share-holder-entry.component.css']
})
export class ShareHolderEntryComponent implements OnInit {
  getSelectedDT: any | undefined;
  __no_of_shared_remaining:number =0;
  @Input() shareHolderMst: any=[];
  @Input() country: any = [];
  @Input() cmpDtlsMst:any =[];
  @Output() setReset = new EventEmitter();
  @Input() set formDT(value){
    this.getSelectedDT = value;
    if(value){
      this.sharedFrm.patchValue({
        shareholders_type:value.type
      });
    this.setSharedFormData(value);
    }
    else{
      this.reset();
    }
    this.getSelectedDT = value;
  }
  @Output() sendsavedsharedholderDtls = new EventEmitter<any>();
  allowedExtensions = ['pdf'];
  state: any = [];
  district: any = [];
  city: any = [];
  pincodeMst: any = [];
   sharedFrm = new FormGroup({
    id: new FormControl(0),
    shareholders_type: new FormControl('E'),
    name: new FormControl('',[Validators.required]),
    dob: new FormControl('',[Validators.required]),
    comp_profile_id: new FormControl('',[Validators.required]),
    pan: new FormControl('',[Validators.required]),
    address: new FormGroup({
      add_line1: new FormControl('',[Validators.required]),
      add_line2: new FormControl(''),
      country_id: new FormControl('',[Validators.required]),
      state_id: new FormControl('',[Validators.required]),
      dist_id: new FormControl('',[Validators.required]),
      city_id: new FormControl('',[Validators.required]),
      pincode: new FormControl('',[Validators.required]),
    }),
    mobile:new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    certificate_no: new FormControl('',[Validators.required]),
    date: new FormControl('',[Validators.required]),
    share_no: new FormControl('',[Validators.required]),
    registered_folio: new FormControl('',[Validators.required]),
    distinctive_from: new FormControl('',[Validators.required]),
    distinctive_to: new FormControl('',[Validators.required]),
    nominee_name: new FormControl('',[Validators.required]),
    percentage: new FormControl('',[Validators.required]),
    share_transfer: new FormGroup({
      trans_form: new FormControl(''),
      upload_scan: new FormControl(''),
      file: new FormControl(''),
      file_preview: new FormControl(''),
      remarks: new FormControl('')
    }),
    present_shareholder: new FormGroup({})
   });
  constructor(private dbIntr: DbIntrService,private sanitizer:DomSanitizer,private utility:UtiliService) { }

  ngOnInit(): void {
  }

  setFormDTAgainstTypeChange(res){
   if(res == 'E'){}
   else{
     if(this.getSelectedDT && this.getSelectedDT.type == 'E'){
      // Reset Form if form is not auto populated from datatables & its type is 'E'
        this.setSharedFormData(null);
         this.getSelectedDT = '';
     }
   }
  }



  ngAfterViewInit(){
  this.sharedFrm.controls['shareholders_type'].valueChanges.subscribe(res =>{
    this.sharedFrm.get(['share_transfer','upload_scan']).setValidators(res == 'S' ? [fileValidators.fileExtensionValidator(this.allowedExtensions),] : null);
    this.sharedFrm.get(['share_transfer','upload_scan']).updateValueAndValidity({emitEvent:false});
    if(res == 'T'){
      this.sharedFrm.get('comp_profile_id').disable();
      this.sharedFrm.get('share_no').setAsyncValidators([this.checkShareHolderExceed()]);
    }
    else{
      this.sharedFrm.get('comp_profile_id').enable();
      this.sharedFrm.get('share_no').clearAsyncValidators();
    }
    this.sharedFrm.get('share_no').updateValueAndValidity();
       this.setFormDTAgainstTypeChange(res);
  })
  this.sharedFrm.get(['share_transfer','trans_form']).valueChanges.subscribe(res =>{
          if(res){
                this.sharedFrm.controls['comp_profile_id'].setValue(
                  this.shareHolderMst.filter(x => x.id == res)[0]?.cm_profile_id);
                  this.__no_of_shared_remaining = this.shareHolderMst.filter(x => x.id == res)[0]?.no_of_share;
          }
          else{
            this.sharedFrm.controls['comp_profile_id'].setValue('')
          }

  })
  }
  setSharedFormData(dt){
    console.log(dt.transfer_id);

    this.state.length = 0;
    this.district.length = 0;
    this.city.length = 0;
    this.pincodeMst.length = 0;
    this.sharedFrm.get('comp_profile_id').setValue(dt ? dt.cm_profile_id : '');
    setTimeout(() => {
    this.sharedFrm.patchValue({
      id:dt ? dt.id : 0,
      name: dt ? dt.name : '',
      dob: dt ? dt.dob : '',
      pan: dt ? dt.pan : '',
      address: {
        add_line1: dt ? dt.add_1 : '',
        add_line2:  dt ? dt.add_2 : '',
        country_id: dt ? dt.country_id : '',
        state_id: dt ? dt.state_id : '',
        dist_id: dt ? dt.district_id : '',
        city_id: dt ? dt.city_id : '',
        pincode: dt ? dt.pincode : '',
      },
      mobile:dt ? dt.mob : '',
      email: dt ?  dt.email : '',
      certificate_no: dt ? dt.certificate_no : '',
      date: dt ? dt.date : '',
      share_no: dt ? dt.no_of_share : '',
      registered_folio: dt ? dt.registered_folio : '',
      distinctive_from: dt ? dt.distinctive_no_from : '',
      distinctive_to: dt ? dt.distinctive_no_to : '',
      nominee_name: dt ? dt.nominee : '',
      percentage: dt ? dt.percentage : '',
    });
    if(dt?.type == 'T'){
      this.sharedFrm.get(['share_transfer','trans_form']).reset(dt ? dt.transfer_id : '',{emitEvent:true});
      this.sharedFrm.patchValue({
        share_transfer:{
          // trans_form: dt ? dt.transfer_id : '',
          file: dt ? `${environment.company_logo_url +'shared-doc/'+  dt.upload_scan}` : '',
          file_preview: dt ? `${environment.company_logo_url +'shared-doc/'+  dt.upload_scan}` : '',
          remarks: dt ? dt.remarks : ''
        }
      })
    }
  },100)

  }

  getselectedItem(ev){
    switch(ev.flag){
      case 'C' :
        this.getStateMst(ev.id);
      break;
      case 'S' :
        this.getDistrictMst(ev.id);
      break;
      case 'D' :
        this.getCityMst(ev.id);
      break;
      case 'CY' :
        this.getPincodeMst(ev.id);
      break;
      default: break;
    }
  }
   getStateMst(country_id){
    if(country_id){
      this.dbIntr.api_call(0,'/states','country_id='+country_id).pipe(pluck("data")).subscribe(res =>{
        this.state =res;
      })
    }
    else{
      this.state.length = 0;
      this.sharedFrm.get(['address','state_id']).reset('',{emitEvent:true});
    }

   }
   getDistrictMst(state_id){
    if(state_id){
      this.dbIntr.api_call(0,'/districts','state_id='+state_id).pipe(pluck("data")).subscribe(res =>{
        this.district =res;
      })
    } else{
      this.district.length = 0;
      this.sharedFrm.get(['address','dist_id']).reset('',{emitEvent:true});
    }
   }
   getCityMst(district_id){
    if(district_id){
      this.dbIntr.api_call(0,'/city','district_id='+district_id).pipe(pluck("data")).subscribe(res =>{
        this.city =res;
      })
    }else{
      this.city.length = 0;
      this.sharedFrm.get(['address','city_id']).reset('',{emitEvent:true});
    }
   }
   getPincodeMst(city_id){
    if(city_id){
      this.dbIntr.api_call(0,'/pincode','city_id='+city_id).pipe(pluck("data")).subscribe(res =>{
        this.pincodeMst =res;
      })
    }
    else{
      this.pincodeMst.length = 0
      this.sharedFrm.get(['address','pincode']).reset('',{emitEvent:false});
    }
   }
   submitSharedHolders(){
    const shareholders = new FormData();
    shareholders.append('type',this.sharedFrm.value.shareholders_type);
    shareholders.append('name',this.sharedFrm.value.name);
    shareholders.append('dob',this.sharedFrm.value.dob);
    shareholders.append('pan',this.sharedFrm.value.pan);
    shareholders.append('email',this.sharedFrm.value.email);
    shareholders.append('mob',this.sharedFrm.value.mobile);
    shareholders.append('cm_profile_id',this.sharedFrm.getRawValue().comp_profile_id);
    shareholders.append('percentage',this.sharedFrm.value.percentage);
    shareholders.append('date',this.sharedFrm.value.date);
    shareholders.append('no_of_share',this.sharedFrm.value.share_no);
    shareholders.append('certificate_no',this.sharedFrm.value.certificate_no);
    shareholders.append('registered_folio',this.sharedFrm.value.registered_folio);
    shareholders.append('distinctive_no_from',this.sharedFrm.value.distinctive_from);
    shareholders.append('distinctive_no_to',this.sharedFrm.value.distinctive_to);
    shareholders.append('nominee',this.sharedFrm.value.nominee_name);
    shareholders.append('add_1',this.sharedFrm.get(['address','add_line1']).value);
    shareholders.append('add_2',this.sharedFrm.get(['address','add_line2']).value);
    shareholders.append('country_id',this.sharedFrm.get(['address','country_id']).value);
    shareholders.append('state_id',this.sharedFrm.get(['address','state_id']).value);
    shareholders.append('district_id',this.sharedFrm.get(['address','dist_id']).value);
    shareholders.append('city_id',this.sharedFrm.get(['address','city_id']).value);
    shareholders.append('pincode',this.sharedFrm.get(['address','pincode']).value);
    shareholders.append('id',this.sharedFrm.value.id ? this.sharedFrm.value.id : 0);
     if(this.sharedFrm.value.shareholders_type=='T'){
      shareholders.append('remarks',this.sharedFrm.get(['share_transfer','remarks']).value);
      shareholders.append('trans_from_id',this.sharedFrm.get(['share_transfer','trans_form']).value);
      shareholders.append('upload_scan',typeof(this.sharedFrm.get(['share_transfer','file']).value) == 'string' ? '' : this.sharedFrm.get(['share_transfer','file']).value);
     }
    this.dbIntr.api_call(1,'/comp/sharedHolderAddEdit',shareholders).subscribe((res: any) =>{
      this.utility.showSnackbar(res.suc == 1 ? 'Share holders saved successfully':res.msg,res.suc);
      this.sendsavedsharedholderDtls.emit({data:res.data,id:this.sharedFrm.value.id});
      this.reset();
    })
   }
   getFile(ev){
    console.log(ev);
    this.sharedFrm.get(['share_transfer','upload_scan']).setValidators([fileValidators.fileSizeValidator(ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.sharedFrm.get(['share_transfer','upload_scan']).updateValueAndValidity();
    if (this.sharedFrm.get(['share_transfer','upload_scan']).status == 'VALID') {
      this.sharedFrm.get(['share_transfer','file'])?.patchValue(ev.target.files[0]);
      this.sharedFrm.get(['share_transfer','file_preview'])?.patchValue(this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(ev.target.files[0])));
    }
    else{
      this.sharedFrm.get(['share_transfer','file'])?.patchValue('');
      this.sharedFrm.get(['share_transfer','file_preview'])?.patchValue('')
    }
   }
   reset(){
    this.__no_of_shared_remaining =0;
    this.sharedFrm.patchValue({
      shareholders_type: 'E',
      name: '',
      dob: '',
      comp_profile_id: '',
      pan: '',
      address: {
        add_line1: '',
        add_line2:  '',
        country_id: '',
        state_id: '',
        dist_id: '',
        city_id: '',
        pincode: '',
      },
      mobile:'',
      email: '',
      certificate_no: '',
      date: '',
      share_no: '',
      registered_folio: '',
      distinctive_from: '',
      distinctive_to: '',
      nominee_name: '',
      percentage: '',
      share_transfer:{
        trans_form:'',
        upload_scan:'',
        file:'',
        file_preview: '',
        remarks:''
      },
      id:0
    });
     this.sharedFrm.get('shareholders_type').setValue('E',{emitEvent:false});
    // this.sharedFrm.get('id').reset(0,{emitEvent:false});
    this.setReset.emit('');
   }
   checkShareHolderExceed(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfShareHolderExceed(control.value).pipe(
        map(res => {
           if(control.value){
             return res ?  null : { shareHolderExceed: true };
           }
           return null
        })
      );
    };
    }
    checkIfShareHolderExceed(share_no):Observable<boolean>{
       return of(this.__no_of_shared_remaining >= share_no);

    }
}
