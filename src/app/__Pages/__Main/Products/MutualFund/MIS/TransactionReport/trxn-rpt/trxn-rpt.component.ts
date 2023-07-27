import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import periods from '../../../../../../../../assets/json/datePeriods.json';
import { amc } from 'src/app/__Model/amc';
import { client } from 'src/app/__Model/__clientMst';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { scheme } from 'src/app/__Model/__schemeMst';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { global } from 'src/app/__Utility/globalFunc';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { Calendar } from 'primeng/calendar';
import { dates } from 'src/app/__Utility/disabledt';
import { totalAmt } from 'src/app/__Model/TotalAmt';



@Component({
  selector: 'app-trxn-rpt',
  templateUrl: './trxn-rpt.component.html',
  styleUrls: ['./trxn-rpt.component.css'],
})
export class TrxnRptComponent implements OnInit {

  @ViewChild('tableCard') tableCard:ElementRef


  /**
   * For Display Total Amount
   */
    total:totalAmt;

  /**
   * For Display Total
   */

  /**
   * For Holding Max Date And Min Date form Prime Ng Calendar
   */
    minDate: Date;
    maxDate:Date;

  /**
   *  getAccess of Prime Ng Calendar
   */
  @ViewChild('dateRng') date_range:Calendar;

  /**
   * Holding Advance Filter / Normal Filter
   */
  selectBtn = filterOpt;
  /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
  __isClientPending: boolean = false;

  /**
   * Holding Client Master Data after search
   */
  __clientMst: client[] = [];

  /**
   * Show / hide search list dropdown after serach input match
   */
  displayMode_forClient: string;

  /**
   *  get date Periods from JSON File Located at (assets/json/datePeriods) for populate
   *  inside the date periods dropdown
   */
  periods_type: { id: string; periods: string }[] = periods;

  /**
   * Hold transaction details after search
   */
  trxnRpt: TrxnRpt[] = [];

  /**
   * Hold column for transaction table
   */
  column: column[] = trxnClm.column.filter((item:column) => (item.field!='scheme_link' && item.field!='isin_link' ));

  /**
   * Holding AMC Master Data
   */
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

  /**
   * Constructor
   * @param dbIntr
   * @param utility
   */

  constructor(private dbIntr: DbIntrService, private utility: UtiliService) {}

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

  /**
   * hold Button Type Advance Filter / Normal Filter
   */
  btn_type: 'R' | 'A' = 'R';

  /**
   * Form Field for search Transaction
   */
  misTrxnRpt = new FormGroup({
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
    pan_no:new FormControl(''),
    client_name: new FormControl(''),
    trxn_type_id: new FormControl([], { updateOn: 'blur' }),
    trxn_sub_type_id: new FormControl([], { updateOn: 'blur' }),
  });

  ngOnInit(): void {
    this.getAmcMst();
    this.getTrxnTypeMst();
    this.maxDate= this.calculateDates('T');
    this.minDate= this.calculateDates('P');
  }


  calculateDates  =  (mode:string):Date =>{
    let dt = new Date();
    switch(mode){
      case 'T' : break;
      case 'P' : dt.setFullYear(dt.getFullYear() - 1)
    }
    console.log(new Date(dt.toISOString().split('T')[0]));
    return new Date(dt.toISOString().split('T')[0]);
  }

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

