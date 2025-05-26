import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {
  custEntry:any;
  step:number = 0;
  step_content_name = 'customer_dtls'
  step_wizard = [
    {
      id:0,
      name:'Customer Details',
      value:0,
      formControlName:'customer_dtls',
    },
    {
      id:1,
      name:'NRI Details',
      value:1,
      formControlName:'foreign_contact_details'
    },
    {
      id:2,
      name:'Contact Details',
      value:2,
      formControlName:'contact_dtls'
    },
    {
      id:3,
      name:'Bank Details',
      value:3,
      formControlName:'bank_dtls'
    },
    {
      id:4,
      name:'Nominee',
      value:4,
      formControlName:'nominee_dtls'
    },
    {
      id:5,
      name:'Additional Details',
      value:5,
       formControlName:'additional_dtls'
    },
    {
      id:6,
      name:'Final Submission',
      value:6,
       formControlName:'final_submit'

    }
  ];
  step_wizard_title:string = 'Customer Details'
  md_country = [];
  md_state = [];
  md_city = [];
  md_district = [];
  md_pincode = [];
  md_tax = [];
  md_occupation = [];
  md_exempt_category = [];
  md_gaurdian_exempt_category = [];
  md_accountType=[];
  md_divPayMode = [];
  mdMobileEmailDecFlag = [];
  mdCommunicationMode = [];
  md_relationship = [];
  md_clientHolding = [];
  md_nominee_state = [];
  private shouldScroll = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  new_client_form = new FormGroup({
      customer_dtls:new FormGroup({
          client_code:new FormControl(''),
          title:new FormControl(''),
          pan:new FormControl({value:'',disabled:true}),
          first_name:new FormControl(''),
          middle_name:new FormControl(''),
          last_name:new FormControl(''),
          dob:new FormControl(''),
          gender:new FormControl(''),
          occupation:new FormControl(''),
          // kyc_status:new FormControl(''),
          // inv_ckyc:new FormControl(''),
          kyc_type:new FormControl(''),
          ckyc_number:new FormControl(''),
          exempt_ref_number:new FormControl(''),
          aadhaar_updated:new FormControl('N'),
          joint_holder:new FormArray([]),
          guardian_first_name:new FormControl(''),
          guardian_middle_name:new FormControl(''),
          guardian_last_name:new FormControl(''),
          guardian_dob:new FormControl(''),
          guardian_pan_exempt:new FormControl(''),
          guardian_exempt_category:new FormControl({value:'',disabled:true}),
          guardian_pan:new FormControl({value:'',disabled:true}),
          guardian_kyc_type:new FormControl(''),
          guardian_ckyc_number:new FormControl(''),
          guardian_exempt_ref_number:new FormControl(''),
          pan_exempt:new FormControl(''),
          exempt_category:new FormControl({value:'',disabled:true}),
          client_type:new FormControl('')
      }),
      contact_dtls:new FormGroup({
         address1:new FormControl(''),
         address2:new FormControl(''),
         address3:new FormControl(''),
        country_id:new FormControl('',{updateOn:'blur'}),
        state_id: new FormControl('',{updateOn:'blur'}),
        city_id:new FormControl('',{updateOn:'blur'}),
        district_id:new FormControl('',{updateOn:'blur'}),
        pincode_id:new FormControl(''),
        mobile:new FormControl('',{updateOn:'blur'}),
        mobile_rel:new FormControl(''),
        email:new FormControl('',{updateOn:'blur'}),
        email_rel:new FormControl(''),
        residential_fax:new FormControl(''),
        residential_phone:new FormControl(''),
        office_fax:new FormControl(''),
        office_phone:new FormControl(''),
        communication_mode:new FormControl('')
      }),
      foreign_contact_details:new FormGroup({
          foreign_address2:new FormControl(''), 
          foreign_address3:new FormControl(''), 
          foreign_address1:new FormControl('',[Validators.required]), 
          foreign_city:new FormControl('',[Validators.required]), 
          foreign_state:new FormControl('',[Validators.required]), 
          sea_fears:new FormControl("No"), 
          foreign_pincode:new FormControl('',[Validators.required]), 
          foreign_country:new FormControl('',[Validators.required]), 
          foreign_address_residential_phone:new FormControl(''), 
          foreign_address_office_phone:new FormControl(''), 
          foreign_address_residential_fax:new FormControl(''), 
          foreign_address_office_fax:new FormControl(''), 

      }),
      bank_dtls:new FormGroup({
          bank:new FormArray([])
      }),
      nominee_dtls:new FormGroup({
        nominee_number:new FormControl({value:'',disabled:true}),
        nominee:new FormArray([]),
        nominee_opted:new FormControl(''),
        authentication_mode:new FormControl('')
      }),
      // final_submit_acknowledgemnt:new FormControl(false),
      additional_dtls:new FormGroup({
        map_in_id:new FormControl(''),
        paperless_flag:new FormControl(''),
        lei_no:new FormControl('',{updateOn:'blur'}),
        lei_validity:new FormControl(''),
        pms:new FormControl(''),
        default_dp:new FormControl(''),
        cdsl_dpid:new FormControl(''),
        cdslclt_id:new FormControl(''),
        cmbp_id:new FormControl(''),
        nsdldp_id:new FormControl(''),
        nsdlclt_id:new FormControl(''),
        div_pay_mode:new FormControl('')
      }),
      final_submit:new FormGroup({
        final_submit_acknowledgemnt:new FormControl(false),
        created_by:new FormControl('NSE')
      })
  })

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    this.fetchTaxStatus();
    this.fetchClientModeOfHolding();
  }

    fetchTaxStatus = () =>{
        this.dbIntr.api_call_for_nuedge_online(0,'/taxStatus',null).pipe(pluck('data'))
        .subscribe((res:any) =>{
              this.md_tax = res;
        })
    }

    fetchClientModeOfHolding = () =>{
          this.dbIntr.api_call_for_nuedge_online(0,'/clientHolding',null)
          .pipe(pluck('data'))
          .subscribe((res:any) =>{
              this.md_clientHolding = res;
          })
    }

    fetchOccupation = () =>{
      if(this.md_occupation.length == 0){
        this.dbIntr.api_call_for_nuedge_online(0,'/occupationCode',null)
          .pipe(pluck('data'))
          .subscribe((res:any) =>{
            console.log(res)
            this.md_occupation = res;
          })
      } 
    }

    fetchExemptCategoryDependOnPanExempt = () =>{
        if(this.md_exempt_category.length == 0){
          this.dbIntr.api_call_for_nuedge_online(0,'/panExemptCategory',null)
            .pipe(pluck('data'))
            .subscribe((res:any) =>{this.md_exempt_category = res;})
        } 
    }

    fetchGaurdianExemptCategoryDependOnGaurdianPanExempt = () =>{
        if(this.md_gaurdian_exempt_category.length == 0){
          this.dbIntr.api_call_for_nuedge_online(0,'/panExemptCategory',null)
            .pipe(pluck('data'))
            .subscribe((res:any) =>{this.md_gaurdian_exempt_category = res;})
        } 
    }

    fetchAccountType = () =>{
      if(this.md_accountType.length == 0){
          this.dbIntr.api_call_for_nuedge_online(0,'/accountType',null)
            .pipe(pluck('data'))
            .subscribe((res:any) =>{this.md_accountType = res;})
        } 
    }

    fetchDividendPayMode = () =>{
       if(this.md_divPayMode.length == 0){
        this.dbIntr.api_call_for_nuedge_online(0,'/dividendPaymode',null)
        .pipe(pluck('data'))
        .subscribe((res:any) =>{
            this.md_divPayMode = res;
        })
       } 
    }

    fetchRelationShip = () =>{
          if(this.md_relationship.length == 0){
              this.dbIntr.api_call_for_nuedge_online(0,'/relationship',null)
              .pipe(pluck('data'))
              .subscribe((res:any) =>{
                  this.md_relationship = res;
              })
          }
    }

  ngAfterViewInit():void {

     this.new_client_form.get('customer_dtls.kyc_type')
    .valueChanges.subscribe(res => {
      this.new_client_form.get('customer_dtls.ckyc_number').setValue('');
       if(res == 'C'){
          this.new_client_form.get('customer_dtls.ckyc_number').setValidators([Validators.required]);
       }
       else{
        this.new_client_form.get('customer_dtls.ckyc_number').removeValidators([Validators.required]);
       }
       this.new_client_form.get('customer_dtls.ckyc_number').updateValueAndValidity({emitEvent:false});
    })

    //  this.new_client_form.get('contact_dtls.email')
    // .valueChanges.subscribe(res => {
    //   this.new_client_form.get('contact_dtls.email_rel').setValue('');
    //    if(res){
    //       this.new_client_form.get('contact_dtls.email_rel').setValidators([Validators.required]);
    //    }
    //    else{
    //     this.new_client_form.get('contact_dtls.email_rel').removeValidators([Validators.required]);
    //    }
    //    this.new_client_form.get('contact_dtls.email_rel').updateValueAndValidity({emitEvent:false});
    // })

    // this.new_client_form.get('contact_dtls.mobile')
    // .valueChanges.subscribe(res => {
    //   this.new_client_form.get('contact_dtls.mobile_rel').setValue('');
    //    if(res){
    //       this.new_client_form.get('contact_dtls.mobile_rel').setValidators([Validators.required]);
    //    }
    //    else{
    //     this.new_client_form.get('contact_dtls.mobile_rel').removeValidators([Validators.required]);
    //    }
    //    this.new_client_form.get('contact_dtls.mobile_rel').updateValueAndValidity({emitEvent:false});
    // })

     this.new_client_form.get('customer_dtls.guardian_kyc_type')
    .valueChanges.subscribe(res => {
      this.new_client_form.get('customer_dtls.guardian_ckyc_number').setValue('');
       if(res == 'C'){
          this.new_client_form.get('customer_dtls.guardian_ckyc_number').setValidators([Validators.required]);
       }
       else{
        this.new_client_form.get('customer_dtls.guardian_ckyc_number').removeValidators([Validators.required]);
       }
       this.new_client_form.get('customer_dtls.guardian_ckyc_number').updateValueAndValidity({emitEvent:false});
    })


    this.new_client_form.get('additional_dtls.lei_no')
    .valueChanges.subscribe(res => {
      this.new_client_form.get('additional_dtls.lei_validity').setValue('');
       if(res){
          this.new_client_form.get('additional_dtls.lei_validity').setValidators([Validators.required]);
       }
       else{
        this.new_client_form.get('additional_dtls.lei_validity').removeValidators([Validators.required]);
       }
       this.new_client_form.get('additional_dtls.lei_validity').updateValueAndValidity({emitEvent:false});
    })


     this.new_client_form.get('additional_dtls.pms')
    .valueChanges.subscribe(res => {
      this.new_client_form.get('additional_dtls.cmbp_id').clearValidators();

      if(this.new_client_form.get('additional_dtls.default_dp').value == 'NSDL' && res == 'Y'){
        this.new_client_form.get('additional_dtls.cmbp_id').setValidators([ Validators.required,Validators.maxLength(16),Validators.pattern('^[0-9]*$')]);
      }
      this.new_client_form.get('additional_dtls.cmbp_id').updateValueAndValidity({emitEvent:false})
    })

     this.new_client_form.get('additional_dtls.default_dp')
    .valueChanges.subscribe(res => {
      this.new_client_form.get('additional_dtls.cdsl_dpid').setValue('');
      this.new_client_form.get('additional_dtls.cdslclt_id').setValue('');
      this.new_client_form.get('additional_dtls.nsdldp_id').setValue('');
      this.new_client_form.get('additional_dtls.nsdlclt_id').setValue('');
      this.new_client_form.get('additional_dtls.nsdldp_id').clearValidators();
      this.new_client_form.get('additional_dtls.nsdlclt_id').clearValidators();
      this.new_client_form.get('additional_dtls.cdslclt_id').clearValidators();
      this.new_client_form.get('additional_dtls.cdsl_dpid').clearValidators();
       this.new_client_form.get('additional_dtls.cmbp_id').clearValidators();
       if(res == 'CDSL'){
          this.new_client_form.get('additional_dtls.cdslclt_id').setValidators([
            Validators.required,
            Validators.maxLength(16)
          ]);
          this.new_client_form.get('additional_dtls.cdsl_dpid').setValidators([
            Validators.required,
            Validators.maxLength(8)
          ]);
       }
       else if(res == 'NSDL'){
          this.new_client_form.get('additional_dtls.nsdldp_id').setValidators([Validators.required]);
          this.new_client_form.get('additional_dtls.nsdlclt_id').setValidators([Validators.required]);
          if(this.new_client_form.get('additional_dtls.pms').value == 'Y'){
            this.new_client_form.get('additional_dtls.cmbp_id').setValidators([ Validators.required,Validators.maxLength(16),Validators.pattern('^[0-9]*$')]);
          }
       }
      this.new_client_form.get('additional_dtls.nsdldp_id').updateValueAndValidity({emitEvent:false});
      this.new_client_form.get('additional_dtls.nsdlclt_id').updateValueAndValidity({emitEvent:false});
      this.new_client_form.get('additional_dtls.cdslclt_id').updateValueAndValidity({emitEvent:false});
      this.new_client_form.get('additional_dtls.cdsl_dpid').updateValueAndValidity({emitEvent:false});
      this.new_client_form.get('additional_dtls.cmbp_id').updateValueAndValidity({emitEvent:false})
    })


    this.new_client_form.get('nominee_dtls.nominee_opted')
    .valueChanges.subscribe(res => {
       if(res == 'Y'){
        this.new_client_form.get('nominee_dtls.nominee_number').enable();
        this.new_client_form.get('nominee_dtls.nominee_number').setValidators([Validators.required]);
       }
       else{
        this.new_client_form.get('nominee_dtls.nominee_number').disable();
        this.new_client_form.get('nominee_dtls.nominee_number').clearValidators();
        this.new_client_form.get('nominee_dtls.nominee_number').setValue('');
       }
       this.new_client_form.get('nominee_dtls.nominee_number').updateValueAndValidity({emitEvent:false});
    })


    this.new_client_form.get('nominee_dtls.nominee_number')
    .valueChanges.subscribe(res => {
          console.log("************* NOMINEE CHANGE ******************")
          // console.log(res);
          // this.nominee.controls[index].get('nominee_dob').setValidators([Validators.required,this.minAgeValidator(18)])
          if(res){
            this.addNominee(res);
          }
          else{
            this.nominee.clear()
          }
    })


    this.new_client_form.get('customer_dtls.guardian_pan_exempt').valueChanges.subscribe(res =>{
           this.new_client_form.get('customer_dtls.guardian_exempt_category').setValue('');   
            this.new_client_form.get('customer_dtls.guardian_pan').setValue('');   
            this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').setValue(''); 
            this.new_client_form.get('customer_dtls.guardian_exempt_category').disable();  
            this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').disable();   
            this.new_client_form.get('customer_dtls.guardian_pan').disable(); 
          if(res == 'N'){
              this.new_client_form.get('customer_dtls.guardian_pan').setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
              this.new_client_form.get('customer_dtls.guardian_exempt_category').removeValidators([Validators.required]);
              this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').removeValidators([Validators.required]);  
              this.new_client_form.get('customer_dtls.guardian_pan').enable(); 
          }
          else if(res == 'Y'){
          this.fetchGaurdianExemptCategoryDependOnGaurdianPanExempt();
            this.new_client_form.get('customer_dtls.guardian_pan').removeValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
              this.new_client_form.get('customer_dtls.guardian_exempt_category').setValidators([Validators.required]);
              this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').setValidators([Validators.required]);  
              this.new_client_form.get('customer_dtls.guardian_exempt_category').enable(); 
              this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').enable();   
          }
          else{
              this.new_client_form.get('customer_dtls.guardian_pan').removeValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
              this.new_client_form.get('customer_dtls.guardian_exempt_category').removeValidators([Validators.required]);
              this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').removeValidators([Validators.required]);  
          }
          this.new_client_form.get('customer_dtls.guardian_pan').updateValueAndValidity({emitEvent:false});
          this.new_client_form.get('customer_dtls.guardian_exempt_category').updateValueAndValidity({emitEvent:false});
          this.new_client_form.get('customer_dtls.guardian_exempt_ref_number').updateValueAndValidity({emitEvent:false});
    })

      this.new_client_form.get('customer_dtls.pan_exempt').valueChanges.subscribe(res =>{
         this.new_client_form.get('customer_dtls.exempt_category').setValue('');   
         this.new_client_form.get('customer_dtls.pan').setValue('');   
         this.new_client_form.get('customer_dtls.exempt_ref_number').setValue(''); 
         this.new_client_form.get('customer_dtls.exempt_category').disable();  
         this.new_client_form.get('customer_dtls.exempt_ref_number').disable();   
         this.new_client_form.get('customer_dtls.pan').disable(); 
        if(res == 'N'){
                this.new_client_form.get('customer_dtls.pan').setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
                this.new_client_form.get('customer_dtls.exempt_category').removeValidators([Validators.required]);
                this.new_client_form.get('customer_dtls.exempt_ref_number').removeValidators([Validators.required]);
                this.new_client_form.get('customer_dtls.pan').enable();   
            }
        else if(res == 'Y'){
          this.fetchExemptCategoryDependOnPanExempt();
          this.new_client_form.get('customer_dtls.pan').removeValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
            this.new_client_form.get('customer_dtls.exempt_category').setValidators([Validators.required]);
            this.new_client_form.get('customer_dtls.exempt_ref_number').setValidators([Validators.required]);  
            this.new_client_form.get('customer_dtls.exempt_category').enable();  
            this.new_client_form.get('customer_dtls.exempt_ref_number').enable();  
        }
        else{
            this.new_client_form.get('customer_dtls.pan').removeValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
            this.new_client_form.get('customer_dtls.exempt_category').removeValidators([Validators.required]);
            this.new_client_form.get('customer_dtls.exempt_ref_number').removeValidators([Validators.required]);
        }
        this.new_client_form.get('customer_dtls.pan').updateValueAndValidity({emitEvent:false});
        this.new_client_form.get('customer_dtls.exempt_category').updateValueAndValidity({emitEvent:false});
        this.new_client_form.get('customer_dtls.exempt_ref_number').updateValueAndValidity({emitEvent:false});
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
        if(this.nominee.length > 0){
            const diff = Number(range) - this.nominee.length;
            // console.log('DIFF:' + diff)
            if(diff > 0){
                  for(let i = 0;i<diff;i++){
                    this.nominee.push(this.setNominee())
                  }
            }
            else if(diff < 0){
                  const len = this.nominee.length;
                  for(let i = 1;i<(Math.abs(diff) + 1);i++){
                    this.nominee.removeAt(len - i);
                  }
            }
          this.setPercentageOfNomineesDependOnNumberOfSelectedNominee(range)
        }
        else{
          this.nominee.clear();
          for(let i=0;i<range;i++){
            let percentage = i == 0 ? 100 : 0;
            this.nominee.push(this.setNominee(percentage))
          }
        }
  }

  setPercentageOfNomineesDependOnNumberOfSelectedNominee = (range) =>{
      for(let i=0;i<range;i++){
           const percentage = i == 0 ? 100 : 0
          this.nominee.at(i).get('nominee_percentage').setValue(percentage);

      }
  }

  get nominee(): FormArray {
    return this.new_client_form.get('nominee_dtls.nominee') as FormArray;
  }

  get joint_holder():FormArray {
    return this.new_client_form.get('customer_dtls.joint_holder') as FormArray;
  }

  get bank(): FormArray {
    return this.new_client_form.get('bank_dtls.bank') as FormArray;
  }


  setJointHolder(
    title='',first_name='',middle_name='',last_name='',
    pan='',
    dob='',gender='',occupation='',kyc_type='',inv_ckyc='',
    exempt_category='',
    pan_exempt='',
    ckyc_number='',
    exempt_ref_number='',
    email='',
    email_dec_flag='',
    mobile='',
    mobile_dec_flag='',
  ){
    return new FormGroup({
      title:new FormControl(title ? title : ''),
      pan: new FormControl({value:pan ? pan : '',disabled:true}),
      first_name: new FormControl(first_name ? first_name : ''),
      last_name: new FormControl(last_name ? last_name : ''),
      middle_name: new FormControl(middle_name ? middle_name : ''),
      dob: new FormControl(dob ? dob : ''),
      gender: new FormControl(gender ? gender : ''),
      occupation: new FormControl(occupation ? occupation : ''),
      kyc_type: new FormControl(kyc_type ? kyc_type : ''),
      ckyc_number: new FormControl(ckyc_number ? ckyc_number : ''),
      exempt_ref_number: new FormControl(exempt_ref_number ? exempt_ref_number : ''),
      exempt_category:new FormControl({value:exempt_category ? exempt_category : '',disabled:true}),
      pan_exempt:new FormControl(pan_exempt ? pan_exempt : ''),
      email:new FormControl(email ? email : '',{updateOn:'blur'}),
      email_dec_flag:new FormControl(email_dec_flag ? email_dec_flag : ''),
      mobile:new FormControl(mobile ? mobile : '',{updateOn:'blur'}),
      mobile_dec_flag:new FormControl(mobile_dec_flag ? mobile_dec_flag : ''),
    })
  }

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
    nominee_gaurdian_rel='',
    nominee_country='',
    nominee_district='',
  ){
    return new FormGroup({
      nominee_type:new FormControl(nominee_type ? nominee_type : '',[Validators.required]),
      nominee_pan: new FormControl(nominee_pan ? nominee_pan : '',[Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]),
      nominee_name: new FormControl(nominee_name ? nominee_name : '',[Validators.required]),
      nominee_dob: new FormControl(nominee_dob ? nominee_dob : '',[Validators.required,this.minAgeValidator(18)]),
      nominee_address1: new FormControl(nominee_address1 ? nominee_address1 : ''),
      nominee_city: new FormControl(nominee_city ? nominee_city : ''),
      nominee_address2: new FormControl(nominee_address2 ? nominee_address2 : ''),
      nominee_state: new FormControl(nominee_state ? nominee_state : ''),
      nominee_address3: new FormControl(nominee_address3 ? nominee_address3 : ''),
      nominee_pincode: new FormControl(nominee_pincode ? nominee_pincode : ''),
      nominee_relationship: new FormControl(nominee_relationship ? nominee_relationship : '',[Validators.required]),
      nominee_percentage:new FormControl(nominee_percentage,[
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.percentageValidator]),
      nominee_gaurdian_name:new FormControl({value:nominee_gaurdian_name ? nominee_gaurdian_name : '',disabled:true}),
      nominee_gaurdian_pan:new FormControl({value:nominee_gaurdian_pan ? nominee_gaurdian_pan : '',disabled:true},[Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]),
      nominee_gaurdian_rel:new FormControl({value:nominee_gaurdian_rel ? nominee_gaurdian_rel : '',disabled:true}),
      nominee_country:new FormControl({value: nominee_country ? nominee_country : '',disabled:false}),
      nominee_district:new FormControl({value: nominee_district ? nominee_district : '',disabled:false}),
      md_nominee_state:new FormControl([]),
      md_nominee_district:new FormControl([]),
      md_nominee_city:new FormControl([]),
      md_nominee_pincode:new FormControl([]),
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
      ifsc_code:new FormControl(ifsc_code ? ifsc_code : '',[Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      acc_type: new FormControl(acc_type ? acc_type : '',[Validators.required]),
      acc_no: new FormControl(acc_no ? acc_no : '',[Validators.required,

         Validators.minLength(6),
        //   Validators.maxLength(10),
          this.numericValidator 
      ]),
      micr: new FormControl(micr ? micr : ''),
      bank_name: new FormControl(bank_name ? bank_name : ''),
      bank_branch: new FormControl(bank_branch ? bank_branch : ''),
      bank_address: new FormControl(bank_address ? bank_address : ''),
      bank_city: new FormControl(bank_city ? bank_city : ''),
      bank_district: new FormControl(bank_district ? bank_district : ''),
      bank_state: new FormControl(bank_state ? bank_state : ''),
      bank_pincode:new FormControl(bank_pincode ? bank_pincode : ''),
      default_bank_flag:new FormControl(default_bank_flag ? default_bank_flag : '',[Validators.required]),
    })
  }

    // Custom validator for numeric input
  numericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^\d+$/.test(value);
    return isValid ? null : { notNumeric: true };
  }

  changeStep = (item,index) => {
    // if(this.new_client_form.invalid && index > this.step){}
    // else{
        console.log("************CHANGE OF STEP**************** ")
        this.step=index;
        this.step_wizard_title=item.name;
        this.step_content_name = item.formControlName;

        if(item.id == 2){
          this.getCountry();
          this.fetchMobileEmailDeclarationFlag();
          this.fetchCommunicationMode();
        }
        else if(item.id == 0){
          this.fetchOccupation();
          if(this.custEntry?.tax_status != 'S'){
            this.fetchMobileEmailDeclarationFlag();
          }
        }
        else if(item.id == 3){
          if(this.bank.length == 0){
            this.bank.clear();
            this.bank.push(this.setBankDetails())
          }
          this.fetchAccountType();
        }
        else if(item.id == 4){
            // if(this.new_client_form.get('nominee_dtls.'))
            this.fetchRelationShip();
        }
        else if(item.id == 5){
            this.fetchDividendPayMode();
        }
        this.setValidationDependOnStep(item)
        console.log("************END**************** ")
    // }
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

  fetchCommunicationMode = () =>{
        if(this.mdCommunicationMode.length == 0){
              this.dbIntr.api_call_for_nuedge_online(0,'/communicationMode',null)
           .pipe(pluck('data'))
           .subscribe((res:any) =>{
              this.mdCommunicationMode = res;
           })
        }
  }

  get1stepEntry(ev){
      this.custEntry = ev;
      this.joint_holder.clear();
      if(ev.mode_of_holding == 3){
          this.joint_holder.push(this.setJointHolder())
      }
      else if(ev.mode_of_holding == 2){
        this.joint_holder.push(this.setJointHolder())
        this.joint_holder.push(this.setJointHolder())
      }
      if(Number(ev.tax_status) != 21){
          this.getStepWizardContent();
      }
      else{
         this.changeStep(this.step_wizard[0],0)
      }
      
     
  }

  getStepWizardContent = () =>{
    this.step_wizard = this.step_wizard.filter(el => el.id != 1);
    // console.log(this.step_wizard);
    this.changeStep(this.step_wizard[0],0)
  }

  addJointHolder(){
    this.joint_holder.push(this.setJointHolder());
    console.log(this.joint_holder.length)
  }
  goPrev(){
    const dt = this.step - 1;
    this.changeStep(this.step_wizard[dt],dt);
    
  }
  goNext(){
    const dt = this.step + 1;
    this.changeStep(this.step_wizard[dt],dt);
  }
  deleteJointHolder(index){
    this.joint_holder.removeAt(index)
  }
  onChangeNomineeType(ev,index){
      this.nominee.controls[index].get('nominee_gaurdian_name').setValue('');
      this.nominee.controls[index].get('nominee_gaurdian_pan').setValue('');
      this.nominee.controls[index].get('nominee_gaurdian_rel').setValue('');
      // this.nominee.controls[index].get('nominee_dob').setValidators([Validators.required,this.minAgeValidator(18)])
      if(ev.target.value == 'Y'){
          this.nominee.controls[index].get('nominee_gaurdian_name').enable();
        this.nominee.controls[index].get('nominee_gaurdian_pan').enable();
        this.nominee.controls[index].get('nominee_gaurdian_rel').enable();
        this.nominee.controls[index].get('nominee_gaurdian_name').setValidators([Validators.required]);
        // this.nominee.controls[index].get('nominee_dob').clearValidators();
      }
      else{
        this.nominee.controls[index].get('nominee_gaurdian_name').disable();
        this.nominee.controls[index].get('nominee_gaurdian_pan').disable();
        this.nominee.controls[index].get('nominee_gaurdian_rel').disable();
        this.nominee.controls[index].get('nominee_gaurdian_name').clearValidators();
        // this.nominee.controls[index].get('nominee_dob').setValidators([this.minAgeValidator(18)]);
      }
        this.nominee.controls[index].get('nominee_gaurdian_name').updateValueAndValidity({emitEvent:false});
        // this.nominee.controls[index].get('nominee_dob').updateValueAndValidity({emitEvent:false});


  }

  setValidationDependOnStep = (item) => {
      // console.log(item);
      Object.keys(this.new_client_form.controls).forEach(controlName => {
        const control = this.new_client_form.get(controlName);
        if(control instanceof FormArray){}
        else if (control instanceof FormGroup) {
           Object.keys(control?.value).forEach(key =>{
            if(control?.get(key) instanceof FormArray){
                 const nestedControls = control.get(key) as FormArray;
                  nestedControls.controls.forEach((group) =>{
                            if (group instanceof FormGroup) {
                              Object.values(group.controls).forEach(control => {
                                control.clearValidators();
                                control.updateValueAndValidity({emitEvent:false});
                              });
                            }
                  })
            }
            else{
                control.get(key).clearValidators();
                control.get(key).updateValueAndValidity({emitEvent:false});
            }
            
          })
        }
        else{}
      });
      const form_control_name = Object.keys(this.new_client_form.controls);
      this.validateField(form_control_name,item?.formControlName);
    
  }

    validateField = (form_controls,formControlName) =>{
      form_controls.forEach(el =>{
        if(el == formControlName){
                const control = this.new_client_form.get(formControlName);
                Object.keys(control.value).forEach(key =>{
                  if(formControlName == 'customer_dtls'){
                      if(control.get(key) instanceof FormArray){
                            const nestedControls = control.get(key) as FormArray;
                            nestedControls.controls.forEach((el,index) =>{
                                          this.nestedValidateField(el,formControlName,index);
                            })
                      } 
                      else{
                            if(key == 'pan'){control.get(key).setValidators([Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])}
                            if(key == 'gender'){
                                const tax_status = Number(this.custEntry?.tax_status);
                                // if tax status 1,21,22,2(Minor) make gender validation
                                if(tax_status == 1 
                                  || tax_status == 21 
                                  || tax_status == 22 
                                  || tax_status == 2){
                                console.log(tax_status)
                                      control.get(key).setValidators([Validators.required])
                                }
                            }
                            else if(key == 'guardian_first_name' 
                              || key == 'guardian_pan_exempt' 
                              || key == 'guardian_pan'
                              || key == 'guardian_ckyc_number'
                              || key == 'guardian_exempt_ref_number'  
                            ){
                                  const tax_status = Number(this.custEntry?.tax_status);
                                // if tax status 2 (Minor) make gender validation
                                if(tax_status == 2){
                                      if(key == 'guardian_pan'){
                                      control.get(key).setValidators([Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
                                      }
                                      else if(key == 'guardian_ckyc_number'){
                                          if(control.get('guardian_kyc_type').value == 'C'){
                                            control.get(key).setValidators([Validators.required])
                                          }
                                      }
                                      else if(key == 'guardian_exempt_ref_number'){
                                         if(control.get('guardian_pan_exempt').value == 'Y'){
                                            control.get(key).setValidators([Validators.required])
                                          }
                                      }
                                      else{
                                      control.get(key).setValidators([Validators.required])
                                      }
                                }
                            }
                            else if(key == 'dob'){control.get(key).setValidators([Validators.required,this.minAgeValidator(18)])}
                            else if(key == 'last_name' || key == 'middle_name' 
                              || key == 'pan' || key == 'dob'
                              || key == 'exempt_category' 
                              || key == 'guardian_last_name'
                              || key == 'guardian_middle_name'
                              || key == 'guardian_dob' 
                              || key == 'aadhaar_updated'
                              || key == 'guardian_kyc_type'
                              || key == 'guardian_exempt_category'){}
                            else if(key == 'ckyc_number'){
                                if(control.get('kyc_type').value == 'C'){
                                  control.get(key).setValidators([Validators.required])
                                }
                            }
                            else if(key == 'exempt_ref_number'){
                                 if(control.get('pan_exempt').value == 'Y'){
                                  control.get(key).setValidators([Validators.required])
                                }
                            }
                            else{control.get(key).setValidators([Validators.required])}
                      }
                      
                  } 
                  else if(formControlName == 'foreign_contact_details'){
                        if(key == 'foreign_address2' 
                          || key == 'foreign_address3'
                          || key == 'sea_fears'
                          || key == 'foreign_address_residential_phone'
                          || key == 'foreign_address_office_phone'
                          || key == 'foreign_address_residential_fax'
                          ||  key == 'foreign_address_office_fax'
                        ){}
                        else{control.get(key).setValidators([Validators.required])}
                  }
                  else if(formControlName == 'bank_dtls'){
                      if(control.get(key) instanceof FormArray){
                              const nestedControls = control.get(key) as FormArray;
                              nestedControls.controls.forEach((el,index) =>{
                                    this.nestedValidateField(el,formControlName,index);
                              })
                      }
                  }
                  else if(formControlName == 'contact_dtls'){
                    if(key == 'communication_mode'){
                        control.get(key).setValidators([Validators.required])
                    }
                    else if(key == 'email'){
                        control.get(key).setValidators([Validators.required,Validators.email])
                    }
                    else if(key == 'mobile'){
                      control.get(key).setValidators([
                        Validators.required,
                        Validators.pattern('^[0-9]*$'), // Digits only
                        Validators.minLength(10),
                        Validators.maxLength(10)
                      ])
                    }
                    // else if(key == 'email_rel'){
                    //         if(control.get('email').value){
                    //            control.get(key).setValidators([Validators.required])
                    //         }
                    // }
                    //  else if(key == 'mobile_rel'){
                    //         if(control.get('mobile').value){
                    //            control.get(key).setValidators([Validators.required])
                    //         }
                    // }
                    else{
                        // if(this.custEntry?.tax_status != '21' 
                        // && this.custEntry?.tax_status != '22'){
                              if(key == 'address2' 
                                || key == 'address3' 
                                || key == 'residential_fax'
                                || key == 'residential_phone'
                                || key == 'office_fax'
                                || key == 'office_phone'
                              ){}
                              else{control.get(key).setValidators([Validators.required])}
                      //  }
                    }
                    
                  }
                  else if(formControlName == 'nominee_dtls'){
                                if(control.get(key) instanceof FormArray){
                                     const nestedControls = control.get(key) as FormArray;
                                      nestedControls.controls.forEach((el,index) =>{
                                            // this.nestedValidateField(el,formControlName,index);
                                            this.nestedValidateField(el,formControlName,index);
                                      })
                                }
                                else{
                                    if(key == 'authentication_mode'){
                                      if(this.custEntry?.mode_of_holding == 1 || this.new_client_form.get('customer_dtls.client_type').value == 'P'){
                                        control.get(key).setValidators([Validators.required]);
                                      }
                                    }
                                    else{
                                        control.get(key).setValidators([Validators.required]);
                                    }
                                    
                                    // if(control.get(key).value == 'Y'){
                                    // control.get('nominee_number').setValidators([Validators.required])
                                    // }
                                }
                       
                  }
                  else if(formControlName == 'additional_dtls'){
                      if(key == 'map_in_id'  || key == 'pms' || key == 'lei_no'){}
                      else if(key == 'lei_validity'){
                          if(control.get('lei_no').value){
                             control.get(key).setValidators([Validators.required]);
                          }
                      }
                      else if(key == 'default_dp'){
                          if(this.new_client_form.get('customer_dtls.client_type').value == 'D'){
                             control.get(key).setValidators([Validators.required]);
                          }
                      }
                      else if(key == 'cdsl_dpid'){
                          if(control.get('default_dp').value == 'CDSL'){
                             control.get(key).setValidators([
                              Validators.required,
                              Validators.maxLength(8)
                            ]);
                          }
                      }
                      else if(key == 'cdslclt_id'){
                         if(control.get('default_dp').value == 'CDSL'){
                             control.get(key).setValidators([
                              Validators.required,
                              Validators.maxLength(16)
                            ]);
                          }
                      }
                      else if(key == 'cmbp_id'){
                          if(control.get('default_dp').value == 'NSDL' 
                          && control.get('pms').value == 'Y'){
                             control.get(key).setValidators([
                              Validators.required,
                              Validators.maxLength(16),
                              Validators.pattern('^[0-9]*$')
                            ]);
                          }
                      }
                      else if(key == 'nsdldp_id' || key =='nsdlclt_id'){
                          if(control.get('default_dp').value == 'NSDL'){
                             control.get(key).setValidators([
                              Validators.required,
                              Validators.maxLength(8)
                            ]);
                          }
                      }
                      else{
                        console.log(key)
                         control.get(key).setValidators([Validators.required]);
                      }
                  }
                  else{
                    if(key == 'final_submit_acknowledgemnt'){
                          control.get(key).setValidators([Validators.requiredTrue]);
                    }
                    else if(key == 'created_by'){
                        control.get(key).setValidators([Validators.required]);
                    }
                  }
                  control.get(key).updateValueAndValidity({emitEvent:false}); 
                })
        }
      })
      console.log(this.new_client_form.controls)
    }

    nestedValidateField = (control,formControlName,index) => {
           Object.keys(control.value).forEach(key =>{
                  if(formControlName == 'customer_dtls'){
                            if(key == 'pan'){control.get(key).setValidators([Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])}
                            else if(key == 'dob'){control.get(key).setValidators([Validators.required,this.minAgeValidator(18)])}
                            else if(key == 'last_name' || key == 'middle_name' 
                              || key == 'pan' 
                              || key == 'occupation' 
                              || key == 'kyc_type' 
                              // || key == 'gender'
                              || key == 'exempt_category'){}
                              else if(key == 'ckyc_number'){
                                if(control.get('kyc_type').value == 'C'){
                                  control.get(key).setValidators([Validators.required])
                                }
                              }
                              else if(key == 'exempt_ref_number'){
                                if(control.get('pan_exempt').value == 'Y'){
                                  control.get(key).setValidators([Validators.required])
                                }
                              }
                              else if(key == 'email'){
                                  control.get(key).setValidators([Validators.required,Validators.email])
                              }
                              else if(key == 'mobile'){
                                   control.get(key).setValidators([
                                    Validators.required,
                                    Validators.pattern('^[0-9]*$'), // Digits only
                                    Validators.minLength(10),
                                    Validators.maxLength(10)
                                  ])
                              }
                            // else if(key == 'email_dec_flag'){
                            //       if(control.get('email').value){
                            //         control.get(key).setValidators([Validators.required])
                            //       }
                            // }
                            // else if(key == 'mobile_dec_flag'){
                            //         if(control.get('mobile').value){
                            //           control.get(key).setValidators([Validators.required])
                            //         }
                            // }
                            else{
                              // if(index == 0){
                              //   control.get(key).setValidators([Validators.required])
                              // }
                              // else{
                              //   if(key == 'pan_exempt'){
                              //       control.get(key).setValidators([Validators.required])
                              //   }
                              // }
                            control.get(key).setValidators([Validators.required])
                            }
                  } 
                  else if(formControlName == 'bank_dtls'){
                      if(key == 'micr' 
                        || key == 'bank_name'
                        || key == 'bank_branch'
                        || key == 'bank_address'
                        || key == 'bank_city'
                        || key == 'bank_district'
                        || key == 'bank_state'
                        || key == 'bank_pincode'
                      ){}
                      else if(key == 'acc_no'){
                         control.get(key).setValidators([Validators.required,Validators.minLength(6),
                        this.numericValidator])
                      }
                      else if(key == 'ifsc_code'){
                         control.get(key).setValidators([
                           Validators.required,
                          Validators.minLength(11),
                          Validators.maxLength(11),
                         ])

                         
                      }
                      else{
                         control.get(key).setValidators([Validators.required])
                      }
                  }
                  else if(formControlName == 'nominee_dtls'){
                          if(key == 'nominee_addres1'  
                            || key == 'nominee_addres2'
                            || key == 'nominee_addres3'
                            || key == 'nominee_city'  
                            || key == 'nominee_state'
                            || key == 'nominee_pincode'
                            || key == 'nominee_gaurdian_rel'
                            || key == 'nominee_country'
                            || key == 'nominee_district'
                            || key == 'md_nominee_state'
                            || key == 'md_nominee_district'
                            || key == 'md_nominee_city'     
                            || key == 'md_nominee_pincode'     
                          ){}
                          else if(key == 'nominee_type'
                            || key == 'nominee_name'
                            || key == 'nominee_relationship'
                          ){
                                control.get(key).setValidators([Validators.required])
                          }
                          else if(key == 'nominee_percentage'){
                              control.get(key).setValidators([
                                  Validators.required,
                                  Validators.pattern(/^\d+(\.\d{1,4})?$/),
                                  Validators.min(1), 
                                  Validators.max(100)
                                ])
                          }
                          else if(key == 'nominee_pan' || key == 'nominee_gaurdian_pan'){
                              control.get(key).setValidators([Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
                          }
                          else if(key == 'nominee_dob'){
                            //  console.log('nominee_dob');
                             control.get(key).setValidators([Validators.required,this.minAgeValidator(18)]);
                            // if(control.get('nominee_type').value == 'Y'){}
                            // else{
                            //   control.get(key).setValidators([this.minAgeValidator(18)]);
                            // }
                          }
                          else{
                              if(control.get('nominee_type').value == 'Y'){
                                 if(key == 'nominee_gaurdian_name'){
                                          control.get(key).setValidators([Validators.required])
                                 }
                              }
                          }
                  }
                  control.get(key).updateValueAndValidity(); 
                })
    }
    

    // Custom Validator Function
      percentageValidator(control: AbstractControl): ValidationErrors | null {
        const value = parseFloat(control.value);
        if (isNaN(value)) return { notANumber: true };
        if (value <= 0) return { tooLow: true };
        if (value > 100) return { tooHigh: true };
        return null;  // valid
      }


     hasRequiredValidator(controlName: string): boolean {
      try{
        const control = this.new_client_form.get(controlName);
        const validator = control?.validator?.({} as FormControl);
        return !!validator?.['required'];
        }
      catch(err){
        return false
      }
     
    }

    hasRequiredValidatorForJointHolder = (controlName: string,index): boolean =>{
      try{
        const control = this.joint_holder.at(index).get(controlName);
        const validator = control?.validator?.({} as FormControl);
        return !!validator?.['required'];
        }
      catch(err){
        return false
      }
    }
     hasRequiredValidatorForNominee = (controlName: string,index): boolean =>{
      try{
        const control = this.nominee.at(index).get(controlName);
        const validator = control?.validator?.({} as FormControl);
        return !!validator?.['required'];
        }
      catch(err){
        return false
      }
    }

     hasRequiredValidatorForBankDtls = (controlName: string,index): boolean =>{
      try{
        const control = this.bank.at(index).get(controlName);
        const validator = control?.validator?.({} as FormControl);
        return !!validator?.['required'];
        }
      catch(err){
        return false
      }
    }

    minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = new Date(control.value);
      const today = new Date();

      if (isNaN(dob.getTime())) return null; // skip validation if invalid or empty

      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      const isOldEnough = 
        age > minAge || 
        (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      return isOldEnough ? null : { underage: true };
    };
  }

  handleChangePanOfJointHolder = (ev,index) =>{
        this.joint_holder.at(index).get('exempt_category').setValue('');   
         this.joint_holder.at(index).get('pan').setValue('');    
         this.joint_holder.at(index).get('exempt_ref_number').setValue('');    
         this.joint_holder.at(index).get('exempt_category').disable();   
         this.joint_holder.at(index).get('pan').disable(); 
         this.joint_holder.at(index).get('exempt_ref_number').disable();    
        if(ev.target.value == 'N'){
            //  if( this.joint_holder.at(index).get('first_name').value){
            //           this.joint_holder.at(index).get('pan').setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])
            //  }
            //  else{
            //       this.joint_holder.at(index).get('pan').removeValidators([Validators.required]);
            //       this.joint_holder.at(index).get('pan').setValidators([Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])
            //  }
            this.joint_holder.at(index).get('pan').setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])
            this.joint_holder.at(index).get('exempt_category').removeValidators([Validators.required]);
            this.joint_holder.at(index).get('exempt_ref_number').removeValidators([Validators.required]);
            this.joint_holder.at(index).get('pan').enable();   
        }
        else if(ev.target.value == 'Y'){
            this.fetchExemptCategoryDependOnPanExempt()
            this.joint_holder.at(index).get('pan').removeValidators([Validators.required]);
            this.joint_holder.at(index).get('exempt_category').setValidators([Validators.required]);
            this.joint_holder.at(index).get('exempt_ref_number').setValidators([Validators.required]);
            this.joint_holder.at(index).get('exempt_category').enable();   
            this.joint_holder.at(index).get('exempt_ref_number').enable();
        }
        else{
            this.joint_holder.at(index).get('pan').removeValidators([Validators.required]);
            this.joint_holder.at(index).get('exempt_category').removeValidators([Validators.required])
            this.joint_holder.at(index).get('exempt_ref_number').setValidators([Validators.required]);
        }
        this.joint_holder.at(index).get('pan').updateValueAndValidity({emitEvent:false});
        this.joint_holder.at(index).get('exempt_category').updateValueAndValidity({emitEvent:false});
        this.joint_holder.at(index).get('exempt_ref_number').updateValueAndValidity({emitEvent:false});

  }

  handleBlurValidatorForJointHolder = (ev,index) =>{
    console.log(ev.target.value)
      if(ev.target.value 
        && this.joint_holder.at(index).get('pan_exempt').value == 'N'){
          this.joint_holder.at(index).get('pan').setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])
      }
      else{
        this.joint_holder.at(index).get('pan').removeValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]);
      }
  }

  fetchMobileEmailDeclarationFlag = () =>{
        if(this.mdMobileEmailDecFlag.length == 0){
           this.dbIntr.api_call_for_nuedge_online(0,'/mobileEmailDeclaration',null)
           .pipe(pluck('data'))
           .subscribe((res:any) =>{
              this.mdMobileEmailDecFlag = res;
           })
        }
  }

  createNewClient(){
    if(this.new_client_form.invalid){
      console.log('****** VALIDATION ERROR IN FORM **********');
      return;
    }
    console.log('****** VALIDATION SUCCESS IN FORM **********');
    if(this.step < (this.step_wizard.length - 1)){
      this.goNext();
    }
    else{
      const formdata = new FormData();
      const tax_status = this.md_tax.find(el => el.id == this.custEntry?.tax_status);
      const mode_of_holding = this.md_clientHolding.find(el => el.id == this.custEntry?.mode_of_holding);
      formdata.append('tax_status',tax_status ? JSON.stringify(tax_status) : '');
      formdata.append('mode_of_holding',mode_of_holding ? JSON.stringify(mode_of_holding) : '');
      Object.keys(this.new_client_form.value).forEach((key) =>{
              const control = this.new_client_form.get(key);
                Object.keys(control.value).forEach(nestedkey =>{
                      if(control.get(nestedkey) instanceof FormArray){
                            const nestedControls = control.get(nestedkey) as FormArray;
                            nestedControls.controls.forEach((el,index) =>{
                                    console.log(nestedkey)
                                    Object.keys(el.value).forEach((obj,i) =>{
                                         if(obj == 'exempt_category'){
                                              if(el.value['pan_exempt'] == 'Y'){
                                                  const exempt_cat = this.md_exempt_category?.find(ele => ele.id == el.value[obj]);
                                                  console.log(exempt_cat);
                                                  formdata.append(`${obj}${index + 1}`,exempt_cat ? JSON.stringify(exempt_cat) : null)
                                              }
                                              else{
                                                formdata.append(`${obj}${index + 1}`,null)
                                              }
                                         }
                                         else if(obj == 'occupation'){
                                                  const td_occupation = this.md_occupation?.find(ele => ele.id == el.value[obj]);
                                                  formdata.append(`${obj}${index + 1}`,td_occupation ? JSON.stringify(td_occupation) : null)
                                         }
                                         else if(obj == 'acc_type'){
                                                  const td_accType = this.md_accountType?.find(ele => ele.id == el.value[obj]);
                                                  formdata.append(`${obj}${index + 1}`,td_accType ? JSON.stringify(td_accType) : null)
                                         }
                                         else if(obj == 'mobile_dec_flag'){
                                                if(el.value['mobile']){
                                                      const tdMobileFlag = this.mdMobileEmailDecFlag?.find(ele => ele.id == el.value[obj]);
                                                      formdata.append(`${obj}${index + 1}`,tdMobileFlag ? JSON.stringify(tdMobileFlag) : null)
                                                }
                                                else{
                                                    formdata.append(`${obj}${index + 1}`,null)
                                                }
                                         }
                                        else if(obj == 'email_dec_flag'){
                                                if(el.value['email']){
                                                      const tdEmailFlag = this.mdMobileEmailDecFlag?.find(ele => ele.id == el.value[obj]);
                                                      formdata.append(`${obj}${index + 1}`,tdEmailFlag ? JSON.stringify(tdEmailFlag) : null);
                                                }
                                                else{
                                                    formdata.append(`${obj}${index + 1}`,null)
                                                }
                                         }
                                         else if(obj == 'nominee_relationship'){
                                              const TDRelationShip = this.md_relationship?.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,TDRelationShip ? JSON.stringify(TDRelationShip) : null);
                                         }
                                         else if(obj == 'nominee_gaurdian_rel'){
                                                if(el.value['nominee_type'] == 'Y'){
                                                        const TDRelationShip = this.md_relationship?.find(ele => ele.id == el.value[obj]);
                                                        formdata.append(`${obj}${index + 1}`,TDRelationShip ? JSON.stringify(TDRelationShip) : null);
                                                }
                                                else{
                                                    formdata.append(`${obj}${index + 1}`,null)
                                                }
                                              const TDRelationShip = this.md_relationship?.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,TDRelationShip ? JSON.stringify(TDRelationShip) : null);
                                         }
                                         else if(obj == 'nominee_country'){
                                                const country = this.md_country.find(ele => ele.id == el.value[obj]);
                                                formdata.append(`${obj}${index + 1}`,country ? JSON.stringify(country) : null)
                                          } 
                                          else if(obj == 'nominee_state'){
                                                const state = this.nominee.controls[index].get('md_nominee_state')?.value.find(ele => ele.id == el.value[obj]);
                                                formdata.append(`${obj}${index + 1}`,state ? JSON.stringify(state) : null)
                                          }
                                          else if(obj == 'nominee_city'){
                                              const city = this.nominee.controls[index].get('md_nominee_city')?.value.find(ele => ele.id == el.value[obj]);
                                                formdata.append(`${obj}${index + 1}`,city ? JSON.stringify(city) : null)
                                          }
                                          else if(obj == 'nominee_district'){
                                              const district = this.nominee.controls[index].get('md_nominee_district')?.value.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,district ? JSON.stringify(district) : null)
                                          }
                                          else if(obj == 'nominee_pincode'){
                                              const pincode = this.nominee.controls[index].get('nominee_pincode')?.value.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,pincode ? JSON.stringify(pincode) : null)
                                          }
                                         else if(obj == 'md_nominee_state' || obj == 'md_nominee_city' || obj == 'md_nominee_district' || obj == 'md_nominee_pincode'){}
                                         else{
                                           formdata.append(`${obj}${index + 1}`,el.value[obj] ? el.value[obj] : '')
                                         }
                                    })
                            })
                      }
                      else{
                          if(nestedkey == 'occupation'){
                            const occupations = this.md_occupation?.find(el => el.id == control.get(nestedkey)?.value);
                            formdata.append(nestedkey,occupations ? JSON.stringify(occupations) : null)
                          }
                          else if(nestedkey == 'exempt_category'){
                              if(this.new_client_form.get('customer_dtls.pan_exempt')?.value == 'Y'){
                                  const exempt_cat = this.md_exempt_category?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,exempt_cat ? JSON.stringify(exempt_cat) : null)
                              }
                              else{
                                 formdata.append(nestedkey,null)
                              }
                          }
                          else if(nestedkey == 'guardian_exempt_category'){
                              if(this.new_client_form.get('customer_dtls.guardian_pan_exempt')?.value == 'Y'){
                                  const exempt_cat = this.md_gaurdian_exempt_category?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,exempt_cat ? JSON.stringify(exempt_cat) : null)
                              }
                              else{
                                 formdata.append(nestedkey,null)
                              }
                          }
                           else if(nestedkey == 'email_rel'){
                              if(this.new_client_form.get('contact_dtls.email')?.value){
                                  const TDemailFlag = this.mdMobileEmailDecFlag?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,TDemailFlag ? JSON.stringify(TDemailFlag) : null)
                              }
                              else{
                                 formdata.append(nestedkey,null)
                              }
                          }
                          else if(nestedkey == 'mobile_rel'){
                              if(this.new_client_form.get('contact_dtls.mobile')?.value){
                                  const TDmobileFlag = this.mdMobileEmailDecFlag?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,TDmobileFlag ? JSON.stringify(TDmobileFlag) : null)
                              }
                              else{
                                  formdata.append(nestedkey,null)
                              }
                          }
                          else if(nestedkey == 'communication_mode'){
                                const TDcommunicationMode = this.mdCommunicationMode?.find(el => el.id == control.get(nestedkey)?.value);
                                formdata.append(nestedkey,TDcommunicationMode ? JSON.stringify(TDcommunicationMode) : null)
                          }
                          else if(nestedkey == 'div_pay_mode'){
                              const divPayMode = this.md_divPayMode?.find(ele => ele.id == control.get(nestedkey)?.value);
                              console.log(divPayMode);
                              formdata.append(nestedkey,divPayMode ? JSON.stringify(divPayMode) : null)
                          }
                          else if(nestedkey == 'country_id'){
                               const country = this.md_country.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,country ? JSON.stringify(country) : null)
                          } 
                          else if(nestedkey == 'state_id'){
                               const state = this.md_state.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,state ? JSON.stringify(state) : null)
                          }
                          else if(nestedkey == 'city_id'){
                               const city = this.md_city.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,city ? JSON.stringify(city) : null)
                          }
                          else if(nestedkey == 'district_id'){
                                const district = this.md_district.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,district ? JSON.stringify(district) : null)
                          }
                          else if(nestedkey == 'pincode_id'){
                                const pincode = this.md_pincode.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,pincode ? JSON.stringify(pincode) : null)
                          }
                          else{
                            formdata.append(nestedkey,control.get(nestedkey)?.value)
                          }
                      }
                }) 
      })
      this.dbIntr.api_call_for_nuedge_online(1,'/createClient',formdata)
      .subscribe((res:any) =>{
            console.log(res);
             this.utility.showSnackbar(res?.suc == 1 ? 'Data saved successfully' : 'We are unable to process your request right now, Please try again after some time',res?.suc)
      })
    }
   
  }

  handleChangeKycTypeOfJointHolder = (ev,index) =>{
        this.joint_holder.at(index).get('ckyc_number').setValue('');
       if(ev.target.value == 'C'){
          this.joint_holder.at(index).get('ckyc_number').setValidators([Validators.required]);
       }
       else{
        this.joint_holder.at(index).get('ckyc_number').removeValidators([Validators.required]);
       }
       this.joint_holder.at(index).get('ckyc_number').updateValueAndValidity({emitEvent:false});
  }
  handleBlurForJointHolderMobile = (ev,index) =>{
      //  this.joint_holder.at(index).get('mobile_dec_flag').setValue('');
      //  if(ev.target.value){
      //     this.joint_holder.at(index).get('mobile_dec_flag').setValidators([Validators.required]);
      //  }
      //  else{
      //   this.joint_holder.at(index).get('mobile_dec_flag').removeValidators([Validators.required]);
      //  }
      //  this.joint_holder.at(index).get('mobile_dec_flag').updateValueAndValidity({emitEvent:false});
  }

  handleBlurForJointHolderEmail = (ev,index) =>{
      //  this.joint_holder.at(index).get('email_dec_flag').setValue('');
      //  if(ev.target.value){
      //     this.joint_holder.at(index).get('email_dec_flag').setValidators([Validators.required]);
      //  }
      //  else{
      //   this.joint_holder.at(index).get('email_dec_flag').removeValidators([Validators.required]);
      //  }
      //  this.joint_holder.at(index).get('email_dec_flag').updateValueAndValidity({emitEvent:false});
  }

  changeDefaultBankFlag = (ev,index) =>{
    console.log('********************* CHANGE EVENT OF DEFAULT BANK FLAG ***********************')
    console.log(index);
    console.log(ev.target.value);
    console.log('******************** END ****************************************************');
    this.bank.controls.forEach((el,j) => {
      if(j == index){

      }
      else{
      this.bank.at(j).get('default_bank_flag').setValue('N');
      }
    })
  }

  onChangeCountry = (ev,index) =>{
        this.nominee.controls[index].get('nominee_state').setValue('');
        this.nominee.controls[index].get('nominee_district').setValue('');
        this.nominee.controls[index].get('nominee_city').setValue('');
        this.nominee.controls[index].get('nominee_pincode').setValue('');
        this.nominee.controls[index].get('md_nominee_state').setValue([]);
        this.nominee.controls[index].get('md_nominee_district').setValue([]);
        this.nominee.controls[index].get('md_nominee_city').setValue([]);
        this.nominee.controls[index].get('md_nominee_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchNomineeStateByCountry(ev.target?.value,index)
      }
  }

  fetchNomineeStateByCountry = (countryId,index) =>{
      this.dbIntr.api_call(0,`/states?country_id=${countryId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.nominee.controls[index].get('md_nominee_state').setValue(res);
        })
  }

  onChangeState = (ev,index) =>{
      this.nominee.controls[index].get('nominee_district').setValue('');
      this.nominee.controls[index].get('nominee_city').setValue('');
      this.nominee.controls[index].get('nominee_pincode').setValue('');
      this.nominee.controls[index].get('md_nominee_district').setValue([]);
      this.nominee.controls[index].get('md_nominee_city').setValue([]);
      this.nominee.controls[index].get('md_nominee_pincode').setValue([]);
       if(ev.target?.value){
        this.fetchNomineeDistrictByState(ev.target?.value,index)
      }
  }

  fetchNomineeDistrictByState = (stateId,index) =>{
      this.dbIntr.api_call(0,`/districts?state_id=${stateId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.nominee.controls[index].get('md_nominee_district').setValue(res);
        })
  }

  onChangeDistrict = (ev,index) =>{
      this.nominee.controls[index].get('nominee_city').setValue('');
      this.nominee.controls[index].get('md_nominee_city').setValue([]);
      this.nominee.controls[index].get('nominee_pincode').setValue('');
      this.nominee.controls[index].get('md_nominee_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchNomineeCityByDistrict(ev.target?.value,index)
      }
  }

  fetchNomineeCityByDistrict = (districtId,index) =>{
        this.dbIntr.api_call(0,`/city?district_id=${districtId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.nominee.controls[index].get('md_nominee_city').setValue(res);
        })
  }

  onChangeCity = (ev,index) =>{
      this.nominee.controls[index].get('nominee_pincode').setValue('');
      this.nominee.controls[index].get('md_nominee_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchNomineePincodeByCity(ev.target?.value,index)
      }
  }
  fetchNomineePincodeByCity = (cityId,index) =>{
          this.dbIntr.api_call(0,`/pincode?city_id=${cityId}`,null)
          .pipe(pluck('data')).subscribe((res:any) =>{
              this.nominee.controls[index].get('md_nominee_pincode').setValue(res);
          })
    }


}
