import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, delay, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IQueryGivenByOrReceiveThrough, IQueryNature, IQueryStatus, IQueryTypeSubType } from '../../Master/queryDesk/query-desk-report/query-desk-report.component';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DatePipe } from '@angular/common';
import { global } from 'src/app/__Utility/globalFunc';
import { environment, url } from 'src/environments/environment';
import { amc } from 'src/app/__Model/amc';
import { Observable, of } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-view-entry',
  templateUrl: './view-entry.component.html',
  styleUrls: ['./view-entry.component.css']
})
export class ViewEntryComponent implements OnInit {

  
  settingsforFolioDropdown = this.utility.settingsfroMultiselectDropdown(
    'folio_no',
    'folio_no',
    'Search Folio',
    1,
    197,
    true
  );

  settingsforSchemeDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Search Scheme',
    1,
    197
  );
  md_holiday:any = [];

  productId:number | undefined = 0;
  queryId:number | undefined = 0;
  __isInvestorSpinner:boolean | undefined = false;
  // __isSchemeSpinner:boolean | undefined = false;
  displayMode_forClient: string;
  // displayMode_forScheme: string;
  formData:any | undefined = null;
  md_client:Partial<client>[] = [];
  md_scheme:Partial<scheme>[] = [];
  md_folio:any = [];
  md_plan:any = [];
  md_amc:Partial<amc>[] = [];
  md_queryStatus:Partial<IQueryStatus>[] = [];
  md_QueryGiven_by:Partial<IQueryGivenByOrReceiveThrough>[] = [];
  md_queryType:Partial<IQueryTypeSubType>[] = [];
  md_querySubType:Partial<IQueryTypeSubType>[] = [];
  md_queryNature:Partial<IQueryNature>[] = [];
  md_QueryGivenReceiveThr:Partial<IQueryGivenByOrReceiveThrough>[] = [];
  md_query_status:any = [];
  queryEntryForm = new FormGroup({
       client_code: new FormControl(''),
       entry_attachment:new FormControl([]),
       entry_file:new FormControl([]),
       solve_attachment:new FormControl([]),
       solve_file:new FormControl([]),
       investor_name: new FormControl('',[Validators.required]),
       investor_code: new FormControl(''),
       investor_pan: new FormControl({value:'',disabled: true}),
       investor_email: new FormControl({value:'',disabled: true}),
       investor_mobile: new FormControl({value:'',disabled: true}), 
       folio_no: new FormControl('',{
        updateOn:'change',
        // validators:Validators.required
      }),
        // plan_id:new FormControl(''),
        ins_product_id:new FormControl(''),
        fd_scheme_id: new FormControl(''),
        policy_no:new FormControl(''),
        fd_no:new FormControl(''),
       application_no: new FormControl(''),
       query_given_by_id: new FormControl('',[Validators.required]),
       entry_name:new FormControl('',[Validators.required]),
       scheme_name:new FormControl(''),
       scheme_id:new FormControl([]),
       product_code: new FormControl(''),
       isin_no:new FormControl(''),
       query_type_id:new FormControl('',{
        updateOn:'change',
        validators:Validators.required
      }),
      query_rec_through_id:new FormControl(''),
      query_mode_id: new FormControl('O'),
       query_subtype_id:new FormControl('',[Validators.required]),
       query_details:new FormControl('',[Validators.required]),
       query_nature_id:new FormControl(''),
      //  query_given_to_amc_or_company:new FormControl('Yes'),
        query_given_to_id:new FormControl(''),
       level_id:new FormControl(''),
       query_given_through_id:new FormControl(''),
       concern_person_name:new FormControl(''),
       contact_no:new FormControl('',[Validators.pattern("^[0-9]*$")]),
       email_id:new FormControl('',[Validators.email]),
       query_tat:new FormControl(''),
       query_receive_by_id:new FormControl(''),
       expected_close_date: new FormControl(''),
       selectAll:new FormControl({
        value:false,
        disabled:true
       }),
      //  actual_close_date: new FormControl('',[Validators.required]),
      //  query_status_id: new FormControl('',[Validators.required]),
       remarks: new FormControl(''),
       query_status_id: new FormControl(''),
      //  query_feedback: new FormControl('',[Validators.required]),
      //  status_overall_feedback: new FormControl('',[Validators.required])
      query_feedback:new FormControl(''),
      // suggestion:new FormControl(''),
      scheme_dtls:new FormArray([],{
          asyncValidators:this.checkIfAnyOnItemCheckedOrNot()
      })
  })

  constructor(private RtDt:ActivatedRoute,
    private datePipe:DatePipe,
    private __dbIntr:DbIntrService, private  utility:UtiliService) {}

  ngOnInit(): void {
    this.fetchHoliday();

    // console.log(this.utility.DcryptText(this.RtDt.snapshot.params.queryId));
    // this.productId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.productId));
    this.productId = Number(this.utility.DcryptText(this.RtDt.snapshot.params.productId));

    // this.queryId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.queryId));
    this.queryId = Number(this.utility.DcryptText(this.RtDt.snapshot.params.queryId));
    this.queryEntryForm.get('query_nature_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('remarks').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('query_status_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('entry_name').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    // this.queryEntryForm.get('query_mode_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    // this.queryEntryForm.get('query_details').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    // this.queryEntryForm.get('query_given_to_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null);
    // this.queryEntryForm.get('query_given_through_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null);
    this.queryEntryForm.get('query_tat').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null);
    this.queryEntryForm.get('expected_close_date').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null);
    this.queryEntryForm.get('query_tat').updateValueAndValidity();
    // this.queryEntryForm.get('query_given_to_id').updateValueAndValidity();
    this.queryEntryForm.get('expected_close_date').updateValueAndValidity();
    // this.queryEntryForm.get('query_given_through_id').updateValueAndValidity();
    this.queryEntryForm.get('query_nature_id').updateValueAndValidity();
    this.fetchGivenByQuery();
    this.fetchQueryType();
    this.fetchQueryNature();
    this.fetchQueryGivenReceiveThr();
    this.fetchPlanaccordingtoProductId();

    if(this.queryId > 0){
      this.fetchQueryDetails(this.queryId);
      this.fetchQueryStatus();
      this.queryEntryForm.get('investor_name').removeValidators([Validators.required]);
      this.queryEntryForm.get('query_given_by_id').removeValidators([Validators.required]);
      // this.queryEntryForm.get('query_nature_id').removeValidators([Validators.required]);
      this.queryEntryForm.get('query_subtype_id').removeValidators([Validators.required]);
      this.queryEntryForm.get('query_type_id').removeValidators([Validators.required]);
      this.queryEntryForm.get('investor_name').updateValueAndValidity({emitEvent:false});
      this.queryEntryForm.get('query_given_by_id').updateValueAndValidity({emitEvent:false});
      // this.queryEntryForm.get('query_nature_id').updateValueAndValidity({emitEvent:false});
      this.queryEntryForm.get('query_subtype_id').updateValueAndValidity({emitEvent:false});
      this.queryEntryForm.get('query_type_id').updateValueAndValidity({emitEvent:false});
    }
    else{
       this.setFormControlValidators();
    }
    this.utility.__userDtls$.subscribe(res => {
        this.queryEntryForm.patchValue({
          entry_name:res ? res?.name : '',
          query_receive_by_id:res?.id
        });
        this.queryEntryForm.get('entry_name').disable();
    })
    this.queryEntryForm.get('query_nature_id').disable();
    this.queryEntryForm.get('expected_close_date').disable();
    this.queryEntryForm.get('query_status_id').disable();
    this.queryEntryForm.get('remarks').disable();
    this.queryEntryForm.get('level_id').disable();
    this.queryEntryForm.get('concern_person_name').disable();
    this.queryEntryForm.get('email_id').disable();
    this.queryEntryForm.get('contact_no').disable();
    this.queryEntryForm.get('query_feedback').disable();
    this.queryEntryForm.get('query_rec_through_id').disable();
  }

  /**
   * @description This function checks if the query has any holiday dates
   */
  checkIfchecked(value){
      return of(!value.map(el => el.isActive).some(item => item)).pipe(
        delay(200)
      );
  }

  /**
   * @description This function set async validation
   */
  checkIfAnyOnItemCheckedOrNot(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.checkIfchecked(control.value)
        .pipe(
          map((result: boolean) =>
            result ? { checkErr: true } : null
          )
        );
    };
  }
  /**
   *  @description This function getter for scheme details form array
   *  It returns the FormArray instance for scheme_dtls from the queryEntryForm. 
   */
  get schemeDtls(): FormArray {
    return this.queryEntryForm.get("scheme_dtls") as FormArray;
  }

  // addSchemeDetials(): void {
  //   this.schemeDtls.push(this.createItem());
  // }

  /**
   * @description This function creates a new FormGroup for scheme details
   * It returns a new FormGroup instance with the specified controls and their initial values.
   */
  setFormControlValidators = () =>{
      const first_formControlName = this.productId > 2 ? (this.productId == 3 ? 'policy_no' : 'fd_no') : 'folio_no';
      // const second_formControlName = this.productId > 2  ? (this.productId == 3 ? 'ins_product_id' : 'fd_scheme_id') : 'scheme_id';
      this.queryEntryForm.get(first_formControlName).setValidators([Validators.required]);
      if(this.productId!= 1){
        const second_formControlName = this.productId == 3 ? 'ins_product_id' : 'fd_scheme_id';
        this.queryEntryForm.get(second_formControlName).setValidators([Validators.required]);
      }

  }

  /**
   * @description This function fetch query data from the server
   * It makes an API call to the server to fetch query details based on the provided query_id.
   */
  fetchQueryDetails = (query_id:number) =>{
        this.__dbIntr.api_call(1,`/cus_service/queryShow?id=${query_id}`,null)
        .pipe(pluck('data'))
        .subscribe((res:any) =>{
              this.formData = {
                ...res,
                // entryattach:res.entryattach.map(el => {
                //     el.url=`${environment.query_entry_file}${el.name}`;
                //     el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                //     return el
                // }),
                // solveattach:res.solveattach.map(el =>{
                //     el.url=`${environment.query_solve_file}${el.name}`;
                //     el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                //     return el
                // })
                ...res,
                //    entryattach:res.allattach.filter(el =>{
                //       if(el.query_status_id == 2){
                //           el.url=`${environment.query_attachments}${el.name}`;
                //           el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                //           return el
                //       }
                // }),
                // solveattach:res.allattach.filter(el =>{
                //     if(el.query_status_id != 2){
                //       if(el.query_status_id == res.query_status_id){
                //           el.url=`${environment.query_attachments}${el.name}`;
                //           el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                //           return el
                //       }
                //     }
                // })
                entryattach:res.allattach.filter(el =>{
                  if(el.query_status_id == 2){
                      el.url=`${environment.query_attachments}${el.name}`;
                      el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                      return el
                  }
              }),
              solveattach:res.allattach.filter(el =>{
                  if(el.query_status_id != 2){
                    if(el.query_status_id == res.query_status_id){
                        el.url=`${environment.query_attachments}${el.name}`;
                        el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                        return el
                    }
                  }
              })
              }

              this.setForm(res);
              this.fetchFoliosOfInvestor(res?.investor_name,res?.investor_pan);
        })
  }

  /**
   * @description This function set the form with the provided data
   * It updates the form controls with the values from the data object.
   */
  setForm = (data:any | undefined = null) =>{
    console.log(data);
    this.queryEntryForm.get('investor_name').setValue(data ? data?.investor_name : '',{emitEvent:false});
    this.queryEntryForm.get('folio_no').setValue(data ? [{folio_no:data?.folio_no}] : [],{emitEvent:false});
    this.queryEntryForm.get('query_nature_id').setValue(data ? global.getActualVal(data?.query_nature_id) : '',{emitEvent:false});
    if(data?.query_tat){
      this.queryEntryForm.get('query_tat').setValue(data?.query_tat,{emitEvent:false});
    }
    this.queryEntryForm.patchValue({
      client_code: data && this.productId == 12 ? data?.client_code : '',
      investor_code: data ? data?.investor_code : '',
      investor_pan: data ? data?.investor_pan : '',
      investor_email:data ? data?.investor_email : '',
      investor_mobile:data ? data?.investor_mobile : '', 
      application_no:data ? data?.application_no : '',
      query_given_by_id: data ? data?.query_given_by_id : '',
      entry_name:data ? data?.entry_name : '',
      policy_no: this.productId == 3 ? (data ? data?.policy_no : '') : '',
      fd_no: this.productId == 4 ? (data ? data?.fd_no : '') : '',
      ins_product_id:this.productId == 3 ? (data ? data?.ins_product_id : '') : '',
      fd_scheme_id:this.productId == 4 ? (data ? data?.fd_scheme_id : '') : '',
      // folio_no:data ? data?.folio_no : '',
      product_code:data ? data?.product_code : '',
      isin_no:data ? data?.isin_no : '',
      expected_close_date:data ? (data?.expected_close_date ? (this.datePipe.transform(global.getActualVal(data?.expected_close_date),'yyyy-MM-dd')) : '')  : '',
      query_details:data ? data?.query_details : '',
      remarks: data ? data?.remarks : '',
      query_status_id:data ? data?.query_status_id : '',
      email_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.email_id) : '') : '',
      contact_no:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.contact_no) : '') : '',
      query_given_to_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_given_to_id) : '') : '',
      level_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.level_id) : '') : '',
      query_given_through_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_given_through_id) : '') : '',
      concern_person_name:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.concern_person_name) : '') : '',
      query_feedback:data ? global.getActualVal(data?.query_feedback) : '',
      query_rec_through_id:data ? global.getActualVal(data?.query_rec_through_id) : '',
    });
    setTimeout(() => {
      if(data?.query_tat){
        const queryTypeDtls = data ? this.md_queryType.filter(el => el.id == data?.query_type_id)[0] : ''
        this.queryEntryForm.get('query_type_id').setValue(data ? this.md_queryType.filter(el => el.id == data?.query_type_id)[0] : '',{emitEvent:false});
        this.fetchQuerySubType(queryTypeDtls)
      }
      else{
        this.queryEntryForm.get('query_type_id').setValue(data ? this.md_queryType.filter(el => el.id == data?.query_type_id)[0] : '',{emitEvent:true});
      }
      this.queryEntryForm.get('query_subtype_id').setValue(data ? data?.query_subtype_id : '',{emitEvent:false});
    }, 500);
    this.queryEntryForm.get('investor_name').disable({emitEvent:false});
    this.queryEntryForm.get('folio_no').disable({emitEvent:false});
    this.queryEntryForm.get('application_no').disable({emitEvent:false});
    this.queryEntryForm.get('query_given_by_id').disable({emitEvent:false});
    this.queryEntryForm.get('scheme_id').disable({emitEvent:false});
    this.queryEntryForm.get('query_type_id').disable({emitEvent:false});
    this.queryEntryForm.get('query_subtype_id').disable({emitEvent:false});
    this.queryEntryForm.get('query_details').disable({emitEvent:false});
    this.settingsforFolioDropdown ={
      ...this.settingsforFolioDropdown,
      disabled:true
    } 

  
    
  }

  /**
   * @description This function get expected close date based on the query_tat and date
   * It calculates the expected close date by adding the query_tat to the provided date or current date if no date is provided.
   */
  globalFuncForExpectedCloseDate = (date,query_tat) =>{
      let  daysAfteradd;
      if(date){
        daysAfteradd = moment(date).add(Number(query_tat),'d');
      }
      else{
        daysAfteradd = moment().add(Number(query_tat),'d');
      }
      let actualDate = daysAfteradd;
      this.md_holiday.forEach(element => {
          if(actualDate.isSame(element)){
              console.log("SAME")
              daysAfteradd = daysAfteradd.add(Number(query_tat),'d');
          }
          console.log(daysAfteradd);
          const isweekDay =  daysAfteradd.format('ddd');           
          if(isweekDay == 'Sat'){
            actualDate = moment(daysAfteradd,"DD-MM-yyyy").add(2, 'days');
          }
          else if(isweekDay == 'Sun'){
            actualDate = moment(daysAfteradd,"DD-MM-yyyy").add(1, 'days');
          }
      })
      this.queryEntryForm.get('expected_close_date').setValue(actualDate.format('YYYY-MM-DD'))
    }

  ngAfterViewInit(){
    this.queryEntryForm.controls['investor_name'].valueChanges
      .pipe(
        tap(() => (
          this.__isInvestorSpinner = true,
          this.queryEntryForm.get('investor_code').setValue('')
        )),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/cus_service/searchClient', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.md_client = value;
          this.searchResultVisibilityForInvestor('block');
          this.__isInvestorSpinner = false;
        },
        complete: () => {},
        error: (err) => {
          this.__isInvestorSpinner = false;
        },
      });

      this.queryEntryForm.get('folio_no').valueChanges.subscribe(res =>{
        // this.queryEntryForm.get('scheme_id').setValue([]);
        this.schemeDtls.clear();
        this.queryEntryForm.get('selectAll').setValue(false,{emitEvent:false});
        this.queryEntryForm.get('selectAll').disable();

        if(res.length > 0){
          // console.log(res)
          this.fetchSchemeByFolio(res[0].folio_no);
        }
        else{
          this.md_scheme = [];
          // this.md_amc = [];
          // this.queryEntryForm.get('scheme_id').setValue([]);
        }
      })

      this.queryEntryForm.get('query_type_id').valueChanges.subscribe(res =>{
        if(res){
          this.fetchQuerySubType(res)
        }
        else{
          this.md_querySubType = [];
          this.queryEntryForm.get('query_subtype_id').setValue('');
        }
      })

            this.queryEntryForm.get('query_nature_id').valueChanges.subscribe(res =>{
              console.log('sadsadsadsa works')
              this.queryEntryForm.get('query_given_to_id').setValidators(res != '3' ? [Validators.required] : null);
              this.queryEntryForm.get('level_id').setValidators(res != '3' ? [Validators.required] : null);
              this.queryEntryForm.get('query_given_through_id').setValidators(res != '3' ? [Validators.required] : null);
              this.queryEntryForm.get('contact_no').setValidators(res != '3' ? [Validators.pattern("^[0-9]*$")] : null);
              this.queryEntryForm.get('email_id').setValidators(res != '3' ? [Validators.email] : null);
              if(res == 3){
                this.queryEntryForm.get('query_given_to_id').enable();
                this.queryEntryForm.get('query_tat').disable();
              }
              else{
                this.queryEntryForm.get('query_given_to_id').disable();
                this.queryEntryForm.get('query_tat').enable();
              }
              this.queryEntryForm.get('query_given_to_id').updateValueAndValidity();
              this.queryEntryForm.get('level_id').updateValueAndValidity();
              this.queryEntryForm.get('query_given_through_id').updateValueAndValidity();
              this.queryEntryForm.get('concern_person_name').updateValueAndValidity();
              this.queryEntryForm.get('contact_no').updateValueAndValidity();
              this.queryEntryForm.get('email_id').updateValueAndValidity();
              this.queryEntryForm.get('query_given_to_id').setValue((res == 3 && res) ? '' : 2);
              const dt =  this.md_querySubType .filter((el:any) => el.id == this.queryEntryForm.getRawValue().query_subtype_id);  
              this.queryEntryForm.get('query_tat').setValue(dt.length > 0 ? dt[0]?.query_tat : '');
      })

      this.queryEntryForm.get('selectAll').valueChanges.subscribe(res =>{
        // console.log(this.schemeDtls)
            this.schemeDtls.value.forEach((el,index) =>{
              this.schemeDtls.controls[index].get('isActive').setValue(res);
            })
      })

      this.queryEntryForm.get('level_id').valueChanges.subscribe(res => {
         if(res){
          this.setFormControlValue(this.md_amc[0][`${res}_name`],this.md_amc[0][`${res}_email`],this.md_amc[0][`${res}_contact_no`])
         }
         else{
          this.queryEntryForm.patchValue({
            concern_person_name:'',
            email_id:'',
            contact_no:''
          })
          this.setFormControlValue('','','')
         }
      })

      // this.queryEntryForm.get('query_tat').valueChanges.subscribe(res =>{
      //       let date = new Date();
      //       date.setDate(Number(date.getDate()) + Number(res));
      //       this.queryEntryForm.get('expected_close_date').setValue(this.datePipe.transform(date,'YYYY-MM-dd'))
      // })
      this.queryEntryForm.get('query_tat').valueChanges.subscribe(res =>{
        this.globalFuncForExpectedCloseDate(null,res);
  })
  }

  /**
   * @description This function used to set form control values
   * It sets the values of the form controls concern_person_name, email_id, and contact_no
   * based on the provided name, email, and mobile parameters.
   * If the name or email is 'null', it sets the value to an empty string.
   * If mobile is not provided, it sets the value to an empty string.
   * It makes an API call to the server to fetch query status details.
   */
  setFormControlValue = (name:string,email:string,mobile) =>{
        this.queryEntryForm.patchValue({
          concern_person_name:(name && name!='null') ? name : '',
          email_id:(email && email!='null') ? email : '',
          contact_no:mobile ? mobile : ''
        })
  }

  /**
   * @description This function fetches the level from the server
   * It makes an API call to the server to retrieve the level details.
   */
  fetchLevel = (amc_id:number) =>{
        this.__dbIntr.api_call(0,`/amc?id=${amc_id}`,null)
        .pipe(pluck('data'))
        .subscribe((res:Partial<amc>[]) =>{
            this.md_amc = res;
        })
  }

  /**
   * @description This function fetches the scheme details based on the folio
   */
  fetchSchemeByFolio = (folio_no:string) =>{
      this.__dbIntr.api_call(0,'/cus_service/getFoliowiseProduct',`folio_no=${folio_no}`)
      .pipe(pluck('data'))
      .subscribe((res:any) =>{

          if(res.length > 0){
            this.queryEntryForm.get('selectAll').enable(
              {
                onlySelf:false,
                emitEvent:false
              }
            )
          }
          else{
            this.queryEntryForm.get('selectAll').disable(
              {
                onlySelf:false,
                emitEvent:false
              }
            )
          } 
          // console.log(this.formData);
          // console.log(res);

          if(this.queryId?.toString() != '0'){
                res.forEach(el =>{
                        const dt = this.formData?.allscheme.filter(item => item?.product_code == el.product_code && item?.isin_no == el.isin_no);
                        if(dt.length > 0){
                            this.schemeDtls.push(
                              new FormGroup({
                                  id: new FormControl(el.id),
                                  amc_id:new FormControl(el.amc_id ? el.amc_id : 'N/A'),
                                  product_code: new FormControl(el.product_code ? el.product_code : 'N/A'),
                                  isin_no: new FormControl(el.isin_no  ? el.isin_no : 'N/A'),
                                  scheme_name: new FormControl(el.scheme_name ? `${el.scheme_name}-${el.plan_name}-${el.option_name}` : 'N/A'),
                                  isActive:new FormControl({value:true}),
                                  folio_no:new FormControl(el?.folio_no ? el.folio_no : 'N/A'),
                                  curr_val:new FormControl(el?.curr_val ? (Number(el.curr_val) >= 0 ? Number(el.curr_val) : 0.00) : 0.00),
                                })
                            )
                        }
                        
                });
                if(this.schemeDtls.value.length == res.length){
                  this.queryEntryForm.get('selectAll').setValue(this.schemeDtls.value.length == res.length);
                  this.queryEntryForm.get('selectAll').disable();
                }
                this.fetchLevel(this.schemeDtls.value[0]?.amc_id);
          }
          else{
            res.forEach(el =>{
              this.schemeDtls.push(
                  this.createItem(el)
              );
            })
          }
         
          // if(this.queryId > 0 && this.formData){
          //   const getDtls = this.md_scheme.filter(el => el.product_code == this.formData?.product_code && el.isin_no == this.formData?.isin_no)[0];
          //   this.queryEntryForm.get('scheme_id').setValue(getDtls?.id);  
          // }
      })
  }

  /**
   * @description This function fetches the folios of the investor
   * It makes an API call to the server to retrieve the folios based on the investor name and PAN.
   */
  setSelctAllCheckbox(event){
      const isAllSelected = this.schemeDtls.value.map(el => el.isActive).every(item => item);
      this.getIsAllSelected(isAllSelected);
  }

  /**
   * @description This function used to check whether all items are selected or not
   * It sets the value of the selectAll form control based on the isAllSelected parameter.
   * If isAllSelected is true, it sets the value to true, otherwise it sets it to false.
   * The emitEvent option is set to false to prevent emitting the value change event.
   */
  getIsAllSelected(isAllSelected:boolean){
    this.queryEntryForm.get('selectAll').setValue(isAllSelected,{emitEvent:false});

  }

  /**
   * @description This function fetches the holiday of the investor
   * It makes an API call to the server to retrieve the holiday 
   */
  fetchHoliday = () =>{
    this.__dbIntr.api_call(0,'/cus_service/holiday',null)
    .pipe(pluck('data'))
    .subscribe((res:any) =>{
      this.md_holiday = res.map(el => el.occ_date);
    })
  }



  /**
   * @description This function used to create a new FormGroup for scheme details
   * It takes an element (el) as a parameter and returns a new FormGroup instance with the specified controls and their initial values.
   * The controls include id, product_code, isin_no, scheme_name, isActive, folio_no, and curr_val.
   * If any of the values are not provided, it sets them to 'N/A' or 0.00 as appropriate.
   */
  createItem(el): FormGroup {
    return new FormGroup({
      id: new FormControl(el.id),
      product_code: new FormControl(el.product_code ? el.product_code : 'N/A'),
      isin_no: new FormControl(el.isin_no  ? el.isin_no : 'N/A'),
      scheme_name: new FormControl(el.scheme_name ? `${el.scheme_name}-${el.plan_name}-${el.option_name}` : 'N/A'),
      isActive:new FormControl(false),
      folio_no:new FormControl(el.folio_no ? el.folio_no : 'N/A'),
      curr_val:new FormControl(el.curr_val ? (Number(el.curr_val) >= 0 ? Number(el.curr_val) : 0.00) : 0.00),
    });
  }

  /**
   * This function is used to handle the visibility of the search result for the investor.
   * It takes a display_mode parameter and sets the displayMode_forClient variable to that value.
   * This variable is used to control the visibility of the search result for the investor.
   * 
   * @param {string} display_mode - The display mode for the search result visibility.
   */
  searchResultVisibilityForInvestor(display_mode) {
    // this.__subBrkArn.nativeElement.style.display = display_mode;
    this.displayMode_forClient = display_mode;
  }

  

  // searchResultVisibilityForScheme(display_mode){
  //   this.displayMode_forScheme = display_mode;
  // }

  /**
   * @description This function is used to get the selected items from the parent component
   * It takes an event (ev) as a parameter and updates the queryEntryForm with the selected investor's details.
   * It sets the investor_code, investor_pan, investor_email, and investor_mobile fields in the form.
   */
  getSelectedItemsFromParent = (ev) => {
      this.searchResultVisibilityForInvestor('none');
      this.queryEntryForm.patchValue({
        investor_code:ev.item.client_code,
        investor_pan:ev.item.pan,
        investor_email:ev.item.email,
        investor_mobile:ev.item.mobile
      });
      this.queryEntryForm.get('investor_name').setValue(ev.item.client_name,{emitEvent:false});
      if(this.productId == 1){
        // this.queryEntryForm.get('folio_no').setValue([],{emitEvent:false});
        this.fetchFoliosOfInvestor(ev.item.client_name,ev.item.pan);
        this.queryEntryForm.get('folio_no').setValue([
          {
             "folio_no":ev.item?.folio_no,
          }],{emitEvent:false});
          // this.fetchSchemeByFolio(ev.item.folio_no);
      }
      // else{
      //    // call Plan Mster data
      //    if(this.md_plan.length == 0){
      //    this.fetchPlanaccordingtoPolicyHolder_fd(ev.item.client_name,ev.item.pan);

      //    }
      // }
  }

  /**
   * @description This function fetches the plan according to the product ID
   * It checks the product ID and makes an API call to fetch the plan details based on the product type.
   * If the product ID is 3 (Insurance) or 4 (Fixed Deposit), it fetches the respective plan details.
   * The fetched data is then assigned to the md_plan variable for further use.
   */
  fetchPlanaccordingtoProductId= () =>{

    if(Number(this.productId) ==3 || Number(this.productId) ==4){

        const api_name = this.productId == 3 ? '/ins/product' : '/fd/scheme'
        this.__dbIntr.api_call(0, api_name, null)
        .pipe(pluck('data'))
        .subscribe((res: any) => {
          this.md_plan = res;
        });
    }
      
  } 


  /**
   * @description This function fetches the query given by data from the server
   * It makes an API call to the server to retrieve the query given by data.
   * The fetched data is then assigned to the md_QueryGiven_by variable for further use.
   */
  fetchGivenByQuery = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryGivenBy',null).pipe(pluck('data')).subscribe((res:Partial<IQueryGivenByOrReceiveThrough>[]) =>{
          this.md_QueryGiven_by = res;
      })
  }

  /**
   * @description This function fetches the query given through data from the server
   * It makes an API call to the server to retrieve the query given through data.
   * The fetched data is then assigned to the md_QueryGivenReceiveThr variable for further use.
   */
  fetchQueryGivenReceiveThr = () =>{
    this.__dbIntr.api_call(0,'/cus_service/queryGivenThrough',null).pipe(pluck('data')).subscribe((res:Partial<IQueryGivenByOrReceiveThrough>[]) =>{
      this.md_QueryGivenReceiveThr = res;
  })
    
  }

  /**
   * @description This function fetches the query type data from the server
   * It makes an API call to the server to retrieve the query type data.
   * The fetched data is then assigned to the md_queryType variable for further use.
   * If the queryId is greater than 0, it can be used to filter or manipulate the fetched data as needed.
   */
  fetchQueryType = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryType',null).pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
          this.md_queryType = res;
          // if(this.queryId > 0){
          //   this.
          // }
      })
  }

  /**
   * @description This function fetches the query sub-type data based on the selected query type
   * It makes an API call to the server to retrieve the query sub-type data based on the selected query type.
   * The fetched data is then assigned to the md_querySubType variable for further use.
   * If the queryId is not equal to 0, it sets the query_tat and expected_close_date fields in the form based on the fetched data.
   */
  fetchQuerySubType = (query_type:any) =>{
      this.__dbIntr.api_call(0,'/cus_service/querySubType',`query_type_id=${query_type.id}`).pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
        this.md_querySubType = res;
        if(this.queryId.toString() != '0'){
          setTimeout(() => {
            let dt = [];
            dt =  res.filter((el:any) => el.id == this.queryEntryForm.getRawValue().query_subtype_id);  
            if(!this.queryEntryForm.value.query_tat){
              this.queryEntryForm.get('query_tat').setValue(dt.length > 0 ? dt[0]?.query_tat : '');
            }
            if(!this.queryEntryForm.value.expected_close_date){
              if(dt.length > 0){
                  this.globalFuncForExpectedCloseDate(null,dt[0]?.query_tat);
              }
            }
          }, 2000);
        
        }
      })
  }


  /**
   * @description This function is used to handle file selection for query entry
   * It checks if any files are selected, and if so, it retrieves the selected files and sets them in the queryEntryForm.
   * If no files are selected, it sets the entry_attachment field to an empty array.
   */
  onFileSelect(e:any){
    if(e.target.files.length > 0){
      // e.target.files.forEach(el =>{
      //   console.log(el);
      // })
      let files = e.target.files;
      let original_files = [];
      for (let file of files) {
        original_files.push(file);
      }
        this.queryEntryForm.get('entry_attachment').setValue(original_files);
    }
    else{
      this.queryEntryForm.get('entry_attachment').setValue([]);
    }
  }
  /**
   * @description This function is used to handle file selection for query update
   * It checks if any files are selected, and if so, it retrieves the selected files and sets them in the queryEntryForm.
   * If no files are selected, it sets the solve_attachment field to an empty array.
   * This function is specifically used for updating the query with new attachments.
   */
  onFileSelectforUpdate(e:any){
    if(e.target.files.length > 0){
      let files = e.target.files;
      let original_files = [];
      for (let file of files) {
        original_files.push(file);
      }
        this.queryEntryForm.get('solve_attachment').setValue(original_files);
    }
    else{
      this.queryEntryForm.get('solve_attachment').setValue([]);
    }
  }

  /**
   * @description This function fetches the query nature data from the server
   * It makes an API call to the server to retrieve the query nature data.
   * The fetched data is then assigned to the md_queryNature variable for further use.
   * This function is used to populate the query nature dropdown in the query entry form.
   */
  fetchQueryNature = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryNature',null).pipe(pluck('data')).subscribe((res:Partial<IQueryNature>[]) =>{
          this.md_queryNature = res;
      })
  }

  /**
   * @description This function fetches the query status data from the server
   * It makes an API call to the server to retrieve the query status data.
   */
  fetchQueryStatus = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
        this.md_queryStatus = res;
    })
  }

  /**
   * @description This function fetches the folios of an investor based on client name and PAN
   * It makes an API call to the server to retrieve the folios of the investor.
   * The fetched data is then assigned to the md_folio variable for further use.
   * This function is used to populate the folio dropdown in the query entry form.
   */
  fetchFoliosOfInvestor = (client_name:string,client_pan:string) =>{
      this.__dbIntr.api_call(0,`/cus_service/getFolio`,`client_name=${client_name}&pan_no=${client_pan ? client_pan : ''}`).pipe(pluck('data')).subscribe(res =>{
        this.md_folio = res;
      })
  }

  /**
   * @description This function is used to submit the query entry form
   * It collects the form data, processes it, and sends it to the server via an API call.
   * The form data includes various fields such as investor details, query type, scheme details, and attachments.
   * After successful submission, it resets the form and displays a success message.
   * 
   * @returns {void}
   */
  submitQuery = () =>{
      // console.log(this.queryEntryForm.controls);
      const payload = {
        ...this.queryEntryForm.getRawValue(),
        query_type_id:this.queryEntryForm.getRawValue().query_type_id?.id,
        product_id:this.productId,
        folio_no:this.queryEntryForm.getRawValue().folio_no ? this.queryEntryForm.getRawValue().folio_no[0]?.folio_no : '',
        scheme_dtls:this.schemeDtls.value.filter(el => el?.isActive),
      }
      // console.log(payload)
      let api_payload ;
      if(this.productId == 3 || this.productId == 4){
        if(this.productId == 3){
          const {entry_attachment,entry_file,scheme_name,folio_no,fd_no,fd_scheme_id,product_code,isin_no,scheme_id,scheme_dtls,...rest} = payload;
          api_payload = rest;
        }
        else{
          const {entry_attachment,entry_file,scheme_name,folio_no,policy_no,ins_product_id,product_code,isin_no,scheme_id,scheme_dtls,...rest} = payload;
          api_payload = rest;
        }
      }
      else {
        const {entry_attachment,scheme_name,policy_no,ins_product_id,fd_no,fd_scheme_id,...rest} = payload;
        api_payload = rest;
      }

      const formData = new FormData();
      Object.keys(api_payload).forEach((key) => 
      {
        if(key == 'scheme_dtls'){
          formData.append(key, (api_payload[key] ? JSON.stringify(api_payload[key]) : '[]'))
        }
        else{
        formData.append(key, (api_payload[key] ? api_payload[key] : ''))
      }});
      for(let file of  this.queryEntryForm.get('entry_attachment').value){
        formData.append("entry_attachment[]", file);
      }

      this.__dbIntr.api_call(1,'/cus_service/queryAdd',formData)
      .pipe(pluck('data')).subscribe((res:any) =>{
        // this.setForm();
        this.queryEntryForm.get('investor_name').setValue('',{emitEvent:false});
        this.queryEntryForm.get('folio_no').setValue([]);
        this.queryEntryForm.get('query_type_id').setValue('');
        this.queryEntryForm.patchValue({
          investor_pan:'',
          investor_email:'',
          investor_mobile:'',
          application_no:'',
          query_given_by_id:'',
          entry_name:'',
          query_subtype_id:'',
          query_details:'',
          entry_file:null,
          entry_attachment:[]
        });
        this.md_folio = [];
        
        this.utility.showSnackbar(`Query with id ${res.query_id} has been registered successfully`,1)
      })
  } 

  /**
   * @description This function is used to compare two objects based on their IDs
   * It checks if the existing object and the object to check against have the same ID.
   */
  compareWith(existing, toCheckAgainst) {
    if (!toCheckAgainst) {
      return false;
    }
    return existing.id === toCheckAgainst.id;
  }

  /**
   * @description This function is used to update the query status
   * It collects the form data, processes it, and sends it to the server via an
   */
  updateQueryStatus = () =>{
    console.log(this.queryEntryForm);
    let payload =null;
    if(this.queryEntryForm.get('query_nature_id').value != '3'){
        payload = {
          query_nature_id:this.queryEntryForm.getRawValue()?.query_nature_id,
          remarks:this.queryEntryForm.getRawValue()?.remarks,
          query_status_id:this.queryEntryForm.getRawValue()?.query_status_id,
          query_given_to_id:this.queryEntryForm.getRawValue()?.query_given_to_id,
          level_id:this.queryEntryForm.getRawValue()?.level_id,
          query_given_through_id:this.queryEntryForm.getRawValue()?.query_given_through_id,
          query_tat:this.queryEntryForm.getRawValue()?.query_tat,
          expected_close_date:this.queryEntryForm.getRawValue()?.expected_close_date,
          ...payload,
          id:this.queryId.toString(),
          product_id:this.productId?.toString()
        }
    }else{
      payload = {
        query_nature_id:this.queryEntryForm.getRawValue()?.query_nature_id,
        remarks:this.queryEntryForm.getRawValue()?.remarks,
        query_status_id:this.queryEntryForm.getRawValue()?.query_status_id,
        query_tat:this.queryEntryForm.getRawValue()?.query_tat,
        expected_close_date:this.queryEntryForm.getRawValue()?.expected_close_date,
        id:this.queryId.toString(),
        product_id:this.productId?.toString()
      }
    }

    const formData = new FormData();
    Object.keys(payload).forEach((key) => formData.append(key, (payload[key] ? payload[key] : '')));
    for(let file of  this.queryEntryForm.get('solve_attachment').value){
      formData.append("solve_attachment[]", file);
    }
    this.__dbIntr.api_call(1,'/cus_service/queryAdd',formData)
      .pipe(pluck('data')).subscribe((res:any) =>{
        // this.setForm();
        this.utility.showSnackbar(`Query with id ${res.query_id} has been registered successfully`,1)
      })
  }

  /**
   * @description This function is used to inform the query through different channels
   * It takes a flag as a parameter, which indicates the channel through which the query should be informed.
   * The function constructs a payload with the query ID and the inform flag, and then makes an API call to inform the query.
   * If the API call is successful, it updates the form data with the new flags and displays a success message.
   * 
   * @param {string} flag - The channel through which the query should be informed (e.g., 'C' for Call, 'W' for WhatsApp, 'E' for Email, 'S' for SMS).
   */
  queryInformThrough = (flag:string) =>{
       const payload = {
          query_id:this.queryId,
          inform_flag:flag[0]
       }
       this.__dbIntr.api_call(1,'/cus_service/queryInform',this.utility.convertFormData(payload)).subscribe((res:any) =>{
        if(res.suc == 1){
                        this.utility.showSnackbar(`Query information through ${flag} has been successfull`,1);
                        const dt = this.formData;
                        switch(flag[0]){
                          case 'C': this.formData = {
                                    ...dt,
                                    call_flag:res?.data?.call_flag
                                  };
                                  break;
                          case 'W': this.formData = {
                                      ...dt,
                                      whats_app_flag:res?.data?.whats_app_flag
                                    };
                                    break;
                          case 'E': this.formData = {
                                      ...dt,
                                      email_flag:res?.data?.email_flag
                                    };
                                    break;
                          default: this.formData = {
                                      ...dt,
                                      sms_flag:res?.data?.sms_flag
                                    };
                                    break;
                        }
                      }
       })   
  }

  /**
   * @description This function is used to change the level name
   * It retrieves the values of concern_person_name, contact_no, and email_id from the queryEntryForm.
   * It logs these values to the console for debugging purposes.
   */
  changeLevelName = () =>{
        console.log(this.queryEntryForm.get('concern_person_name').value);
        console.log(this.queryEntryForm.get('contact_no').value);
        console.log(this.queryEntryForm.get('email_id').value);
  }


}
