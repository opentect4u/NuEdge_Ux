/**
 * Flag is used for maintaining Parent Tab
 * F => Folio Master (index : 0)
 * K => KYC Report (index: 1)
 * N => Nomination Report (index: 2)
 * A => Aadhar Pan Linki Report (index: 3)
 * *******************************************
 * *******************************************
 * sub_flag is used for maintaining Sub Tab
 * IW => Investor Wise (subIndex: 0)
 * KNV => KYC Not Verified (subIndex: 1, parent Tab: KYC Report)
 * IOP => Opt-In/Opt-Out Pending (subIndex: 1, parent Tab: Nomination Report)
 * NL  =>  Not Linked (subIndex: 1, parent Tab: Aadhar Pan Link Report)
 */



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
import { IStaticRpt } from './static-rpt';
import { client } from 'src/app/__Model/__clientMst';
import { IDisclaimer } from '../PortFolio/LiveMFPortFolio/live-mf-port-folio.component';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
enum TABLE_WIDTH {
  'F' = '1258rem', //FOLIO
  'K' = '445rem', // KYC
  'A' = '350rem', // ADHAAR PAN LINK
  'N' = '367rem', // NOMINEE

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

  disclaimer:Partial<IDisclaimer> | undefined;

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

    /**
   * Setting of multiselect dropdown
   */
    settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
      'pan',
      'client_name',
      'Search Family members',
      3
    );

    family_members:client[] = [];

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

  sub_tab: Partial<ITab[]> = [];

  title: string | undefined = '';

  index: number = 0;

  subIndex: number = 0;

  flag: string | undefined = '';

  sub_flag:string | undefined = ''

  column: column[] = [];

  report_data: IStaticRpt[] = [];

  __clientMst = [];

  /** Paginate : for holding how many result tobe fetched */
  paginate: number = 1;


  __isClientPending: boolean = false;

  displayMode_forClient: string = 'none';

  filter = new FormGroup({
    is_all_client:new FormControl(false),
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
    euin_no: new FormControl([]),
    family_members: new FormControl([]),
    folio_no: new FormControl(''),
    investor_static_type: new FormControl('')
  })

  view_type: { id: string, type: string }[] = ClientType;

  constructor(private utility: UtiliService,
    private dbIntr: DbIntrService,
    @Inject(DOCUMENT) private document: Document) { console.log(this.view_type); }

  ngOnInit(): void {
    /*** get TAB Details **/
    this.setTab().then((res: ITab[]) => {
      this.tab_menu = res;
      this.filter.get('is_all_client').disable();
      // this.setTitle();
      // this.setFlag();
      // console.log(this.column);
    })
    /*** End ***/


    // this.setColumn('F').then(res =>{
    //   this.column = res;
    //   this.tble_width = TABLE_WIDTH['F'];
    // })
  }

  setTitle = () => {
    this.title = this.tab_menu[this.index].tab_name;
  }

  setFlag = () => {
    this.flag = this.tab_menu[this.index].flag;
    console.log(this.flag);
  }


  setTab = (): Promise<ITab[]> => {
    return new Promise((resolve, reject) => {
      resolve( Menu.filter(item => item.id == 7)[0].sub_menu
      .map(res => ({
          id:res.id,
          tab_name: res.title,
          flag:res.flag,
          img_src: '',
          sub_menu:res.sub_menu
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

  changeWheelSpeed(container, speedY) {
    var scrollY = 0;
    var handleScrollReset = function() {
        scrollY = container.scrollTop;
    };
    var handleMouseWheel = function(e) {
        e.preventDefault();
        scrollY += speedY * e.deltaY
        if (scrollY < 0) {
            scrollY = 0;
        } else {
            var limitY = container.scrollHeight - container.clientHeight;
            if (scrollY > limitY) {
                scrollY = limitY;
            }
        }
        container.scrollTop = scrollY;
    };

    var removed = false;
    container.addEventListener('mouseup', handleScrollReset, false);
    container.addEventListener('mousedown', handleScrollReset, false);
    container.addEventListener('mousewheel', handleMouseWheel, false);

    return function() {
        if (removed) {
            return;
        }
        container.removeEventListener('mouseup', handleScrollReset, false);
        container.removeEventListener('mousedown', handleScrollReset, false);
        container.removeEventListener('mousewheel', handleMouseWheel, false);
        removed = true;
    };
}

  ngAfterViewInit() {
    this.filter.get('is_all_client')
    .valueChanges
    .subscribe(res =>{
      this.filter.get('client_name').setValue('',{onlySelf:true,emitEvent:false});
      this.filter.get('pan_no').setValue('',{onlySelf:true,emitEvent:false});
      if(res){
          this.filter.get('client_name').disable({onlySelf:true,emitEvent:false});
          if(this.filter.value.view_type == 'F'){
            this.filter.controls.family_members.disable();
          }
        }
        else{
          this.filter.get('client_name').enable({onlySelf:true,emitEvent:false});
          if(this.filter.value.view_type == 'F'){
            this.filter.get('family_members').enable();
          }
        }
    })

    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
      this.changeWheelSpeed(el, 0.99);
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
     if(res.length > 0){
      this.disabledSubBroker(res);
      this.getRelationShipManagerMst(res, this.filter.value.brn_cd);
     }
    else{
        this.__RmMst = [];
        this.__subbrkArnMst =[];
        this.__euinMst = [];
        this.filter.get('euin_no').setValue([]);
        this.filter.get('sub_brk_cd').setValue([]);
        this.filter.get('rm_id').setValue([]);
    }
    
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
        tap(() => {
          this.__isClientPending = true;
          if(this.family_members.length > 0){
            this.getFamilymemberAccordingToFamilyHead_Id()
          }
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
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
      if(this.family_members.length > 0){
        this.getFamilymemberAccordingToFamilyHead_Id();
      }
      this.filter.get('is_all_client').reset(false, { onlySelf:true,emitEvent: false });
      this.filter.get('client_name').reset('', { emitEvent: false });
      this.filter.get('pan_no').reset('');
      if (res) {
        this.filter.get('is_all_client').enable({emitEvent:false})
        this.filter.get('client_name').enable();
        this.__clientMst = [];
      }
      else{
        this.filter.get('is_all_client').disable({emitEvent:false})
        this.filter.get('client_name').disable();
      }
    })
        /**End */
  }

  changeTabDtls = (ev) => {
    this.sub_tab = [];
    this.index = ev.index;
    this.setTitle();
    this.setFlag();
    this.filter.get('investor_static_type').setValue(ev.tabDtls.flag);
    this.setColumn(ev.tabDtls.flag).then((res: column[]) => {
      this.tble_width = TABLE_WIDTH[ev.tabDtls.flag];
      this.column = res;
    })
    this.btn_type = 'R';
    this.subIndex = 0;
    setTimeout(() => {
      this.sub_tab =  ev.tabDtls.sub_menu.map(res =>({
        id:res.id,
        tab_name: res.title,
        flag:res.flag,
        img_src: '',
      }));
      this.changeSubTab({index : this.subIndex,tabDtls:this.sub_tab.length > 0 ? this.sub_tab[this.subIndex] : null})
    }, 100);

  }

  changeSubTab = (event) =>{
      this.sub_flag = event.tabDtls?.flag;
      this.resetForm();
      this.report_data = [];
      if (this.state == 'collapsed') {
        this.toggle();
      }
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

    this.filter.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.filter.get('pan_no').reset(searchRlt.item.pan);
    // this.Rpt.get('client_id').reset(searchRlt.item.first_client_pan);
    this.__isClientPending = false;
    this.searchResultVisibilityForClient('none');
    if(this.filter.value.view_type == 'F'){
      this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
    }
  };


  /**
   *
   */
  getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
    if(id){
      this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.filter.value.view_type}`)
      .pipe(pluck('data'))
      .subscribe((res:client[]) =>{
       this.family_members = res;
       this.filter.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
      })
   }
   else{
       this.family_members = [];
       this.filter.get('family_members').setValue([]);

   }
}

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
      if (this.state == 'collapsed') {
        this.toggle();
      }
      this.getBranchMst();
    } else {
      this.resetForm();
      //this.searchTrxnReport();
      this.report_data = [];
    }
  }

  resetForm = () => {
    this.filter.patchValue({
      folio_no: '',
      folio_status: '',
      kyc_status: '',
      nominee_status: '',
      adhaar_pan_link_status: '',
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
    this.getfolioMaster(this.filter.getRawValue());
  }


  getfolioMaster = (fb) => {
    this.report_data = [];
    if(
      this.filter.getRawValue().client_name != '' || this.filter.value.folio_no != ''
      || this.filter.getRawValue().is_all_client
    ){
       if(fb.view_type == 'F' && fb.client_name && fb.family_members.length == 0){
          this.utility.showSnackbar(`Please Select family members`,2)
          return
       }
        this.toggle();
        const{family_members,...object}  = Object.assign({}, fb, {
          ...fb,
          family_members_pan:this.filter.value.view_type == 'F' ? this.utility.mapIdfromArray(fb.family_members.filter(item => item.pan),'pan') : '[]',
          family_members_name:this.filter.value.view_type == 'F' ? this.utility.mapIdfromArray(fb.family_members.filter(item => !item.pan),'client_name') : '[]',
          select_all_client:this.filter.getRawValue().is_all_client,
          brn_cd: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.brn_cd, 'id') : '[]',
          bu_type_id: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.bu_type_id, 'bu_code') : '[]',
          euin_no: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.euin_no, 'euin_no') : '[]',
          rm_id: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.rm_id, 'euin_no') : '[]',
          sub_brk_cd: this.btn_type == 'A' ? this.utility.mapIdfromArray(fb.sub_brk_cd, 'code') : '[]',
          kyc_status: this.flag == 'K' ? (this.sub_flag == 'IW' ? fb.kyc_status : 'N') : (this.flag == 'A' ? fb.kyc_status : ''),
          nominee_status: this.flag == 'N' ? (this.sub_flag == 'IW' ? fb.nominee_status : 'Pending') : '',
          adhaar_pan_link_status: this.flag == 'A' ? (this.sub_flag == 'IW' ? fb.adhaar_pan_link_status : 'N') : ''
        })
      console.log(object);
      // return;
      this.dbIntr
        .api_call(1, '/showFolioDetails', this.utility.convertFormData(object))
        .pipe(pluck('data'))
        .subscribe((res:Partial<{data:IStaticRpt[],disclaimer:Partial<IDisclaimer>}>) => {
          this.disclaimer =res.disclaimer;
          this.report_data = res.data;
        });
    }
    else{
      console.log(`ERRRO`);
      this.utility.showSnackbar('Please either select client or enter folio no',0);
    }

  };

  exportExcel = () =>{

    let dt = [];
    if(this.index == 0){
        this.report_data.forEach((el:any,index) =>{
          dt.push([
            (index + 1),
            el.bu_type,
            el.branch_name,
            el.rm_name,
            el.sub_brk_cd,
            el.euin_no,
            el.folio_no,
            el.family,
            el.first_client_name,
            el.cat_name,
            el.subcat_name,
            `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
            el.add_1,
            el.add_2,
            el.add_3,
            el.city,
            el.state,
            el.pincode,
            el.city_type,
            el.mode_of_holding,
            el.pan,
            el.ckyc_no_1st,
            el.dob,
            el.tax_status,
            el.occupation_des,
            el.mobile,
            el.email,
            el.joint_name_1,
            el.pan_2_holder,
            el.ckyc_no_2nd,
            el.dob_2nd_holder,
            el.tax_status_2nd_holder,
            el.occupation_des_2nd_holder,
            el.mobile_2nd_holder,
            el.email_2nd_holder,
            el.joint_name_2,
            el.pan_3rd_holder,
            el.ckyc_no_3rd,
            el.dob_3rd_holder,
            el.tax_status_3rd_holder,
            el.occupation_des_3rd_holder,
            el.mobile_3rd_holder,
            el.email_3rd_holder,
            el.guardian_name,
            el.guardian_pan,
            el.guardian_ckyc_no,
            el.guardian_dob,
            el.guardian_tax_status,
            el.guardian_occu_des,
            el.guardian_mobile,
            el.guardian_email,
            el.guardian_relation,
            el.pa_link_ststus_1st,
            el.pa_link_ststus_2nd,
            el.pa_link_ststus_3rd,
            el.guardian_pa_link_ststus,
            el.kyc_status_1st,
            el.kyc_status_2nd,
            el.kyc_status_3rd,
            el.guardian_kyc_status,
            el.bank_name,
            el.bank_acc_no,
            el.acc_type,
            el.bank_ifsc,
            el.bank_micr,
            el.bank_branch,
            el.nom_optout_status,
            el.nom_name_1,
            el.nom_relation_1,
            el.nom_per_1,
            el.nom_name_2,
            el.nom_relation_2,
            el.nom_per_2,
            el.nom_name_3,
            el.nom_relation_3,
            el.nom_per_3,
            el.folio_date,
            el.folio_balance,
            el.folio_status
          ])
        }) 
    }
    else if(this.index == 1){
      this.report_data.forEach((el:any,index) =>{
        dt.push([
          (index + 1),
          el.bu_type,
          el.branch_name,
          el.rm_name,
          el.sub_brk_cd,
          el.euin_no,
          el.folio_no,
          el.first_client_name,
          el.cat_name,
          el.subcat_name,
          `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
          el.mode_of_holding,
          el.pan,
          el.ckyc_no_1st,
          el.joint_name_1,
          el.pan_2_holder,
          el.ckyc_no_2nd,
          el.joint_name_2,
          el.pan_3rd_holder,
          el.ckyc_no_3rd,
          el.guardian_pan,
          el.guardian_ckyc_no,
          el.kyc_status_1st,
          el.kyc_status_2nd,
          el.kyc_status_3rd,
          el.guardian_kyc_status,
          el.folio_date,
          el.folio_balance,
          el.folio_status
        ])
      }) 
    }
    else if(this.index == 2){
      this.report_data.forEach((el:any,index) =>{
        dt.push([
          (index + 1),
          el.bu_type,
          el.branch_name,
          el.rm_name,
          el.sub_brk_cd,
          el.euin_no,
          el.folio_no,
          el.first_client_name,
          el.cat_name,
          el.subcat_name,
          `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
          el.nom_optout_status,
          el.nom_name_1,
          el.nom_relation_1,
          el.nom_per_1,
          el.nom_name_2,
          el.nom_relation_2,
          el.nom_per_2,
          el.nom_name_3,
          el.nom_relation_3,
          el.nom_per_3,
          el.folio_date,
          el.folio_balance,
          el.folio_status
        ])
      }) 
    }
    else{
      this.report_data.forEach((el:any,index) =>{
        dt.push([
          (index + 1),
          el.bu_type,
          el.branch_name,
          el.rm_name,
          el.sub_brk_cd,
          el.euin_no,
          el.folio_no,
          el.family,
          el.first_client_name,
          el.cat_name,
          el.subcat_name,
          `${el.scheme_name}-${el.plan_name}-${el.option_name}`,
          el.pan,
          el.guardian_pan,
          el.pa_link_ststus_1st,
          el.pa_link_ststus_2nd,
          el.pa_link_ststus_3rd,
          el.guardian_pa_link_ststus,
          el.kyc_status_1st,
          el.kyc_status_2nd,
          el.kyc_status_3rd,
          el.guardian_kyc_status,
          el.folio_date,
          el.folio_balance,
          el.folio_status
        ])
      })
    }
    this.handleExport(dt)
  }


  handleExport = (dt) =>{
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('REPORT',
      {
        views:[
          {state: 'frozen', xSplit: 0, ySplit: 1}
        ]
      }
    );
    const column = this.column.map(el => el.header);
    let headerRow = worksheet.addRow(column);
    headerRow.eachCell((cell) =>{
      cell.fill={
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:'FFFFFF00'},
        bgColor:{argb:'FF0000FF'},
      }
    })
    worksheet.addRows(dt);
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet
    let disclaimerRow = worksheet.addRow([
      `Disclaimer - ${this.disclaimer?.dis_des}`
    ]);
    disclaimerRow.eachCell((cell) =>{
     cell.font = {
        color :{argb:this.disclaimer?.color_code}
     }
     cell.font.size= this.disclaimer?.font_size
    })
    worksheet.mergeCells((currentRowIdx + 1), 1, (currentRowIdx + 1), endColumnIdx,'REPORT');
    workbook.xlsx.writeBuffer().then((data)=>{
      let blob = new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      saveAs(blob, `${this.title}.xlsx`);
    })
  }

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
    const euin_no = this.__euinMst.map(el => el.euin_no);
    const dt = this.filter.get('euin_no').value.filter(el => euin_no.includes( el.euin_no));
    this.filter.get('euin_no').setValue(dt,{emitEvent:false});
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
          const code = this.__subbrkArnMst.map(el => el.code);
          const dt = this.filter.get('sub_brk_cd').value.filter(el => code.includes( el.code));
          this.filter.get('sub_brk_cd').setValue(dt,{emitEvent:false});
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
          const bu_code = this.__bu_type.map(el => el.bu_code);
          const dt = this.filter.get('bu_type_id').value.filter(el => bu_code.includes( el.bu_code));
          this.filter.get('bu_type_id').setValue(dt,{emitEvent:false});
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
          const euin_no = this.__RmMst.map(el => el.euin_no);
          const dt = this.filter.get('rm_id').value.filter(el => euin_no.includes( el.euin_no));
          this.filter.get('rm_id').setValue(dt,{emitEvent:false});
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
  flag: string,
  sub_menu:any[]
}




