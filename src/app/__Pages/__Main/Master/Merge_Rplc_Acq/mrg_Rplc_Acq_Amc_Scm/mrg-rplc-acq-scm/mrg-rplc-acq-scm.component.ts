import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { map, pluck } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { amc } from 'src/app/__Model/amc';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import dateslist from '../../../../../../../assets/json/dates.json';
import __sipFrequency from '../../../../../../../assets/json/SipFrequency.json';
import { global } from 'src/app/__Utility/globalFunc';
import { dates } from 'src/app/__Utility/disabledt';
// import { Ibenchmark } from '../../../benchmark/benchmark.component';
import { responseDT } from 'src/app/__Model/__responseDT';
import { MultiSelectComponent } from 'ng-multiselect-dropdown';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ScmDtlsPreviewComponent } from '../Dialog/scm-dtls-preview/scm-dtls-preview.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { Ibenchmark } from '../../../benchmark/home/home.component';

// import { MultiSelectComponent } from 'ng-multiselect-dropdown';

export class SchemeColumn{
    static column:column[] = [
    {field:'sl_no',header:'Sl No',width:'6rem'},
    {field:'amc_short_name',header:"AMC",width:'15rem'},
    {field:'cat_name',header:'Category',width:'15rem'},
    {field:'subcate_name',header:'Subcategory',width:'20rem'},
    {field:'scheme_name',header:'Scheme',width:'30rem'},
    {field:'view_dtls',header:'View Details',width:'10rem'},
   ]
}

@Component({
  selector: 'mrg-rplc-acq-scm',
  templateUrl: './mrg-rplc-acq-scm.component.html',
  styleUrls: ['./mrg-rplc-acq-scm.component.css']
})
export class MrgRplcAcqScmComponent implements OnInit {

  @ViewChildren('dates_inp') dates_inp:QueryList<MultiSelectComponent>;
  @ViewChildren('checkbox') checkbox:QueryList<MatCheckbox>;

  ALERT_MSG:string;

  MAX_AMC_LIMITATION:number;

  FINAL_PREVIEW_CARD_TITLE:string;

  __scmDtls: scheme[] = [];

  __benchmark:Ibenchmark[] = [];

  dates:{id:string,date:string}[] = dateslist;

  categoryMst:category[] = [];



  subcategoryMst:subcat[] = [];

  @ViewChild('stepper') stepper:MatStepper;

  stepper_index:number = 0;

/**
  * Holding Parent ID For Merge / Replace /Acquisition
  */
  @Input() parent_id:string | null;

    /**
    * Holding ID For  AMC / Scheme
    */
    @Input() flag:string | null;


   /**
   * Holding AMC Master data comming from parent component
   */
    @Input() amcMstDt:amc[] = [];

    __amcMaster:amc[] = [];

  /**
   * Search Form For Scheme Search
   */
    @Input() search_scm:FormGroup | undefined;

     /**
   * Search Form For Scheme Search
   */
     @Input() search_scm_for_acq:FormGroup | undefined;

  /**
   * Settings for AMC Multiselect Dropdown
   */
  @Input() settings;


  /**
   * Column For Scheme data table
   */
   column = SchemeColumn.column.filter((item:column) => item.field!='view_dtls');

   /**
    * Column After Selecting scheme by checkbox
    */
   column_scheme = SchemeColumn.column;

   /**
    * Holding Scheme Master Data
    */
   scheme_mst:scheme[] = [];
   scheme_mst_step2:scheme[] = [];


  /**
    * Holding Category Master Data
    */
   category_mst:category[] = [];

   category_mst_step2:category[] = [];


   /**
    * Holding Subcategory Master Data
    */
   subcategory_mst:subcat[] = [];
   subcategory_mst_step2:subcat[] = [];


   /**
    *
    */
   selected_scheme:scheme[] = [];
   selected_scheme_step2:scheme[] = [];


