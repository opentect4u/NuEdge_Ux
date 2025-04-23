import { Component, OnInit } from '@angular/core';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { FormControl, FormGroup } from '@angular/forms';
import periods from '../../../../../../../../assets/json/datePeriods.json';
import clientType from '../../../../../../../../assets/json/view_type.json';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { scheme } from 'src/app/__Model/__schemeMst';
import { dates } from 'src/app/__Utility/disabledt';
import { IAumFooterModel } from '../component/aum.model';
import { column } from 'src/app/__Model/tblClmns';
import { AumClientColumn } from '../aum-client/aum-client.component';

@Component({
  selector: 'app-aum-top-client',
  templateUrl: './aum-top-client.component.html',
  styleUrls: ['./aum-top-client.component.css']
})
export class AumTopClientComponent implements OnInit {

  selectNumber:number[] = [];

  __formDate:string;

    aum_client_Column:column[] = AumClientColumn.column;
  
    aum_client_sub_column:column[] = AumClientColumn.sub_column;

    /*** Table Footer Details */
    footerDT:Partial<IAumFooterModel>;
    /*** End */

  /**
   * hold Button Type Advance Filter / Normal Filter
  */
  btn_type: 'R' | 'A' = 'R';

  /**
   * Holding Advance Filter / Normal Filter
  */
  selectBtn = filterOpt;

    /**
   * Holding Branch Master Data
   */
    __branchMst: any = [];

  isLoaderShown:boolean | undefined = false;



  duplicateDt = [];

  md_aum_client = [];


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

  client_type= clientType;

  /**
   * Show / hide Loader Spinner while typing inside Client Details Input Field
   */
  __isClientPending: boolean = false;

  /**
   * Holding Relationship Manager
   */
  __RmMst: any = [];


    /**
   * Holding Sub Broker Master Data
   */
    __euinMst: any = [];

    /**
   * Holding Buisness type
   */
    __bu_type: any = [];

  /**
   * Holding Client Master Data after search
   */
  __clientMst: client[] = [];

  /**
   * Show / hide search list dropdown after serach input match
   */
  displayMode_forClient: string;
  
  family_members:client[] = [];

  /**
   * Holding Sub Broker Master Data
   */
  __subbrkArnMst: any = [];

  /**
   * Setting of multiselect dropdown
  */
   settingsforFamilyMembers = this.utility.settingsfroMultiselectDropdown(
    'pan',
    'client_name',
    'Search Family members',
    1
  );

  settingsforAMCDropdown = this.utility.settingsfroMultiselectDropdown(
    'id',
    'amc_short_name',
    'Search AMC',
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

    misTrxnRpt = new FormGroup({
      date_periods: new FormControl(''),
      date_range: new FormControl(''),
      view_type:new FormControl(''),
      number:new FormControl(''),
      amc_id: new FormControl([], { updateOn: 'change' }),
      cat_id: new FormControl([], { updateOn: 'change' }),
      sub_cat_id: new FormControl([], { updateOn: 'change' }),
      scheme_id: new FormControl([]),
      brn_cd: new FormControl([], { updateOn: 'change' }),
      bu_type_id: new FormControl([], { updateOn: 'change' }),
      rm_id: new FormControl([], { updateOn: 'change' }),
      sub_brk_cd: new FormControl([], { updateOn: 'change' }),
      euin_no: new FormControl([]),
      pan_no:new FormControl(''),
      client_name: new FormControl(''),
      family_members: new FormControl([])
    });
  

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    const range = Array.from({ length: 100 }, (_, i) => i + 1);
    this.selectNumber = range;
  }