export class Folio_KYC_Adhaar_pan_nominee_Column {
  static column: column[] = [
    { field: 'sl_no', header: 'Sl No', width: '6rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'bu_type', header: 'Business Type', width: '10rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'branch_name', header: 'Branch', width: '10rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'rm_name', header: 'RM', width: '16rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'sub_brk_code', header: 'Sub Broker Code', width: '16rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'euin_no', header: 'EUIN', width: '8rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'folio_no', header: 'Folio', width: '11rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'family', header: 'Family', width: '16rem', isVisible: ['F'] },
    { field: 'first_client_name', header: 'Investor Name', width: '28rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'cat_name', header: 'Category', width: '11rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'subcat_name', header: 'Sub Category', width: '20rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'scheme_name', header: 'Scheme', width: '40rem', isVisible: ['F', 'K', 'A', 'N'] },
    { field: 'add_1', header: 'Address-1', width: '25rem', isVisible: ['F'] },
    { field: 'add_2', header: 'Address-2', width: '25rem', isVisible: ['F'] },
    { field: 'add_3', header: 'Address-3', width: '25rem', isVisible: ['F'] },
    { field: 'city', header: 'City', width: '15rem', isVisible: ['F'] },
    { field: 'state', header: 'State', width: '15rem', isVisible: ['F'] },
    { field: 'pincode', header: 'Pincode', width: '9rem', isVisible: ['F'] },
    { field: 'city_type', header: 'City Type', width: '8rem', isVisible: ['F'] },
    { field: 'mode_of_holding', header: 'Mode Of Holding', width: '15rem', isVisible: ['F', 'K'] },
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
      header: '1st Holder Occupation',
      width: '15rem', isVisible: ['F']
    },
    { field: 'mobile', header: '1st Holder Phone', width: '12rem', isVisible: ['F'] },
    { field: 'email', header: '1st Holder Email', width: '28rem', isVisible: ['F'] },
    { field: 'joint_name_1', header: '2nd Holder Name', width: '28rem', isVisible: ['F', 'K'] },

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
      header: '2nd Holder Occupation',
      width: '15rem', isVisible: ['F']
    },
    { field: 'mobile_2nd_holder', header: '2nd Holder Phone', width: '12rem', isVisible: ['F'] },
    {
      field: 'email_2nd_holder',
      header: '2nd Holder Email',
      width: '28rem', isVisible: ['F']
    },
    { field: 'joint_name_2', header: '3rd Holder Name', width: '28rem', isVisible: ['F', 'K'] },
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
      header: '3rd Holder Occupation',
      width: '15rem', isVisible: ['F']
    },
    { field: 'mobile_3rd_holder', header: '3rd Holder Phone', width: '12rem', isVisible: ['F'] },
    { field: 'email_3rd_holder', header: '3rd Holder Email', width: '28rem', isVisible: ['F'] },

