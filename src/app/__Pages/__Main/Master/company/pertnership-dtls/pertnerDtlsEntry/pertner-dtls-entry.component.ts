import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'pertner-dtls-entry',
  templateUrl: './pertner-dtls-entry.component.html',
  styleUrls: ['./pertner-dtls-entry.component.css']
})
export class PertnerDtlsEntryComponent implements OnInit {
  @Input() set pertnerShipDT(value){
    console.log(value);
    if(value){
      this.setPertnershipDtls(value);
    }
    else{
      this.setPertnershipDtls(null);
    }
    this.pertnershipDtls.patchValue({
      id:value ? value.id : 0
    })

  }
  @Output() getReset = new EventEmitter<any>();
  @Input() cmpDtlsMst: any=[];
  @Input() pertnershipMstDtls: any = [];
  @Input() country: any = [];
  @Input() set setFormDt(value){
    console.log(value);

  }
  @Output() setpertnershipDtls = new EventEmitter<any>();
  pertnershipDtls = new FormGroup({
    id: new FormControl(0),
    cm_profile_id: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    dob: new FormControl('',[Validators.required]),
    pan: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    mob: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    address: new FormGroup({
      add_1: new FormControl('',[Validators.required]),
      add_2: new FormControl(''),
      country_id: new FormControl('',[Validators.required]),
      state_id: new FormControl('',[Validators.required]),
      dist_id: new FormControl('',[Validators.required]),
      city_id: new FormControl('',[Validators.required]),
      pincode: new FormControl('',[Validators.required]),
    }),
    percentage: new FormControl('',[Validators.required])
  })
  state: any = [];
  district: any = [];
  city: any = [];
  pincodeMst: any = [];
  constructor(private dbIntr: DbIntrService,private utility: UtiliService) { }

  ngOnInit(): void {
  }



  ngAfterViewInit(){
            // this.pertnershipDtls.controls['id'].valueChanges.subscribe(res =>{
            //        if(res > 0){
            //               this.setPertnershipDtls(this.pertnershipMstDtls.filter(x => x.id == res)[0]);
            //        }
            //        else{
            //               this.setPertnershipDtls(null);
            //        }
            // })
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
      this.pertnershipDtls.get(['address','state_id']).reset('',{emitEvent:true});
    }

   }
   getDistrictMst(state_id){
    console.log(state_id);

    if(state_id){
      this.dbIntr.api_call(0,'/districts','state_id='+state_id).pipe(pluck("data")).subscribe(res =>{
        this.district =res;
      })
    } else{
      this.district.length = 0;
      this.pertnershipDtls.get(['address','dist_id']).reset('',{emitEvent:true});

    }
   }
   getCityMst(district_id){
    if(district_id){
      this.dbIntr.api_call(0,'/city','district_id='+district_id).pipe(pluck("data")).subscribe(res =>{
        this.city = res;
      })
    }else{
      this.city.length = 0;
      this.pertnershipDtls.get(['address','city_id']).reset('',{emitEvent:true});
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

    }
   }

   reset(){
    this.pertnershipDtls.patchValue({
      id:0
    });
    this.setPertnershipDtls(null);
    this.getReset.emit('');
  }

  submitPertnershipDtls(){
    const pernershipDtls = new FormData();
    pernershipDtls.append('id',this.pertnershipDtls.value.id ? this.pertnershipDtls.value.id : 0);
    pernershipDtls.append('cm_profile_id',this.pertnershipDtls.value.cm_profile_id);
    pernershipDtls.append('name',this.pertnershipDtls.value.name);
    pernershipDtls.append('dob',this.pertnershipDtls.value.dob);
    pernershipDtls.append('pan',this.pertnershipDtls.value.pan);
    pernershipDtls.append('mob',this.pertnershipDtls.value.mob);
    pernershipDtls.append('email',this.pertnershipDtls.value.email);
    pernershipDtls.append('add_1',this.pertnershipDtls.value.address.add_1);
    pernershipDtls.append('add_2',this.pertnershipDtls.value.address.add_2);
    pernershipDtls.append('country_id',this.pertnershipDtls.value.address.country_id);
    pernershipDtls.append('state_id',this.pertnershipDtls.value.address.state_id);
    pernershipDtls.append('district_id',this.pertnershipDtls.value.address.dist_id);
    pernershipDtls.append('city_id',this.pertnershipDtls.value.address.city_id);
    pernershipDtls.append('pincode',this.pertnershipDtls.value.address.pincode);
    pernershipDtls.append('percentage',this.pertnershipDtls.value.percentage);
    this.dbIntr.api_call(1,'/comp/partnershipAddEdit',pernershipDtls).subscribe((res: any) =>{
         this.utility.showSnackbar(res.suc == 1 ? 'Pertner Details Saved Successfully' : res.msg ,res.suc)
         this.setpertnershipDtls.emit({data:res.data,id:this.pertnershipDtls.value.id});
         this.reset();
        })
  }

  setPertnershipDtls(res){
    this.state.length = 0;
    this.district.length = 0;
    this.city.length = 0;
    this.pincodeMst.length = 0;
      setTimeout(() => {
    this.pertnershipDtls.patchValue({
      cm_profile_id: global.getActualVal(res?.cm_profile_id),
      name: global.getActualVal(res?.name),
      dob: global.getActualVal(res?.dob),
      pan: global.getActualVal(res?.pan),
      mob: global.getActualVal(res?.mob),
      email: global.getActualVal(res?.email),
      address:{
        add_1: global.getActualVal(res?.add_1),
        add_2: global.getActualVal(res?.add_2),
        country_id: global.getActualVal(res?.country_id),
        state_id: global.getActualVal(res?.state_id),
        dist_id: global.getActualVal(res?.district_id),
        city_id: global.getActualVal(res?.city_id),
        pincode: global.getActualVal(res?.pincode)
      },
        percentage: global.getActualVal(res?.percentage)
    })
  },100)
  }


}
