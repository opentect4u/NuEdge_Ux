import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnClm } from 'src/app/__Utility/TransactionRPT/trnsClm';
import periods from '../../../../../../../../assets/json/datePeriods.json';
import { amc } from 'src/app/__Model/amc';
import { client } from 'src/app/__Model/__clientMst';
@Component({
  selector: 'app-trxn-rpt',
  templateUrl: './trxn-rpt.component.html',
  styleUrls: ['./trxn-rpt.component.css']
})
export class TrxnRptComponent implements OnInit {

  /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
  __isClientPending:boolean = false;

  /**
   * Holding Client Master Data after search
   */
  __clientMst:client [] = [];


  /**
   * Show / hide search list dropdown after serach input match
   */
  displayMode_forClient:string;

  /**
   *  get date Periods from JSON File Located at (assets/json/datePeriods) for populate
   *  inside the date periods dropdown
   */
  periods_type:{id:string,periods:string}[] = periods;

  /**
   * Hold transaction details after search
   */
  trxnRpt:TrxnRpt[] =[];

  /**
   * Hold column for transaction table
   */
  column:column[] = trxnClm.column;

  /**
   * Holding AMC Master Date
   */
   amcMst:amc[] = []


  /**
   * Constructor
   * @param dbIntr
   * @param utility
   */

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  /**
   * Setting of multiselect dropdown
   */
  settingsforAMCDropdown = this.utility.settingsfroMultiselectDropdown('id','amc_short_name','Search AMC',1);
  settingsforSchemeDropdown = this.utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforBrnchDropdown = this.utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',1);
  settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
  settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
  settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  /**
   * END
   */

  /**
   * Form Field for search Transaction
   */
  misTrxnRpt = new FormGroup({
      periods: new FormControl(''),
      date_range: new FormControl(''),
      amc_id: new FormControl([]),
      cat_id: new FormControl([]),
      sub_cat_id:new FormControl([]),
      scheme_id: new FormControl([]),
      btn_type:new FormControl([]),
      branch_id: new FormControl([]),
      bu_type_id: new FormControl([]),
      rm_id: new FormControl([]),
      sub_brk_cd: new FormControl([]),
      euin_no: new FormControl([]),
      folio_no: new FormControl(''),
      client_id: new FormControl(''),
      client_name:new FormControl('')
  })

  ngOnInit(): void {
    // this.getTrxnRptMst();
  }
  getTrxnRptMst = () =>{
        this.dbIntr.api_call(1,'/showTransDetails',null)
        .pipe(pluck("data"))
        .subscribe((res:TrxnRpt[]) =>{
            this.trxnRpt = res;
        })
  }

  /**
   *  call API for get transaction according to search result
   */
  searchTrxnReport = () =>{

  }

  /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
  getSelectedItemsFromParent = (searchRlt:{flag:string,item:Object}) =>{
        // this.misTrxnRpt.get('client_name').reset(searchRlt.item?.client_name)
  }
}
