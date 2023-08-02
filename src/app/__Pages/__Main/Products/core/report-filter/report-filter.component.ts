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
  @Input() subCatMst:subcat[] = [];

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
  @Input() branchMst: any = [];

  /**
   * Holding Buisness type
   */
  @Input() bu_type: any = [];

  /**
   * Holding Relationship Manager
   */
  @Input() RmMst: any = [];

  /**
   * Holding Sub Broker Master Data
   */
  @Input() subbrkArnMst: any = [];

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

  /** Event triggered after click on reset/advance filter
   * @param ev
   */
  onItemClick = (ev) =>{
     console.log(ev)
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


}
