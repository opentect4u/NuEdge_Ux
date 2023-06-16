import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-profile-entry',
  templateUrl: './profile-entry.component.html',
  styleUrls: ['./profile-entry.component.css']
})
export class ProfileEntryComponent implements OnInit {

  @Input() country: any = []; /*** Holding the country details */
  @Input() comp_type: any= []; /** Holding the type of company*/
  @Output() getAddCompany = new EventEmitter<any>();  /** Event emit after click on submit button to push or modify in the array*/
  @Output() getReset = new EventEmitter<any>(); /** Event emit after click on reset button to clear the form field */
   /**** Set the form Data after click on edit button inside the report */
  @Input() set setFormDt(value){
      if(value){
        this.setProfile(value);
      }
      else{
         this.profileFrm.reset({emitEvent:false});
      }
  }
/** End */

  state: any = [];
  district: any = [];
  city: any = [];
  pincodeMst: any = [];
  allowedExtensions = ['jpg','png','jpeg'];
  profileFrm = new FormGroup({

    proprietor_ship_firm:new FormGroup({
       establishment_name: new FormControl(''),
       proprietor_name: new FormControl('')
    }),

     comp_type_id: new FormControl('',[Validators.required]),
     name: new FormControl(''),
     cin_no: new FormControl(''),
     reg_address: new FormGroup({
      add_line1: new FormControl('',[Validators.required]),
      add_line2: new FormControl(''),
      country_id: new FormControl('',[Validators.required]),
      state_id: new FormControl('',[Validators.required]),
      dist_id: new FormControl('',[Validators.required]),
      city_id: new FormControl('',[Validators.required]),
      pincode: new FormControl('',[Validators.required]),
      website: new FormControl('')
     }),
     fb_url:new FormControl(''),
     linkedIn_url: new FormControl(''),
     twitter_url: new FormControl(''),
     instagram_url: new FormControl(''),
     pan_no: new FormControl('',[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
     gst_no: new FormControl(''),
     contact_no: new FormControl(''),
     email: new FormControl(''),
     date_of_incorporation: new FormControl(''),
     logo: new FormControl('',[fileValidators.fileExtensionValidator(this.allowedExtensions)]),
     file: new FormControl(''),
     file_preview: new FormControl(''),
     blog_url: new FormControl(''),
     comp_details_id: new FormControl(''),
     comp_default: new FormControl(false)
  })
  constructor(private dbIntr: DbIntrService,private utility: UtiliService) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.profileFrm.get('comp_type_id').valueChanges.subscribe(res =>{
      this.profileFrm.get('cin_no').setValidators((res == 1 || res == 2) ? [Validators.required] : null);
      this.profileFrm.get('name').setValidators((res != 4) ? [Validators.required] : null) ;
      this.profileFrm.get('date_of_incorporation').setValidators((res != 4) ? [Validators.required] : null) ;
      this.profileFrm.get('email').setValidators((res != 4) ? [Validators.required,Validators.email] : null) ;
      this.profileFrm.get('contact_no').setValidators((res != 4) ? [Validators.required] : null) ;
      this.profileFrm.get(['proprietor_ship_firm','establishment_name']).setValidators(res == 4 ? [Validators.required] : null) ;
      this.profileFrm.get(['proprietor_ship_firm','proprietor_name']).setValidators(res == 4 ? [Validators.required] : null) ;
      this.profileFrm.get(['proprietor_ship_firm','establishment_name']).updateValueAndValidity();
      this.profileFrm.get(['proprietor_ship_firm','proprietor_name']).updateValueAndValidity();
      this.profileFrm.get('email').updateValueAndValidity();
      this.profileFrm.get('contact_no').updateValueAndValidity();
      this.profileFrm.get('date_of_incorporation').updateValueAndValidity();
      this.profileFrm.get('name').updateValueAndValidity();
      this.profileFrm.get('cin_no').updateValueAndValidity();
    })
  }

  setProfile(profile){
    this.state.length = 0;
  this.district.length = 0;
  this.city.length = 0;
  this.pincodeMst.length = 0;
    setTimeout(() => {
    this.profileFrm.patchValue({
      comp_details_id:global.getActualVal(profile?.id),
      comp_type_id:global.getActualVal(profile?.type_of_comp),
      name:global.getActualVal(profile?.name),
      cin_no:global.getActualVal(profile?.cin_no),
      date_of_incorporation:global.getActualVal(profile?.date_of_inc),
      pan_no:global.getActualVal(profile?.pan),
      gst_no:global.getActualVal(profile?.gstin),
      contact_no:global.getActualVal(profile?.contact_no),
      fb_url:global.getActualVal(profile?.facebook),
      linkedIn_url: global.getActualVal(profile?.linkedin),
      twitter_url: global.getActualVal(profile?.twitter),
      instagram_url:global.getActualVal(profile?.instagram),
      email:global.getActualVal(profile?.email),
      file_preview:profile?.logo ? `${environment.company_logo_url + profile?.logo}` : '',
      file:profile?.logo ? `${environment.company_logo_url + profile?.logo}` : '',
      reg_address:{
        add_line1: global.getActualVal(profile?.add_1),
        add_line2: global.getActualVal(profile?.add_2),
        country_id:global.getActualVal(profile?.country_id),
        pincode:global.getActualVal(profile?.pincode),
        state_id:global.getActualVal(profile?.state_id),
        city_id:global.getActualVal(profile?.city_id),
        dist_id:global.getActualVal(profile?.district_id),
        website:global.getActualVal(profile?.website),
      },
      proprietor_ship_firm:{
        establishment_name: global.getActualVal(profile?.establishment_name),
        proprietor_name: global.getActualVal(profile?.proprietor_name)
     }
    });
    }, 100);
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
      this.profileFrm.get(['reg_address','state_id']).reset('',{emitEvent:true});
    }

   }
   getDistrictMst(state_id){
    if(state_id){
      this.dbIntr.api_call(0,'/districts','state_id='+state_id).pipe(pluck("data")).subscribe(res =>{
        this.district =res;
      })
    } else{
      this.district.length = 0;
      this.profileFrm.get(['reg_address','dist_id']).reset('',{emitEvent:true});
    }
   }
   getCityMst(district_id){
    if(district_id){
      this.dbIntr.api_call(0,'/city','district_id='+district_id).pipe(pluck("data")).subscribe(res =>{
        this.city =res;
      })
    }else{
      this.city.length = 0;
      this.profileFrm.get(['reg_address','city_id']).reset('',{emitEvent:true});
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
      this.profileFrm.get(['reg_address','pincode']).reset('',{emitEvent:false});
    }
   }
   submitProfile(){
   const profileFrmData = new FormData();
   profileFrmData.append('type_of_comp',this.profileFrm.value.comp_type_id);
   if(this.profileFrm.value.comp_type_id == 1 || this.profileFrm.value.comp_type_id == 2) {
    profileFrmData.append('cin_no',this.profileFrm.value.cin_no);
     profileFrmData.append('name',this.profileFrm.value.name);
     profileFrmData.append('date_of_inc',this.profileFrm.value.date_of_incorporation);
   }
   if(this.profileFrm.value.comp_type_id == 3){
    profileFrmData.append('name',this.profileFrm.value.name);
    profileFrmData.append('date_of_inc',this.profileFrm.value.date_of_incorporation);
    }
    if(this.profileFrm.value.comp_type_id == 4){
      profileFrmData.append('establishment_name',this.profileFrm.get(['proprietor_ship_firm','establishment_name']).value);
      profileFrmData.append('proprietor_name',this.profileFrm.get(['proprietor_ship_firm','proprietor_name']).value);
    }
   profileFrmData.append('pan',this.profileFrm.value.pan_no);
   profileFrmData.append('gstin',this.profileFrm.value.gst_no);
   profileFrmData.append('contact_no',this.profileFrm.value.contact_no);
   profileFrmData.append('email',this.profileFrm.value.email);
   profileFrmData.append('add_1',this.profileFrm.get(['reg_address','add_line1']).value);
   profileFrmData.append('add_2',this.profileFrm.get(['reg_address','add_line2']).value);
   profileFrmData.append('country_id',this.profileFrm.get(['reg_address','country_id']).value);
   profileFrmData.append('state_id',this.profileFrm.get(['reg_address','state_id']).value);
   profileFrmData.append('district_id',this.profileFrm.get(['reg_address','dist_id']).value);
   profileFrmData.append('city_id',this.profileFrm.get(['reg_address','city_id']).value);
   profileFrmData.append('pincode',this.profileFrm.get(['reg_address','pincode']).value);
   profileFrmData.append('comp_default',this.profileFrm.value.comp_default);
   profileFrmData.append('logo',
   typeof(this.profileFrm.value.file) == 'string' ? ''  : global.getActualVal( this.profileFrm.value.file)
   );
   profileFrmData.append('website',this.profileFrm.get(['reg_address','website']).value);
   profileFrmData.append('facebook',global.getActualVal(this.profileFrm.value.fb_url));
   profileFrmData.append('linkedin',global.getActualVal(this.profileFrm.value.linkedIn_url));
   profileFrmData.append('twitter',global.getActualVal(this.profileFrm.value.twitter_url));
   profileFrmData.append('instagram',global.getActualVal(this.profileFrm.value.instagram_url));
   profileFrmData.append('blog',global.getActualVal(this.profileFrm.value.blog_url));
   profileFrmData.append('comp_details_id',this.profileFrm.value.comp_details_id);


   this.dbIntr.api_call(1,'/comp/profileAddEdit',profileFrmData).subscribe((res: any) =>{
    this.utility.showSnackbar(res.suc == 1 ? ('Profile'+ (this.profileFrm.value.comp_details_id ? ' updated '  : ' added ') +'successfully') : 'Profile submission failed',res.suc == 1)
    this.getAddCompany.emit({id:this.profileFrm.value.comp_details_id,data:res.data});
    // this.profileFrm.reset({emitEvent:false});
    this.reset();
  })
   }

   getFile(ev){
    this.profileFrm.get('logo').setValidators([fileValidators.fileSizeValidator(ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.profileFrm.get('logo').updateValueAndValidity();
    if (this.profileFrm.get('logo').status == 'VALID') {
       const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.profileFrm.get('file_preview')?.patchValue(reader.result);
      reader.readAsDataURL(file);
      this.profileFrm.get('file')?.patchValue(ev.target.files[0]);
    }
    else{
      this.profileFrm.get('file')?.patchValue('');
      this.profileFrm.get('file_preview')?.patchValue('')
    }
   }
   reset(){
    this.profileFrm.patchValue({
      comp_type_id:'',
      name:'',
      cin_no:'',
      date_of_incorporation:'',
      pan_no:'',
      gst_no:'',
      contact_no:'',
      fb_url:'',
      linkedIn_url: '',
      twitter_url: '',
      instagram_url:'',
      logo:'',
      email:'',
      file_preview:'',
      file:'',
      reg_address:{
        add_line1: '',
        add_line2: '',
        pincode:'',
        country_id:'',
        state_id:'',
        city_id:'',
      },
    });
    this.profileFrm.get('comp_details_id').setValue('',{emitEvent:false});
    this.getReset.emit();
   }
}