  onItemClick = (ev) => {
    if (ev.option.value == 'A') {
      this.getBranchMst();
    } else {
         this.misTrxnRpt.patchValue({
          amc_id:[],
          date_range:'',
          date_periods:'M',
          view_type:'',
          pan_no:'',
          number:''
         });
         this.misTrxnRpt.get('brn_cd').setValue([],{emitEvent:true});
         this.__subbrkArnMst = [];
         this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
         this.misTrxnRpt.controls['euin_no'].setValue([]);
         this.misTrxnRpt.controls['client_name'].setValue('',{emitEvent:false});
         this.searchTrxnReport();
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

  searchTrxnReport = () => {}


  /**
   * event trigger after select particular result from search list
   * @param searchRlt
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
    this.misTrxnRpt.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.misTrxnRpt.get('pan_no').reset(searchRlt.item.pan);
    this.searchResultVisibilityForClient('none');
    if(this.misTrxnRpt.value.view_type == 'F'){
      this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
    }
  };

  /**
 *  evnt trigger on search particular client & after select client
 * @param display_mode
 */
  searchResultVisibilityForClient = (display_mode: string) => {
    // console.log(display_mode);
    this.displayMode_forClient = display_mode;
  };


  /**
    *
  */
  getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
            if(id){
              this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=${this.misTrxnRpt.value.view_type}`)
              .pipe(pluck('data'))
              .subscribe((res:client[]) =>{
                console.log(res);
                this.family_members = res;
                this.misTrxnRpt.get('family_members').setValue(res.map((item:client) => ({pan:item.pan,client_name:item.client_name})))
              })
            }
            else{
                this.family_members = [];
                this.misTrxnRpt.get('family_members').setValue([]);

            }
  }

  loadInvestorOnScrollToEnd = (ev) =>{
    // if(this.misTrxnRpt.value.client_name == ''){
    //   this.paginate+=1;
    // this.getClientMst(this.misTrxnRpt.value.view_type,this.paginate);
    // }
  }

  onAmcDeSelect = (ev) =>{
    //  this.misTrxnRpt.get('amc_id').setValue(this.misTrxnRpt.value.amc_id.filter(item => item.id != ev.id));
    }
    onCatDeSelect = (ev) =>{
      // this.misTrxnRpt.get('cat_id').setValue(this.misTrxnRpt.value.cat_id.filter(item => item.id != ev.id));
    }
    onSubCatDeSelect = (ev) =>{
      // this.misTrxnRpt.get('sub_cat_id').setValue(this.misTrxnRpt.value.sub_cat_id.filter(item => item.id != ev.id));
    }
    onTrxnTypeDeSelect = (ev) =>{
      // this.misTrxnRpt.get('trxn_type_id').setValue(this.misTrxnRpt.value.trxn_type_id.filter(item => item.id != ev.id));
    }
    onbuTypeDeSelect = (ev) =>{
      // this.misTrxnRpt.get('bu_type_id').setValue(this.misTrxnRpt.value.bu_type_id.filter(item => item.bu_code != ev.bu_code));
    }
    onbrnCdDeSelect = (ev) =>{
      // this.misTrxnRpt.get('brn_cd').setValue(this.misTrxnRpt.value.brn_cd.filter(item => item.id != ev.id));
    }
    onRmDeSelect = (ev) =>{
      // this.misTrxnRpt.get('rm_id').setValue(this.misTrxnRpt.value.rm_id.filter(item => item.euin_no != ev.euin_no));
    }
    onSubBrkDeSelect = (ev) =>{
      // this.misTrxnRpt.get('sub_brk_cd').setValue(this.misTrxnRpt.value.sub_brk_cd.filter(item => item.code != ev.code));
  
    }
  ngAfterViewInit() {


    // this.hideCard('none');
    // this.primeTbl.tableHeaderViewChild.nativeElement.style.position = 'sticky!important';

   /**
    *  Event Trigger on change on Date Periods
    */
   this.misTrxnRpt.controls['date_periods'].valueChanges.subscribe((res) => {
    if(res){
      this.misTrxnRpt.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
    }
    else{
      this.misTrxnRpt.controls['date_range'].setValue('');
      this.misTrxnRpt.controls['date_range'].disable();
      return;
    }

    if (res && res != 'R') {
      this.misTrxnRpt.controls['date_range'].disable();
    } else {
      this.misTrxnRpt.controls['date_range'].enable();
    }
  });


  this.misTrxnRpt.controls['date_range'].valueChanges.subscribe((res) => {
    if(res){
        this.maxDate = dates.calculatMaximumDates('R',6,new Date(res[0]));
      }
      else{
        this.maxDate = dates.calculateDates('T');
      }
  })

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
     * Event Trigger after change Branch
     */
    this.misTrxnRpt.controls['brn_cd'].valueChanges.subscribe((res) => {
      console.log(res);
      this.getBusinessTypeMst(res);
    });

    /**
     * Event Trigger after Business Type
     */
    this.misTrxnRpt.controls['bu_type_id'].valueChanges.subscribe((res) => {
      console.log(res);
      if(res.length > 0){
        this.disabledSubBroker(res);
        this.getRelationShipManagerMst(res, this.misTrxnRpt.value.brn_cd);
      }
      else{
          this.__RmMst = [];
          this.__subbrkArnMst =[];
          this.__euinMst = [];
          this.misTrxnRpt.get('euin_no').setValue([]);
          this.misTrxnRpt.get('sub_brk_cd').setValue([]);
          this.misTrxnRpt.get('rm_id').setValue([]);
      }
      
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
      console.log(res);
      this.setEuinDropdown(res, this.misTrxnRpt.value.rm_id);
    });

      /** Investor Change */
      this.misTrxnRpt.controls['client_name'].valueChanges
      .pipe(
        tap(()=> this.misTrxnRpt.get('pan_no').setValue('')),
        tap(() => {
          this.__isClientPending = true
          if(this.family_members.length > 0){
            this.getFamilymemberAccordingToFamilyHead_Id();
          }
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',
          dt+'&view_type='+this.misTrxnRpt.value.view_type
          ) : []

        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          // console.log(value);
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

      /**view_type Change*/
      this.misTrxnRpt.controls['view_type'].valueChanges.subscribe(res =>{
          if(this.family_members.length > 0){
            this.getFamilymemberAccordingToFamilyHead_Id();
          }
          this.misTrxnRpt.get('client_name').reset('',{emitEvent:false});
          this.misTrxnRpt.get('pan_no').reset('');
            if(res){
              // this.paginate = 1;
              this.__clientMst = [];
              this.misTrxnRpt.get('client_name').enable();
              // this.getClientMst(res,this.paginate);
            }
            else{
              this.misTrxnRpt.get('client_name').disable();
            }
      })
      /**End */

  }
 
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
        this.misTrxnRpt.get('scheme_id').reset([]);
      }
    };


    disabledSubBroker(bu_type_ids) {
      if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
        this.misTrxnRpt.controls['sub_brk_cd'].enable();
      } else {
        this.misTrxnRpt.controls['sub_brk_cd'].disable();
        this.misTrxnRpt.controls['sub_brk_cd'].setValue([],{emitEvent:false});
        this.__subbrkArnMst = [];
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
            const dt = this.misTrxnRpt.get('sub_brk_cd').value.filter(el => code.includes( el.code));
            this.misTrxnRpt.get('sub_brk_cd').setValue(dt,{emitEvent:false});
          });
      } else {
        this.__subbrkArnMst = [];
        this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
      }
    }

    getBusinessTypeMst(brn_cd) {
      console.log(brn_cd)
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
            const dt = this.misTrxnRpt.get('bu_type_id').value.filter(el => bu_code.includes( el.bu_code));
            this.misTrxnRpt.get('bu_type_id').setValue(dt,{emitEvent:false});
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
            const euin_no = this.__RmMst.map(el => el.euin_no);
            const dt = this.misTrxnRpt.get('rm_id').value.filter(el => euin_no.includes( el.euin_no));
            this.misTrxnRpt.get('rm_id').setValue(dt,{emitEvent:false});
          });
      } else {
        this.__RmMst = [];
        this.misTrxnRpt.controls['rm_id'].setValue([],{emitEvent:true});
      }
    }

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
      // console.log(this.__euinMst)
      // const euin_no = this.__euinMst.map(el => el.euin_no);
      // const dt =  this.misTrxnRpt.controls['euin_no'].value;
      // this.misTrxnRpt.get('euin_no').setValue(dt)
      const euin_no = this.__euinMst.map(el => el.euin_no);
      const dt = this.misTrxnRpt.get('euin_no').value.filter(el => euin_no.includes( el.euin_no));
      this.misTrxnRpt.get('euin_no').setValue(dt,{emitEvent:false});
    };
}
