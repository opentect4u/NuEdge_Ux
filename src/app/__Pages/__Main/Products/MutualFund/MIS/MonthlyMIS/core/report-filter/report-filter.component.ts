/******
 *  FLAG == `R` => Monthly MIS Report
 *  FLAG == `T` => Monthly MIS Trend Report
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import filterOpt from '../../../../../../../../../assets/json/filterOption.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { FormControl, FormGroup } from '@angular/forms';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { scheme } from 'src/app/__Model/__schemeMst';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { pluck } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'core-mis-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '15px 20px', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('formbodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '15px 20px', visibility: 'visible', })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('230ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ReportFilterComponent implements OnInit {
  /*** FOR MAINTAINING CARD HEADER SHOW HIDE ANIMATION */
  state: string | undefined = 'expanded';
  /****END */

  /****  Showing Title on the card header */
  @Input() title: string;
  /***** End */

  /**
  * hold Button Type Advance Filter / Normal Filter
  */
  btn_type: 'R' | 'A' = 'R';

  /**
 * Holding Advance Filter / Normal Filter
 */
  selectBtn = filterOpt;

  month_year: string[] = [];

  /**
  * Setting of multiselect dropdown
  */
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

  @Input() flag: 'R' | 'T'; // T(MONTHLY MIS TREND REPORT) / R(MONTHLY MIS REPORT)


  /******
   *
   * AMC Master
   * */
  amcMst: amc[] = [];
  /**
     * Holding Category Master Data
     */
  catMst: category[] = [];

  /**
    * Holding Sub-Category Master Data
    */
  subcatMst: subcat[] = [];

  /**
    * Holding Scheme Master Data
    */
  schemeMst: scheme[] = [];

  /**
  * Holding Transaction Type  Master Data
  */
  trxnTypeMst: rntTrxnType[] = [];

  /**
   * Holding Transaction Sub-Type  Master Data
   */
  trxnSubTypeMst: rntTrxnType[] = [];


  /**
  * Holding Branch Master Data
  */
  __branchMst: any = [];

  /**
   * Holding Buisness type
   */
  __bu_type: any = [];

  /**
   * Holding Relationship Manager
   */
  __RmMst: any = [];

  /**
   * Holding Sub Broker Master Data
   */
  __subbrkArnMst: any = [];

  /**
   * Holding Sub Broker Master Data
   */
  __euinMst: any = [];


  monthly_mis_filter_form = new FormGroup({
    mis_month: new FormControl(''),
    no_of_month: new FormControl(''),
    amc_id: new FormControl([]),
    cat_id: new FormControl([]),
    sub_cat_id: new FormControl([]),
    scheme_id: new FormControl([]),
    trans_type: new FormControl([]),
    trans_sub_type: new FormControl([]),
    euin_no: new FormControl([]),
    brn_cd: new FormControl([]),
    rm_id: new FormControl([]),
    bu_type_id: new FormControl([]),
    sub_brk_cd: new FormControl([])
  });

  @Output() searchReport = new EventEmitter()
  constructor(private utility: UtiliService, private dbIntr: DbIntrService) { }

  ngOnInit(): void {
    /*******
    * disable mis_month if flag == `T`;
    * disable no_of_month if flag == `R`
    * */
    this.monthly_mis_filter_form.get(this.flag == 'R' ? 'no_of_month' : 'mis_month').disable();
    /***** END */
    this.getAmcMst(); // Holding AMC Master Data...
    this.getTrxnTypeMst(); // Holding AMC Master Data...
    /******** For Getting Month & Year  from Jan-1980 to Till Now */
    global.getMonthYears().then(MY => {
      this.month_year = MY;
      this.searchFilter();
    }).catch(err => {
      console.log(err);
    })
    /***** END */

  }

  ngAfterViewInit() {
    /**
     * Event Trigger after change amc
     */
    this.monthly_mis_filter_form.controls['amc_id'].valueChanges.subscribe((res) => {
      this.getCategoryMst(res);
      this.getSubcategoryMst(res, this.monthly_mis_filter_form.value.cat_id);
      this.getSchemeMst(
        res,
        this.monthly_mis_filter_form.value.cat_id,
        this.monthly_mis_filter_form.value.sub_cat_id
      );
    });
    /**
     * Event Trigger after change category
     */
    this.monthly_mis_filter_form.controls['cat_id'].valueChanges.subscribe((res) => {
      this.getSubcategoryMst(this.monthly_mis_filter_form.value.amc_id, res);
      this.getSchemeMst(
        this.monthly_mis_filter_form.value.amc_id,
        res,
        this.monthly_mis_filter_form.value.sub_cat_id
      );
    });
    /**
     * Event Trigger after change subcategory
     */
    this.monthly_mis_filter_form.controls['sub_cat_id'].valueChanges.subscribe((res) => {
      this.getSchemeMst(
        this.monthly_mis_filter_form.value.amc_id,
        this.monthly_mis_filter_form.value.cat_id,
        res
      );
    });

    /**
     * Event Trigger after change Transaction Type
     */
    this.monthly_mis_filter_form.controls['trans_type'].valueChanges.subscribe((res) => {
      this.getTrxnSubTypeMst(res);
    });
    /**
     * Event Trigger after change Branch
     */
    this.monthly_mis_filter_form.controls['brn_cd'].valueChanges.subscribe((res) => {
      this.getBusinessTypeMst(res);
    });

    /**
     * Event Trigger after Business Type
     */
    this.monthly_mis_filter_form.controls['bu_type_id'].valueChanges.subscribe((res) => {
      this.disabledSubBroker(res);
      this.getRelationShipManagerMst(res, this.monthly_mis_filter_form.value.brn_cd);
    });

    /**
     * Event Trigger after Rlationship Manager
     */
    this.monthly_mis_filter_form.controls['rm_id'].valueChanges.subscribe((res) => {
      if (
        this.monthly_mis_filter_form.value.bu_type_id.findIndex(
          (item) => item.bu_code == 'B'
        ) != -1
      ) {
        this.getSubBrokerMst(res);
      } else {
        this.__euinMst = [];
        this.__euinMst = res;
      }
    });
    /**
     * Event Trigger after Rlationship Manager
     */
    this.monthly_mis_filter_form.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
      this.setEuinDropdown(res, this.monthly_mis_filter_form.value.rm_id);
    });
  }

  onItemClick = (ev) => {
    if (ev.option.value == 'A') {
      this.getBranchMst();
    } else {
    }
  };


  /**
   * Get AMC Master Data from Backend API
   */
  getAmcMst = () => {
    this.dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.amcMst = res;
      });
  };

  /**
  * Cal API for getting Transaction Type Master Data
  */
  getTrxnTypeMst = () => {
    this.dbIntr
      .api_call(0, '/rntTransTypeSubtypeShow', null)
      .pipe(pluck('data'))
      .subscribe((res: rntTrxnType[]) => {
        this.trxnTypeMst = res;
      });
  };


  /**
   * get Category Master Data according to AMC
   * @param amc_id
   */
  getCategoryMst = <T extends { id: number; amc_short_name: string }[]>(
    amc_id: T
  ) => {
    // console.log(amc_id)
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
      this.monthly_mis_filter_form.get('cat_id').reset([], { emitEvent: true });
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
      this.monthly_mis_filter_form.get('sub_cat_id').reset([], { emitEvent: true });
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
      this.monthly_mis_filter_form.get('scheme_id').reset([]);
    }
  };

  /**
   * get Transaction sub type master data after change transaction type
   * @param trxnType
   */

  getTrxnSubTypeMst = <T extends rntTrxnType[]>(trxnType: T) => {
    if (trxnType.length > 0) {
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
    else {
      this.trxnSubTypeMst = [];
      this.monthly_mis_filter_form.get('trxn_sub_type_id').setValue([]);
    }
  };

  /**
   * Get Branch Master Data
   */
  getBranchMst = () => {
    this.dbIntr
      .api_call(0, '/branch', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__branchMst = res;
      });
  };

  toggle() {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }


  /***** SEARCH MONTHLY MIS REPORT*/
  searchFilter = () => {
    console.log(this.monthly_mis_filter_form.value);
    this.searchReport.emit(this.monthly_mis_filter_form.value);
  }
  /*******END */

  setEuinDropdown = (sub_brk_cd, rm) => {
    this.__euinMst = rm.filter(
      (item) =>
        !this.__subbrkArnMst
          .map((item) => {
            return item['emp_euin_no'];
          })
          .includes(item.euin_no)
    );
    if (sub_brk_cd.length > 0) {
      sub_brk_cd.forEach((element) => {
        if (
          this.__subbrkArnMst.findIndex((el) => element.code == el.code) != -1
        ) {
          this.__euinMst.push({
            euin_no:
              this.__subbrkArnMst[
                this.__subbrkArnMst.findIndex((el) => element.code == el.code)
              ].euin_no,
            emp_name: '',
          });
        }
      });
    } else {
      this.__euinMst = this.__euinMst.filter(
        (item) =>
          !this.__subbrkArnMst
            .map((item) => {
              return item['euin_no'];
            })
            .includes(item.euin_no)
      );
    }
  };


  disabledSubBroker(bu_type_ids) {
    if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
      this.monthly_mis_filter_form.controls['sub_brk_cd'].enable();
    } else {
      this.monthly_mis_filter_form.controls['sub_brk_cd'].disable();
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
          this.__bu_type = res;
        });
    } else {
      this.monthly_mis_filter_form.controls['bu_type_id'].setValue([], { emitEvent: true });
      this.__bu_type = [];
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
          this.__subbrkArnMst = res.map(
            ({ code, bro_name, emp_euin_no, euin_no }) => ({
              code,
              emp_euin_no,
              euin_no,
              bro_name: bro_name + '-' + code,
            })
          );
        });
    } else {
      this.__subbrkArnMst = [];
      this.monthly_mis_filter_form.controls['sub_brk_cd'].setValue([]);
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
          this.__RmMst = res;
        });
    } else {
      this.__RmMst = [];
      this.monthly_mis_filter_form.controls['rm_id'].setValue([], { emitEvent: true });
    }
  }

}
