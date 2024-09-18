import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IQueryGivenByOrReceiveThrough, IQueryNature, IQueryStatus, IQueryTypeSubType } from '../../Master/queryDesk/query-desk-report/query-desk-report.component';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DatePipe } from '@angular/common';
import { plan } from 'src/app/__Model/plan';

@Component({
  selector: 'app-query-entry-component',
  templateUrl: './query-entry-component.component.html',
  styleUrls: ['./query-entry-component.component.css']
})
export class QueryEntryComponentComponent implements OnInit {

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
  md_plan:Partial<plan[]> = [];
  md_queryStatus:Partial<IQueryStatus>[] = [];
  md_QueryGiven_by:Partial<IQueryGivenByOrReceiveThrough>[] = [];
  md_queryType:Partial<IQueryTypeSubType>[] = [];
  md_querySubType:Partial<IQueryTypeSubType>[] = [];
  md_queryNature:Partial<IQueryNature>[] = [];
  md_QueryGivenReceiveThr:Partial<IQueryGivenByOrReceiveThrough>[] = []
  queryEntryForm = new FormGroup({
       investor_name: new FormControl('',[Validators.required]),
       investor_code: new FormControl('',[Validators.required]),
       investor_pan: new FormControl({value:'',disabled: true}),
       investor_email: new FormControl({value:'',disabled: true}),
       investor_mobile: new FormControl({value:'',disabled: true}), 
       folio_no: new FormControl('',{
        updateOn:'change',
        // validators:Validators.required
      }),
        plan_id:new FormControl(''),
        policy_no:new FormControl(''),
        fd_no:new FormControl(''),
       application_no: new FormControl(''),
       query_given_by_id: new FormControl('',[Validators.required]),
       entry_name:new FormControl('',[Validators.required]),
       scheme_name:new FormControl(''),
       scheme_id:new FormControl(''),
       product_code: new FormControl(''),
       isin_no:new FormControl(''),
       query_type_id:new FormControl('',{
        updateOn:'change',
        validators:Validators.required
      }),
       query_subtype_id:new FormControl('',[Validators.required]),
       query_details:new FormControl('',[Validators.required]),
       query_nature_id:new FormControl('',[Validators.required]),
      //  query_given_to_amc_or_company:new FormControl('Yes',[Validators.required]),
        query_given_to_id:new FormControl('',[Validators.required]),
       query_receive_through_id:new FormControl('',[Validators.required]),
       query_given_through_id:new FormControl('',[Validators.required]),
       concern_person_name:new FormControl('',[Validators.required]),
       contact_no:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
       email_id:new FormControl('',[Validators.required,Validators.email]),
       query_tat:new FormControl('',[Validators.required]),
       expected_close_date: new FormControl('',[Validators.required]),
      //  actual_close_date: new FormControl('',[Validators.required]),
      //  query_status_id: new FormControl('',[Validators.required]),
       remarks: new FormControl('',[Validators.required]),
      //  query_feedback: new FormControl('',[Validators.required]),
      //  status_overall_feedback: new FormControl('',[Validators.required])
  })

  constructor(private RtDt:ActivatedRoute,
    private datePipe:DatePipe,
    private __dbIntr:DbIntrService, private  utility:UtiliService) {}