   cat_settings =  this.utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Search Category',
    1,
    139,
    true
  );

  date_settings =  this.utility.settingsfroMultiselectDropdown(
    'id',
    'date',
    'Search Date',
    5,
    139,
    false,
    false
  );

   subcat_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Search Subcategory',
    1,
    139,
    true
  );

  scheme_frm = new FormGroup({
    amc_id: new FormControl('',[Validators.required ]),
    category_id:new FormControl('',[Validators.required]),
    subcategory_id: new FormControl('',[Validators.required]),
    scheme_name:new FormControl('',[Validators.required]),
    scheme_type: new FormControl('O'),
    pip_fresh_min_amt: new FormControl('',[Validators.required]),
    pip_add_min_amt:new FormControl('',[Validators.required]),
    sip_date: new FormControl('',[Validators.required]),
    swp_date:new FormControl('',[Validators.required]),
    stp_date:new FormControl('',[Validators.required]),
    sip_freq_wise_amt: new FormArray([]),
    swp_freq_wise_amt: new FormArray([]),
    stp_freq_wise_amt: new FormArray([]),
    ava_special_sip: new FormControl(false),
    special_sip_name: new FormControl(''),
    ava_special_swp: new FormControl(false),
    special_swp_name: new FormControl(''),
    ava_special_stp: new FormControl(false),
    special_stp_name: new FormControl(''),
    step_up_min_amt:new FormControl(''),
    step_up_min_per:new FormControl(''),
    benchmark_id: new FormControl(''),
    same_as_sip_dates:new FormControl(false),
    same_as_stp_dates:new FormControl(false),
    same_as_swp_dates:new FormControl(false),
    is_selectall: new FormControl(false),
    is_selectall_for_swp:new FormControl(false),
    is_selectall_for_stp:new FormControl(false),
    benchmark: new FormControl(''),
    effective_date:new FormControl('')
  })

  constructor(
    private utility:UtiliService,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private dbIntr:DbIntrService) { }

  ngOnInit(): void {
    if(this.parent_id != '48'){
      this.setFrequencyAmt( __sipFrequency);
      this.setSwpfrequencyAmt(__sipFrequency);
      this.setStpFrequency(__sipFrequency);
    }
    else{
      Object.keys(this.scheme_frm.controls).forEach((key) => {
        const control = this.scheme_frm.controls[key];
        console.log(control);
        control.removeValidators([Validators.required]);
        control.updateValueAndValidity();
    });
    }
    this.getcatMasterbyproductId('1');

    /******** ALERT MESSAGE */
    this.MAX_AMC_LIMITATION = this.parent_id == '46' ? 2 : 1;
    this.ALERT_MSG = this.parent_id == '46' ? 'Please select atleast two scheme in step-1' : 'Please select scheme in step-1 & step-2'
    this.FINAL_PREVIEW_CARD_TITLE = this.parent_id == '46' ? 'New scheme to be merged with' : (this.parent_id == '47' ? 'New scheme to be replaced with' : 'New scheme to be acquisition with')
    /*********END********* */
  }


  ngAfterViewInit(){

    this.scheme_frm.controls['is_selectall_for_swp'].valueChanges.subscribe(
      (res) => {
        this.swp_freq_wise_amt.controls.map((value, index) => {
          value.get('is_checked').patchValue(res, { emitEvent: false });
          this.setSwpFormControldependOnCheckbox(index, res);
        });
      }
    );

    this.scheme_frm.get('swp_freq_wise_amt').valueChanges.subscribe((val) => {
      //For checking or Unchecking the select All checkbox base on select check box inside the table body
      const allSelected = val.every((bool) => bool.is_checked);
      if (this.scheme_frm.get('is_selectall_for_swp').value !== allSelected) {
        this.scheme_frm
          .get('is_selectall_for_swp')
          .patchValue(allSelected, { emitEvent: false });
      }
    });

    this.scheme_frm.controls['is_selectall_for_stp'].valueChanges.subscribe(
      (res) => {
        this.stp_freq_wise_amt.controls.map((value, index) => {
          value.get('is_checked').patchValue(res, { emitEvent: false });
          this.setStpFormControldependOnCheckbox(index, res);
        });
      }
    );
    this.scheme_frm.get('stp_freq_wise_amt').valueChanges.subscribe((val) => {
      //For checking or Unchecking the select All checkbox base on select check box inside the table body
      const allSelected = val.every((bool) => bool.is_checked);
      if (this.scheme_frm.get('is_selectall_for_stp').value !== allSelected) {
        this.scheme_frm
          .get('is_selectall_for_stp')
          .patchValue(allSelected, { emitEvent: false });
      }
    });


    this.search_scm.controls['amc_id'].valueChanges.subscribe(res =>{
      console.log(res);
      this.getCategoryAgainstAMC(res);
      this.getSubcategoryAgainstCategoryAMC(res,this.search_scm.value.cat_id);
    })

    this.search_scm.controls['cat_id'].valueChanges.subscribe(res =>{
      this.getSubcategoryAgainstCategoryAMC(this.search_scm.value.amc_id,res);
    })

    this.search_scm_for_acq.controls['amc_id'].valueChanges.subscribe(res =>{
      this.getCategoryAgainstAMC_step2(res);
      this.getSubcategoryAgainstCategoryAMC_step2(res,this.search_scm_for_acq.value.cat_id);
    })

    this.search_scm_for_acq.controls['cat_id'].valueChanges.subscribe(res =>{
      this.getSubcategoryAgainstCategoryAMC_step2(this.search_scm_for_acq.value.amc_id,res);
    })


    this.scheme_frm.controls['is_selectall'].valueChanges.subscribe((res) => {
      this.sip_freq_wise_amt.controls.map((value, index) => {
        value.get('is_checked').patchValue(res, { emitEvent: false });
        this.setFormControldependOnCheckbox(index, res);
      });
    });

    this.scheme_frm.get('sip_freq_wise_amt').valueChanges.subscribe((val) => {
      //For checking or Unchecking the select All checkbox base on select check box inside the table body
      const allSelected = val.every((bool) => bool.is_checked);
      if (this.scheme_frm.get('is_selectall').value !== allSelected) {
        this.scheme_frm
          .get('is_selectall')
          .patchValue(allSelected, { emitEvent: false });
      }
    });




    /*--------------Trigger when Category changes---------------*/
    this.scheme_frm.controls['category_id'].valueChanges.subscribe((res) => {
      this.getsubcatMasterbyproductId(res);
      this.getbenchmark(res,this.scheme_frm.value.subcategory_id);
    });
    /*--------------End---------------*/

     /*--------------Trigger when Sub Category changes---------------*/
     this.scheme_frm.controls['subcategory_id'].valueChanges.subscribe((res) => {
      this.getbenchmark(this.scheme_frm.value.category_id,res);
    });
    /*--------------End---------------*/

    // Available Special SIP
    this.scheme_frm.controls['ava_special_sip'].valueChanges.subscribe((res) => {
      this.scheme_frm.controls['special_sip_name'].setValidators(
        res ? [Validators.required] : null
      );
      this.scheme_frm.controls['special_sip_name'].updateValueAndValidity({
        emitEvent: false,
      });
      if (!res) {
        this.scheme_frm.controls['special_sip_name'].setValue('');
      }
    });

    // Available Special SWP
    this.scheme_frm.controls['ava_special_swp'].valueChanges.subscribe((res) => {
      this.scheme_frm.controls['special_swp_name'].setValidators(
        res ? [Validators.required] : null
      );
      this.scheme_frm.controls['special_swp_name'].updateValueAndValidity({
        emitEvent: false,
      });
      if (!res) {
        this.scheme_frm.controls['special_swp_name'].setValue('');
      }
    });

    // Available Special STP
    this.scheme_frm.controls['ava_special_stp'].valueChanges.subscribe((res) => {
      this.scheme_frm.controls['special_stp_name'].setValidators(
        res ? [Validators.required] : null
      );
      this.scheme_frm.controls['special_stp_name'].updateValueAndValidity({
        emitEvent: false,
      });
      if (!res) {
        this.scheme_frm.controls['special_stp_name'].setValue('');
      }
    });

    //Same As SIP DATES
    this.scheme_frm.controls['same_as_sip_dates'].valueChanges.subscribe(
      (res) => {
        this.scheme_frm.controls['sip_date'].setValue(
          res
            ? this.__scmDtls.length > 0
              ? JSON.parse(this.__scmDtls[0].sip_date)
              : []
            : []
        );
      }
    );

    //Same As STP DATES
    this.scheme_frm.controls['same_as_stp_dates'].valueChanges.subscribe(
      (res) => {
        this.scheme_frm.controls['stp_date'].setValue(
          res
            ? this.__scmDtls.length > 0
              ? JSON.parse(this.__scmDtls[0].stp_date)
              : []
            : []
        );
      }
    );

    //Same As SWP DATES
    this.scheme_frm.controls['same_as_swp_dates'].valueChanges.subscribe(
      (res) => {
        this.scheme_frm.controls['swp_date'].setValue(
          res
            ? this.__scmDtls.length > 0
              ? JSON.parse(this.__scmDtls[0].swp_date)
              : []
            : []
        );
      }
    );

    //AMC On Change Event
    this.scheme_frm.controls['amc_id'].valueChanges.subscribe((res) => {
      console.log('AMC' + res);

      this.getDatesAgainstAmc(res);
    });


  }

  get sip_freq_wise_amt(): FormArray {
    return this.scheme_frm.get('sip_freq_wise_amt') as FormArray;
  }

  get swp_freq_wise_amt(): FormArray {
    return this.scheme_frm.get('swp_freq_wise_amt') as FormArray;
  }
  get stp_freq_wise_amt(): FormArray {
    return this.scheme_frm.get('stp_freq_wise_amt') as FormArray;
  }

  setFrequencyAmt(freq_dtls) {
    this.scheme_frm.get('is_selectall').setValue(
      freq_dtls.every((bool) => global.getType(bool.is_checked)),{emitEvent:false}
    )
    freq_dtls.forEach((freqDtls) => {
      this.addFrequency(freqDtls);
    });
  }

  setSwpfrequencyAmt(freq_dtls) {
    this.scheme_frm.get('is_selectall_for_swp').setValue(
      freq_dtls.every((bool) => global.getType(bool.is_checked)),{emitEvent:false}
    );
    freq_dtls.forEach((freqDtls) => {
      this.addSwpFrequency(freqDtls);
    });
  }
  setStpFrequency(freq_dtls) {
    console.log(freq_dtls);
    this.scheme_frm.get('is_selectall_for_stp').setValue(
      freq_dtls.every((bool) => global.getType(bool.is_checked)),{emitEvent:false}
    );
    freq_dtls.forEach((freqDtls) => {
      this.addStpFrequency(freqDtls);
    });
  }

  addFrequency(_freDtls) {
    this.sip_freq_wise_amt.push(this.createFrequcncy(_freDtls));
  }

  addStpFrequency(__freDtls) {
    this.swp_freq_wise_amt.push(this.createFrequencyforSWP_STP(__freDtls));
  }

  addSwpFrequency(_freDtls) {
    this.stp_freq_wise_amt.push(this.createFrequcncy(_freDtls));
  }

    createFrequencyforSWP_STP(_freDtls): FormGroup {
    return new FormGroup({
      id: new FormControl(_freDtls.id),
      freq_name: new FormControl(_freDtls.freq_name),
      is_checked: new FormControl(global.getType(_freDtls.is_checked)),
      sip_add_min_amt: new FormControl(global.getType(_freDtls.is_checked) ? _freDtls.sip_add_min_amt : '', [
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  createFrequcncy(_freDtls): FormGroup {
    return new FormGroup({
      id: new FormControl(_freDtls.id),
      freq_name: new FormControl(_freDtls.freq_name),
      is_checked: new FormControl(global.getType(_freDtls.is_checked)),
      sip_fresh_min_amt: new FormControl(global.getType(_freDtls.is_checked) ? _freDtls.sip_fresh_min_amt : '', [
        Validators.pattern('^[0-9]*$'),
      ]),
      sip_add_min_amt: new FormControl(global.getType(_freDtls.is_checked) ? _freDtls.sip_add_min_amt : '', [
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }





  setFinalPreviewList = (ev) =>{
    this.setSelected_scheme(ev);
    this.checkValid_data_selection(ev);
  }

  checkValid_data_selection = (ev) =>{
    if(this.parent_id == '46'){
      if(ev){
        if(ev.length > 1){
          this.stepper.next();
          return;
         }
      }
    }
    else{
      if(ev){
        this.stepper.next();
        return;
       }
    }
    this.utility.showSnackbar(`Plese select ${this.parent_id == '46' ? 'atleast two' : ''} scheme`,2)
  }

  setFinalPreviewList_step2 = (ev) =>{
    this.setSelected_scheme_step2(ev);
    this.checkValid_data_selection(ev);
  }

  setFinalSelectedScheme = (ev) =>{
    this.setSelected_scheme(ev);
  }

  setFinalSelectedScheme_step2 = (ev) =>{
    this.setSelected_scheme_step2(ev);
  }

  setSelected_scheme_step2 = (scheme) =>{
    this.selected_scheme_step2 = [];
    if(scheme){
      this.selected_scheme_step2.push(scheme);
    }
  }
  setSelected_scheme = (scheme) =>{
    switch(this.parent_id){
      case '46':
      this.selected_scheme = scheme ? scheme : [];
      break;
      default:
       this.selected_scheme = [];
      if(scheme){
        this.selected_scheme.push(scheme);
      }break;
    }
  }

  setScheme__formControl(scheme:scheme | undefined = undefined): void{
    console.log(scheme);
    this.scheme_frm.patchValue({
      amc_id:scheme  ? global.getActualVal(scheme?.amc_id) : '',
      category_id:scheme  ? global.getActualVal(scheme?.category_id) : '',
      subcategory_id: scheme  ? global.getActualVal(scheme?.subcategory_id) : '',
      scheme_name:scheme  ? global.getActualVal(scheme?.scheme_name) : '',
      pip_fresh_min_amt: scheme  ? global.getActualVal(scheme?.pip_fresh_min_amt) : '',
      pip_add_min_amt:scheme  ? global.getActualVal(scheme?.pip_add_min_amt) : '',
      benchmark:scheme  ? global.getActualVal(scheme?.benchmark) : '',
      benchmark_id:scheme  ? global.getActualVal(scheme?.benchmark_id) : '',
      ava_special_sip: scheme  ? global.getActualVal(global.getType(scheme?.ava_special_sip)) : '',
      special_sip_name:scheme  ? global.getActualVal(scheme?.special_sip_name) : '',
      ava_special_swp: scheme  ? global.getActualVal(global.getType(scheme?.ava_special_swp)) : '',
      special_swp_name: scheme  ? global.getActualVal(scheme?.special_swp_name) : '',
      ava_special_stp: scheme  ? global.getActualVal(global.getType(scheme?.ava_special_stp)) : '',
      special_stp_name: scheme  ? global.getActualVal(scheme?.special_stp_name) : '',
      step_up_min_amt:scheme  ? global.getActualVal(scheme?.step_up_min_amt) : '',
      step_up_min_per:scheme  ? global.getActualVal(scheme?.step_up_min_per) : '',
      sip_date:scheme ? JSON.parse(scheme?.sip_date) : [],
      stp_date:scheme ? JSON.parse(scheme?.stp_date) : [],
      swp_date:scheme ? JSON.parse(scheme?.swp_date) : [],
      // same_as_sip_dates:false,
      // same_as_stp_dates:false,
      // same_as_swp_dates:false
    });

    console.log( JSON.parse(scheme.sip_date));

    if(scheme){
      this.setSIPFrequency(scheme.sip_freq_wise_amt);
      this.setSTPFrequency(scheme.stp_freq_wise_amt);
      this.setSWPFrequency(scheme.swp_freq_wise_amt);
    }
    else{
      this.setSIPFrequency(JSON.stringify(__sipFrequency));
      this.setSTPFrequency(JSON.stringify(__sipFrequency));
      this.setSWPFrequency(JSON.stringify(__sipFrequency));
    }
  }

  setSIPFrequency = (sip_freq_wise_amt) =>{
    this.scheme_frm.get('is_selectall').setValue(
      JSON.parse(sip_freq_wise_amt).every((bool) => global.getType(bool.is_checked)),{emitEvent:false}
    )
    JSON.parse(sip_freq_wise_amt).forEach((element,index) => {
      this.sip_freq_wise_amt.controls[index].get('freq_name').setValue(element.freq_name)
      this.sip_freq_wise_amt.controls[index].get('is_checked').setValue(global.getType(element.is_checked))
      this.sip_freq_wise_amt.controls[index].get('sip_add_min_amt').setValue(element.sip_add_min_amt)
      this.sip_freq_wise_amt.controls[index].get('sip_fresh_min_amt').setValue(element.sip_fresh_min_amt)
      this.sip_freq_wise_amt.controls[index].get('id').setValue(element.id);
    });
  }

   setSTPFrequency = (stp_freq_wise_amt) =>{
    this.scheme_frm.get('is_selectall_for_stp').setValue(
      JSON.parse(stp_freq_wise_amt).every((bool) => global.getType(bool.is_checked)),{emitEvent:false}
    );
    JSON.parse(stp_freq_wise_amt).forEach((element,index) => {
      this.stp_freq_wise_amt.controls[index].get('freq_name').setValue(element.freq_name)
      this.stp_freq_wise_amt.controls[index].get('is_checked').setValue(global.getType(element.is_checked))
      this.stp_freq_wise_amt.controls[index].get('sip_add_min_amt').setValue(element.sip_add_min_amt)
      this.stp_freq_wise_amt.controls[index].get('id').setValue(element.id);
    });
  }

  setSWPFrequency = (swp_freq_wise_amt) =>{
    this.scheme_frm.get('is_selectall_for_swp').setValue(
      JSON.parse(swp_freq_wise_amt).every((bool) => global.getType(bool.is_checked)),{emitEvent:false}
    );
    JSON.parse(swp_freq_wise_amt).forEach((element,index) => {
      this.swp_freq_wise_amt.controls[index].get('freq_name').setValue(element.freq_name)
      this.swp_freq_wise_amt.controls[index].get('is_checked').setValue(global.getType(element.is_checked))
      this.swp_freq_wise_amt.controls[index].get('sip_add_min_amt').setValue(element.sip_add_min_amt)
      this.swp_freq_wise_amt.controls[index].get('id').setValue(element.id);
    });
  }

  schemePropulate = () =>{
    this.dbIntr.api_call(0,'/scheme',
    'arr_subcat_id=' +
    this.utility.mapIdfromArray(this.search_scm.value.sub_cat_id,'id') +
    '&arr_cat_id=' +
    this.utility.mapIdfromArray(this.search_scm.value.cat_id,'id') +
    '&arr_amc_id=' +
    this.utility.mapIdfromArray(this.search_scm.value.amc_id,'id')).
    pipe(pluck('data'))
    .subscribe((res:scheme[]) =>{
      if(res.map(item => {return item.id})
      .some(ai =>
      this.scheme_mst
      .map(item => {return item.id}).includes(ai))){
         this.utility.showSnackbar('Scheme already populated',2);
      }
      else{
        this.scheme_mst = this.scheme_mst.concat(res);
        this.search_scm.controls['amc_id'].setValue([],{emitEvent:true});
      }

    })
  }

  getCategoryAgainstAMC = (amc_ids: amc[]) =>{
    if(this.stepper_index == 0){
    if(amc_ids.length > 0){
      this.dbIntr.api_call(0,'/category','arr_amc_id='+this.utility.mapIdfromArray(amc_ids,'id'))
      .pipe(pluck('data'))
      .subscribe((res:category[]) =>{
          this.category_mst = res;
      })
    }
    else{
      this.category_mst = [];
      this.search_scm.controls['cat_id'].setValue([],{emiEvent:true});
    }
  }
  }

  getCategoryAgainstAMC_step2 = (amc_ids: amc[]) =>{
    if(this.stepper_index == 1){
    if(amc_ids.length > 0){
      this.dbIntr.api_call(0,'/category','arr_amc_id='+this.utility.mapIdfromArray(amc_ids,'id'))
      .pipe(pluck('data'))
      .subscribe((res:category[]) =>{
          this.category_mst_step2 = res;
      })
    }
    else{
      this.category_mst_step2 = [];
      this.search_scm_for_acq.controls['cat_id'].setValue([],{emiEvent:true});
    }
    }
  }

 getSubcategoryAgainstCategoryAMC = (amc_ids:amc[],cat_ids:category[]) =>{

  if(this.stepper_index == 0){

  if(amc_ids.length > 0 && cat_ids.length > 0){
    this.dbIntr.api_call(0,
    '/subcategory',
    'arr_cat_id=' +
      this.utility.mapIdfromArray(cat_ids,'id') +
      '&arr_amc_id=' +
      this.utility.mapIdfromArray(amc_ids,'id')
    )
    .pipe(pluck('data'))
    .subscribe((res:subcat[]) =>{
        this.subcategory_mst = res;
    })
  }
  else{
    this.subcategory_mst = [];
    this.search_scm.controls['sub_cat_id'].setValue([],{emiEvent:false});
  }
  }
 }

 getSubcategoryAgainstCategoryAMC_step2 = (amc_ids:amc[],cat_ids:category[]) =>{
  if(this.stepper_index == 1){
    if(amc_ids.length > 0 && cat_ids.length > 0){
      this.dbIntr.api_call(0,
      '/subcategory',
      'arr_cat_id=' +
        this.utility.mapIdfromArray(cat_ids,'id') +
        '&arr_amc_id=' +
        this.utility.mapIdfromArray(amc_ids,'id')
      )
      .pipe(pluck('data'))
      .subscribe((res:subcat[]) =>{
          this.subcategory_mst_step2 = res;
      })
    }
    else{
      this.subcategory_mst_step2 = [];
      this.search_scm_for_acq.controls['sub_cat_id'].setValue([],{emiEvent:false});
    }
  }
  else{

  }

 }

  onAmcDeSelect = (ev) =>{
    this.search_scm.get('amc_id').setValue(this.search_scm.value.amc_id.filter(item => item.id != ev.id));
  }
  onAmcDeSelect_step2 = (ev) =>{
    this.search_scm_for_acq.get('amc_id').setValue(this.search_scm_for_acq.value.amc_id.filter(item => item.id != ev.id));
  }
  onCatDeSelect = (ev) =>{
    this.search_scm.get('cat_id').setValue(this.search_scm.value.cat_id.filter(item => item.id != ev.id));
  }
  onCatDeSelect_step2 = (ev) =>{
    this.search_scm_for_acq.get('cat_id').setValue(this.search_scm_for_acq.value.cat_id.filter(item => item.id != ev.id));
  }

  onStepChange = (ev) =>{
    this.stepper_index = ev.selectedIndex;
    if(this.parent_id == '47'){
      if(this.selected_scheme.length > 0 && this.stepper_index == 1){
        this.setScheme__formControl(this.selected_scheme[0]);
      }
    }
    this.scheme_frm.get('effective_date').setValidators(ev.selectedIndex > 1 ?Validators.required : null);
    this.scheme_frm.get('effective_date').updateValueAndValidity();
      if(this.parent_id !='48'){
      this.dates_inp.forEach(el =>{
        el.disabled = this.stepper_index == 1 ? false : true;
      });
      this.checkbox.forEach(el =>{
         el.disabled = this.stepper_index == 1 ? false : true;
      });
    }
}



ViewDetails = (ev:scheme):void =>{
  this.openDialog(ev,ev.id)
}
openDialog(scheme: scheme,scheme_id){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '60%';
  dialogConfig.height = '100%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: `S${scheme_id}`,
    id: scheme_id,
    items: scheme,
    title: scheme.scheme_name,
    product_id:'1',
    date_settings:this.date_settings,
    right: global.randomIntFromInterval(1,60),
    dates:this.dates
  };
  dialogConfig.id = scheme_id > 0 ? scheme_id.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      ScmDtlsPreviewComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {

    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
    this.utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: `S${scheme_id}`,
    });
  }
}

createFrequency(_freDtls): FormGroup {
  return new FormGroup({
    id: new FormControl(_freDtls.id),
    freq_name: new FormControl(_freDtls.freq_name),
    is_checked: new FormControl(global.getType(_freDtls.is_checked)),
    sip_add_min_amt: new FormControl(global.getType(_freDtls.is_checked) ? _freDtls.sip_add_min_amt : '', [
      Validators.pattern('^[0-9]*$'),
    ]),
  });
}
preventNonumeric(__ev, index) {
  dates.numberOnly(__ev);
}


getCheckboxVal(i, checked, __id) {
  switch (__id) {
    case '1':
      this.setFormControldependOnCheckbox(i, checked);
      break;
    case '2':
      this.setSwpFormControldependOnCheckbox(i, checked);
      break;
    default:
      this.setStpFormControldependOnCheckbox(i, checked);
      break;
  }
}
setFormControldependOnCheckbox(i, __res) {
  this.sip_freq_wise_amt.controls[i]
    .get('sip_fresh_min_amt')
    .setValidators(
      __res ? [Validators.required, Validators.pattern('^[0-9]*$')] : null
    );
  this.sip_freq_wise_amt.controls[i]
    .get('sip_add_min_amt')
    .setValidators(
      __res ? [Validators.required, Validators.pattern('^[0-9]*$')] : null
    );
  this.sip_freq_wise_amt.controls[i]
    .get('sip_fresh_min_amt')
    .updateValueAndValidity();
  this.sip_freq_wise_amt.controls[i].get('sip_add_min_amt').updateValueAndValidity();
}
setSwpFormControldependOnCheckbox(i, __res) {
  // this.swp_frequency.controls[i].get('sip_fresh_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
  this.swp_freq_wise_amt.controls[i]
    .get('sip_add_min_amt')
    .setValidators(
      __res ? [Validators.required, Validators.pattern('^[0-9]*$')] : null
    );
  // this.swp_frequency.controls[i].get('sip_fresh_min_amt').updateValueAndValidity();
  this.swp_freq_wise_amt.controls[i]
    .get('sip_add_min_amt')
    .updateValueAndValidity();
}
setStpFormControldependOnCheckbox(i, __res) {
  // this.stp_frequency.controls[i].get('sip_fresh_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
  this.stp_freq_wise_amt.controls[i]
    .get('sip_add_min_amt')
    .setValidators(
      __res ? [Validators.required, Validators.pattern('^[0-9]*$')] : null
    );
  // this.stp_freq_wise_amt.controls[i].get('sip_fresh_min_amt').updateValueAndValidity();
  this.stp_freq_wise_amt.controls[i]
    .get('sip_add_min_amt')
    .updateValueAndValidity();
}


/********* */
getDatesAgainstAmc(amc_id) {
  if (amc_id) {
    this.dbIntr
      .api_call(0, '/scheme', 'amc_id=' + amc_id)
      .pipe(pluck('data'))
      .subscribe((res: scheme[]) => {
        this.__scmDtls = res;
      });
  } else {
    this.__scmDtls.length = 0;
  }
}

private getamcMasterbyproductId(product_id) {
  this.dbIntr
    .api_call(0, '/amcUsingPro', 'product_id=' + product_id)
    .pipe(map((x: responseDT) => x.data))
    .subscribe((res: amc[]) => {
      this.__amcMaster = res;
    });
}
private getcatMasterbyproductId(product_id) {
  this.dbIntr
    .api_call(0, '/catUsingPro', 'product_id=' + product_id)
    .pipe(map((x: responseDT) => x.data))
    .subscribe((res: category[]) => {
      this.categoryMst = res;
    });
}
private getsubcatMasterbyproductId(cat_id) {
  this.dbIntr
    .api_call(0, '/subcatUsingPro', 'category_id=' + cat_id)
    .pipe(map((x: responseDT) => x.data))
    .subscribe((res: subcat[]) => {
      this.subcategoryMst = res;
    });
}


getbenchmark = (cat_id:number,sub_cat_id:number) => {
  if(cat_id && sub_cat_id){
    this.dbIntr.api_call(
      0,
      '/benchmark',
      'category_id='+cat_id+'&subcat_id='+sub_cat_id)
    .pipe(pluck('data'))
    .subscribe((res:Ibenchmark[]) =>{
       this.__benchmark = res;
    })
  }
  else{
    this.__benchmark = [];
  }

}

/********* */

SubmitEffectiveDate = () =>{
  let form_data

  if(this.parent_id == '48'){
   form_data = {
    scheme_ids:JSON.stringify(this.selected_scheme.map((item:scheme) => {return item.id})),
    product_id:'1',
    acquisition_to_id:this.selected_scheme_step2.map(item=> item.id),
    effective_dt:this.scheme_frm.value.effective_dt
   }
  }
   else{
    let dt = Object.assign({}, this.scheme_frm.value,
      {
       sip_date:JSON.stringify(this.scheme_frm.value.sip_date),
       stp_date:JSON.stringify(this.scheme_frm.value.stp_date),
       swp_date:JSON.stringify(this.scheme_frm.value.swp_date),
       frequency:JSON.stringify(this.scheme_frm.value.sip_freq_wise_amt),
       stp_freq_wise_amt:JSON.stringify(this.scheme_frm.value.stp_freq_wise_amt),
       swp_freq_wise_amt:JSON.stringify(this.scheme_frm.value.swp_freq_wise_amt),
      });

      form_data = {
        ...dt,
        scheme_ids:JSON.stringify(this.selected_scheme.map((item:scheme) => {return item.id})),
        product_id:'1',
      };
  }


      // console.log(dt);
      this.dbIntr.api_call(1,
        (this.parent_id == '46' ? '/schemeMerge' : (this.parent_id == '47' ? '/schemeReplace' : '/schemeAcquisition'))
        ,this.utility.convertFormData(form_data))
      .subscribe((res: any) =>{
        console.log(res);
        this.utility.showSnackbar(res.suc == 1 ? `Scheme ${this.parent_id == '46' ? 'merged' : (this.parent_id == '47' ? 'replaced' : 'acquisition')} successfully` : res.msg,res.suc)
        if(res.suc == 1){
          if(this.parent_id == '48')
          {
          this.selected_scheme_step2 = [];
          this.scheme_mst_step2 = [];
          }
          else{
            this.setScheme__formControl(null);
          }
          this.scheme_mst = [];
          this.selected_scheme = [];
          this.stepper.previous();
          this.stepper.previous();
        }

      })
}

schemePropulate_forStep2 = () => {
   console.log(this.search_scm_for_acq.value);
   this.dbIntr.api_call(0,'/scheme',
    'arr_subcat_id=' +
    this.utility.mapIdfromArray(this.search_scm_for_acq.value.sub_cat_id,'id') +
    '&arr_cat_id=' +
    this.utility.mapIdfromArray(this.search_scm_for_acq.value.cat_id,'id') +
    '&arr_amc_id=' +
    this.utility.mapIdfromArray(this.search_scm_for_acq.value.amc_id,'id')).
    pipe(pluck('data'))
    .subscribe((res:scheme[]) =>{
      if(res.map(item => {return item.id})
      .some(ai =>
      this.scheme_mst_step2
      .map(item => {return item.id}).includes(ai))){
         this.utility.showSnackbar('Scheme already populated',2);
      }
      else{
        this.scheme_mst_step2 = this.scheme_mst_step2.concat(res);
        this.search_scm_for_acq.controls['amc_id'].setValue([],{emitEvent:true});
      }

    })
}

}
