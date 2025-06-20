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

  settingsforBrnchDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'pincode',
    'Search Pincode',
    1,
    90,
    true
  );
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
        div_pay_mode:new FormControl(''),
        
        app_income_value:new FormControl(''),
        pep:new FormControl(''),
        additional_occupation:new FormControl(''),
        source_of_wealth:new FormControl(''),
        fatca_dob:new FormControl(''),
        address_type:new FormControl(''),
        data_source:new FormControl(''),
        additional_email:new FormControl(''),
        country_of_birth_or_incorporation:new FormControl(''),
        place_of_birth:new FormControl(''),
        tax_receidence_other_than_india:new FormControl(''),
        country_of_tax_residency1:new FormControl(''),
        tax_payer_identification_no1:new FormControl(''),
        identification_type1:new FormControl(''),
        country_of_tax_residency2:new FormControl(''),
        tax_payer_identification_no2:new FormControl(''),
        identification_type2:new FormControl(''),
        country_of_tax_residency3:new FormControl(''),
        tax_payer_identification_no3:new FormControl(''),
        identification_type3:new FormControl(''),
        country_of_tax_residency4:new FormControl(''),
        tax_payer_identification_no4:new FormControl(''),
        identification_type4:new FormControl(''),
        ffi:new FormControl(''),
        nffe_category:new FormControl(''),
        nature_of_bussiness:new FormControl(''),
        active_nffe_sub_category:new FormControl(''),
        name_of_stock_exchange:new FormControl(''),
        name_of_listed_company:new FormControl(''),
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

  /**
   * @description This function is used to scroll the view to the bottom
   * It checks if the scrollContainer is defined and then scrolls to the bottom.
   * It sets the shouldScroll flag to false after scrolling.
   */
    fetchTaxStatus = () =>{
        this.dbIntr.api_call_for_nuedge_online(0,'/taxStatus',null).pipe(pluck('data'))
        .subscribe((res:any) =>{
              this.md_tax = res;
        })
    }

    /**
     * @description This function is used to fetch the client mode of holding
     * It makes an API call to the '/clientHolding' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_clientHolding variable.
     * 
     * @returns void
     */
    fetchClientModeOfHolding = () =>{
          this.dbIntr.api_call_for_nuedge_online(0,'/clientHolding',null)
          .pipe(pluck('data'))
          .subscribe((res:any) =>{
              this.md_clientHolding = res;
          })
    }

    /**
     * @description This function is used to fetch the country data
     * It makes an API call to the '/country' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_country variable.
     */
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

    /**
     * @description This function is used to fetch the country data
     * It makes an API call to the '/country' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_country variable.
     */
    fetchExemptCategoryDependOnPanExempt = () =>{
        if(this.md_exempt_category.length == 0){
          this.dbIntr.api_call_for_nuedge_online(0,'/panExemptCategory',null)
            .pipe(pluck('data'))
            .subscribe((res:any) =>{this.md_exempt_category = res;})
        } 
    }

    /**
     * @description This function is used to fetch the country data
     * It makes an API call to the '/country' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_country variable.
     * 
     * @returns void
     */
    fetchGaurdianExemptCategoryDependOnGaurdianPanExempt = () =>{
        if(this.md_gaurdian_exempt_category.length == 0){
          this.dbIntr.api_call_for_nuedge_online(0,'/panExemptCategory',null)
            .pipe(pluck('data'))
            .subscribe((res:any) =>{this.md_gaurdian_exempt_category = res;})
        } 
    }

    /**
     * @description This function is used to fetch the country data
     * It makes an API call to the '/country' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_country variable.
     */
    fetchAccountType = () =>{
      if(this.md_accountType.length == 0){
          this.dbIntr.api_call_for_nuedge_online(0,'/accountType',null)
            .pipe(pluck('data'))
            .subscribe((res:any) =>{this.md_accountType = res;})
        } 
    }

    /**
     * @description This function is used to fetch the country data
     * It makes an API call to the '/country' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_country variable.
     */
    fetchDividendPayMode = () =>{
       if(this.md_divPayMode.length == 0){
        this.dbIntr.api_call_for_nuedge_online(0,'/dividendPaymode',null)
        .pipe(pluck('data'))
        .subscribe((res:any) =>{
            this.md_divPayMode = res;
        })
       } 
    }

    /**
     * @description This function is used to fetch the country data
     * It makes an API call to the '/country' endpoint and retrieves the data.
     * The fetched data is then assigned to the md_country variable.
     */
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
          this.getCountry();
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

  /**
   * 
   * @param range - The number of nominees to be added or removed
   * @description This function is used to add or remove nominees based on the range provided.
   * If the number of nominees is greater than 0, it calculates the difference between the current number of nominees and the range.
   * If the difference is positive, it adds nominees; if negative, it removes nominees.
   * If there are no nominees, it initializes the nominees with the specified range.
   */
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

  /**
   * 
   * @param range - The number of nominees to set the percentage for
   * @description This function sets the percentage of nominees based on the number of selected nominees.
   * It iterates through the nominees and sets the percentage to 100 for the first nominee and 0 for the rest.
   * This ensures that the total percentage across all nominees always equals 100%.
   */
  setPercentageOfNomineesDependOnNumberOfSelectedNominee = (range) =>{
      for(let i=0;i<range;i++){
           const percentage = i == 0 ? 100 : 0
          this.nominee.at(i).get('nominee_percentage').setValue(percentage);

      }
  }

  /**
   * @param control - The form control to validate
   * @returns A validator function that checks if the percentage is valid
   * @description This function returns a validator function that checks if the percentage of nominees is valid.
   */
  get nominee(): FormArray {
    return this.new_client_form.get('nominee_dtls.nominee') as FormArray;
  }

  /**
   * @param control - The form control to validate
   * @returns A validator function that checks if the percentage is valid
   */
  get joint_holder():FormArray {
    return this.new_client_form.get('customer_dtls.joint_holder') as FormArray;
  }

  /**
   * @param control - The form control to validate
   * @returns A validator function that checks if the percentage is valid
   */
  get bank(): FormArray {
    return this.new_client_form.get('bank_dtls.bank') as FormArray;
  }


  /**
   * 
   * @param title  - The title of the joint holder
   * @param first_name - The first name of the joint holder
   * @param middle_name - The middle name of the joint holder
   * @param last_name - The last name of the joint holder
   * @param pan - The PAN of the joint holder
   * @param dob - The date of birth of the joint holder
   * @param first_name - The first name of the joint holder
   * @param middle_name - The middle name of the joint holder
   * @param last_name - The last name of the joint holder
   * @param pan - The PAN of the joint holder
   * @description This function is used to set the joint holder details in the form.
   * It returns a FormGroup with the joint holder details.
   * @param dob - The date of birth of the joint holder
   * @param gender -  The gender of the joint holder   
   * @param occupation - The occupation of the joint holder
   * @param kyc_type - The KYC type of the joint holder
   * @param inv_ckyc - The CKYC number of the joint holder 
   * @param kyc_type - The KYC type of the joint holder
   * @param exempt_category - The exempt category of the joint holder
   * @param inv_ckyc - The CKYC number of the joint holder
   * @param exempt_ref_number - The exempt reference number of the joint holder
   * @param exempt_category - The exempt category of the joint holder
   * @param pan_exempt - The PAN exempt status of the joint holder
   * @param ckyc_number - The CKYC number of the joint holder
   * @param pan_exempt - The PAN exempt status of the joint holder
   * @param exempt_category - The exempt category of the joint holder
   * @param ckyc_number - The CKYC number of the joint holder
   * @param exempt_ref_number - The exempt reference number of the joint holder
   * @param exempt_ref_number - The exempt reference number of the joint holder
   * @param email - The email of the joint holder
   * @param email_dec_flag - The email declaration flag of the joint holder
   * @param mobile - The mobile number of the joint holder
   * @param mobile_dec_flag - The mobile declaration flag of the joint holder
   * @returns 
   */
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

  /**
   * @description This function is used to set the nominee details in the form.
   * It returns a FormGroup with the nominee details.
   */
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
    nominee_email='',
    nominee_mobile='',
    nominee_same_as_email_applicant=false,
    nominee_same_as_mobile_applicant=false,
    nominee_document='',
    nominee_aadhar='',
    nominee_driving_license='',
    nominee_passport=''
  ){
    return new FormGroup({
      nominee_type:new FormControl(nominee_type ? nominee_type : '',[Validators.required]),
      nominee_pan: new FormControl(nominee_pan ? nominee_pan : '',[Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)]),
      nominee_name: new FormControl(nominee_name ? nominee_name : '',[Validators.required]),
      // nominee_dob: new FormControl(nominee_dob ? nominee_dob : '',[Validators.required,this.minAgeValidator(18)]),
      nominee_dob: new FormControl(nominee_dob ? nominee_dob : ''),
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
      nominee_email:new FormControl(nominee_email ? nominee_email : '',[Validators.required,Validators.email]),
      nominee_mobile:new FormControl(nominee_mobile ? nominee_mobile : '',[
           Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10)
      ]),
      nominee_same_as_email_applicant:new FormControl(nominee_same_as_email_applicant),
      nominee_same_as_mobile_applicant:new FormControl(nominee_same_as_mobile_applicant),
      nominee_document:new FormControl(nominee_document,[Validators.required]),
      nominee_aadhar:new FormControl(nominee_aadhar ? nominee_aadhar : ''),
      nominee_driving_license:new FormControl(nominee_driving_license ? nominee_driving_license : ''),
      nominee_passport:new FormControl(nominee_passport ? nominee_passport : ''),
    })
  }

  /**
   * 
   * @param ifsc_code - The IFSC code of the bank
   * @param acc_type - The account type of the bank
   * @param acc_no - The account number of the bank
   * @param micr - The MICR code of the bank
   * @description This function is used to set the bank details in the form.
   * It returns a FormGroup with the bank details.
   * @param bank_name - The name of the bank
   * @param bank_branch -   The branch of the bank  
   * @param bank_address - The address of the bank
   * @param bank_city - The city of the bank
   * @param bank_district - The district of the bank
   * @param bank_state - The state of the bank
   * @param bank_pincode - The pincode of the bank
   * @param default_bank_flag - The default bank flag
   * @param bank_country - The country of the bank
   * @param md_bank_state - The metadata for the bank state
   * @param md_bank_district - The metadata for the bank district
   * @param md_bank_city - The metadata for the bank city
   * @param md_bank_pincode - The metadata for the bank pincode
   * @description This function is used to set the bank details in the form.
   * It returns a FormGroup with the bank details.
   * @returns 
   */
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
    bank_pincode:string = '',
    default_bank_flag:string='',
    bank_country:string='',
    md_bank_state:any[]=[],
    md_bank_district:any[]=[],
    md_bank_city:any[]=[],
    md_bank_pincode:any[]=[],
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
      bank_city: new FormControl(bank_city ? bank_city : '',{updateOn:'blur'}),
      bank_district: new FormControl(bank_district ? bank_district : '',{updateOn:'blur'}),
      bank_state: new FormControl(bank_state ? bank_state : '',{updateOn:'blur'}),
      bank_pincode:new FormControl(bank_pincode ? bank_pincode : ''),
      bank_country:new FormControl(bank_country ? bank_country : '',{updateOn:'blur'}),
      default_bank_flag:new FormControl(default_bank_flag ? default_bank_flag : '',[Validators.required]),
      md_bank_state:new FormControl(md_bank_state && md_bank_state.length > 0 ? md_bank_state : []),
      md_bank_district:new FormControl(md_bank_district && md_bank_district.length > 0 ? md_bank_district : []),
      md_bank_city:new FormControl(md_bank_city && md_bank_city.length > 0 ? md_bank_city : []),
      md_bank_pincode:new FormControl(md_bank_pincode && md_bank_pincode.length > 0 ? md_bank_pincode : [])
    })
  }

    // Custom validator for numeric input
  numericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^\d+$/.test(value);
    return isValid ? null : { notNumeric: true };
  }

  /**
   * 
   * @param item - The step item to change to
   * @param index - The index of the step item
   * @description This function is used to change the step in the step wizard.
   * @param index - The index of the step item
   * It updates the step, step_wizard_title, and step_content_name based on the item and index.
   * It also fetches the required data based on the step id.
   * If the new client form is invalid, it does not change the step.
   * @returns
   */
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
          this.getCountry();
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

  /**
   * @description This function is used to set the validation for the form controls based on the step.
   * It sets the validation for the form controls based on the step id.
   */
  getCountry = () => {
    if(this.md_country.length == 0){
      this.dbIntr.api_call(0,'/country',null).pipe(pluck('data')).subscribe((res:any) =>{
        this.md_country = res;
     })
    }
  }

  /**
   * 
   * @param countryId - The ID of the country to get the states for
   * @description This function is used to get the states by country ID.
   * It checks if the md_state array is empty, and if so, it makes an API call to fetch the states for the given country ID.
   * The fetched states are then stored in the md_state array.
   * @returns
   */
  getStateByCountryId = (countryId) =>{
      if(this.md_state.length == 0){
        this.dbIntr.api_call(0,`/states?country_id=${countryId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
          this.md_state = res;
       })
      }
  }

  /**
   * @param stateId - The ID of the state to get the districts for
   * @description This function is used to get the districts by state ID.
   */
  getDistrictByStateId = (stateId) =>{
    if(this.md_district.length == 0){
      this.dbIntr.api_call(0,`/districts?state_id=${stateId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.md_district = res;
     })
    }
  }

  /**
   * @param districtId - The ID of the district to get the cities for
   * @description This function is used to get the cities by district ID.
   */
  getcityByDistrictId = (districtId) =>{
    if(this.md_city.length == 0){
      this.dbIntr.api_call(0,`/city?district_id=${districtId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.md_city = res;
     })
    }
  }

  /**
   *  * @param cityId - The ID of the city to get the pin codes for
   * @description This function is used to get the pin codes by city ID.
   * It checks if the md_pincode array is empty, and if so, it makes an API call to fetch the pin codes for the given city ID.
   * The fetched pin codes are then stored in the md_pincode array.
   * @returns
   */
  getpinCodeByCityId = (cityId) =>{
    if(this.md_pincode.length == 0){
      this.dbIntr.api_call(0,`/pincode?city_id=${cityId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.md_pincode = res;
        console.log(this.md_pincode)
     })
    }
  }

  /**
   * @description This function is used to add more bank details to the form.
   * It pushes a new FormGroup with bank details to the bank FormArray.
   * It also sets the shouldScroll flag to true to enable scrolling to the bottom of the form.
   * @returns
   */
  addMoreBank(){
    this.bank.push(this.setBankDetails());
    this.shouldScroll = true;
  }
  /**
   * @description This function is used to scroll to the bottom of the form.
   * It uses the window.scrollTo method to scroll to the bottom of the document body.
   * If there is an error during scrolling, it logs the error to the console.
   * @returns 
   */
  private scrollToBottom(): void {
    try {
      // this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }
  /**
   * @param index - The index of the bank to delete
   * @description This function is used to delete a bank from the bank FormArray.
   * It removes the bank at the specified index from the bank FormArray.
   * @returns
   */
  deleteBank(index){
    this.bank.removeAt(index)
  }

  /**
   * @description This function is used to fetch the occupation list from the API.
   * It checks if the mdOccupation array is empty, and if so, it makes an
   */
  fetchCommunicationMode = () =>{
        if(this.mdCommunicationMode.length == 0){
              this.dbIntr.api_call_for_nuedge_online(0,'/communicationMode',null)
           .pipe(pluck('data'))
           .subscribe((res:any) =>{
              this.mdCommunicationMode = res;
           })
        }
  }

  /**
   * @description This function is used to fetch the occupation list from the API.
   * It checks if the mdOccupation array is empty, and if so, it makes an API call to fetch the occupations.
   * The fetched occupations are then stored in the mdOccupation array.
   */
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

  /**
   * @description This function is used to fetch the occupation list from the API.
   * It checks if the mdOccupation array is empty, and if so, it makes an
   */
  getStepWizardContent = () =>{
    this.step_wizard = this.step_wizard.filter(el => el.id != 1);
    // console.log(this.step_wizard);
    this.changeStep(this.step_wizard[0],0)
  }

  /**
   * @description This function is used to fetch the occupation list from the API.
   * It checks if the mdOccupation array is empty, and if so, it makes an API call to fetch the occupations.
   * The fetched occupations are then stored in the mdOccupation array.
   */
  addJointHolder(){
    this.joint_holder.push(this.setJointHolder());
    console.log(this.joint_holder.length)
  }
  /**
   * @description This function is used to go to the previous step in the step wizard.
   * It decreases the step by 1 and calls the changeStep function with the previous step item and its index.
   * If the step is already at the first step, it does nothing.
   * @returns
   */
  goPrev(){
    const dt = this.step - 1;
    this.changeStep(this.step_wizard[dt],dt);
    
  }
  /**
   * @description This function is used to go to the next step in the step wizard.
   * It increases the step by 1 and calls the changeStep function with the next step item and its index.
   * If the step is already at the last step, it does nothing.
   * @returns
   */
  goNext(){
    const dt = this.step + 1;
    this.changeStep(this.step_wizard[dt],dt);
  }
  /**
   * @param index - The index of the joint holder to delete
   * @description This function is used to delete a joint holder from the joint_holder FormArray.
   * It removes the joint holder at the specified index from the joint_holder FormArray.
   * If there is only one joint holder left, it does not allow deletion.
   * @returns
   */
  deleteJointHolder(index){
    this.joint_holder.removeAt(index)
  }
  /**
   * @param ev - The event object containing the selected nominee type
   * @param index - The index of the nominee in the FormArray
   */
  onChangeNomineeType(ev,index){
      this.nominee.controls[index].get('nominee_gaurdian_name').setValue('');
      this.nominee.controls[index].get('nominee_gaurdian_pan').setValue('');
      this.nominee.controls[index].get('nominee_gaurdian_rel').setValue('');
      this.nominee.controls[index].get('nominee_dob').setValidators([Validators.required])
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
        this.nominee.controls[index].get('nominee_dob').removeValidators([Validators.required])
      }
        this.nominee.controls[index].get('nominee_gaurdian_name').updateValueAndValidity({emitEvent:false});
        this.nominee.controls[index].get('nominee_dob').updateValueAndValidity({emitEvent:false});


  }

  /**
   * @param item - The step item to set the validation for
   * @description This function is used to set the validation for the form controls based on the step.
   * It clears the validators for all form controls and sets the validators based on the step id.
   * It also calls the validateField function to validate the specific field based on the step.
   * @returns
   */
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

  /**
   * @param form_controls - The array of form control names
   * @param formControlName - The name of the form control to validate
   * @description This function is used to validate a specific field in the form.
   */
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
                      else if(key == 'identification_type2' 
                        || key =='tax_payer_identification_no2' 
                        || key == 'country_of_tax_residency2'
                        || key == 'identification_type3' 
                        || key =='tax_payer_identification_no3' 
                        || key == 'country_of_tax_residency3'
                        || key == 'identification_type4' 
                        || key =='tax_payer_identification_no4' 
                        || key == 'country_of_tax_residency4'
                        || key == 'ffi'
                        || key == 'nffe_category'
                        || key == 'nature_of_bussiness'
                        || key == 'active_nffe_sub_category'
                        || key == 'name_of_stock_exchange'
                      ){}
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

    /**
     * @param control - The FormGroup control to validate
     * @param formControlName - The name of the form control to validate
     */
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
                        || key == 'bank_country'
                        || key == 'md_bank_state'
                        || key == 'md_bank_district'
                        || key == 'md_bank_city'
                        || key == 'md_bank_pincode'
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
                          else if(key == 'nominee_email'){
                              control.get(key).setValidators([Validators.required,Validators.email]);
                          }
                          else if(key == 'nominee_mobile'){
                              control.get(key).setValidators([
                                Validators.required,
                                Validators.pattern('^[0-9]*$'),
                                Validators.minLength(10),
                                Validators.maxLength(10)
                              ]);
                          }
                          else if(key == 'nominee_dob'){
                            if(control.get('nominee_type').value == 'Y'){
                              control.get(key).setValidators([Validators.required])
                            }
                            else{
                              control.get(key).setValidators([this.minAgeValidator(18)]);
                            }
                          }
                          else if(key == 'nominee_pan'){
                              if(control.get('nominee_document').value == 'P'){
                                control.get(key).setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])
                              }
                          }
                          else if(key == 'nominee_aadhar'){
                              if(control.get('nominee_document').value == 'A'){
                                control.get(key).setValidators([
                                  Validators.required,
                                  Validators.pattern('^[0-9]*$'),
                                  Validators.minLength(4),
                                  Validators.maxLength(4)
                                ])
                              }
                          }
                          else if(key == 'nominee_driving_license'){
                              if(control.get('nominee_document').value == 'D'){
                                control.get(key).setValidators([Validators.required])
                              }
                          }
                          else if(key == 'nominee_passport'){
                              if(control.get('nominee_document').value == 'PA'){
                                control.get(key).setValidators([Validators.required])
                              }
                          }
                          else if(key == 'nominee_document'){
                                control.get(key).setValidators([Validators.required])
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

      /**
       * @description This function checks if a form control has a required validator.
       * It takes the control name as a parameter and returns true if the control has a required validator, otherwise false.
       * @param controlName - The name of the form control to check for required validator
       * @returns boolean - true if the control has a required validator, false otherwise
       */
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

    /**
     * @description This function checks if a form control in the joint_holder FormArray has a required validator.
     * It takes the control name and index as parameters and returns true if the control has a required validator, otherwise false.
     * @param controlName - The name of the form control to check for required validator
     * @param index - The index of the joint holder in the FormArray
     * @returns boolean - true if the control has a required validator, false otherwise
     */
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
    /**
     * @description This function checks if a form control in the nominee FormArray has a required validator.
     * It takes the control name and index as parameters and returns true if the control has a
     */
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

    /**
     * @description This function checks if a form control in the bank FormArray has a required validator.
     * It takes the control name and index as parameters and returns true if the control has a required validator, otherwise false.
     * @param controlName - The name of the form control to check for required validator
     * @param index - The index of the bank in the FormArray
     * @returns boolean - true if the control has a required validator, false otherwise
     */
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

    /**
     * @description This function validates the age of a user based on their date of birth.
     * It checks if the user is old enough based on the minimum age provided.
     * If the date of birth is invalid or empty, it skips validation.
     * @param minAge - The minimum age to validate against
     * @returns ValidatorFn - A function that takes an AbstractControl and returns ValidationErrors or null
     */
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

  /**
   * @description This function is used to handle the change event of the pan_exempt field in the joint_holder FormArray.
   * It updates the validators for the pan, exempt_category, and exempt_ref_number fields based
   */
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

  /**
   * @description This function is used to handle the blur event of the pan field in the joint_holder FormArray.
   * It updates the validators for the pan field based on the value of the pan_exempt
   */
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

  /**
   * @description This function is used to fetch the mobile and email declaration flags from the database.
   * It checks if the flags are already fetched and if not, it makes an API call to fetch them.
   * The fetched flags are stored in the mdMobileEmailDecFlag array.
   * 
   * @returns void
   */
  fetchMobileEmailDeclarationFlag = () =>{
        if(this.mdMobileEmailDecFlag.length == 0){
           this.dbIntr.api_call_for_nuedge_online(0,'/mobileEmailDeclaration',null)
           .pipe(pluck('data'))
           .subscribe((res:any) =>{
              this.mdMobileEmailDecFlag = res;
           })
        }
  }

  /**
   * @description This function is used to create a new client.
   * It validates the new_client_form and if valid, it either goes to the next step or submits the form data.
   * The form data is prepared by appending various fields and their values to a FormData object.
   * 
   * @returns void
   */
  createNewClient(){
    console.log(this.new_client_form.value);
    //  return;
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
                                                  formdata.append(`${obj}${index + 1}`,exempt_cat ? JSON.stringify(exempt_cat) : '')
                                              }
                                              else{
                                                formdata.append(`${obj}${index + 1}`,'')
                                              }
                                         }
                                         else if(obj == 'occupation'){
                                                  const td_occupation = this.md_occupation?.find(ele => ele.id == el.value[obj]);
                                                  formdata.append(`${obj}${index + 1}`,td_occupation ? JSON.stringify(td_occupation) : '')
                                         }
                                         else if(obj == 'acc_type'){
                                                  const td_accType = this.md_accountType?.find(ele => ele.id == el.value[obj]);
                                                  formdata.append(`${obj}${index + 1}`,td_accType ? JSON.stringify(td_accType) : '')
                                         }
                                         else if(obj == 'mobile_dec_flag'){
                                                if(el.value['mobile']){
                                                      const tdMobileFlag = this.mdMobileEmailDecFlag?.find(ele => ele.id == el.value[obj]);
                                                      formdata.append(`${obj}${index + 1}`,tdMobileFlag ? JSON.stringify(tdMobileFlag) : '')
                                                }
                                                else{
                                                    formdata.append(`${obj}${index + 1}`,'')
                                                }
                                         }
                                        else if(obj == 'email_dec_flag'){
                                                if(el.value['email']){
                                                      const tdEmailFlag = this.mdMobileEmailDecFlag?.find(ele => ele.id == el.value[obj]);
                                                      formdata.append(`${obj}${index + 1}`,tdEmailFlag ? JSON.stringify(tdEmailFlag) : '');
                                                }
                                                else{
                                                    formdata.append(`${obj}${index + 1}`,'')
                                                }
                                         }
                                         else if(obj == 'nominee_relationship'){
                                              const TDRelationShip = this.md_relationship?.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,TDRelationShip ? JSON.stringify(TDRelationShip) : '');
                                         }
                                         else if(obj == 'nominee_gaurdian_rel'){
                                                if(el.value['nominee_type'] == 'Y'){
                                                        const TDRelationShip = this.md_relationship?.find(ele => ele.id == el.value[obj]);
                                                        formdata.append(`${obj}${index + 1}`,TDRelationShip ? JSON.stringify(TDRelationShip) : '');
                                                }
                                                else{
                                                    formdata.append(`${obj}${index + 1}`,'')
                                                }
                                              const TDRelationShip = this.md_relationship?.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,TDRelationShip ? JSON.stringify(TDRelationShip) : '');
                                         }
                                         else if(obj == 'nominee_country'){
                                                const country = this.md_country.find(ele => ele.id == el.value[obj]);
                                                formdata.append(`${obj}${index + 1}`,country ? JSON.stringify(country) : '')
                                          } 
                                          else if(obj == 'nominee_state'){
                                                const state = this.nominee.controls[index].get('md_nominee_state')?.value.find(ele => ele.id == el.value[obj]);
                                                formdata.append(`${obj}${index + 1}`,state ? JSON.stringify(state) : '')
                                          }
                                          else if(obj == 'nominee_city'){
                                              const city = this.nominee.controls[index].get('md_nominee_city')?.value.find(ele => ele.id == el.value[obj]);
                                                formdata.append(`${obj}${index + 1}`,city ? JSON.stringify(city) : '')
                                          }
                                          else if(obj == 'nominee_district'){
                                              const district = this.nominee.controls[index].get('md_nominee_district')?.value.find(ele => ele.id == el.value[obj]);
                                              formdata.append(`${obj}${index + 1}`,district ? JSON.stringify(district) : '')
                                          }
                                          else if(obj == 'nominee_pincode'){
                                              let nominee_pincode = '';
                                              if(el.value[obj] && el.value[obj].length > 0){
                                                      nominee_pincode = el.value[obj].length > 0 ?  this.nominee.controls[index].get('md_nominee_pincode')?.value?.find(ele => ele.id == el.value[obj][0]?.id) : '';
                                              }
                                              formdata.append(`${obj}${index + 1}`,nominee_pincode ? JSON.stringify(nominee_pincode) : '')
                                          }
                                         else if(obj == 'md_nominee_state' 
                                          || obj == 'md_nominee_city' || obj == 'md_nominee_district' 
                                          || obj == 'md_nominee_pincode'
                                          || obj == 'md_bank_state' 
                                          || obj == 'md_bank_city' || obj == 'md_bank_district' 
                                          || obj == 'md_bank_pincode' 
                                        ){}
                                         else if(obj == 'bank_country'){
                                                let bank_country = '';
                                                if(el.value[obj]){
                                                    bank_country = this.md_country.find(ele => ele.id == Number(el.value[obj]));
                                                }
                                                formdata.append(`${obj}${index + 1}`,bank_country ? JSON.stringify(bank_country) : '')
                                         }
                                         else if(obj == 'bank_state'){
                                                let bank_state = '';
                                                if(el.value[obj]){
                                                    bank_state =  this.bank.controls[index].get('md_bank_state')?.value.find(ele => ele.id == Number(el.value[obj]));
                                                }
                                                formdata.append(`${obj}${index + 1}`,bank_state ? JSON.stringify(bank_state) : '')
                                         }
                                        else if(obj == 'bank_district'){
                                                let bank_district = '';
                                                if(el.value[obj]){
                                                    bank_district =  this.bank.controls[index].get('md_bank_district')?.value.find(ele => ele.id == Number(el.value[obj]));
                                                }
                                                formdata.append(`${obj}${index + 1}`,bank_district ? JSON.stringify(bank_district) : '')
                                         }
                                         else if(obj == 'bank_city'){
                                                let bank_city = '';
                                                if(el.value[obj]){
                                                    bank_city =  this.bank.controls[index].get('md_bank_city')?.value.find(ele => ele.id == Number(el.value[obj]));
                                                }
                                                formdata.append(`${obj}${index + 1}`,bank_city ? JSON.stringify(bank_city) : '')
                                         }
                                         else if(obj == 'bank_pincode'){
                                            let bank_pincode = '';
                                            if(el.value[obj] && el.value[obj].length > 0){
                                                    bank_pincode = el.value[obj].length > 0 ?  this.bank.controls[index].get('md_bank_pincode')?.value?.find(ele => ele.id == el.value[obj][0]?.id) : '';
                                            }
                                            formdata.append(`${obj}${index + 1}`,bank_pincode ? JSON.stringify(bank_pincode) : '')
                                         }
                                         else{
                                           formdata.append(`${obj}${index + 1}`,el.value[obj] ? el.value[obj] : '')
                                         }
                                    })
                            })
                      }
                      else{
                          if(nestedkey == 'occupation'){
                            const occupations = this.md_occupation?.find(el => el.id == control.get(nestedkey)?.value);
                            formdata.append(nestedkey,occupations ? JSON.stringify(occupations) : '')
                          }
                          else if(nestedkey == 'exempt_category'){
                              if(this.new_client_form.get('customer_dtls.pan_exempt')?.value == 'Y'){
                                  const exempt_cat = this.md_exempt_category?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,exempt_cat ? JSON.stringify(exempt_cat) : '')
                              }
                              else{
                                 formdata.append(nestedkey,'')
                              }
                          }
                          else if(nestedkey == 'guardian_exempt_category'){
                              if(this.new_client_form.get('customer_dtls.guardian_pan_exempt')?.value == 'Y'){
                                  const exempt_cat = this.md_gaurdian_exempt_category?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,exempt_cat ? JSON.stringify(exempt_cat) : '')
                              }
                              else{
                                 formdata.append(nestedkey,'')
                              }
                          }
                           else if(nestedkey == 'email_rel'){
                              if(this.new_client_form.get('contact_dtls.email')?.value){
                                  const TDemailFlag = this.mdMobileEmailDecFlag?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,TDemailFlag ? JSON.stringify(TDemailFlag) : '')
                              }
                              else{
                                 formdata.append(nestedkey,'')
                              }
                          }
                          else if(nestedkey == 'mobile_rel'){
                              if(this.new_client_form.get('contact_dtls.mobile')?.value){
                                  const TDmobileFlag = this.mdMobileEmailDecFlag?.find(el => el.id == control.get(nestedkey)?.value);
                                  formdata.append(nestedkey,TDmobileFlag ? JSON.stringify(TDmobileFlag) : '')
                              }
                              else{
                                  formdata.append(nestedkey,'')
                              }
                          }
                          else if(nestedkey == 'communication_mode'){
                                const TDcommunicationMode = this.mdCommunicationMode?.find(el => el.id == control.get(nestedkey)?.value);
                                formdata.append(nestedkey,TDcommunicationMode ? JSON.stringify(TDcommunicationMode) : '')
                          }
                          else if(nestedkey == 'div_pay_mode'){
                              const divPayMode = this.md_divPayMode?.find(ele => ele.id == control.get(nestedkey)?.value);
                              console.log(divPayMode);
                              formdata.append(nestedkey,divPayMode ? JSON.stringify(divPayMode) : '')
                          }
                          else if(nestedkey == 'country_id'){
                               const country = this.md_country.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,country ? JSON.stringify(country) : '')
                          } 
                          else if(nestedkey == 'state_id'){
                               const state = this.md_state.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,state ? JSON.stringify(state) : '')
                          }
                          else if(nestedkey == 'city_id'){
                               const city = this.md_city.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,city ? JSON.stringify(city) : '')
                          }
                          else if(nestedkey == 'district_id'){
                                const district = this.md_district.find(ele => ele.id == control.get(nestedkey)?.value);
                               formdata.append(nestedkey,district ? JSON.stringify(district) : '')
                          }
                          else if(nestedkey == 'pincode_id'){
                                const pincode = control.get(nestedkey)?.value.length > 0 ?  this.md_pincode.find(ele => ele.id == control.get(nestedkey)?.value[0]?.id) : '';
                              //  const pincode = control.get(nestedkey)?.value.length > 0 ?  this.md_pincode.find(ele => ele.id == control.get(nestedkey)?.value[0]?.id) : '';
                               formdata.append(nestedkey,pincode ? JSON.stringify(pincode) : '')
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

  /**
   * @description This function is used to handle the change event of the KYC type for joint holders.
   * It updates the validators for the ckyc_number field based on the selected KYC type.
   * If the KYC type is 'C', it sets the ckyc_number field as required.
   * If the KYC type is not 'C', it removes the required validator from the ckyc_number field.
   */
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
  /**
   * @description This function is used to handle the blur event of the mobile field for joint holders.
   * It updates the validators for the mobile_dec_flag field based on the value of the mobile field.
   * If the mobile field has a value, it sets the mobile_dec_flag field as required.
   */
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

  /**
   * @description This function is used to handle the blur event of the email field for joint holders.
   * It updates the validators for the email_dec_flag field based on the value of the email field.
   * If the email field has a value, it sets the email_dec_flag field as required.
   */
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

  /**
   * @description This function is used to handle the change event of the default bank flag in the bank FormArray.
   * It sets the default_bank_flag of all other banks to 'N' when a bank is set as default.
   * It logs the event and index of the bank being changed.
   * 
   * @param ev - The change event from the default bank flag input
   * @param index - The index of the bank in the FormArray
   */
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

  /**
   * @description This function is used to handle the change event of the country field in the nominee FormArray.
   * It resets the state, district, city, and pincode fields for the nominee at the specified index.
   * It fetches the states for the selected country and updates the md_nominee_state field.
   */
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

  /**
   * @description This function is used to handle the change event of the country field in the bank FormArray.
   * It resets the state, district, city, and pincode fields for the bank at the specified index.
   * It fetches the states for the selected country and updates the md_bank_state field.
   * 
   * @param ev - The change event from the country input
   * @param index - The index of the bank in the FormArray
   */
  onChangeBankCountry = (ev,index) =>{
      this.bank.controls[index].get('bank_state').setValue('');
      this.bank.controls[index].get('bank_district').setValue('');
      this.bank.controls[index].get('bank_city').setValue('');
      this.bank.controls[index].get('bank_pincode').setValue('');
      this.bank.controls[index].get('md_bank_state').setValue([]);
      this.bank.controls[index].get('md_bank_district').setValue([]);
      this.bank.controls[index].get('md_bank_city').setValue([]);
      this.bank.controls[index].get('md_bank_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchBankStateByCountry(ev.target?.value,index)
      }
  }

  /**
   * @description This function fetches the states based on the selected country for the bank FormArray.
   * It makes an API call to fetch the states and updates the md_bank_state field for the specified index.
   */
  fetchBankStateByCountry = (countryId,index) =>{
     this.dbIntr.api_call(0,`/states?country_id=${countryId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
          this.bank.controls[index].get('md_bank_state').setValue(res);
      })
  }

  /**
   * @description This function fetches the states based on the selected country for the nominee FormArray.
   * It makes an API call to fetch the states and updates the md_nominee_state field for the specified index.
   * 
   * @param countryId - The ID of the selected country
   * @param index - The index of the nominee in the FormArray
   */
  fetchNomineeStateByCountry = (countryId,index) =>{
      this.dbIntr.api_call(0,`/states?country_id=${countryId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.nominee.controls[index].get('md_nominee_state').setValue(res);
        })
  }

  /**
   * @description This function is used to handle the change event of the state field in the nominee FormArray.
   * It resets the district, city, and pincode fields for the nominee at the specified index.
   * It fetches the districts for the selected state and updates the md_nominee_district field.
   */
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

  /**
   * @description This function is used to handle the change event of the state field in the bank FormArray.
   * It resets the district, city, and pincode fields for the bank at the specified index.
   * It fetches the districts for the selected state and updates the md_bank_district field.
   */
  onChangeBankState = (ev,index) =>{
      this.bank.controls[index].get('bank_district').setValue('');
      this.bank.controls[index].get('bank_city').setValue('');
      this.bank.controls[index].get('bank_pincode').setValue('');
      this.bank.controls[index].get('md_bank_district').setValue([]);
      this.bank.controls[index].get('md_bank_city').setValue([]);
      this.bank.controls[index].get('md_bank_pincode').setValue([]);
       if(ev.target?.value){
        this.fetchBankDistrictByState(ev.target?.value,index)
      }
  }
  /**
   * @description This function fetches the districts based on the selected state for the bank FormArray.
   * It makes an API call to fetch the districts and updates the md_bank_district field for the specified index.
   * 
   * @param stateId - The ID of the selected state
   * @param index - The index of the bank in the FormArray
   */
  fetchBankDistrictByState  = (stateId,index) =>{
      this.dbIntr.api_call(0,`/districts?state_id=${stateId}`,null)
      .pipe(pluck('data')).subscribe((res:any) =>{
          this.bank.controls[index].get('md_bank_district').setValue(res);
      })
  }

  /**
   * @description This function fetches the districts based on the selected state for the nominee FormArray.
   * It makes an API call to fetch the districts and updates the md_nominee_district
   */
  fetchNomineeDistrictByState = (stateId,index) =>{
      this.dbIntr.api_call(0,`/districts?state_id=${stateId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.nominee.controls[index].get('md_nominee_district').setValue(res);
        })
  }

  /**
   * @description This function is used to handle the change event of the district field in the nominee FormArray.
   * It resets the city and pincode fields for the nominee at the specified index.
   * It fetches the cities for the selected district and updates the md_nominee_city field.
   */
  onChangeDistrict = (ev,index) =>{
      this.nominee.controls[index].get('nominee_city').setValue('');
      this.nominee.controls[index].get('md_nominee_city').setValue([]);
      this.nominee.controls[index].get('nominee_pincode').setValue('');
      this.nominee.controls[index].get('md_nominee_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchNomineeCityByDistrict(ev.target?.value,index)
      }
  }

  /**
   * @description This function is used to handle the change event of the district field in the bank FormArray.
   * It resets the city and pincode fields for the bank at the specified index.
   * It fetches the cities for the selected district and updates the md_bank_city field.
   */
  onChangeBankDistrict = (ev,index) =>{
      this.bank.controls[index].get('bank_city').setValue('');
      this.bank.controls[index].get('md_bank_city').setValue([]);
      this.bank.controls[index].get('bank_pincode').setValue('');
      this.bank.controls[index].get('md_bank_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchBankCityByDistrict(ev.target?.value,index)
      }
  }
  /**
   * @description This function fetches the cities based on the selected district for the bank FormArray.
   * It makes an API call to fetch the cities and updates the md_bank_city field for the specified index.
   * 
   * @param districtId - The ID of the selected district
   * @param index - The index of the bank in the FormArray
   */
  fetchBankCityByDistrict = (districtId,index) =>{
        this.dbIntr.api_call(0,`/city?district_id=${districtId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.bank.controls[index].get('md_bank_city').setValue(res);
        })
  }

  /**
   * @description This function fetches the cities based on the selected district for the nominee FormArray.
   * It makes an API call to fetch the cities and updates the md_nominee_city field for the specified index.
   * 
   * @param districtId - The ID of the selected district
   * @param index - The index of the nominee in the FormArray
   */
  fetchNomineeCityByDistrict = (districtId,index) =>{
        this.dbIntr.api_call(0,`/city?district_id=${districtId}`,null)
        .pipe(pluck('data')).subscribe((res:any) =>{
            this.nominee.controls[index].get('md_nominee_city').setValue(res);
        })
  }

  /**
   * @description This function is used to handle the change event of the city field in the nominee FormArray.
   * It resets the pincode field for the nominee at the specified index.
   * It fetches the pincodes for the selected city and updates the md_nominee_pincode field.
   */
  onChangeCity = (ev,index) =>{
      this.nominee.controls[index].get('nominee_pincode').setValue('');
      this.nominee.controls[index].get('md_nominee_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchNomineePincodeByCity(ev.target?.value,index)
      }
  }

  /**
   * @description This function is used to handle the change event of the city field in the bank FormArray.
   * It resets the pincode field for the bank at the specified index.
   * It fetches the pincodes for the selected city and updates the md_bank_pincode field.
   */
  onChangeBankCity = (ev,index) =>{
      this.bank.controls[index].get('bank_pincode').setValue('');
      this.bank.controls[index].get('md_bank_pincode').setValue([]);
      if(ev.target?.value){
        this.fetchBankPincodeByCity(ev.target?.value,index)
      }
  }

  /**
   * @description This function fetches the pincodes based on the selected city for the bank FormArray.
   * It makes an API call to fetch the pincodes and updates the md_bank_pincode field for the specified index.
   * 
   * @param cityId - The ID of the selected city
   * @param index - The index of the bank in the FormArray
   */
  fetchBankPincodeByCity = (cityId,index) =>{
          this.dbIntr.api_call(0,`/pincode?city_id=${cityId}`,null)
          .pipe(pluck('data')).subscribe((res:any) =>{
              this.bank.controls[index].get('md_bank_pincode').setValue(res);
          })
  }

  /**
   * @description This function fetches the pincodes based on the selected city for the nominee FormArray.
   * It makes an API call to fetch the pincodes and updates the md_nominee_pincode field for the specified index.
   * 
   * @param cityId - The ID of the selected city
   * @param index - The index of the nominee in the FormArray
   */
  fetchNomineePincodeByCity = (cityId,index) =>{
          this.dbIntr.api_call(0,`/pincode?city_id=${cityId}`,null)
          .pipe(pluck('data')).subscribe((res:any) =>{
              this.nominee.controls[index].get('md_nominee_pincode').setValue(res);
          })
    }

    /**
     * @description This function is used to handle the change event of the same as mobile applicant checkbox in the nominee FormArray.
     * It sets the nominee_mobile field to the primary holder's mobile number if the checkbox is checked,
     * otherwise it clears the nominee_mobile field.
     */
    sameAsMobileApplicant = (ev,index) =>{
      if(ev.target.checked){
        const primary_holder_mobile = this.new_client_form.get('contact_dtls.mobile')?.value;
        this.nominee.controls[index].get('nominee_mobile').setValue(primary_holder_mobile);
      }
      else{
        this.nominee.controls[index].get('nominee_mobile').setValue('');
      }
    }

    /**
     * @description This function is used to handle the change event of the same as email applicant checkbox in the nominee FormArray.
     * It sets the nominee_email field to the primary holder's email if the checkbox is checked,
     * otherwise it clears the nominee_email field.
     * 
     * @param ev - The change event from the checkbox input
     * @param index - The index of the nominee in the FormArray
     */
    sameAsEmailApplicant = (ev,index) =>{
        if(ev.target.checked){
          const primary_holder_email = this.new_client_form.get('contact_dtls.email')?.value;
          this.nominee.controls[index].get('nominee_email').setValue(primary_holder_email);
        }
        else{
          this.nominee.controls[index].get('nominee_email').setValue('');
        }
    }

    /**
     * @description This function is used to handle the change event of the nominee document type in the nominee FormArray.
     * It updates the validators for the nominee document fields based on the selected document type.
     * If the document type is 'P', it sets the nominee_pan field as required with a specific pattern.
     */
    onchangeNomineeDocumentType = (ev,index) =>{
      this.nominee.controls[index].get('nominee_pan').clearValidators();   
      this.nominee.controls[index].get('nominee_aadhar').clearValidators();   
      this.nominee.controls[index].get('nominee_driving_license').clearValidators();   
      this.nominee.controls[index].get('nominee_passport').clearValidators();
      if(ev.target.value == 'P'){
        this.nominee.controls[index].get('nominee_pan').setValidators([Validators.required,Validators.pattern(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/)])
      }
      else if(ev.target.value == 'A'){
        this.nominee.controls[index].get('nominee_aadhar').setValidators([
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(4),
            Validators.maxLength(4)
        ])
      }
      else if(ev.target.value == 'D'){
        this.nominee.controls[index].get('nominee_driving_license').setValidators([Validators.required])
      }
      else if(ev.target.value == 'PA'){
        this.nominee.controls[index].get('nominee_passport').setValidators([Validators.required])
      }

      this.nominee.controls[index].get('nominee_pan').updateValueAndValidity({emitEvent:false});   
      this.nominee.controls[index].get('nominee_aadhar').updateValueAndValidity({emitEvent:false});   
      this.nominee.controls[index].get('nominee_driving_license').updateValueAndValidity({emitEvent:false});   
      this.nominee.controls[index].get('nominee_passport').updateValueAndValidity({emitEvent:false});

    }

}