  ngOnInit(): void {
    this.fetchGivenByQuery();
    this.fetchQueryType();
    this.fetchQueryNature();
    this.fetchQueryGivenReceiveThr();
    this.productId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.productId));
    this.queryId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.queryId));
    if(this.queryId > 0){
      this.fetchQueryDetails(this.queryId);
      const keys = Object.keys(this.queryEntryForm.getRawValue());
      keys.forEach(el =>{
         this.queryEntryForm.get(el).disable();
      })
    }
    else{
       this.setFormControlValidators();
    }
  }

  setFormControlValidators = () =>{
      const first_formControlName = this.productId > 2 ? (this.productId == 3 ? 'policy_no' : 'fd_no') : 'folio_no';
      const second_formControlName = this.productId > 2 ? 'plan_id' : 'scheme_id';
      this.queryEntryForm.get(first_formControlName).setValidators([Validators.required]);
      this.queryEntryForm.get(second_formControlName).setValidators([Validators.required]);

  }

  fetchQueryDetails = (query_id:number) =>{
        this.__dbIntr.api_call(1,`/cusService/queryShow?id=${query_id}`,null)
        .pipe(pluck('data'))
        .subscribe((res:any) =>{
              this.formData = res;
              this.setForm(res);
              this.fetchFoliosOfInvestor(res?.investor_name,res?.investor_pan);
        })
  }

  setForm = (data:any | undefined = null) =>{
    console.log(data);
    this.queryEntryForm.get('investor_name').setValue(data ? data?.investor_name : '',{emitEvent:false});
    this.queryEntryForm.patchValue({
      investor_code: data ? data?.investor_code : '',
      investor_pan: data ? data?.investor_pan : '',
      investor_email:data ? data?.investor_email : '',
      investor_mobile:data ? data?.investor_mobile : '', 
      application_no:data ? data?.application_no : '',
      query_given_by_id: data ? data?.query_given_by_id : '',
      entry_name:data ? data?.entry_name : '',
      // scheme_id:data ? data?.scheme_id : '',
      // scheme_name:data ? data?.scheme_name : '',
      folio_no:data ? data?.folio_no : '',
      product_code:data ? data?.product_code : '',
      isin_no:data ? data?.isin_no : '',
      query_type_id:data ? data?.query_type_id : '',
      query_details:data ? data?.query_details : '',
      query_nature_id:data ? data?.query_nature_id : '',
      query_given_to_id:data ? data?.query_given_to_id : '',
      query_receive_through_id:data ? data?.query_rec_through_id : '',
      query_given_through_id:data ? data?.query_given_through_id : '',
      concern_person_name:data ? data?.concern_per_name : '',
      contact_no:data ? data?.contact_no : '',
      email_id:data ? data?.email_id : '',
      query_tat:data ? data?.query_tat : '',
      expected_close_date:data ? this.datePipe.transform(data?.expected_close_date,'yyyy-MM-dd')  : '',
      remarks: data ? data?.remarks : '',
    });
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
          dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.md_client = value.data;
          this.searchResultVisibilityForInvestor('block');
          this.__isInvestorSpinner = false;
        },
        complete: () => {},
        error: (err) => {
          this.__isInvestorSpinner = false;
        },
      });

      this.queryEntryForm.get('folio_no').valueChanges.subscribe(res =>{
        console.log(res);
        if(res){
          this.fetchSchemeByFolio(res)
        }
        else{
          this.md_scheme = [];
          this.queryEntryForm.get('scheme_id').setValue('');
        }
      })

      this.queryEntryForm.get('query_type_id').valueChanges.subscribe(res =>{
        console.log(res);
        if(res){
          this.fetchQuerySubType(res)
        }
        else{
          this.md_querySubType = [];
          this.queryEntryForm.get('query_subtype_id').setValue('');
        }
      })

      this.queryEntryForm.get('query_subtype_id').valueChanges.subscribe(res =>{
          let TAT = '';
          if(res){
              const subTypeDtls = this.md_querySubType.filter(el => el.id == res);
              TAT = subTypeDtls.length > 0 ? subTypeDtls[0].query_tat.toString() : '';
              let date = new Date();
              date.setDate(Number(date.getDate()) + Number(TAT));
              console.log(date)
              this.queryEntryForm.get('expected_close_date').setValue(this.datePipe.transform(date,'YYYY-MM-dd'))
          }
         this.queryEntryForm.get('query_tat').setValue(TAT);
      })

      this.queryEntryForm.get('scheme_id').valueChanges.subscribe(res =>{
            if(res){
                const scheme_dtls = this.md_scheme.filter(el => Number(el.id) == Number(res))[0];
                this.queryEntryForm.patchValue({
                  product_code:scheme_dtls?.product_code,
                  isin_no:scheme_dtls?.isin_no
                })
            }
            else{
              this.queryEntryForm.patchValue({
                product_code:'',
                isin_no:''
              })
            }
      })

      // this.queryEntryForm.controls['scheme_name'].valueChanges
      // .pipe(
      //   tap(() => (
      //     this.__isSchemeSpinner = true,
      //     this.queryEntryForm.get('scheme_id').setValue('')
      //   )),
      //   debounceTime(200),
      //   distinctUntilChanged(),
      //   switchMap((dt) =>
      //     dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', dt) : []
      //   ),
      //   map((x: responseDT) => x.data)
      // )
      // .subscribe({
      //   next: (value) => {
      //     this.md_scheme = value;
      //     this.searchResultVisibilityForScheme('block');
      //     this.__isSchemeSpinner = false;
      //   },
      //   complete: () => {},
      //   error: (err) => {
      //     this.__isSchemeSpinner = false;
      //   },
      // });
  }

  fetchSchemeByFolio = (folio_no:string) =>{
      this.__dbIntr.api_call(0,'/cusService/getFoliowiseProduct',`folio_no=${folio_no}`)
      .pipe(pluck('data'))
      .subscribe((res:Partial<scheme>[]) =>{
          console.log(res);
          this.md_scheme = res;
          if(this.queryId > 0 && this.formData){
            const getDtls = this.md_scheme.filter(el => el.product_code == this.formData?.product_code && el.isin_no == this.formData?.isin_no)[0];
            this.queryEntryForm.get('scheme_id').setValue(getDtls?.id);  
          }
      })
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
        this.fetchFoliosOfInvestor(ev.item.client_name,ev.item.pan)
      }
      else{
         // call Plan Mster data
         if(this.md_plan.length == 0){
         this.fetchPlanaccordingtoPolicyHolder_fd(ev.item.client_name,ev.item.pan);

         }
      }
  }

  fetchPlanaccordingtoPolicyHolder_fd = (client_name:string,pan:string) =>{
        this.__dbIntr.api_call(0, '/plan', null)
        .pipe(pluck('data'))
        .subscribe((res: Partial<plan[]>) => {
          this.md_plan = res;
        });
  } 

  // getSelectedItemsFromParentForScheme = (ev) =>{
  //   this.searchResultVisibilityForScheme('none')
  //   this.queryEntryForm.patchValue({
  //     scheme_id:ev.item.id
  //   });
  //   this.queryEntryForm.get('scheme_name').setValue(ev.item.scheme_name,{emitEvent:false});
  // }

  fetchGivenByQuery = () =>{
      this.__dbIntr.api_call(0,'/cusService/queryGivenBy',null).pipe(pluck('data')).subscribe((res:Partial<IQueryGivenByOrReceiveThrough>[]) =>{
          this.md_QueryGiven_by = res;
      })
  }

  fetchQueryGivenReceiveThr = () =>{
    this.__dbIntr.api_call(0,'/cusService/queryGivenThrough',null).pipe(pluck('data')).subscribe((res:Partial<IQueryGivenByOrReceiveThrough>[]) =>{
      this.md_QueryGivenReceiveThr = res;
  })
    
  }

  fetchQueryType = () =>{
      this.__dbIntr.api_call(0,'/cusService/queryTypeSubtype','flag=E').pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
          this.md_queryType = res;
      })
  }

  fetchQuerySubType = (query_type:Partial<IQueryTypeSubType>) =>{
    this.__dbIntr.api_call(0,'/cusService/queryTypeSubtype',`query_type=${query_type.query_type}`).pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
      this.md_querySubType = res;
      // if(this.queryId > 0 && this.formData){
      //   const getDtls = this.md_scheme.filter(el => el.product_code == this.formData?.product_code && el.isin_no == this.formData?.isin_no)[0];
      //   this.queryEntryForm.get('scheme_id').setValue(getDtls?.id);  
      // }
  })
  }

  fetchQueryNature = () =>{
      this.__dbIntr.api_call(0,'/cusService/queryNature',null).pipe(pluck('data')).subscribe((res:Partial<IQueryNature>[]) =>{
          this.md_queryNature = res;
      })
  }

  fetchQueryStatus = () =>{
      this.__dbIntr.api_call(0,'/cusService/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
        this.md_queryStatus = res;
    })
  }

  fetchFoliosOfInvestor = (client_name:string,client_pan:string) =>{
      this.__dbIntr.api_call(0,`/cusService/getFolio`,`client_name=${client_name}&pan_no=${client_pan ? client_pan : ''}`).pipe(pluck('data')).subscribe(res =>{
        this.md_folio = res;
      })
  }

  submitQuery = () =>{
      // console.log(this.queryEntryForm.getRawValue()); 
      const payload = {
        ...this.queryEntryForm.getRawValue(),
        query_type_id:this.queryEntryForm.getRawValue().query_type_id?.query_type,
        product_id:this.productId,
      }
      const {scheme_name,...rest} = payload;
      this.__dbIntr.api_call(1,'/cusService/queryAdd',this.utility.convertFormData(rest))
      .pipe(pluck('data')).subscribe((res:any) =>{
        this.setForm();
        this.utility.showSnackbar(`Query with id ${res.query_id} has been registered successfully`,1)
      })
  } 

  compareWith(existing, toCheckAgainst) {
    if (!toCheckAgainst) {
      return false;
    }
    return existing.id === toCheckAgainst.id;
  }

}