  ngAfterViewInit() {
    this.hideCard('none');

   /**
    *  Event Trigger on change on Date Periods
    */
   this.misTrxnRpt.controls['date_periods'].valueChanges.subscribe((res) => {
    this.misTrxnRpt.controls['date_range'].reset(
      res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
    );
    if (res && res != 'R') {
      this.misTrxnRpt.controls['date_range'].disable();
    } else {
      this.misTrxnRpt.controls['date_range'].enable();
    }
  });

    /**
     *  event trigger on Client Details Search Dropdown
     */
    this.misTrxnRpt.controls['client_name'].valueChanges
      .pipe(
        tap(() => (this.__isClientPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/client', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value: { data: client[] }) => {
          this.__clientMst = value.data;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
          this.misTrxnRpt.get('client_id').reset('');
          this.misTrxnRpt.get('pan_no').reset('');
        },
        complete: () => {},
        error: (err) => {
          this.__isClientPending = false;
        },
      });

    /**
     * Event Trigger after change amc
     */
    this.misTrxnRpt.controls['amc_id'].valueChanges.subscribe((res) => {
      this.getCategoryMst(res);
      this.getSubcategoryMst(res, this.misTrxnRpt.value.cat_id);
      this.getSchemeMst(
        res,
        this.misTrxnRpt.value.cat_id,
        this.misTrxnRpt.value.sub_cat_id
      );
    });
    /**
     * Event Trigger after change category
     */
    this.misTrxnRpt.controls['cat_id'].valueChanges.subscribe((res) => {
      this.getSubcategoryMst(this.misTrxnRpt.value.amc_id, res);
      this.getSchemeMst(
        this.misTrxnRpt.value.amc_id,
        res,
        this.misTrxnRpt.value.sub_cat_id
      );
    });
    /**
     * Event Trigger after change subcategory
     */
    this.misTrxnRpt.controls['sub_cat_id'].valueChanges.subscribe((res) => {
      this.getSchemeMst(
        this.misTrxnRpt.value.amc_id,
        this.misTrxnRpt.value.cat_id,
        res
      );
    });

    /**
     * Event Trigger after change Transaction Type
     */
    this.misTrxnRpt.controls['trxn_type_id'].valueChanges.subscribe((res) => {
      this.getTrxnSubTypeMst(res);
    });
    /**
     * Event Trigger after change Branch
     */
    this.misTrxnRpt.controls['brn_cd'].valueChanges.subscribe((res) => {
      this.getBusinessTypeMst(res);
    });

    /**
     * Event Trigger after Business Type
     */
    this.misTrxnRpt.controls['bu_type_id'].valueChanges.subscribe((res) => {
      this.disabledSubBroker(res);
      this.getRelationShipManagerMst(res, this.misTrxnRpt.value.brn_cd);
    });

    /**
     * Event Trigger after Rlationship Manager
     */
    this.misTrxnRpt.controls['rm_id'].valueChanges.subscribe((res) => {
      if (
        this.misTrxnRpt.value.bu_type_id.findIndex(
          (item) => item.bu_code == 'B'
        ) != -1
      ) {
        this.getSubBrokerMst(res);
      } else {
        this.__euinMst=[];
        this.__euinMst = res;
      }
    });
    /**
     * Event Trigger after Rlationship Manager
     */
    this.misTrxnRpt.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
      this.setEuinDropdown(res, this.misTrxnRpt.value.rm_id);
    });
  }
  /**
   *  call API for get transaction according to search result
   */
  searchTrxnReport = () => {
    const TrxnDt = new FormData();
    TrxnDt.append('date_range',global.getActualVal(this.date_range.inputFieldValue));
    TrxnDt.append('folio_no',global.getActualVal(this.misTrxnRpt.value.folio_no));
    TrxnDt.append('client_id',global.getActualVal(this.misTrxnRpt.value.client_id));
    TrxnDt.append('amc_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.amc_id, 'id'));
    TrxnDt.append('cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.cat_id, 'id'));
    TrxnDt.append('sub_cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.sub_cat_id, 'id'));
    TrxnDt.append('pan_no',global.getActualVal(this.misTrxnRpt.value.pan_no));
    TrxnDt.append('scheme_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.scheme_id, 'id'));
    TrxnDt.append('trans_type_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_type_id,'trans_type'));
    TrxnDt.append('trans_sub_type_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_sub_type_id,'trans_sub_type'));
    if (this.btn_type == 'A') {
      TrxnDt.append('euin_no',this.utility.mapIdfromArray(this.misTrxnRpt.value.euin_no, 'euin_no'));
      TrxnDt.append('brn_cd',this.utility.mapIdfromArray(this.misTrxnRpt.value.brn_cd, 'id'));
      TrxnDt.append('rm_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.rm_id, 'euin_no'));
      TrxnDt.append('bu_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.bu_type_id, 'bu_code'));
      TrxnDt.append('sub_brk_cd',this.utility.mapIdfromArray(this.misTrxnRpt.value.sub_brk_cd, 'code'));
    }

    this.dbIntr
      .api_call(1, '/showTransDetails', TrxnDt)
      .pipe(
        pluck('data'),
        tap((item:TrxnRpt[]) => {
            let net_amt = 0,gross_amt=0,tds=0,stamp_duity =0;
            item.map( item => {
              net_amt+=Number(item.amount);
              gross_amt+=Number(item.gross_amount ? item.gross_amount : 0);
              tds+=Number(item.tds ? item.tds : 0);
              stamp_duity+=Number(item.stamp_duty);
                this.total = {
                      net_amt:net_amt,
                      stamp_duity:stamp_duity,
                      tds:tds,
                      gross_amt:gross_amt
                };
            });
        })
        )
      .subscribe((res: TrxnRpt[]) => {
       this.hideCard('block');
        this.trxnRpt = res;

      });
  };

  /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
  getSelectedItemsFromParent = <T extends client>(searchRlt: {
    flag: string;
    item: T;
  }) => {
    this.misTrxnRpt.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.misTrxnRpt.get('client_id').reset(searchRlt.item.id);
    this.misTrxnRpt.get('pan_no').reset(searchRlt.item.pan);
    this.searchResultVisibilityForClient('none');
  };

  /**
   *  evnt trigger on search particular client & after select client
   * @param display_mode
   */
  searchResultVisibilityForClient = (display_mode: string) => {
    this.displayMode_forClient = display_mode;
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
      this.misTrxnRpt.get('cat_id').reset([], { emitEvent: true });
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
      this.misTrxnRpt.get('sub_cat_id').reset([], { emitEvent: true });
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
            '&arr_sub_cat_id=' +
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
      this.misTrxnRpt.get('scheme_id').reset([]);
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
        'arr_trans_type_id=' + this.utility.mapIdfromArray(trxnType, 'id')
      )
      .pipe(pluck('data'))
      .subscribe((res: rntTrxnType[]) => {
        this.trxnSubTypeMst = res;
      });
    }
    else{
      this.trxnSubTypeMst = [];
      this.misTrxnRpt.get('trxn_sub_type_id').setValue([]);
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
  /**
   * Event Trigger for Advacne Filter / Reset
   * @param ev
   */
  onItemClick = (ev) => {
    console.log(ev);
    if (ev.option.value == 'A') {
      this.getBranchMst();
    } else {
         this.misTrxnRpt.patchValue({
          amc_id:[],
          folio_no:'',
          trxn_type_id:[],
          date_range:'',
          date_periods:'',
          client_id:'',
          pan_no:''
         });
         this.misTrxnRpt.get('brn_cd').setValue([],{emitEvent:true});
         this.__subbrkArnMst = [];
         this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
         this.misTrxnRpt.controls['euin_no'].setValue([]);
         this.misTrxnRpt.controls['client_name'].setValue('',{emitEvent:false});
    }
  };

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
      this.misTrxnRpt.controls['sub_brk_cd'].enable();
    } else {
      this.misTrxnRpt.controls['sub_brk_cd'].disable();
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
      this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
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
      this.misTrxnRpt.controls['bu_type_id'].setValue([], { emitEvent: true });
      this.__bu_type = [];
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
      this.misTrxnRpt.controls['rm_id'].setValue([],{emitEvent:true});
    }
  }

  hideCard = (display_mode) =>{
   this.tableCard.nativeElement.style.display = display_mode;
  }
}
