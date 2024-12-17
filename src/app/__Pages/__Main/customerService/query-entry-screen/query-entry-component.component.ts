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
import { plan } from 'src/app/__Model/plan';
import { global } from 'src/app/__Utility/globalFunc';
import { environment, url } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { amc } from 'src/app/__Model/amc';

@Component({
  selector: 'app-query-entry-component',
  templateUrl: './query-entry-component.component.html',
  styleUrls: ['./query-entry-component.component.css']
})
export class QueryEntryComponentComponent implements OnInit {

  
  settingsforFolioDropdown = this.utility.settingsfroMultiselectDropdown(
    'folio_no',
    'folio_no',
    'Search Folio',
    1,
    197,
    true
  );

  settingsforFdrDropdown = this.utility.settingsfroMultiselectDropdown(
    'fdr_no',
    'fdr_no',
    'Search FDR',
    1,
    197,
    true
  );

  settingsforPolicyDropdown = this.utility.settingsfroMultiselectDropdown(
    'policy_no',
    'policy_no',
    'Search Policy No.',
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
  md_fdr_no:any = [];
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
       entry_attachment:new FormControl([]),
       entry_file:new FormControl([]),
       solve_attachment:new FormControl([]),
       solve_file:new FormControl([]),
       investor_name: new FormControl('',[Validators.required]),
       investor_code: new FormControl(''),
       client_code:new FormControl(''),
       investor_pan: new FormControl({value:'',disabled: true}),
       investor_email: new FormControl({value:'',disabled: true}),
       investor_mobile: new FormControl({value:'',disabled: true}), 
       folio_no: new FormControl([],{
        updateOn:'change',
        // validators:Validators.required
      }),
        // plan_id:new FormControl(''),
        // ins_product_id:new FormControl(''),
        // fd_scheme_id: new FormControl(''),
        // ins_product:new FormArray([]),
        // fd_scheme:new FormArray([]),
        policy_no:new FormControl([],{
          updateOn:'change',
        }),
        fdr_no:new FormControl([],{
          updateOn:'change',
          // validators:Validators.required
        }),
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
       query_rec_by_id:new FormControl(''),
       expected_close_date: new FormControl(''),
       selectAll:new FormControl({
        value:false,
        disabled:true
       }),
       query_rec_through_id:new FormControl(''),
      //  actual_close_date: new FormControl('',[Validators.required]),
      //  query_status_id: new FormControl('',[Validators.required]),
       remarks: new FormControl(''),
       query_status_id: new FormControl(''),
      //  query_feedback: new FormControl('',[Validators.required]),
      //  status_overall_feedback: new FormControl('',[Validators.required])
      // query_feedback:new FormControl(''),
      // suggestion:new FormControl(''),
      scheme_dtls:new FormArray([],{
          asyncValidators:this.checkIfAnyOnItemCheckedOrNot()
      })
  })

  constructor(private RtDt:ActivatedRoute,
    private datePipe:DatePipe,
    private __dbIntr:DbIntrService, private  utility:UtiliService) {}

  ngOnInit(): void {
    console.log(this.productId);
    // console.log(this.utility.DcryptText(this.RtDt.snapshot.params.queryId));
    // this.productId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.productId));
    this.productId = Number(this.utility.DcryptText(this.RtDt.snapshot.params.productId));
    console.log(this.productId);
    // this.queryId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.queryId));
    this.queryId = Number(this.utility.DcryptText(this.RtDt.snapshot.params.queryId));
    this.queryEntryForm.get('query_nature_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('remarks').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('query_status_id').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('entry_name').setValidators(this.queryId.toString() != '0' ? [Validators.required] : null)
    this.queryEntryForm.get('query_rec_through_id').setValidators(this.queryId.toString() == '0' ? [Validators.required] : null)

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
          query_rec_by_id:res?.id
        });
        this.queryEntryForm.get('entry_name').disable();
    })
  }

  checkIfchecked(value){
      return of(!value.map(el => el.isActive).some(item => item)).pipe(
        delay(200)
      );
  }

  checkIfAnyOnItemCheckedOrNot(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.checkIfchecked(control.value)
        .pipe(
          map((result: boolean) =>
            result ? (Number(this.productId) == 1 ? { checkErr: true } : null) : null
          )
        );
    };
  }

  
  get schemeDtls(): FormArray {
    return this.queryEntryForm.get("scheme_dtls") as FormArray;
  }

  // addSchemeDetials(): void {
  //   this.schemeDtls.push(this.createItem());
  // }

  setFormControlValidators = () =>{
      const first_formControlName = this.productId > 2 ? (this.productId == 3 ? 'policy_no' : 'fdr_no') : 'folio_no';
      // const second_formControlName = this.productId > 2  ? (this.productId == 3 ? 'ins_product_id' : 'fd_scheme_id') : 'scheme_id';
      this.queryEntryForm.get(first_formControlName).setValidators([Validators.required]);
      
      /******************* OLD CODE ************/
      // if(this.productId!= 1){
      //   const second_formControlName = this.productId == 3 ? 'ins_product_id' : 'fd_scheme_id';
      //   this.queryEntryForm.get(second_formControlName).setValidators([Validators.required]);
      // }
      /******************** END ****************/

  }

  fetchQueryDetails = (query_id:number) =>{
        this.__dbIntr.api_call(1,`/cus_service/queryShow?id=${query_id}`,null)
        .pipe(pluck('data'))
        .subscribe((res:any) =>{
              this.formData = {
                ...res,
                entryattach:res.entryattach.map(el => {
                    el.url=`${environment.query_entry_file}${el.name}`;
                    el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                    return el
                }),
                solveattach:res.solveattach.map(el =>{
                    el.url=`${environment.query_solve_file}${el.name}`;
                    el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
                    return el
                })
              }

              this.setForm(res);
              this.fetchFoliosOfInvestor(res?.investor_name,res?.investor_pan);
        })
  }

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
      policy_no: this.productId == 3 ? (data ? data?.policy_no : []) : [],
      fdr_no: this.productId == 4 ? (data ? data?.fdr_no : []) : [],
      // ins_product_id:this.productId == 3 ? (data ? data?.ins_product_id : '') : '',
      // fd_scheme_id:this.productId == 4 ? (data ? data?.fd_scheme_id : '') : '',
      // folio_no:data ? data?.folio_no : '',
      product_code:data ? data?.product_code : '',
      isin_no:data ? data?.isin_no : '',
      expected_close_date:data ? this.datePipe.transform(global.getActualVal(data?.expected_close_date),'yyyy-MM-dd')  : '',
      query_details:data ? data?.query_details : '',
      remarks: data ? data?.remarks : '',
      query_status_id:data ? data?.query_status_id : '',
      email_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.email_id) : '') : '',
      contact_no:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.contact_no) : '') : '',
      query_given_to_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_given_to_id) : '') : '',
      level_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.level_id) : '') : '',
      query_given_through_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_given_through_id) : '') : '',
      concern_person_name:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.concern_person_name) : '') : '',
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
    this.queryEntryForm.get('fdr_no').disable({emitEvent:false});
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
          dt?.length > 1 ? this.__dbIntr.searchItems('/cus_service/searchClient', `${dt}&product_id=${this.productId}`) : []
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

      this.queryEntryForm.get('fdr_no').valueChanges.subscribe(res =>{
          /**** BUSSINESS LOGIC  */
            this.schemeDtls.clear();
            this.queryEntryForm.get('selectAll').setValue(false,{emitEvent:false});
            this.queryEntryForm.get('selectAll').disable();

            if(res.length > 0){
              // console.log(res)
              this.fetchSchemeByFDR_no(res[0].fdr_no);
            }
            else{
              this.md_scheme = [];
            }
          /****** END */
      })

      this.queryEntryForm.get('policy_no').valueChanges.subscribe(res =>{
        /**** BUSSINESS LOGIC  */
          this.schemeDtls.clear();
          this.queryEntryForm.get('selectAll').setValue(false,{emitEvent:false});
          this.queryEntryForm.get('selectAll').disable();

          if(res.length > 0){
            // console.log(res)
            this.fetchSchemeByFDR_no(res[0].policy_no);
          }
          else{
            this.md_scheme = [];
          }
        /****** END */
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

      this.queryEntryForm.get('query_tat').valueChanges.subscribe(res =>{
            let date = new Date();
            date.setDate(Number(date.getDate()) + Number(res));
            this.queryEntryForm.get('expected_close_date').setValue(this.datePipe.transform(date,'YYYY-MM-dd'))
      })
  }

  /****** GET SCHEME BY FDR NO FOR BOND & FD  *****/
  fetchSchemeByFDR_no = (id) =>{
    const api_name = this.productId == 3 ? `/ins/product?product_id=${id}` : `/fd/scheme?fdr_no=${id}`
    this.__dbIntr.api_call(0,api_name,null)
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
        // if(this.queryId?.toString() != '0'){
        //       res.forEach(el =>{
        //               const dt = this.formData?.allscheme.filter(item => item?.product_code == el.product_code && item?.isin_no == el.isin_no);
        //               if(dt.length > 0){
        //                   this.schemeDtls.push(
        //                     new FormGroup({
        //                         id: new FormControl(el.id),
        //                         amc_id:new FormControl(el.amc_id ? el.amc_id : 'N/A'),
        //                         product_code: new FormControl(el.product_code ? el.product_code : 'N/A'),
        //                         isin_no: new FormControl(el.isin_no  ? el.isin_no : 'N/A'),
        //                         scheme_name: new FormControl(el.scheme_name ? `${el.scheme_name}-${el.plan_name}-${el.option_name}` : 'N/A'),
        //                         isActive:new FormControl({value:true}),
        //                         folio_no:new FormControl(el?.folio_no ? el.folio_no : 'N/A'),
        //                         curr_val:new FormControl(el?.curr_val ? (Number(el.curr_val) >= 0 ? Number(el.curr_val) : 0.00) : 0.00),
        //                       })
        //                   )
        //               }
                      
        //       });
        //       if(this.schemeDtls.value.length == res.length){
        //         this.queryEntryForm.get('selectAll').setValue(this.schemeDtls.value.length == res.length);
        //         this.queryEntryForm.get('selectAll').disable();
        //       }
        //       this.fetchLevel(this.schemeDtls.value[0]?.amc_id);
        // }
        // else{
        //   res.forEach(el =>{
          // this.schemeDtls.push(
          //   this.createItem_For_Ins_Fd_Bond(el)
          // );
        //   })
        // }
    })
  }
  /***** END */

  setFormControlValue = (name:string,email:string,mobile) =>{
        this.queryEntryForm.patchValue({
          concern_person_name:(name && name!='null') ? name : '',
          email_id:(email && email!='null') ? email : '',
          contact_no:mobile ? mobile : ''
        })
  }

  fetchLevel = (amc_id:number) =>{
        this.__dbIntr.api_call(0,`/amc?id=${amc_id}`,null)
        .pipe(pluck('data'))
        .subscribe((res:Partial<amc>[]) =>{
            this.md_amc = res;
        })
  }

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

  setSelctAllCheckbox(event){
      const isAllSelected = this.schemeDtls.value.map(el => el.isActive).every(item => item);
      this.getIsAllSelected(isAllSelected);
  }

  getIsAllSelected(isAllSelected:boolean){
    this.queryEntryForm.get('selectAll').setValue(isAllSelected,{emitEvent:false});

  }

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


  createItem_For_Ins_Fd_Bond(el): FormGroup {
    if(this.productId == 2 || this.productId == 4){
      return new FormGroup({
        id: new FormControl(el.id),
        scheme_name: new FormControl(el.scheme_name ? `${el.scheme_name}` : 'N/A'),
        isActive:new FormControl(false),
      });
    }
    else{
      return new FormGroup({
        id: new FormControl(el.id),
        product_name: new FormControl(el.product_name ? `${el.product_name}` : 'N/A'),
        isActive:new FormControl(false),
      });
    }
  
  }

  searchResultVisibilityForInvestor(display_mode) {
    // this.__subBrkArn.nativeElement.style.display = display_mode;
    this.displayMode_forClient = display_mode;
  }

  

  // searchResultVisibilityForScheme(display_mode){
  //   this.displayMode_forScheme = display_mode;
  // }

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
      else if(this.productId == 3){
          /*******  Insurance */

          this.queryEntryForm.get('folio_no').setValue([
            {
               "policy_no":ev.item?.policy_no,
            }],{emitEvent:false});
      }
      else{
        this.queryEntryForm.get('folio_no').setValue([
          {
             "fdr_no":ev.item?.fdr_no,
          }],{emitEvent:false});
      }
      // else{
      //    // call Plan Mster data
      //    if(this.md_plan.length == 0){
      //    this.fetchPlanaccordingtoPolicyHolder_fd(ev.item.client_name,ev.item.pan);

      //    }
      // }
  }

  fetchPlanaccordingtoProductId= (id: any | undefined = '') =>{

    if(Number(this.productId) == 3 || Number(this.productId) == 4 || Number(this.productId) == 2){

        // const api_name = this.productId == 3 ? `/ins/product?product_id=${id}` : `/fd/scheme?scheme_id=${id}`
        // this.__dbIntr.api_call(0, api_name, null)
        // .pipe(pluck('data'))
        // .subscribe((res: any) => {
        //   this.md_plan = res;
        // });
        this.queryEntryForm.get('selectAll').enable(
          {
            onlySelf:false,
            emitEvent:false
          }
        )
        const api_name = this.productId == 3 ? `/ins/product` : `/fd/scheme`
        this.__dbIntr.api_call(0, api_name, null)
        .pipe(pluck('data'))
        .subscribe((res: any) => {
          // this.md_plan = res;
          res.forEach(element => {
            // console.log(element);
            this.schemeDtls.push(
              this.createItem_For_Ins_Fd_Bond(element)
            );
          });
        });
    }
      
  } 


  fetchGivenByQuery = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryGivenBy',null).pipe(pluck('data')).subscribe((res:Partial<IQueryGivenByOrReceiveThrough>[]) =>{
          this.md_QueryGiven_by = res;
      })
  }

  fetchQueryGivenReceiveThr = () =>{
    this.__dbIntr.api_call(0,'/cus_service/queryGivenThrough',null).pipe(pluck('data')).subscribe((res:Partial<IQueryGivenByOrReceiveThrough>[]) =>{
      this.md_QueryGivenReceiveThr = res;
  })
    
  }

  fetchQueryType = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryType',null).pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
          this.md_queryType = res;
          // if(this.queryId > 0){
          //   this.
          // }
      })
  }

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
         
                let date = new Date();
                date.setDate(Number(date.getDate()) + Number(dt[0]?.query_tat));
                this.queryEntryForm.get('expected_close_date').setValue(this.datePipe.transform(date,'YYYY-MM-dd'))
              }
            }
          }, 2000);
        
        }
      })
  }


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

  fetchQueryNature = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryNature',null).pipe(pluck('data')).subscribe((res:Partial<IQueryNature>[]) =>{
          this.md_queryNature = res;
      })
  }

  fetchQueryStatus = () =>{
      this.__dbIntr.api_call(0,'/cus_service/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
        this.md_queryStatus = res;
    })
  }

  fetchFoliosOfInvestor = (client_name:string,client_pan:string) =>{
      this.__dbIntr.api_call(0,`/cus_service/getFolio`,`client_name=${client_name}&pan_no=${client_pan ? client_pan : ''}`).pipe(pluck('data')).subscribe(res =>{
        this.md_folio = res;
      })
  }

  submitQuery = () =>{
      // console.log(this.queryEntryForm.controls);
      const payload = {
        ...this.queryEntryForm.getRawValue(),
        query_type_id:this.queryEntryForm.getRawValue().query_type_id?.id,
        product_id:this.productId,
        folio_no:this.queryEntryForm.getRawValue().folio_no ? this.queryEntryForm.getRawValue().folio_no[0]?.folio_no : '',
        fdr_no:this.queryEntryForm.getRawValue().fdr_no ? this.queryEntryForm.getRawValue().fdr_no[0]?.fdr_no : '',
        policy_no:this.queryEntryForm.getRawValue().policy_no ? this.queryEntryForm.getRawValue().policy_no[0]?.policy_no : '',
        scheme_dtls:this.schemeDtls.value.filter(el => el?.isActive),
        client_code:this.productId == 12 ? global.getActualVal(this.queryEntryForm.getRawValue()?.client_code) : '',
        application_no:this.productId != 12 ? '' : global.getActualVal(this.queryEntryForm.getRawValue()?.application_no)
      }
      // console.log(payload)
      let api_payload ;
      if(this.productId == 3 || this.productId == 4 || this.productId == 2){
        if(this.productId == 3){
          const {entry_attachment,entry_file,scheme_name,folio_no,fdr_no,product_code,isin_no,scheme_id,client_code,...rest} = payload;
          api_payload = rest;
        }
        else{
          const {entry_attachment,entry_file,scheme_name,folio_no,policy_no,product_code,isin_no,scheme_id,client_code,...rest} = payload;
          api_payload = rest;
        }
      }
      else if(this.productId == 12){
        const {entry_attachment,scheme_name,policy_no,fdr_no,application_no,...rest} = payload;
        api_payload = rest;  
      }
      else {
        const {entry_attachment,scheme_name,policy_no,fdr_no,client_code,...rest} = payload;
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
          query_subtype_id:'',
          query_details:'',
          entry_file:null,
          entry_attachment:[]
        });
        this.md_folio = [];
        
        this.utility.showSnackbar(`Query with id ${res.query_id} has been registered successfully`,1)
      })
  } 

  compareWith(existing, toCheckAgainst) {
    if (!toCheckAgainst) {
      return false;
    }
    return existing.id === toCheckAgainst.id;
  }

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
        this.utility.showSnackbar(`Query with id ${res.query_id} has been updated successfully`,1)
      })
  }

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

  changeLevelName = () =>{
        console.log(this.queryEntryForm.get('concern_person_name').value);
        console.log(this.queryEntryForm.get('contact_no').value);
        console.log(this.queryEntryForm.get('email_id').value);
  }

}
