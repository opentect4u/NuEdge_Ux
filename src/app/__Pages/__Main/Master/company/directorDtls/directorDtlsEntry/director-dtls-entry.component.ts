import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'app-director-dtls-entry',
  templateUrl: './director-dtls-entry.component.html',
  styleUrls: ['./director-dtls-entry.component.css']
})
export class DirectorDtlsEntryComponent implements OnInit {
  @Input() country: any = [];
  @Input() cmpDtlsMst : any = [];
  @Input() directorMst: any= [];
  @Output() getReset = new EventEmitter<any>(); /** Event emit after click on reset button to clear the form field */
  @Input() set setFormDt(value){
    console.log(value);

    if(value){
      this.setDirectorDtls(value);
    }
    else{
      this.directorDtlsFrm.reset({emitEvent:false});
    }
    this.directorDtlsFrm.patchValue({
      id: value ? value?.id : ''
    })
  }
  @Output() getDirectorDtls = new EventEmitter<any>();
  state: any = [];
  district: any = [];
  city: any = [];
  pincodeMst: any = [];
  directorDtlsFrm = new FormGroup({
    comp_profile_id: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    address: new FormGroup({
     add_line1: new FormControl('',[Validators.required]),
     add_line2: new FormControl(''),
     country_id: new FormControl('',[Validators.required]),
     state_id: new FormControl('',[Validators.required]),
     dist_id: new FormControl('',[Validators.required]),
     city_id: new FormControl('',[Validators.required]),
     pincode: new FormControl('',[Validators.required])
    }),
    pan_no: new FormControl('',[Validators.required]),
    contact_no: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    dob: new FormControl('',[Validators.required]),
    din_no: new FormControl('',[Validators.required]),
    valid_frm: new FormControl('',[Validators.required]),
    valid_to: new FormControl('',[Validators.required]),
    id: new FormControl('')
 })
  constructor(private dbIntr: DbIntrService,private utility: UtiliService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){}

  setDirectorDtls(director){
  this.state.length = 0;
  this.district.length = 0;
  this.city.length = 0;
  this.pincodeMst.length = 0;
    setTimeout(() => {
    this.directorDtlsFrm.patchValue({
      comp_profile_id:global.getActualVal(director?.cm_profile_id),
      name:global.getActualVal(director?.name),
      cin_no:global.getActualVal(director?.cin_no),
      dob: global.getActualVal(director?.dob),
      pan_no:global.getActualVal(director?.pan),
      din_no: global.getActualVal(director?.din_no),
      contact_no:global.getActualVal(director?.mob),
      valid_frm: global.getActualVal(director?.valid_from),
      valid_to: global.getActualVal(director?.valid_to),
      email:global.getActualVal(director?.email),
      address:{
        add_line1: global.getActualVal(director?.add_1),
        add_line2: global.getActualVal(director?.add_2),
        country_id:global.getActualVal(director?.country_id),
        pincode:global.getActualVal(director?.pincode),
        state_id:global.getActualVal(director?.state_id),
        city_id:global.getActualVal(director?.city_id),
        dist_id:global.getActualVal(director?.district_id),
      }
    });
    }, 100);
  }


  getselectedItem(ev){
    console.log(ev);
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
      this.directorDtlsFrm.get(['address','state_id']).reset('',{emitEvent:true});
    }

   }
   getDistrictMst(state_id){
    if(state_id){
      this.dbIntr.api_call(0,'/districts','state_id='+state_id).pipe(pluck("data")).subscribe(res =>{
        this.district =res;
      })
    } else{
      this.district.length = 0;
      this.directorDtlsFrm.get(['address','dist_id']).reset('',{emitEvent:true});
    }
   }
   getCityMst(district_id){
    if(district_id){
      this.dbIntr.api_call(0,'/city','district_id='+district_id).pipe(pluck("data")).subscribe(res =>{
        this.city =res;
      })
    }else{
      this.city.length = 0;
      this.directorDtlsFrm.get(['address','city_id']).reset('',{emitEvent:true});
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
      this.directorDtlsFrm.get(['address','pincode']).reset('',{emitEvent:false});
    }
   }
   submitDirectorDetails(){
   console.log(this.directorDtlsFrm.value);
       const directorDtlsFrmData =  new FormData();
       directorDtlsFrmData.append('cm_profile_id',global.getActualVal(this.directorDtlsFrm.value.comp_profile_id));
       directorDtlsFrmData.append('name',global.getActualVal(this.directorDtlsFrm.value.name));
       directorDtlsFrmData.append('dob',global.getActualVal(this.directorDtlsFrm.value.dob));
       directorDtlsFrmData.append('pan',global.getActualVal(this.directorDtlsFrm.value.pan_no));
       directorDtlsFrmData.append('valid_from',global.getActualVal(this.directorDtlsFrm.value.valid_frm));
       directorDtlsFrmData.append('valid_to',global.getActualVal(this.directorDtlsFrm.value.valid_to));
       directorDtlsFrmData.append('mob',global.getActualVal(this.directorDtlsFrm.value.contact_no));
       directorDtlsFrmData.append('email',global.getActualVal(this.directorDtlsFrm.value.email));
       directorDtlsFrmData.append('din_no',global.getActualVal(this.directorDtlsFrm.value.din_no));
       directorDtlsFrmData.append('add_1',global.getActualVal(this.directorDtlsFrm.get(['address','add_line1']).value));
       directorDtlsFrmData.append('add_2',global.getActualVal(this.directorDtlsFrm.get(['address','add_line2']).value));
       directorDtlsFrmData.append('country_id',global.getActualVal(this.directorDtlsFrm.get(['address','country_id']).value));
       directorDtlsFrmData.append('state_id',global.getActualVal(this.directorDtlsFrm.get(['address','state_id']).value));
       directorDtlsFrmData.append('district_id',global.getActualVal(this.directorDtlsFrm.get(['address','dist_id']).value));
       directorDtlsFrmData.append('city_id',global.getActualVal(this.directorDtlsFrm.get(['address','city_id']).value));
       directorDtlsFrmData.append('pincode',global.getActualVal(this.directorDtlsFrm.get(['address','pincode']).value));
       directorDtlsFrmData.append('id', this.directorDtlsFrm.value.id ? global.getActualVal(this.directorDtlsFrm.value.id) : 0);


       this.dbIntr.api_call(1,'/comp/directorAddEdit',directorDtlsFrmData).subscribe((res: any) =>{
        this.utility.showSnackbar(res.suc == 1 ? ('Director'+ (this.directorDtlsFrm.value.id ? ' updated '  : ' added ') +'successfully') : 'Profile submission failed',res.suc == 1)
        this.getDirectorDtls.emit({id:this.directorDtlsFrm.value.id ,data:res.data});
        this.reset();
       })
   }
   reset(){
    this.directorDtlsFrm.patchValue({
      comp_profile_id:'',
      name:'',
      din_no:'',
      dob:'',
      pan_no:'',
      contact_no:'',
      email:'',
      valid_frm:'',
      valid_to:'',
      address:{
        add_line1: '',
        add_line2: '',
        country_id:'',
        pincode:'',
        state_id:'',
        city_id:'',
        dist_id:'',
      }
    });
    this.directorDtlsFrm.get('id').setValue('',{emitEvent:false});
    this.getReset.emit();
   }
}
