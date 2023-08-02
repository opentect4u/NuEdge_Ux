import { Component, Input, OnInit } from '@angular/core';
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
import { pluck } from 'rxjs/operators';
import { dates } from 'src/app/__Utility/disabledt';

@Component({
  selector: 'core-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.css']
})
export class ReportFilterComponent implements OnInit {

  /**
   * For Displaying title in card header
  */
  @Input() title:string | null = '';

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
  settingsforTrxnTypeDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'trans_type',
    'Search Transaction Type',
    1
  );
  settingsforTrxnSubTypeDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'trans_sub_type',
    'Search Transaction Sub-Type',
    1,
    150
  );

  /**
   * END
   */

  /**
   * For which report this filter will work...
   * MT=> Mutual Fund Trasaction Report
   * MSIP/MSTP/MSWP => Mutual Fund SIP/STP/SWP Report
   *
   */
  @Input() flag:string;


  /**
   * For holding client those are  present only in transaction.
   */
   @Input() clientMst:any=[];

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
   * For Holding Scheme Master Data
  */
   @Input() schemeMst:scheme[] = [];

   /**
   * Holding Transaction Type  Master Data
   */
   @Input() trxnTypeMst: rntTrxnType[] = [];

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

  /**
   * Form Field for search Transaction
   */
  Rpt = new FormGroup({
    date_periods: new FormControl(''),
    date_range: new FormControl(''),
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
    pan_no:new FormControl([]),
    client_name: new FormControl(''),
    trxn_type_id: new FormControl([], { updateOn: 'blur' }),
    trxn_sub_type_id: new FormControl([], { updateOn: 'blur' }),
  });

  constructor(private utility:UtiliService,private dbIntr:DbIntrService) { }

  ngOnInit(): void {
    this.maxDate= this.calculateDates('T');
    this.minDate= this.calculateDates('P');
  }

  /**
   * Event trigger after form submit
   */
  searchReport = () =>{

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
         this.Rpt.patchValue({
          amc_id:[],
          folio_no:'',
          trxn_type_id:[],
          date_range:'',
          date_periods:'',
          client_id:'',
          pan_no:[]
         });
         this.Rpt.get('brn_cd').setValue([],{emitEvent:true});
         this.subbrkArnMst = [];
         this.Rpt.controls['sub_brk_cd'].setValue([]);
         this.Rpt.controls['euin_no'].setValue([]);
         this.Rpt.controls['client_name'].setValue('',{emitEvent:false});
    }
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


  ngAfterViewInit(){
    this.Rpt.controls['date_periods'].valueChanges.subscribe((res) => {
      this.Rpt.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      if (res && res != 'R') {
        this.Rpt.controls['date_range'].disable();
      } else {
        this.Rpt.controls['date_range'].enable();
      }
    });

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
       * Event Trigger after change Transaction Type
       */
      this.Rpt.controls['trxn_type_id'].valueChanges.subscribe((res) => {
        this.getTrxnSubTypeMst(res);
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

  /**
   * get Transaction sub type master data after change transaction type
   * @param trxnType
   */

  getTrxnSubTypeMst = <T extends rntTrxnType[]>(trxnType: T) => {
    if(trxnType.length > 0){
    this.dbIntr
      .api_call(
        0,
        '/rntTransTypeSubtypeShow',
        'arr_trans_type=' + this.utility.mapIdfromArray(trxnType, 'trans_type')
      )
      .pipe(pluck('data'))
      .subscribe((res: rntTrxnType[]) => {
        this.trxnSubTypeMst = res;
      });
    }
    else{
      this.trxnSubTypeMst = [];
      this.Rpt.get('trxn_sub_type_id').setValue([]);
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

}