    { field: 'guardian_name', header: 'Guardian Name', width: '28rem', isVisible: ['F'] },
    { field: 'guardian_pan', header: 'Guardian PAN', width: '12rem', isVisible: ['F', 'K', 'A'] },
    { field: 'guardian_ckyc_no', header: 'Guardian CKYC', width: '15rem', isVisible: ['F', 'K'] },
    { field: 'guardian_dob', header: 'Guardian DOB', width: '10rem', isVisible: ['F'] },
    { field: 'guardian_tax_status', header: 'Guardian Tax Status', width: '15rem', isVisible: ['F'] },
    {
      field: 'guardian_occu_des',
      header: 'Guardian Occupation',
      width: '15rem', isVisible: ['F']
    },
    { field: 'guardian_mobile', header: 'Guardian Phone', width: '15rem', isVisible: ['F'] },
    { field: 'guardian_email', header: 'Guardian Email', width: '20rem', isVisible: ['F'] },
    {
      field: 'guardian_relation',
      header: 'Guardian Relationship',
      width: '15rem', isVisible: ['F']
    },
    {
      field: 'pa_link_ststus_1st',
      header: '1st Holder PAN Aadhaar Link',
      width: '15rem', isVisible: ['F', 'A']
    },
    {
      field: 'pa_link_ststus_2nd',
      header: '2nd Holder PAN Aadhaar Link',
      width: '15rem', isVisible: ['F', 'A']
    },
    {
      field: 'pa_link_ststus_3rd',
      header: '3rd Holder PAN Aadhaar Link',
      width: '15rem', isVisible: ['F', 'A']
    },
    {
      field: 'guardian_pa_link_ststus',
      header: 'Guardian PAN Adhaar Link',
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
      header: 'Guardian KYC Status',
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
      header: '1st Nominee Relationship',
      width: '15rem', isVisible: ['F', 'N']
    },
    {
      field: 'nom_per_1',
      header: '% of 1st Nominee',
      width: '10rem', isVisible: ['F', 'N']
    },
    { field: 'nom_name_2', header: '2nd Nominee', width: '28rem', isVisible: ['F', 'N'] },
    //{ field: 'nom_pan_2', header: '2nd Nominee PAN', width: '12rem' },
    {
      field: 'nom_relation_2',
      header: '2nd Nominee Relationship',
      width: '15rem', isVisible: ['F', 'N']
    },
    {
      field: 'nom_per_2',
      header: '% of 2nd Nominee',
      width: '10rem', isVisible: ['F', 'N']
    },
    { field: 'nom_name_3', header: '3rd Nominee', width: '28rem', isVisible: ['F', 'N'] },
    //{ field: 'nom_pan_3', header: '3rd Nominee PAN', width: '12rem', isVisible: ['F'] },
    {
      field: 'nom_relation_3',
      header: '3rd Nominee Relationship',
      width: '15rem', isVisible: ['F', 'N']
    },
    {
      field: 'nom_per_3',
      header: '% of 3rd Nominee',
      width: '10rem', isVisible: ['F', 'N']
    },
    {
      field: 'folio_date',
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
