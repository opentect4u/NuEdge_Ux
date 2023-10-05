import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import Menu from '../../../../../../assets/json/Product/MF/homeMenus.json';
import { column } from '../../../../../__Model/tblClmns';
import { Table } from 'primeng/table';
import { UtiliService } from '../../../../../__Services/utils.service';
import  ClientType  from '../../../../../../assets/json//view_type.json';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DbIntrService } from '../../../../../__Services/dbIntr.service';
import filterOpt from '../../../../../../assets/json/filterOption.json';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
enum TABLE_WIDTH {
  'F' = '900rem',
  'K' = '350rem',
  'A' = '300rem',
  'N' = '200rem',

}

@Component({
  selector: 'app-investor-static-report',
  templateUrl: './investor-static-report.component.html',
  styleUrls: ['./investor-static-report.component.css'],
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
export class InvestorStaticReportComponent implements OnInit {


  state: string | undefined = 'expanded';

  /*** Settings for Advance Filter Options */
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

  /*** END****/


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

  @ViewChild('primeTbl') primeTbl: Table;

  filter_type = filterOpt;

  btn_type: string = 'R';

  tble_width: string | undefined = '';

  tab_menu: ITab[] = [];

  title: string | undefined = '';

  index: number = 0;

  flag: string | undefined = '';

  column: column[] = [];

  report_data: any = [];

  __clientMst = [];

  /** Paginate : for holding how many result tobe fetched */
  paginate: number = 1;


  __isClientPending: boolean = false;

  displayMode_forClient: string = 'none';

  filter = new FormGroup({
    view_type: new FormControl(''),
    client_name: new FormControl(''),
    pan_no: new FormControl(''),
    folio_status: new FormControl(''),
    kyc_status: new FormControl(''),
    nominee_status: new FormControl(''),
    adhaar_pan_link_status: new FormControl(''),
    brn_cd: new FormControl([], { updateOn: 'blur' }),
    bu_type_id: new FormControl([], { updateOn: 'blur' }),
    rm_id: new FormControl([], { updateOn: 'blur' }),
    sub_brk_cd: new FormControl([], { updateOn: 'blur' }),
    euin_no: new FormControl([])
  })

  view_type: { id: string, type: string }[] = ClientType;

  constructor(private utility: UtiliService,
    private dbIntr: DbIntrService,
    @Inject(DOCUMENT) private document: Document) { console.log(this.view_type); }

  ngOnInit(): void {
    /*** get TAB Details **/
    this.setTab().then((res: ITab[]) => {
      this.tab_menu = res;
      this.setTitle();
      this.setFlag();
    })
    /*** End ***/
  }

  setTitle = () => {
    this.title = this.tab_menu[this.index].tab_name;
  }

  setFlag = () => {
    this.flag = this.tab_menu[this.index].flag;
  }

  setTab = (): Promise<ITab[]> => {
    return new Promise((resolve, reject) => {
      resolve( Menu.filter(item => item.id == 7)[0].sub_menu
      .map(res => ({
          id:res.id,
          tab_name: res.title,
          flag:res.flag,
          img_src: ''
        }))
      ),
        reject([])
    })
    
  }

  setColumn = (flag:string):Promise<column[]> => {
    return new Promise((resolve, reject) => {
      resolve(
        Folio_KYC_Adhaar_pan_nominee_Column.column.filter((item: column) => item.isVisible.includes(flag))
      ),
       reject([])
    })
  }

  ngAfterViewInit() {


    /**
    * Event Trigger after change Branch
    */
    this.filter.controls['brn_cd'].valueChanges.subscribe((res) => {
      this.getBusinessTypeMst(res);
    });

    /**
     * Event Trigger after Business Type
     */
    this.filter.controls['bu_type_id'].valueChanges.subscribe((res) => {
      this.disabledSubBroker(res);
      this.getRelationShipManagerMst(res, this.filter.value.brn_cd);
    });

    /**
     * Event Trigger after Rlationship Manager
     */
    this.filter.controls['rm_id'].valueChanges.subscribe((res) => {
      if (
        this.filter.value.bu_type_id.findIndex(
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
    this.filter.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
      this.setEuinDropdown(res, this.filter.value.rm_id);
    });


    /** Investor Change */
    this.filter.controls['client_name'].valueChanges
      .pipe(
        tap(() => this.filter.get('pan_no').setValue('')),
        tap(() => (this.__isClientPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchClient',
            dt + '&view_type=' + this.filter.value.view_type
          ) : []

        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__clientMst = value;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
        },
        complete: () => { },
        error: (err) => {
          this.__isClientPending = false;
        },
      });

    /** End */

    /**view_type Change*/
    this.filter.controls['view_type'].valueChanges.subscribe(res => {
      if (res) {
        this.paginate = 1;
        this.__clientMst = [];
        this.filter.get('client_name').reset('', { emitEvent: false });
        this.filter.get('pan_no').reset('');
        this.getClientMst(res, this.paginate);
      }
    })
        /**End */
  }

  changeTabDtls = (ev) => {
    this.index = ev.index;
    this.setTitle();
    this.setFlag();
    this.setColumn(ev.tabDtls.flag).then((res: column[]) => {
      this.tble_width = TABLE_WIDTH[ev.tabDtls.flag];
      this.column = res;
    })
    this.btn_type = 'R';
    this.resetForm();
  }

  filterGlobal = (ev) => {
    let value = ev.target.value;
    this.primeTbl.filterGlobal(value, 'contains');

  }

  getColumns = () => {
    return this.utility.getColumns(this.column);
  }

  /**
  * event trigger after select particular result from search list
  * @param searchRlt
  */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {

    this.filter.get('client_name').reset(searchRlt.item.first_client_name, { emitEvent: false });
    this.filter.get('pan_no').reset(searchRlt.item.first_client_pan);
    // this.Rpt.get('client_id').reset(searchRlt.item.first_client_pan);

    this.searchResultVisibilityForClient('none');
  };

  /**
  *  evnt trigger on search particular client & after select client
  * @param display_mode
  */
  searchResultVisibilityForClient = (display_mode: string) => {
    this.displayMode_forClient = display_mode;
  };

  loadInvestorOnScrollToEnd = (ev) => {
    console.log(this.filter.value.client_name);
    if (this.filter.value.client_name == '') {
      // console.log('adasd')
      this.paginate += 1;
      this.getClientMst(this.filter.value.view_type, this.paginate);
    }
  }

  /**
   * Get Client Master Data
   */
  getClientMst = (view_type: string, paginate: number | undefined = 1) => {
    if (view_type) {
      this.dbIntr.api_call(0,
        '/searchClient',
        'view_type=' + view_type
        + '&page=' + paginate
      ).pipe(pluck("data")).subscribe((res: any) => {
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

  onItemClick = (ev) => {
    if (ev.option.value == 'A') {
      this.getBranchMst();
    } else {
      this.resetForm();
      //this.searchTrxnReport();
    }
  }

  resetForm = () => {
    this.filter.patchValue({
      folio_no: '',
      folio_status: 'A',
      kyc_status: 'A',
      nominee_status: 'A',
      adhaar_pan_link_status: 'A',
      view_type: '',
      pan_no: ''
    });
    this.paginate = 1;
    this.filter.get('brn_cd').setValue([], { emitEvent: true });
    this.__subbrkArnMst = [];
    this.filter.controls['sub_brk_cd'].setValue([]);
    this.filter.controls['euin_no'].setValue([]);
    this.filter.controls['client_name'].setValue('', { emitEvent: false });
  }

  searchInvestorReport = () => {
    this.toggle();
    this.getfolioMaster(this.filter.value);
  }


  getfolioMaster = (fb) => {
    console.log(fb);
    let object = Object.assign({}, fb, {
      ...fb,
      brn_cd: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.brn_cd, 'id') : '[]',
      bu_type_id: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.bu_type_id, 'bu_code') : '[]',
      euin_no: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.euin_no, 'euin_no') : '[]',
      rm_id: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.rm_id, 'euin_no') : '[]',
      sub_brk_cd: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.sub_brk_cd, 'code') : '[]',
      kyc_status: (this.flag == 'K' || this.flag == 'A') ? fb.kyc_status : '',
      nominee_status: (this.flag == 'N') ? fb.nominee_status : '',
      adhaar_pan_link_status: (this.flag == 'A') ? fb.adhaar_pan_link_status : ''
    })
    this.dbIntr
      .api_call(1, '/showFolioDetails', this.utility.convertFormData(object))
      .pipe(pluck('data'))
      .subscribe(res => {
        this.report_data = res;
      });
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
      this.filter.controls['sub_brk_cd'].enable();
    } else {
      this.filter.controls['sub_brk_cd'].disable();
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
      this.filter.controls['sub_brk_cd'].setValue([]);
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
      this.filter.controls['bu_type_id'].setValue([], { emitEvent: true });
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
      this.filter.controls['rm_id'].setValue([], { emitEvent: true });
    }
  }

  toggle = () => {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
}

export interface ITab {
  tab_name: string,
  id: number,
  img_src: string,
  flag: string
}




export class Folio_KYC_Adhaar_pan_nominee_Column {
  static column: column[] = [
    { field: 'sl_no', header: 'Sl No', width: '6rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'bu_type', header: 'Business Type', width: '10rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'brnach_name', header: 'Branch', width: '10rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'rm_name', header: 'RM', width: '16rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'sub_brk_code', header: 'Sub Broker Code', width: '16rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'euin_no', header: 'Euin', width: '8rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'folio_no', header: 'Folio', width: '11rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'family', header: 'Family', width: '16rem', isVisible: ['F'] },
    { field: 'first_client_name', header: 'Investor Name', width: '16rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'cat_name', header: 'Category', width: '11rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'subcat_name', header: 'Sub Category', width: '20rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'scheme_name', header: 'Scheme', width: '28rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'add_1', header: 'Address1', width: '25rem', isVisible: ['F'] },
    { field: 'add_2', header: 'Address2', width: '25rem', isVisible: ['F'] },
    { field: 'add_3', header: 'Address3', width: '25rem', isVisible: ['F'] },
    { field: 'city', header: 'City', width: '15rem', isVisible: ['F'] },
    { field: 'state', header: 'State', width: '15rem', isVisible: ['F'] },
    { field: 'pincode', header: 'Pincode', width: '9rem', isVisible: ['F'] },
    { field: 'city_type', header: 'City Type', width: '8rem', isVisible: ['F'] },
    { field: 'mode_of_holding', header: 'Mode Of Holding', width: '10rem', isVisible: ['F', 'K'] },
    { field: 'pan', header: '1st Holder PAN', width: '12rem', isVisible: ['F', 'K', 'A'] },
    {
      field: 'ckyc_no_1st',
      header: '1st Holder CKYC',
      width: '15rem',
      isVisible: ['F', 'K']
    },
    { field: 'dob', header: '1st Holder DOB', width: '12rem', isVisible: ['F'] },
    {
      field: 'tax_status',
      header: '1st Holder Tax Status',
      width: '15rem',
      isVisible: ['F']
    },
    {
      field: 'occupation_des',
      header: '1st Holder Occupassion',
      width: '15rem', isVisible: ['F']
    },
    { field: 'mobile', header: '1st Holder Phone', width: '12rem', isVisible: ['F'] },
    { field: 'email', header: '1st Holder Email', width: '15rem', isVisible: ['F'] },

    { field: 'pan_2_holder', header: '2nd Holder PAN', width: '12rem', isVisible: ['F', 'K'] },
    {
      field: 'ckyc_no_2nd',
      header: '2nd Holder CKYC',
      width: '15rem', isVisible: ['F', 'K']
    },
    { field: 'dob_2nd_holder', header: '2nd Holder DOB', width: '12rem', isVisible: ['F'] },
    {
      field: 'tax_status_2_holder',
      header: '2nd Holder Tax Status',
      width: '15rem', isVisible: ['F']
    },
    {
      field: 'occupation_des_2nd',
      header: '2nd Holder Occupassion',
      width: '15rem', isVisible: ['F']
    },
    { field: 'mobile_2nd_holder', header: '2nd Holder Phone', width: '12rem', isVisible: ['F'] },
    {
      field: 'email_2nd_holder',
      header: '2nd Holder Email',
      width: '15rem', isVisible: ['F']
    },

    { field: 'pan_3_holder', header: '3rd Holder PAN', width: '12rem', isVisible: ['F', 'K'] },
    {
      field: 'ckyc_no_3rd',
      header: '3rd Holder CKYC',
      width: '15rem', isVisible: ['F', 'K']
    },
    { field: 'dob_3rd_holder', header: '3rd Holder DOB', width: '12rem', isVisible: ['F'] },
    {
      field: 'tax_status_3_holder',
      header: '3rd Holder Tax Status',
      width: '15rem', isVisible: ['F']
    },
    {
      field: 'occupation_des_3rd',
      header: '3rd Holder Occupassion',
      width: '15rem', isVisible: ['F']
    },
    { field: 'mobile_3rd_holder', header: '3rd Holder Phone', width: '12rem', isVisible: ['F'] },
    { field: 'email_3rd_holder', header: '3rd Holder Email', width: '15rem', isVisible: ['F'] },

    { field: 'guardian_name', header: 'Gurdian Name', width: '15rem', isVisible: ['F'] },
    { field: 'guardian_pan', header: 'Gurdian PAN', width: '9rem', isVisible: ['F', 'K', 'A'] },
    { field: 'guardian_ckyc_no', header: 'Gurdian CKYC', width: '15rem', isVisible: ['F', 'K'] },
    { field: 'guardian_dob', header: 'Gurdian DOB', width: '10rem', isVisible: ['F'] },
    { field: 'guardian_tax_status', header: 'Gurdian Tax', width: '15rem', isVisible: ['F'] },
    {
      field: 'guardian_occu_des',
      header: 'Gurdian Occupassion',
      width: '15rem', isVisible: ['F']
    },
    { field: 'guardian_mobile', header: 'Gurdian Phone', width: '15rem', isVisible: ['F'] },
    { field: 'guardian_email', header: 'Gurdian Email', width: '20rem', isVisible: ['F'] },
    {
      field: 'guardian_relation',
      header: 'Gurdian Relation',
      width: '15rem', isVisible: ['F']
    },
    {
      field: 'pa_link_ststus_1st',
      header: '1st Holder PAN Adhare Link',
      width: '15rem', isVisible: ['F', 'A']
    },
    {
      field: 'pa_link_ststus_2nd',
      header: '2nd Holder PAN Adhare Link',
      width: '15rem', isVisible: ['F', 'A']
    },
    {
      field: 'pa_link_ststus_3rd',
      header: '3rd Holder PAN Adhare Link',
      width: '15rem', isVisible: ['F', 'A']
    },
    {
      field: 'guardian_pa_link_ststus',
      header: 'Gurdian PAN Adhaar Link',
      width: '15rem', isVisible: ['F', 'A']
    },


    {
      field: 'kyc_status_1st',
      header: '1st Holder KYC Status',
      width: '15rem', isVisible: ['F', 'K', 'A']
    },
    {
      field: 'kyc_status_2nd',
      header: '2nd Holder KYC Status',
      width: '15rem', isVisible: ['F', 'K', 'A']
    },
    {
      field: 'kyc_status_3rd',
      header: '3rd Holder KYC Status',
      width: '15rem', isVisible: ['F', 'K', 'A']
    },
    {
      field: 'guardian_kyc_status',
      header: 'Gurdian KYC Status',
      width: '15rem', isVisible: ['F', 'K', 'A']
    },
    { field: 'bank_name', header: 'Bank', width: '15rem', isVisible: ['F'] },
    { field: 'bank_acc_no', header: 'Account No', width: '15rem', isVisible: ['F'] },
    { field: 'acc_type', header: 'Account Type', width: '15rem', isVisible: ['F'] },
    { field: 'bank_ifsc', header: 'IFSC', width: '15rem', isVisible: ['F'] },
    { field: 'bank_micr', header: 'MICR', width: '15rem', isVisible: ['F'] },
    { field: 'bank_branch', header: 'Bank Branch', width: '15rem', isVisible: ['F'] },
    { field: 'nom_optout_status', header: 'Nominee Status', width: '15rem', isVisible: ['F', 'N'] },
    { field: 'nom_name_1', header: '1st Nominee', width: '15rem', isVisible: ['F', 'N'] },
    //{ field: 'nom_pan_1', header: '1st Nominee PAN', width: '12rem' },
    {
      field: 'nom_relation_1',
      header: '1st Nominee Relation',
      width: '15rem', isVisible: ['F', 'N']
    },
    {
      field: 'nom_per_1',
      header: '% of 1st Nominee',
      width: '10rem', isVisible: ['F', 'N']
    },
    { field: 'nom_name_2', header: '2nd Nominee', width: '15rem', isVisible: ['F', 'N'] },
    //{ field: 'nom_pan_2', header: '2nd Nominee PAN', width: '12rem' },
    {
      field: 'nom_relation_2',
      header: '2nd Nominee Relation',
      width: '15rem', isVisible: ['F', 'N']
    },
    {
      field: 'nom_per_2',
      header: '% of 2nd Nominee',
      width: '10rem', isVisible: ['F', 'N']
    },
    { field: 'nom_name_3', header: '3rd Nominee', width: '15rem', isVisible: ['F', 'N'] },
    //{ field: 'nom_pan_3', header: '3rd Nominee PAN', width: '12rem', isVisible: ['F'] },
    {
      field: 'nom_relation_3',
      header: '3rd Nominee Relation',
      width: '15rem', isVisible: ['F', 'N']
    },
    {
      field: 'nom_per_3',
      header: '% of 3rd Nominee',
      width: '10rem', isVisible: ['F', 'N']
    },
    {
      field: 'folio_start_date',
      header: 'Folio Start Date',
      width: '10rem',
      isVisible: ['F', 'K', 'A', 'N']
    },
    {
      field: 'folio_balance',
      header: 'Folio Balance',
      width: '10rem',
      isVisible: ['F', 'K', 'A', 'N']
    },
    {
      field: 'folio_status',
      header: 'Folio Status',
      width: '10rem',
      isVisible: ['F', 'K', 'A', 'N']
    },

  ];
}
