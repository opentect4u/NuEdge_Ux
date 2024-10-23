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
import { global } from 'src/app/__Utility/globalFunc';
import { environment, url } from 'src/environments/environment';

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
       scheme_id:new FormControl(''),
       product_code: new FormControl(''),
       isin_no:new FormControl(''),
       query_type_id:new FormControl('',{
        updateOn:'change',
        validators:Validators.required
      }),
      query_receive_by_id:new FormControl(''),
      query_mode_id: new FormControl('O'),
       query_subtype_id:new FormControl('',[Validators.required]),
       query_details:new FormControl('',[Validators.required]),
       query_nature_id:new FormControl({value:'',disabled:true}),
      //  query_given_to_amc_or_company:new FormControl('Yes'),
        query_given_to_id:new FormControl({value:'',disabled: true}),
       query_rec_through_id:new FormControl({value:'',disabled: true}),
       query_given_through_id:new FormControl({value:'',disabled: true}),
       concern_person_name:new FormControl({value:'',disabled: true}),
       contact_no:new FormControl({value:'',disabled: true},[Validators.pattern("^[0-9]*$")]),
       email_id:new FormControl({value:'',disabled: true},[Validators.email]),
       query_tat:new FormControl({value:'',disabled: true}),
       expected_close_date: new FormControl({value:'',disabled: true}),
      //  actual_close_date: new FormControl('',[Validators.required]),
      //  query_status_id: new FormControl('',[Validators.required]),
       remarks: new FormControl({value:'',disabled: true}),
       query_status_id: new FormControl({value:'',disabled: true}),
      //  query_feedback: new FormControl('',[Validators.required]),
      //  status_overall_feedback: new FormControl('',[Validators.required])
      query_feedback:new FormControl({value:'',disabled: true}),
      suggestion:new FormControl({value:'',disabled: true}),
  })

  constructor(private RtDt:ActivatedRoute,
    private datePipe:DatePipe,
    private __dbIntr:DbIntrService, private  utility:UtiliService) {
   
    }

  ngOnInit(): void {
    // console.log(this.utility.DcryptText(this.RtDt.snapshot.params.queryId));
    // this.productId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.productId));
    this.productId = Number(this.utility.DcryptText(this.RtDt.snapshot.params.productId));
    // this.queryId = Number(this.utility.decrypt_dtls(this.RtDt.snapshot.params.queryId));
    this.queryId = Number(this.utility.DcryptText(this.RtDt.snapshot.params.queryId));
    this.fetchGivenByQuery();
    this.fetchQueryType();
    this.fetchQueryNature();
    this.fetchQueryGivenReceiveThr();
    this.fetchPlanaccordingtoProductId();

    if(this.queryId > 0){
      this.fetchQueryDetails(this.queryId);
      this.fetchQueryStatus();
    }
    else{
       this.setFormControlValidators();
    }
    this.utility.__userDtls$.subscribe(res =>{
        this.queryEntryForm.patchValue({
          entry_name:res ? res?.name : ''
        });
        this.queryEntryForm.patchValue({
          query_receive_by_id:res?.id
        })
        this.queryEntryForm.get('entry_name').disable();
    })
  }


  setFormControlValidators = () =>{
      // const first_formControlName = this.productId > 2 ? (this.productId == 3 ? 'policy_no' : 'fd_no') : 'folio_no';
      // const second_formControlName = this.productId > 2  ? (this.productId == 3 ? 'ins_product_id' : 'fd_scheme_id') : 'scheme_id';
      // this.queryEntryForm.get(first_formControlName).setValidators([Validators.required]);
      // this.queryEntryForm.get(second_formControlName).setValidators([Validators.required]);
  }

  fetchQueryDetails = (query_id:number) =>{
        this.__dbIntr.api_call(1,`/cusService/queryShow?id=${query_id}`,null)
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
    this.queryEntryForm.patchValue({
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
      query_type_id:data ? this.md_queryType.filter(el => el.id == data?.query_type_id)[0] : '',
      query_subtype_id:data ? data?.query_subtype_id : '',
      query_details:data ? data?.query_details : '',
      // query_nature_id:data ? data?.query_nature_id : '',
      // query_given_to_id:data ? data?.query_given_to_id : '',
      // query_rec_through_id:data ? data?.query_rec_through_id : '',
      // query_given_through_id:data ? data?.query_given_through_id : '',
      // concern_person_name:data ? data?.concern_per_name : '',
      // contact_no:data ? data?.contact_no : '',
      // email_id:data ? data?.email_id : '',
      // query_tat:data ? this.md_queryType.filter(el => el.id == data?.query_type_subtype_id)[0]?.query_tat : '',
      // expected_close_date:data ? this.datePipe.transform(data?.expected_close_date,'yyyy-MM-dd')  : '',
      remarks: data ? data?.remarks : '',
      query_feedback: data ? data?.query_feedback : '',
      suggestion: data ? data?.suggestion : '',
      // query_mode_id:data ? data?.query_mode_id : 'O'
      query_status_id:data ? data?.query_status_id : '',
      expected_close_date:data ? this.datePipe.transform(global.getActualVal(data?.expected_close_date),'yyyy-MM-dd')  : '',
      email_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.email_id) : '') : '',
      contact_no:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.contact_no) : '') : '',
      query_given_to_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_given_to_id) : '') : '',
      query_rec_through_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_rec_through_id) : '') : '',
      query_given_through_id:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.query_given_through_id) : '') : '',
      concern_person_name:data ? (data?.query_nature_id == 4 ? global.getActualVal(data?.concern_person_name) : '') : '',
    });
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

  ngAfterViewInit(){

      this.queryEntryForm.get('folio_no').valueChanges.subscribe(res =>{
        if(res.length > 0){
          console.log(res)
          this.fetchSchemeByFolio(res[0].folio_no)
        }
        else{
          this.md_scheme = [];
          this.queryEntryForm.get('scheme_id').setValue('');
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
      // else{
      //    // call Plan Mster data
      //    if(this.md_plan.length == 0){
      //    this.fetchPlanaccordingtoPolicyHolder_fd(ev.item.client_name,ev.item.pan);

      //    }
      // }
  }

  fetchPlanaccordingtoProductId= () =>{

    if(Number(this.productId) ==3 || Number(this.productId) ==4){
      console.log('sasas')

        const api_name = this.productId == 3 ? '/ins/product' : '/fd/scheme'
        this.__dbIntr.api_call(0, api_name, null)
        .pipe(pluck('data'))
        .subscribe((res: any) => {
          console.log(res);
          this.md_plan = res;
        });
    }
      
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
      this.__dbIntr.api_call(0,'/cusService/queryType',null).pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
          this.md_queryType = res;
          // if(this.queryId > 0){
          //   this.
          // }
      })
  }

  fetchQuerySubType = (query_type:Partial<IQueryTypeSubType>) =>{
      this.__dbIntr.api_call(0,'/cusService/querySubType',`query_type_id=${query_type.id}`).pipe(pluck('data')).subscribe((res:Partial<IQueryTypeSubType>[]) =>{
        this.md_querySubType = res;
        console.log(this.queryId);
        if(this.queryId.toString() != '0'){
          setTimeout(() => {
            console.log(this.md_querySubType)
            console.log(this.queryEntryForm.getRawValue().query_subtype_id);
            const dt =  res.filter((el:any) => el.id == this.queryEntryForm.getRawValue().query_subtype_id);  
            // console.log(dt);
            this.queryEntryForm.get('query_tat').setValue(
              dt.length > 0 ? dt[0]?.query_tat : ''
            );

            if(!this.queryEntryForm.value.expected_close_date){
              let date = new Date();
              date.setDate(Number(date.getDate()) + Number(dt[0]?.query_tat));
              this.queryEntryForm.get('expected_close_date').setValue(this.datePipe.transform(date,'YYYY-MM-dd'))
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
      // console.log(this.queryEntryForm.getRawValue().entry_attachment.files);
      const payload = {
        ...this.queryEntryForm.getRawValue(),
        query_type_id:this.queryEntryForm.getRawValue().query_type_id?.id,
        product_id:this.productId,
        folio_no:this.queryEntryForm.getRawValue().folio_no ? this.queryEntryForm.getRawValue().folio_no[0]?.folio_no : ''
      }
      // console.log(payload)
      let api_payload ;
      if(this.productId == 3 || this.productId == 4){
        if(this.productId == 3){
          const {entry_attachment,entry_file,scheme_name,folio_no,fd_no,fd_scheme_id,product_code,isin_no,scheme_id,...rest} = payload;
          api_payload = rest;
        }
        else{
          const {entry_attachment,entry_file,scheme_name,folio_no,policy_no,ins_product_id,product_code,isin_no,scheme_id,...rest} = payload;
          api_payload = rest;
        }
      }
      else {
        const {entry_attachment,scheme_name,policy_no,ins_product_id,fd_no,fd_scheme_id,...rest} = payload;
        api_payload = rest;
      }

      const formData = new FormData();
      Object.keys(api_payload).forEach((key) => formData.append(key, (api_payload[key] ? api_payload[key] : '')));
      for(let file of  this.queryEntryForm.get('entry_attachment').value){
        formData.append("entry_attachment[]", file);
      }


      this.__dbIntr.api_call(1,'/cusService/queryAdd',formData)
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

  updateQueryStatus = () =>{
    // console.log(this.queryEntryForm);
    let payload =null;
    if(this.queryEntryForm.get('query_nature_id').value == '4'){
        payload = {
          query_nature_id:this.queryEntryForm.getRawValue()?.query_nature_id,
          remarks:this.queryEntryForm.getRawValue()?.remarks,
          query_status_id:this.queryEntryForm.getRawValue()?.query_status_id,
          query_given_to_id:this.queryEntryForm.getRawValue()?.query_given_to_id,
          query_rec_through_id:this.queryEntryForm.getRawValue()?.query_rec_through_id,
          query_given_through_id:this.queryEntryForm.getRawValue()?.query_given_through_id,
          concern_person_name:this.queryEntryForm.getRawValue()?.concern_person_name,
          contact_no:this.queryEntryForm.getRawValue()?.contact_no,
          email_id:this.queryEntryForm.getRawValue()?.email_id,
          query_tat:this.queryEntryForm.getRawValue()?.query_tat,
          expected_close_date:this.queryEntryForm.getRawValue()?.expected_close_date,
          query_mode_id:this.queryEntryForm.getRawValue()?.query_mode_id,
          ...payload,
          id:this.queryId.toString(),
          query_feedback:this.queryEntryForm.getRawValue()?.query_feedback,
          suggestion:this.queryEntryForm.getRawValue()?.suggestion,
          product_id:this.productId?.toString()
        }
    }else{
      payload = {
        query_nature_id:this.queryEntryForm.getRawValue()?.query_nature_id,
        remarks:this.queryEntryForm.getRawValue()?.remarks,
        query_status_id:this.queryEntryForm.getRawValue()?.query_status_id,
        query_given_to_id:this.queryEntryForm.getRawValue()?.query_given_to_id,
        query_rec_through_id:this.queryEntryForm.getRawValue()?.query_rec_through_id,
        query_given_through_id:this.queryEntryForm.getRawValue()?.query_given_through_id,
        concern_person_name:this.queryEntryForm.getRawValue()?.concern_person_name,
        contact_no:this.queryEntryForm.getRawValue()?.contact_no,
        email_id:this.queryEntryForm.getRawValue()?.email_id,
        query_tat:this.queryEntryForm.getRawValue()?.query_tat,
        expected_close_date:this.queryEntryForm.getRawValue()?.expected_close_date,
        query_mode_id:this.queryEntryForm.getRawValue()?.query_mode_id,
        id:this.queryId.toString(),
        query_feedback:this.queryEntryForm.getRawValue()?.query_feedback,
        suggestion:this.queryEntryForm.getRawValue()?.suggestion,
        product_id:this.productId?.toString()
      }
    }

    const formData = new FormData();
    Object.keys(payload).forEach((key) => formData.append(key, (payload[key] ? payload[key] : '')));
    for(let file of  this.queryEntryForm.get('solve_attachment').value){
      formData.append("solve_attachment[]", file);
    }
    this.__dbIntr.api_call(1,'/cusService/queryAdd',formData)
      .pipe(pluck('data')).subscribe((res:any) =>{
        // this.setForm();
        this.utility.showSnackbar(`Query with id ${res.query_id} has been registered successfully`,1)
      })
  }

  queryInformThrough = (flag:string) =>{
       const payload = {
          query_id:this.queryId,
          inform_flag:flag[0]
       }
       this.__dbIntr.api_call(1,'/cusService/queryInform',this.utility.convertFormData(payload)).subscribe((res:any) =>{
        console.log(res)                
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

}
