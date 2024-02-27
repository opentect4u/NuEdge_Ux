import { Component, EventEmitter, Input, OnInit, Output, ViewChild ,Inject, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { category } from 'src/app/__Model/__category';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { amc } from 'src/app/__Model/amc';
import { UtiliService } from 'src/app/__Services/utils.service';
import filterOpt from '../../../../../../assets/json/filterOption.json';
import periods from '../../../../../../assets/json/datePeriods.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { dates } from 'src/app/__Utility/disabledt';
import { Calendar } from 'primeng/calendar';
import clientType from '../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { DOCUMENT } from '@angular/common';
import MonthDT from '../../../../../../assets/json/Master/month.json';
import { global } from 'src/app/__Utility/globalFunc';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { displayMode } from 'src/app/Enum/displayMode';
enum sip_stp_swp_type {
    'P'='/sipType',
    'R' ='/swpType',
    'SO' ='/stpType'
}

@Component({
  selector: 'core-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('formbodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '10px 20px', visibility: 'visible', })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('230ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ReportFilterComponent implements OnInit {

  mode = displayMode;

   @Input() state: string | undefined;

   @Output() changeState = new EventEmitter<string>(null);

   month:{id:number,month:string}[]  = [];

   year:number[] = [];

  @Input() set Reset(value) {
    //if (value == 'Y') {
    //  this.btn_type = 'R';
    //  this.reset();
    //}
   }

   /**
    * Differenciate between report type
    */
   @Input() type:string;

    /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
    __isClientPending: boolean = false;

    client_type= clientType;


  /**
   * For Displaying title in card header
  */
  @Input() title:string | null = '';

      /**
   * Holding Transaction Type  Master Data
   */
    @Input() trxnTypeMst: rntTrxnType[] = [];


    /**
    * For Checking whether the report is for SIP/STP/SWP
    */
    @Input() report_type:string;


    /**
     * Foe Getting SIP / STP / SWP Type
     */



    /** Paginate : for holding how many result tobe fetched */
    paginate:number = 1;

  /**
   * Setting of multiselect dropdown
   */
  settingsforClient = this.utility.settingsfroMultiselectDropdown(
    'first_client_pan',
    'first_client_name',
    'Search Client',
    1
  );

  settingsforSubCatDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Search Sub-Category',
    1
  );
  settingsforCatDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Search Category',
    1
  );
  settingsforAMCDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'amc_short_name',
    'Search AMC',
    1
  );
  settingsforSchemeDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Search Scheme',
    1
  );
  settingsforBrnchDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'brn_name',
    'Search Branch',
    1,
    90
  );
  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown(
    'bu_code',
    'bu_type',
    'Search Business Type',
    1,
    90
  );
  settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown(
    'euin_no',
    'emp_name',
    'Search Relationship Manager',
    1
  );
  settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown(
    'code',
    'bro_name',
    'Search Sub Broker',
    1
  );
  settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown(
    'euin_no',
    'euin_no',
    'Search Employee',
    1
  );

  /**
   * END
   */

     /**
   * Setting of multiselect dropdown
   */
     settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
      'pan',
      'client_name',
      'Search Family members',
      3
    );


  @ViewChild('dateRng') dt_range:Calendar;

  /**
   * For which report this filter will work...
   * MT=> Mutual Fund Trasaction Report
   * MSIP/MSTP/MSWP => Mutual Fund SIP/STP/SWP Report
   *
   */
  @Input() flag:string;

  /**
   * hold sip/stp/swp type master data
   */
  @Input() sip_stp_swp_type_mst:any = [];

  @Input() sub_type:string;


  /**
   * For holding client those are  present only in transaction.
   */
   @Input() clientMst:any=[];


   __clientMst:client[] = [];


   /**
   * Show / hide search list dropdown after serach input match
   */
  displayMode_forClient: string;

  /**
   * For holding AMC Master Data
  */
  @Input() amcMst:amc[] = [];

  /**
   * For Holding Category Master Data
  */
  @Input() catMst:category[] = [];

  /**
   * For Holding Sub-Category Master Data
  */
  subcatMst:subcat[] = [];

  /**
   * Holding Family member Details
   */
  family_members:client[] = [];

 /**
   * For Holding Scheme Master Data
  */
   @Input() schemeMst:scheme[] = [];


  /**
   * Holding Transaction Sub-Type  Master Data
   */
  @Input() trxnSubTypeMst: rntTrxnType[] = [];

  /**
   * Holding Branch Master Data
   */
  branchMst: any = [];

  /**
   * Holding Buisness type
   */
  bu_type: any = [];

  /**
   * Holding Relationship Manager
   */
  RmMst: any = [];

  /**
   * Holding Sub Broker Master Data
   */
  subbrkArnMst: any = [];

  /**
   * Holding Sub Broker Master Data
   */
  @Input() euinMst: any = [];

  /**
   * hold Button Type Advance Filter / Normal Filter
   */
  btn_type: 'R' | 'A' = 'R';

  /**
   * Holding Advance Filter / Normal Filter
  */
    selectBtn = filterOpt;

 /**
   *  get date Periods from JSON File Located at (assets/json/datePeriods) for populate
   *  inside the date periods dropdown
   */
  periods_type: { id: string; periods: string }[] = periods;

  /**
   * For Holding Max Date And Min Date form Prime Ng Calendar
   */
    minDate: Date;
    maxDate:Date;

   @Output() getsearchValues = new EventEmitter<any>();

  /**
   * Form Field for search Transaction
   */
  Rpt = new FormGroup({
    view_by:new FormControl('M'),
    upto:new FormControl(''),
    month: new FormControl(''),
    year: new FormControl(''),
    amc_id: new FormControl([], { updateOn: 'blur' }),
    cat_id: new FormControl([], { updateOn: 'blur' }),
    sub_cat_id: new FormControl([], { updateOn: 'blur' }),
    scheme_id: new FormControl([]),
    brn_cd: new FormControl([], { updateOn: 'blur' }),
    bu_type_id: new FormControl([], { updateOn: 'blur' }),
    rm_id: new FormControl([], { updateOn: 'blur' }),
    sub_brk_cd: new FormControl([], { updateOn: 'blur' }),
    euin_no: new FormControl([]),
    folio_no: new FormControl(''),
    client_id: new FormControl(''),
    pan_no:new FormControl(''),
    client_name: new FormControl(''),
    trxn_type_id: new FormControl([], { updateOn: 'blur' }),
    trxn_sub_type_id: new FormControl([], { updateOn: 'blur' }),
    view_type:new FormControl(''),
    sip_stp_swp_type: new FormControl(''),
    family_members:new FormControl([])
  });

  constructor(private utility:UtiliService,private dbIntr:DbIntrService,@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    console.log(this.type);
    console.log(this.sub_type);

    this.Rpt.get('client_name').disable();
    /***** Previous Logic */
    // this.month = this.setMonthAccordingToYear(
    //   this.Rpt.value.year,
    //   new Date().getFullYear()
    // );
    /****** End */
    /**** CURRENT LOGIC */
    this.month = this.setMonthAccordingToYear(
      this.Rpt.value.year,
      new Date().getFullYear()
    );
    /******END */
    this.maxDate= this.calculateDates('T');
    this.minDate = this.calculateDates('P');
    this.searchReport();
  }

  changedisabledStatus = (isSet:boolean,sub_type:string) =>{
    if(isSet){
      if(sub_type != 'RR' && sub_type != 'MT'){
      // NO NEED TO SET ANY LOGIC
      }
      else{
        this.Rpt.get('month').enable();
        this.Rpt.get('year').enable();
        this.getYears();
        return;
      }
    }
    this.Rpt.get('month').disable();
    this.Rpt.get('year').disable();
    this.year = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if(changes.hasOwnProperty('sub_type')){
      this.changedisabledStatus(
        changes.hasOwnProperty('sub_type'),
        changes.sub_type.currentValue
      )
    }
    if (changes.hasOwnProperty('Reset')) {
      let dt = new Date();
      if (changes.Reset.currentValue == 'Y') {
        this.btn_type = 'R';
        // console.log('RESET FORM');
        // this.Rpt.get('month').setValue(this.sub_type == 'MM'? ((new Date().getMonth() + 1)) : '');
        // this.Rpt.get('year').setValue(this.sub_type == 'MM' ? new Date().getFullYear() : '');
        this.reset();

      }
    }
  }

  getYears(){
    const start_year = new Date().getFullYear();
    const dt = new Date();
    const year = dt.getFullYear() + 76;
    for(let i = start_year ; i <= year;i++){
      this.year.push(i);
    }
  }


  // checkYearc_month = async (month,year) =>{
  //     if((month && !year) || (!month && year)){
  //         await this.utility.showSnackbar(`Please Select ${this.Rpt.value.month ? ' Year' : ' Month'}`,2);
  //         return;
  //        }
  // }


   checkInvestor_Family_Selection(): string {
    if(this.Rpt.value.view_type){
      if(this.Rpt.value.view_type == 'F'){
        if(!this.Rpt.value.pan_no){
          this.utility.showSnackbar('Please select family head',2)
          return 'INVALID';
        }
        else if(this.Rpt.value.family_members.length == 0){
          this.utility.showSnackbar('Please select atleast one family member',2)
          return 'INVALID';
        }
        }
      else if(this.Rpt.value.view_type == 'C'){
        if(!this.Rpt.value.pan_no){
              this.utility.showSnackbar('Please select investor',2)
              return 'INVALID';
        }
      }
    }
    return 'VALID';
  }

  /**
   * Event trigger after form submit
   */
  searchReport = () => {
    if(this.sub_type == 'RR'){
      if((this.Rpt.value.month && !this.Rpt.value.year) || (!this.Rpt.value.month && this.Rpt.value.year)){
        this.utility.showSnackbar(`Please Select ${this.Rpt.value.month ? ' Year' : ' Month'}`,2);
        return;
       }
    }
    else if(this.sub_type == 'MT'){
      if(this.Rpt.value.view_by == 'M'){
        if((this.Rpt.value.month && !this.Rpt.value.year) || (!this.Rpt.value.month && this.Rpt.value.year)){
          this.utility.showSnackbar(`Please Select ${this.Rpt.value.month ? ' Year' : ' Month'}`,2);
          return;
         }
      }
      else{
          if(!this.Rpt.value.upto){
            this.utility.showSnackbar(`Please Select Upto`,2);
             return;
          }
      }
    }
    /**** this part is for checking whether the view type is selected or not
     * if selected , then check whether client is empty of not for view type `client`
     * for view type `Family` check whether family head & family members both are empty or not
     */
    if(this.checkInvestor_Family_Selection() == 'INVALID')
                return;
    /** End */

    let liveSipReportFilter = Object.assign({}, this.Rpt.value, {
      ...this.Rpt.value,
      family_members_pan:this.Rpt.value.view_type == 'F' ? this.utility.mapIdfromArray(this.Rpt.value.family_members.filter(item => item.pan),'pan') : '[]',
      family_members_name:this.Rpt.value.view_type == 'F' ? this.utility.mapIdfromArray(this.Rpt.value.family_members.filter(item => !item.pan),'client_name') : '[]',
      client_name:this.Rpt.getRawValue().client_name,
      amc_id:this.utility.mapIdfromArray(this.Rpt.value.amc_id,'id'),
      brn_cd:this.btn_type == 'A' ? this.utility.mapIdfromArray(this.Rpt.value.brn_cd,'id') : '[]',
      bu_type_id:this.btn_type == 'A' ? this.utility.mapIdfromArray(this.Rpt.value.bu_type_id,'bu_code') : '[]',
      cat_id:this.utility.mapIdfromArray(this.Rpt.value.cat_id,'id'),
      euin_no:this.btn_type == 'A' ?  this.utility.mapIdfromArray(this.Rpt.value.euin_no,'euin_no') : '[]',
      rm_id:this.btn_type == 'A' ?  this.utility.mapIdfromArray(this.Rpt.value.rm_id,'euin_no') : '[]',
      scheme_id:this.utility.mapIdfromArray(this.Rpt.value.scheme_id,'id'),
      sub_brk_cd:this.btn_type == 'A' ?   this.utility.mapIdfromArray(this.Rpt.value.sub_brk_cd,'code') : '[]',
      sub_cat_id:this.utility.mapIdfromArray(this.Rpt.value.sub_cat_id,'id'),
      month: (this.sub_type != 'RR' && this.sub_type != 'MT') ? '' : (this.sub_type == 'RR' ? global.getActualVal(this.Rpt.value.month) : (this.Rpt.value.view_by == 'M' ? global.getActualVal(this.Rpt.value.month) : '')),
      year: (this.sub_type != 'RR' && this.sub_type != 'MT') ? '' : (this.sub_type == 'RR' ? global.getActualVal(this.Rpt.value.year) : (this.Rpt.value.view_by == 'M' ? global.getActualVal(this.Rpt.value.year) : '')),
      view_by:this.sub_type == 'MT' ? global.getActualVal(this.Rpt.value.view_by) : '',
      upto:this.sub_type == 'MT' ? (this.Rpt.value.view_by == 'D' ? global.getActualVal(this.Rpt.value.upto) : '') : '',
    });
    this.getsearchValues.emit(liveSipReportFilter);
  }

  calculateDates  =  (mode:string):Date =>{
    let dt = new Date();
    switch(mode){
      case 'T' : break;
      case 'P' : dt.setFullYear(dt.getFullYear() - 1)
    }
    return new Date(dt.toISOString().split('T')[0]);
  }


  /**
   * Event Trigger for Advacne Filter / Reset
   * @param ev
   */
  onItemClick = (ev) => {
    if (ev.option.value == 'A') {
      this.getBranchMst();
    } else {
         this.reset();
    }
  }

  reset(){
      this.resetForm();
      this.searchReport();
  }
  resetForm = () => {
    console.log(`SUB TYPE: ${this.sub_type}`);
    this.Rpt.patchValue({
      amc_id: [],
      folio_no: '',
      sip_stp_swp_type:'',
      client_id: '',
      pan_no: '',
      view_type: '',
      month: this.sub_type == 'MT' ?  (new Date().getMonth() + 1) : '',
      view_by:'M',
      upto:'',
      year:this.sub_type == 'MT' ? (new Date().getFullYear()) : ''
    });
    this.Rpt.get('brn_cd').setValue([], { emitEvent: true });
    this.subbrkArnMst = [];
    this.Rpt.controls['sub_brk_cd'].setValue([]);
    this.Rpt.controls['euin_no'].setValue([]);
    this.Rpt.controls['client_name'].setValue('', { emitEvent: false });
  }

 /**
  * Get Branch Master Data
 */
  getBranchMst = () => {
    this.dbIntr
      .api_call(0, '/branch', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.branchMst = res;
      });
  };

   setMonthAccordingToYear(sel_year:Number | undefined,curr_year:Number){
    if(sel_year){
      return sel_year > curr_year ? MonthDT :   MonthDT.filter((item:{id:number,month:string}) => Number(new Date().getMonth() + 1) <= item.id);
      }
      else{
        return MonthDT.filter((item:{id:number,month:string}) => Number(new Date().getMonth() + 1) <= item.id);
      }
    }




  ngAfterViewInit(){


      /**
       * Event Trigger after change year
       */
      this.Rpt.get('year').valueChanges.subscribe(res =>{
          this.month = this.setMonthAccordingToYear(res,new Date().getFullYear())
      })
      /***
       * END
       */

      /**
       * Event Trigger after change amc
       */
      this.Rpt.controls['amc_id'].valueChanges.subscribe((res) => {
        this.getCategoryMst(res);
        this.getSubcategoryMst(res, this.Rpt.value.cat_id);
        this.getSchemeMst(
          res,
          this.Rpt.value.cat_id,
          this.Rpt.value.sub_cat_id
        );
      });
      /**
       * Event Trigger after change category
       */
      this.Rpt.controls['cat_id'].valueChanges.subscribe((res) => {
        this.getSubcategoryMst(this.Rpt.value.amc_id, res);
        this.getSchemeMst(
          this.Rpt.value.amc_id,
          res,
          this.Rpt.value.sub_cat_id
        );
      });
      /**
       * Event Trigger after change subcategory
       */
      this.Rpt.controls['sub_cat_id'].valueChanges.subscribe((res) => {
        this.getSchemeMst(
          this.Rpt.value.amc_id,
          this.Rpt.value.cat_id,
          res
        );
      });

      /**
       * Event Trigger after change Branch
       */
      this.Rpt.controls['brn_cd'].valueChanges.subscribe((res) => {
        this.getBusinessTypeMst(res);
      });

      /**
       * Event Trigger after Business Type
       */
      this.Rpt.controls['bu_type_id'].valueChanges.subscribe((res) => {
        this.disabledSubBroker(res);
        this.getRelationShipManagerMst(res, this.Rpt.value.brn_cd);
      });

      /**
       * Event Trigger after Rlationship Manager
       */
      this.Rpt.controls['rm_id'].valueChanges.subscribe((res) => {
        if (
          this.Rpt.value.bu_type_id.findIndex(
            (item) => item.bu_code == 'B'
          ) != -1
        ) {
          this.getSubBrokerMst(res);
        } else {
          this.euinMst=[];
          this.euinMst = res;
        }
      });
      /**
       * Event Trigger after Rlationship Manager
       */
      this.Rpt.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
        this.setEuinDropdown(res, this.Rpt.value.rm_id);
      });



       /**view_type Change*/
       this.Rpt.controls['view_type'].valueChanges.subscribe(res =>{
        if(this.family_members.length > 0){
          this.getFamilyMembersAccordingTo_Id();
        }
        this.Rpt.get('client_name').reset('',{emitEvent:false});
        this.Rpt.get('pan_no').reset('');
        if(res){
          this.paginate = 1;
          this.__clientMst = [];
          // this.getClientMst(res,this.paginate);
          this.Rpt.get('client_name').enable();
        }
        else{
          this.Rpt.get('client_name').disable();
        }
        })
        /**End */

         /** Investor Change */
      this.Rpt.controls['client_name'].valueChanges
      .pipe(
        tap(()=> this.Rpt.get('pan_no').setValue('')),
        tap(() => {
          this.__isClientPending = true
          if(this.family_members.length > 0){
            this.getFamilyMembersAccordingTo_Id();
          }
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
          dt+'&view_type='+this.Rpt.value.view_type
          ) : []

        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.__clientMst = value;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
        },
        complete: () => {},
        error: (err) => {
          this.__isClientPending = false;
        },
      });

      /** End */
  }


  /**
   * get Category Master Data according to AMC
   * @param amc_id
   */
  getCategoryMst = <T extends { id: number; amc_short_name: string }[]>(
    amc_id: T
  ) => {
    if (amc_id.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/category',
          'arr_amc_id=' + this.utility.mapIdfromArray(amc_id, 'id')
        )
        .pipe(pluck('data'))
        .subscribe((res: category[]) => {
          this.catMst = res;
        });
    } else {
      this.catMst = [];
      this.Rpt.get('cat_id').reset([], { emitEvent: true });
    }
  };

  /**
   * get Sub-Category Master Data according to AMC,Category
   * @param amc_id
   * @param cat_id
   */

  getSubcategoryMst = <
    T extends { id: number; amc_short_name: string }[],
    C extends category[]
  >(
    amc_id: T,
    cat_id: C
  ) => {
    if (cat_id.length > 0 && amc_id.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/subcategory',
          'arr_cat_id=' +
            this.utility.mapIdfromArray(cat_id, 'id') +
            '&arr_amc_id=' +
            this.utility.mapIdfromArray(amc_id, 'id')
        )
        .pipe(pluck('data'))
        .subscribe((res: subcat[]) => {
          this.subcatMst = res;
        });
    } else {
      this.subcatMst = [];
      this.Rpt.get('sub_cat_id').reset([], { emitEvent: true });
    }
  };

  /**
   * get Scheme Master Data according to AMC,Category,Subcategory
   * @param amc_id
   * @param cat_id
   */

  getSchemeMst = <
    T extends { id: number; amc_short_name: string }[],
    C extends category[],
    S extends subcat[]
  >(
    amc_id: T,
    cat_id: C,
    sub_cat_id: S
  ) => {
    if (cat_id.length > 0 && amc_id.length > 0 && sub_cat_id.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/scheme',
          'arr_cat_id=' +
            this.utility.mapIdfromArray(cat_id, 'id') +
            '&arr_subcat_id=' +
            this.utility.mapIdfromArray(sub_cat_id, 'id') +
            '&arr_amc_id=' +
            this.utility.mapIdfromArray(amc_id, 'id')
        )
        .pipe(pluck('data'))
        .subscribe((res: scheme[]) => {
          this.schemeMst = res;
        });
    } else {
      this.schemeMst = [];
      this.Rpt.get('scheme_id').reset([]);
    }
  };




  setEuinDropdown = (sub_brk_cd, rm) => {
    this.euinMst = rm.filter(
      (item) =>
        !this.subbrkArnMst
          .map((item) => {
            return item['emp_euin_no'];
          })
          .includes(item.euin_no)
    );
    if (sub_brk_cd.length > 0) {
      sub_brk_cd.forEach((element) => {
        if (
          this.subbrkArnMst.findIndex((el) => element.code == el.code) != -1
        ) {
          this.euinMst.push({
            euin_no:
              this.subbrkArnMst[
                this.subbrkArnMst.findIndex((el) => element.code == el.code)
              ].euin_no,
            emp_name: '',
          });
        }
      });
    } else {
      this.euinMst = this.euinMst.filter(
        (item) =>
          !this.subbrkArnMst
            .map((item) => {
              return item['euin_no'];
            })
            .includes(item.euin_no)
      );
    }
  };
  disabledSubBroker(bu_type_ids) {
    if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
      this.Rpt.controls['sub_brk_cd'].enable();
    } else {
      this.Rpt.controls['sub_brk_cd'].disable();
    }
  }
  getSubBrokerMst(arr_euin_no) {
    if (arr_euin_no.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/subbroker',
          'arr_euin_no=' +
            JSON.stringify(
              arr_euin_no.map((item) => {
                return item['euin_no'];
              })
            )
        )
        .pipe(pluck('data'))
        .subscribe((res: any) => {
          this.subbrkArnMst = res.map(
            ({ code, bro_name, emp_euin_no, euin_no }) => ({
              code,
              emp_euin_no,
              euin_no,
              bro_name: bro_name + '-' + code,
            })
          );
        });
    } else {
      this.subbrkArnMst = [];
      this.Rpt.controls['sub_brk_cd'].setValue([]);
    }
  }
  getBusinessTypeMst(brn_cd) {
    if (brn_cd.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/businessType',
          'arr_branch_id=' +
            JSON.stringify(
              brn_cd.map((item) => {
                return item['id'];
              })
            )
        )
        .pipe(pluck('data'))
        .subscribe((res) => {
          this.bu_type = res;
        });
    } else {
      this.Rpt.controls['bu_type_id'].setValue([], { emitEvent: true });
      this.bu_type = [];
    }
  }
  getRelationShipManagerMst(bu_type_id, arr_branch_id) {
    if (bu_type_id.length > 0 && arr_branch_id.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/employee',
          'arr_bu_type_id=' +
            JSON.stringify(
              bu_type_id.map((item) => {
                return item['bu_code'];
              })
            ) +
            '&arr_branch_id=' +
            JSON.stringify(
              arr_branch_id.map((item) => {
                return item['id'];
              })
            )
        )
        .pipe(pluck('data'))
        .subscribe((res) => {
          this.RmMst = res;
        });
    } else {
      this.RmMst = [];
      this.Rpt.controls['rm_id'].setValue([],{emitEvent:true});
    }
  }


  /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
    getSelectedItemsFromParent = (searchRlt: {
      flag: string;
      item: any;
    }) => {

      this.Rpt.get('client_name').reset(searchRlt.item.first_client_name, { emitEvent: false });
      this.Rpt.get('pan_no').reset(searchRlt.item.first_client_pan);
      // this.Rpt.get('client_id').reset(searchRlt.item.first_client_pan);
      this.searchResultVisibilityForClient('none');
      if(this.Rpt.value.view_type == 'F'){
        this.getFamilyMembersAccordingTo_Id(searchRlt.item.client_id);
      }
    };

    /**
   *
   */
    getFamilyMembersAccordingTo_Id = (id:number | undefined = undefined) =>{
    if(id){
      this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.Rpt.value.view_type}`)
      .pipe(pluck('data'))
      .subscribe((res:client[]) =>{
       console.log(res);
       this.family_members = res;
       this.Rpt.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
      })
   }
   else{
       this.family_members = [];
       this.Rpt.get('family_members').setValue([]);
   }
  }

   /**
   *  evnt trigger on search particular client & after select client
   * @param display_mode
   */
  searchResultVisibilityForClient = (display_mode: string) => {
    this.displayMode_forClient = display_mode;
  };

  loadInvestorOnScrollToEnd = (ev) =>{
    console.log(this.Rpt.value.client_name);
    if(this.Rpt.value.client_name == ''){
      // console.log('adasd')
      this.paginate+=1;
    this.getClientMst(this.Rpt.value.view_type,this.paginate);
    }
  }

  /**
   * Get Client Master Data
   */
  getClientMst = (view_type:string,paginate:number | undefined = 1) =>{
    if(view_type){
      this.dbIntr.api_call(0,
        '/searchClient',
       'view_type='+view_type
       +'&page='+paginate
       ).pipe(pluck("data")).subscribe((res: any) =>{
        console.log(res);
        // this.__clientMst= res.data;
        /** 1st Way of concat two array*/
        // Array.prototype.push.apply( this.__clientMst, res.data);
        /** END */
        /** 2nd Way of concat two array*/
        this.__clientMst.push(...res.data);
        /**End */
        this.searchResultVisibilityForClient('block');
        this.document.getElementById('Investor').focus();
       })
    }

  }
  toggle() {
    // this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
    this.changeState.emit(this.state);
  }

  clearAdvanceFilter = () =>{
    this.btn_type = 'R';
    this.Rpt.get('brn_cd').setValue([], { emitEvent: true });
    this.subbrkArnMst = [];
    this.Rpt.controls['sub_brk_cd'].setValue([]);
    this.Rpt.controls['euin_no'].setValue([]);
  }


}
