import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {
  step:number = 2
  step_wizard = [
    {
      id:1,
      name:'Customer Details',
      value:1
    },
    {
      id:2,
      name:'Contact Details',
      value:2
    },
    {
      id:3,
      name:'Bank Details',
      value:3
    },
    {
      id:4,
      name:'Nominee',
      value:4
    },
    {
      id:5,
      name:'Additional Details',
      value:5
    },
    {
      id:6,
      name:'Final Submit',
      value:6
    }
  ];
  step_wizard_title:string = 'Customer Details'
  md_country = [];
  md_state = [];
  md_city = [];
  md_district = [];
  md_pincode = [];
  private shouldScroll = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  new_client_form = new FormGroup({
      customer_dtls:new FormGroup({
          title:new FormControl('',[Validators.required]),
          pan:new FormControl('',[Validators.required]),
          first_name:new FormControl('',[Validators.required]),
          middle_name:new FormControl(''),
          last_name:new FormControl('',[Validators.required]),
          dob:new FormControl('',[Validators.required]),
          gender:new FormControl('',[Validators.required]),
          occupation:new FormControl(''),
          kyc_status:new FormControl('',[Validators.required]),
          inv_ckyc:new FormControl('',[Validators.required]),
      
      }),
      contact_dtls:new FormGroup({
        address:new FormControl('',[Validators.required]),
        country_id:new FormControl('',{validators:[Validators.required],updateOn:'blur'}),
        state_id: new FormControl('',{validators:[Validators.required],updateOn:'blur'}),
        city_id:new FormControl('',{validators:[Validators.required],updateOn:'blur'}),
        district_id:new FormControl('',{validators:[Validators.required],updateOn:'blur'}),
        pincode_id:new FormControl('',[Validators.required]),
        mobile:new FormControl('',[Validators.required]),
        mobile_rel:new FormControl('',[Validators.required]),
        email:new FormControl('',[Validators.required]),
        email_rel:new FormControl('',[Validators.required]),
      }),
      bank_dtls:new FormGroup({
          bank:new FormArray([])
      }),
      nominee_dtls:new FormGroup({
        nominee_number:new FormControl(3),
        nominee:new FormArray([]),
        nominee_opted:new FormControl('')
      }),
      final_submit_acknowledgemnt:new FormControl(false)
  })

  constructor(private dbIntr:DbIntrService) { }

  ngOnInit(): void {}

  ngAfterViewInit():void {
    this.new_client_form.get('nominee_dtls.nominee_opted').valueChanges.subscribe(res => {
      console.log(res);
    })

    this.new_client_form.get('nominee_dtls.nominee_number').valueChanges.subscribe(res =>{
          console.log(res);
          if(res){
              this.addNominee(res)
          }
          else{
            this.nominee.clear();
          }
    })

    this.new_client_form.get('contact_dtls.country_id')
    .valueChanges.subscribe(res =>{
      this.md_state = [];
        if(res){
          this.getStateByCountryId(res);
        }
    })

    this.new_client_form.get('contact_dtls.state_id')
    .valueChanges.subscribe(res =>{
      this.md_district = [];
        if(res){
          this.getDistrictByStateId(res);
        }
    })

    this.new_client_form.get('contact_dtls.district_id')
    .valueChanges.subscribe(res =>{
      this.md_city = [];
        if(res){
          this.getcityByDistrictId(res);
        }
    })

    this.new_client_form.get('contact_dtls.city_id')
    .valueChanges.subscribe(res =>{
      this.md_pincode = [];
        if(res){
          this.getpinCodeByCityId(res);
        }
    })
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  addNominee = (range) =>{
    this.nominee.clear();
        for(let i=0;i<range;i++){
          this.nominee.push(this.setNominee((100 / range)))
        }
  }

  get nominee(): FormArray {
    return this.new_client_form.get('nominee_dtls.nominee') as FormArray;
  }

  get bank(): FormArray {
    return this.new_client_form.get('bank_dtls.bank') as FormArray;
  }


  // setNominee(
  //   percentage=100,
  //   title='',first_name='',middle_name='',last_name='',
  //   pan='',
  //   dob='',gender='',occupation='',kyc_status='',inv_ckyc=''){
  //   return new FormGroup({
  //     title:new FormControl(title ? title : ''),
  //     pan: new FormControl(pan ? pan : ''),
  //     first_name: new FormControl(first_name ? first_name : ''),
  //     last_name: new FormControl(last_name ? last_name : ''),
  //     middle_name: new FormControl(middle_name ? middle_name : ''),
  //     dob: new FormControl(dob ? dob : ''),
  //     gender: new FormControl(gender ? gender : ''),
  //     occupation: new FormControl(occupation ? occupation : ''),
  //     kyc_status: new FormControl(kyc_status ? kyc_status : ''),
  //     inv_ckyc: new FormControl(inv_ckyc ? inv_ckyc : ''),
  //     percentage:new FormControl(percentage.toFixed(2))
  //   })
  // }
  setNominee(
    nominee_percentage=100,
    nominee_type='',
    nominee_pan='',
    nominee_name='',
    nominee_dob='',
    nominee_address1='',
    nominee_city='',
    nominee_address2='',
    nominee_state='',
    nominee_address3='',
    nominee_pincode='',
    nominee_relationship='',
    nominee_gaurdian_pan='',
    nominee_gaurdian_name='',
    nominee_gaurdian_rel=''
  ){
    return new FormGroup({
      nominee_type:new FormControl(nominee_type ? nominee_type : ''),
      nominee_pan: new FormControl(nominee_pan ? nominee_pan : ''),
      nominee_name: new FormControl(nominee_name ? nominee_name : ''),
      nominee_dob: new FormControl(nominee_dob ? nominee_dob : ''),
      nominee_address1: new FormControl(nominee_address1 ? nominee_address1 : ''),
      nominee_city: new FormControl(nominee_city ? nominee_city : ''),
      nominee_address2: new FormControl(nominee_address2 ? nominee_address2 : ''),
      nominee_state: new FormControl(nominee_state ? nominee_state : ''),
      nominee_address3: new FormControl(nominee_address3 ? nominee_address3 : ''),
      nominee_pincode: new FormControl(nominee_pincode ? nominee_pincode : ''),
      nominee_relationship: new FormControl(nominee_relationship ? nominee_relationship : ''),
      nominee_percentage:new FormControl(nominee_percentage.toFixed(2)),
      nominee_gaurdian_name:new FormControl(nominee_gaurdian_name ? nominee_gaurdian_name : ''),
      nominee_gaurdian_pan:new FormControl(nominee_gaurdian_pan ? nominee_gaurdian_pan : ''),
      nominee_gaurdian_rel:new FormControl(nominee_gaurdian_rel ? nominee_gaurdian_rel : ''),
    })
  }

  setBankDetails(
    ifsc_code:string='',
    acc_type:string='',
    acc_no:string='',
    micr:string='',
    bank_name:string='',
    bank_branch:string='',
    bank_address:string='',
    bank_city:string='',
    bank_district:string='',
    bank_state:string='',
    bank_pincode:string='',
    default_bank_flag:string='',
  ){
    return new FormGroup({
      ifsc_code:new FormControl(ifsc_code ? ifsc_code : ''),
      acc_type: new FormControl(acc_type ? acc_type : ''),
      acc_no: new FormControl(acc_no ? acc_no : ''),
      micr: new FormControl(micr ? micr : ''),
      bank_name: new FormControl(bank_name ? bank_name : ''),
      bank_branch: new FormControl(bank_branch ? bank_branch : ''),
      bank_address: new FormControl(bank_address ? bank_address : ''),
      bank_city: new FormControl(bank_city ? bank_city : ''),
      bank_district: new FormControl(bank_district ? bank_district : ''),
      bank_state: new FormControl(bank_state ? bank_state : ''),
      bank_pincode:new FormControl(bank_pincode ? bank_pincode : ''),
      default_bank_flag:new FormControl(default_bank_flag ? default_bank_flag : ''),
    })
  }


  changeStep = (item) => {
    this.step=item.id;
    this.step_wizard_title=item.name;
    if(item.id == 2){
      this.getCountry();
    }
    else if(item.id == 3){
      this.bank.clear();
      this.bank.push(this.setBankDetails())
    }
    else if(item.id == 4){
      // this.nominee.clear();
      this.addNominee(3)
    }
  }

  getCountry = () => {
    if(this.md_country.length == 0){
      this.dbIntr.api_call(0,'/country',null).pipe(pluck('data')).subscribe((res:any) =>{
        this.md_country = res;
     })
    }
  }

  getStateByCountryId = (countryId) =>{
      if(this.md_state.length == 0){
        this.dbIntr.api_call(0,`/states?country_id=${countryId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
          this.md_state = res;
       })
      }
  }

  getDistrictByStateId = (stateId) =>{
    if(this.md_district.length == 0){
      this.dbIntr.api_call(0,`/districts?state_id=${stateId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.md_district = res;
     })
    }
  }

  getcityByDistrictId = (districtId) =>{
    if(this.md_city.length == 0){
      this.dbIntr.api_call(0,`/city?district_id=${districtId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.md_city = res;
     })
    }
  }

  getpinCodeByCityId = (cityId) =>{
    if(this.md_pincode.length == 0){
      this.dbIntr.api_call(0,`/pincode?city_id=${cityId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.md_pincode = res;
     })
    }
  }

  addMoreBank(){
    this.bank.push(this.setBankDetails());
    this.shouldScroll = true;
  }
  private scrollToBottom(): void {
    try {
      // this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }
  deleteBank(index){
    this.bank.removeAt(index)
  }
}
