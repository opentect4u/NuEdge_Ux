import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
// import { menuBodyList } from 'src/app/__Model/menuBody';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IQueryStatus } from '../../Master/queryDesk/query-desk-report/query-desk-report.component';
import { FormControl, FormGroup } from '@angular/forms';
import { column } from 'src/app/__Model/tblClmns';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ModifyQueryStatusComponent } from '../modify-query-status/modify-query-status.component';
import { Table } from 'primeng/table';
import { client } from 'src/app/__Model/__clientMst';
import { Calendar } from 'primeng/calendar';
// import  menu from '../../../../../assets/json/menu.json';
import periods from '../../../../../assets/json/datePeriods.json';
import { dates } from 'src/app/__Utility/disabledt';
import filterOpt from '../../../../../assets/json/filterOption.json';
import { global } from 'src/app/__Utility/globalFunc';
import { DocViewComponent } from './dialog/doc-view.component';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/overlaypanel';

enum API{
  'MF'='/cusService/MutualFundQuery',
  'B'='/cusService/BondQuery',
  'I'='/cusService/InsuranceQuery',
  'FD'='/cusService/FixedDepositQuery'
}

@Component({
  selector: 'app-customer-service-home',
  templateUrl: './customer-service-home.component.html',
  styleUrls: ['./customer-service-home.component.css']
})



export class CustomerServiceHomeComponent implements OnInit {

  @ViewChild('op') Overlay__pannel:OverlayPanel;

  
  md_scheme = [];
  settingsforBrnchDropdown = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'brn_name',
    'Search Branch',
    1,
    90
  );
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown(
    'bu_code',
    'bu_type',
    'Search Business Type',
    1,
    90
  );
  settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown(
    'euin_no',
    'emp_name',
    'Search Relationship Manager',
    1
  );
  settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown(
    'code',
    'bro_name',
    'Search Sub Broker',
    1
  );
  settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown(
    'euin_no',
    'euin_no',
    'Search Employee',
    1
  );

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
   *  getAccess of Prime Ng Calendar
   */
  @ViewChild('dateRng') date_range:Calendar;

  /**
   * Holding Branch Master Data
   */
  __branchMst: any = [];
    /**
   * For Holding Max Date And Min Date form Prime Ng Calendar
   */
    minDate: Date;
    maxDate:Date;

    /**
   *  get date Periods from JSON File Located at (assets/json/datePeriods) for populate
   *  inside the date periods dropdown
   */
    periods_type: { id: string; periods: string }[] = periods;

  __isQuery_id_pending:boolean = false;
  md_queryId:any = [];
  displayMode_forQueryId:string;

  __isClientPending:boolean = false;
  __clientMst:Partial<client>[] = [];
  displayMode_forClient:string;



  /**
   * Holding Advance Filter / Normal Filter
   */
  selectBtn = filterOpt;
  constructor(private router:Router,
    private overlay: Overlay,
    public __utility:UtiliService,
    private __actdt: ActivatedRoute,
    private dbIntr:DbIntrService,
    private __dialog: MatDialog
  ) {
    // this.__menu = menu.filter((x: menuBodyList) => x.id == 3)[0].sub_menu;
  }
  @ViewChild('primeTbl') primeTbl :Table;

  productId:string | undefined;
  // queryId:string | undefined = this.__utility.encrypt_dtls(JSON.stringify(0));
  queryId:string | undefined =   this.__utility.EncryptText('0');

  /**
   * hold Button Type Advance Filter / Normal Filter
   */
  btn_type: 'R' | 'A' = 'R';
  query_column:column[] = [];
  customerServiceForm = new  FormGroup({
    date_periods: new FormControl(''),
    query_receive_given_thrugh: new FormControl(''),
    date_range: new FormControl(''),
    query_status_id:new FormControl(''),
    query_mode_id: new FormControl(''),
    query_id:new FormControl(''),
    client_name:new FormControl(''),
    client_id:new FormControl(''),
    pan_no: new FormControl(''),
    query_excleted_level:new FormControl(''),
    query_receive_by:new FormControl(''),
    query_solve_by: new FormControl(""),
    query_given_by:new FormControl(""),
    brn_cd: new FormControl([]),
    bu_type_id:new FormControl([]),
    rm_id: new FormControl([]),
    sub_brk_cd: new FormControl([]),
    euin_no: new FormControl([]),
  })

  queryDataSource = [];
  md_query_rec_given_through:any = [];
  md_product = [];
  md_query_status:Partial<IQueryStatus>[] = [];
  md_query_given_by:any = [];
  md_employee:any = [];


  ngOnInit(): void {
    this.fetchProduct();
    this.fetchQueryStatus();
    this.fetchQueryReceievGivenThrough();
    this.fetchQueryGivenBy();
    this.fetchEmployee();
    setTimeout(() => {
      this.customerServiceForm.get('date_periods').setValue('M',{emitEvent:true});
      }, 500);
  }

  fetchEmployee(){
    this.dbIntr.api_call(0,'/cusService/users',null)
    .pipe(pluck('data'))
    .subscribe(res =>{
        this.md_employee = res;
    })
  }


  fetchQueryGivenBy(){
      this.dbIntr.api_call(0,'/cusService/queryGivenBy',null)
      .pipe(pluck('data'))
      .subscribe(res => {
        console.log(res);  
        this.md_query_given_by = res
      })
  }

  fetchQueryReceievGivenThrough(){
        this.dbIntr.api_call(0,'/cusService/queryGivenThrough',null)
        .pipe(pluck('data'))
        .subscribe(res =>{
              console.log(res)
              this.md_query_rec_given_through = res;
        })
  }

  disabledSubBroker(bu_type_ids) {
    if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
      this.customerServiceForm.controls['sub_brk_cd'].enable();
    } else {
      this.customerServiceForm.controls['sub_brk_cd'].disable();
      this.customerServiceForm.controls['sub_brk_cd'].setValue([],{emitEvent:false});
      this.__subbrkArnMst = [];
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
          const dt = this.customerServiceForm.get('rm_id').value.filter(el => euin_no.includes( el.euin_no));
          this.customerServiceForm.get('rm_id').setValue(dt,{emitEvent:false});
        });
    } else {
      this.__RmMst = [];
      this.customerServiceForm.controls['rm_id'].setValue([],{emitEvent:true});
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
          const dt = this.customerServiceForm.get('sub_brk_cd').value.filter(el => code.includes( el.code));
          this.customerServiceForm.get('sub_brk_cd').setValue(dt,{emitEvent:false});
        });
    } else {
      this.__subbrkArnMst = [];
      this.customerServiceForm.controls['sub_brk_cd'].setValue([]);
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
      const euin_no = this.__euinMst.map(el => el.euin_no);
      const dt = this.customerServiceForm.get('euin_no').value.filter(el => euin_no.includes( el.euin_no));
    this.customerServiceForm.get('euin_no').setValue(dt,{emitEvent:false});
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
          const dt = this.customerServiceForm.get('bu_type_id').value.filter(el => bu_code.includes( el.bu_code));
          this.customerServiceForm.get('bu_type_id').setValue(dt,{emitEvent:false});
        });
    } else {
      this.customerServiceForm.controls['bu_type_id'].setValue([], { emitEvent: true });
      this.__bu_type = [];
    }
  }

  ngAfterViewInit(){
     /**
       * Event Trigger after change Branch
       */
     this.customerServiceForm.controls['brn_cd'].valueChanges.subscribe((res) => {
      this.getBusinessTypeMst(res);
    });

    this.customerServiceForm.controls['query_id'].valueChanges
    .pipe(
      tap(() => {
        this.__isQuery_id_pending = true
      }),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',dt) : []
      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        console.log(value);
        this.md_queryId = value;
        this.searchResultVisibilityForQueryID('block');
        this.__isQuery_id_pending = false;
      },
      complete: () => {},
      error: (err) => {
        this.__isQuery_id_pending = false;
      },
    });


    this.customerServiceForm.controls['client_name'].valueChanges
      .pipe(
        tap(()=> this.customerServiceForm.get('pan_no').setValue('')),
        tap(() => {
          this.__isClientPending = true
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient',dt+'&view_type=C') : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__clientMst = value;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
        },
        complete: () => {},
        error: (err) => {
          this.__isClientPending = false;
        },
      });

      /**
    *  Event Trigger on change on Date Periods
    */
      this.customerServiceForm.controls['date_periods'].valueChanges.subscribe((res) => {
        if(res){
          this.customerServiceForm.controls['date_range'].reset(
            res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
          );
        }
        else{
          this.customerServiceForm.controls['date_range'].setValue('');
          this.customerServiceForm.controls['date_range'].disable();
          return;
        }

        if (res && res != 'R') {
          this.customerServiceForm.controls['date_range'].disable();
        } else {
          this.customerServiceForm.controls['date_range'].enable();
        }
      });


      this.customerServiceForm.controls['date_range'].valueChanges.subscribe((res) => {
        if(res){
            this.maxDate = dates.calculatMaximumDates('R',6,new Date(res[0]));
          }
          else{
            this.maxDate = dates.calculateDates('T');
          }
      })


      /**** Advance Filter Works */
        /**
         * Event Trigger after Business Type
         */
        this.customerServiceForm.controls['bu_type_id'].valueChanges.subscribe((res) => {
          console.log(res);
          if(res.length > 0){
            this.disabledSubBroker(res);
            this.getRelationShipManagerMst(res, this.customerServiceForm.value.brn_cd);
          }
          else{
              this.__RmMst = [];
              this.__subbrkArnMst =[];
              this.__euinMst = [];
              this.customerServiceForm.get('euin_no').setValue([]);
              this.customerServiceForm.get('sub_brk_cd').setValue([]);
              this.customerServiceForm.get('rm_id').setValue([]);
          }
          
        });

      /**
       * Event Trigger after Rlationship Manager
       */
      this.customerServiceForm.controls['rm_id'].valueChanges.subscribe((res) => {
        if (
          this.customerServiceForm.value.bu_type_id.findIndex(
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
      this.customerServiceForm.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
        console.log(res);
        this.setEuinDropdown(res, this.customerServiceForm.value.rm_id);
      });
      /**** End */

  }
  searchResultVisibilityForQueryID(mode){
      this.displayMode_forQueryId = mode;
  } 
  
  searchResultVisibilityForClient(mode){
      this.displayMode_forClient = mode;
  }

  setColumns = (productId:number) =>{
      this.query_column = queryColumn.QueryColumn.filter(el => el.isVisible.includes(Number(productId)))
  }

  TabDetails(ev){
      this.customerServiceForm.patchValue({
        query_status_id:'',
        query_mode_id: ''
      });
      this.queryDataSource = [];
      // this.productId = this.__utility.encrypt_dtls(JSON.stringify((ev.tabDtls?.id)));
      this.productId = this.__utility.EncryptText(ev.tabDtls?.id.toString());
      this.fetchQuery(ev.tabDtls?.flag);
      this.setColumns(ev.tabDtls?.id)
  }
  filterGlobal($event){
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
}

  fetchQuery = (flag) =>{

      this.dbIntr.api_call(1,'/cusService/queryShow',this.__utility.convertFormData({
        ...this.customerServiceForm.value,
        // product_id: this.__utility.decrypt_dtls(this.productId)
        product_id: this.__utility.DcryptText(this.productId)

      }))
      .pipe(pluck('data'))
      .subscribe((res:any) =>{
        this.queryDataSource = res.map(el =>{
          el.solveattach = el.solveattach.map(el =>{
              el.url=`${environment.query_solve_file}${el.name}`;
              el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
              return el
           });
           const outerDt = el.allscheme.map(el =>{
              el.scheme_name = el.schemename ? `${el?.schemename?.scheme_name}-${el?.schemename?.plan_name}-${el?.schemename?.option_name}` : 'N/A';
              return el;
           });
          el.scheme_dtls = outerDt;

          el.scheme_name = el.product_id == 1 ? `${outerDt.length > 0 ? outerDt[0]?.scheme_name : ''}` : (el.product_id == 4 ? el.scheme_name : '');
          // el.cust_query_id = this.__utility.encrypt_dtls(JSON.stringify((el.id)))
          el.cust_query_id = this.__utility.EncryptText(el.id.toString())
          if(el.call_flag == 'N' && el.whats_app_flag == 'N' && el.email_flag == 'N' && el.sms_flag == 'N'){

          }
          else{
              if(el.call_flag == 'N'){
                  el.query_inform_status = 'Call Pending'
              }
              else{
                  if(el.whats_app_flag == 'N' || el.email_flag == 'N' || el.sms_flag == 'N'){
                             el.query_inform_status = 'Partially Inform'
                  }
                  else{
                        el.query_inform_status = 'Fully Inform'
                  }
              }
          }
          return el
        });
        console.log(this.queryDataSource);
      })
  }


  fetchProduct = () =>{
    this.dbIntr.api_call(0,'/product',null).pipe(pluck('data')).subscribe((res:any) => {
      // this.productId =this.__utility.encrypt_dtls(JSON.stringify((res.length > 0 ? res[0].id : 0))) 
      this.productId =   this.__utility.EncryptText((res.length > 0 ? res[0].id.toString() : 0));
      this.md_product = res.map(el => {
          return {
                id:el.id,
                tab_name:el.product_name.toUpperCase(),
                img_src:'',
                flag: this.initialName(el.product_name)
          }
        });
        this.setColumns(res.length > 0 ? res[0].id : 1)
        // console.log(this.productId);
        // console.log()
        // this.fetchQuery(this.md_product[0].flag);
    })
  }

  

  getColumns = () =>{
    return this.__utility.getColumns(this.query_column);
  }

  fetchQueryStatus = () =>{
    this.dbIntr.api_call(0,'/cusService/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
          this.md_query_status = res;
    })
  }

  initialName(words) {
    return words
        .replace(/\b(\w)\w+/g, '$1')
        .replace(/\s/g, '')
        .replace(/\.$/, '')
        .toUpperCase();
  }

  searchQuery = () =>{
    // const product_id = this.__utility.decrypt_dtls(this.productId);
    const product_id = this.__utility.DcryptText(this.productId);
    const flag = this.md_product.filter(el => el.id == product_id);
    this.fetchQuery(flag[0].flag)
  }

  setQuery = (queryDtls) =>{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.closeOnNavigation = false;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = false;
        dialogConfig.width = '40%';
        dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
        dialogConfig.data = {
          flag:queryDtls?.query_id,
          data:queryDtls,
          title:`Change Status (${queryDtls?.query_id})`
        };
        dialogConfig.id = queryDtls?.query_id.toString();
        try {
          const dialogref = this.__dialog.open(
            ModifyQueryStatusComponent,
            dialogConfig
          );
          dialogref.afterClosed().subscribe((dt) => {
              if(dt){
                // const product_ID =Number(this.__utility.decrypt_dtls(this.productId));
                const product_ID =Number(this.__utility.DcryptText(this.productId));

                const response = dt.response;
                if(product_ID == response.product_id){
                    this.queryDataSource = this.queryDataSource.filter(el =>{
                      if(el.id == queryDtls.id){
                            el.status_name = response.status_name;
                            el.color_code = response.color_code;
                            el.query_status_id = response.query_status_id;
                            el.overall_feedback =  response.overall_feedback;
                            el.query_feedback =  response.query_feedback;
                            el.expected_close_date = response.expected_close_date
                      }
                      return el;
                    })
                }
               
              }
          });
        } catch (ex) {
          const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
          dialogRef.updateSize('40%');
          this.__utility.getmenuIconVisible({
            id: dialogConfig.id.toString(),
            isVisible: false,
            flag: queryDtls?.query_id.toString(),
          });
        }
  }

  getSelectedItemsFromParent = (ev) =>{
        console.log(ev);
  }

    /**
       * event trigger after select particular result from search list
       * @param searchRlt
       */
    getSelectedItemsFromParentForClient = (searchRlt: {
      flag: string;
      item: any;
    }) => {

      this.customerServiceForm.get('client_name').reset(searchRlt.item.client_name, { emitEvent: false });
      this.customerServiceForm.get('pan_no').reset(searchRlt.item.pan);
      // this.Rpt.get('client_id').reset(searchRlt.item.first_client_pan);
      this.searchResultVisibilityForClient('none');
      // if(this.Rpt.value.view_type == 'F'){
      //   this.getFamilyMembersAccordingTo_Id(searchRlt.item.client_id);
      // }
    };

    onItemClick = (ev) => {
      if (ev.option.value == 'A') {
        this.getBranchMst();
      } else {
        this.resetForm();
          //  this.misTrxnRpt.patchValue({
          //   amc_id:[],
          //   folio_no:'',
          //   trxn_type_id:[],
          //   date_range:'',
          //   date_periods:'M',
          //   view_type:'',
          //   pan_no:''
          //  });
          //  this.paginate = 1;
          //  this.misTrxnRpt.get('brn_cd').setValue([],{emitEvent:true});
          //  this.__subbrkArnMst = [];
          //  this.misTrxnRpt.controls['sub_brk_cd'].setValue([]);
          //  this.misTrxnRpt.controls['euin_no'].setValue([]);
          //  this.misTrxnRpt.controls['client_name'].setValue('',{emitEvent:false});
          //  this.searchTrxnReport();
      }
    }

    resetForm = () => {
      // console.log(`SUB TYPE: ${this.sub_type}`);
      this.customerServiceForm.patchValue({
              client_id:'',
              pan_no:'',
              query_receive_by:'',
              query_solve_by:'',
              date_periods:'M',
              query_status_id:'',
              query_receive_given_thrugh:'',
              query_excleted_level:''
      });
      this.customerServiceForm.get('brn_cd').setValue([], { emitEvent: true });
      this.customerServiceForm.get('query_id').setValue('', { emitEvent: false });
      this.__subbrkArnMst = [];
      this.customerServiceForm.controls['sub_brk_cd'].setValue([]);
      this.customerServiceForm.controls['euin_no'].setValue([]);
      this.customerServiceForm.controls['client_name'].setValue('', { emitEvent: false });
    }
      /**
   * Get Branch Master Data
   */
   getBranchMst = () => {
    if(this.__branchMst.length == 0){
      this.dbIntr
      .api_call(0, '/branch', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__branchMst = res;
      });
    }
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
    
  clearAdvanceFilter = () =>{
    this.btn_type = 'R';
    this.customerServiceForm.get('brn_cd').setValue([], { emitEvent: true });
    this.__subbrkArnMst = [];
    this.customerServiceForm.controls['sub_brk_cd'].setValue([]);
    this.customerServiceForm.controls['euin_no'].setValue([]);
  }
  openAttachments(trxn){
      // console.log(trxn.solveattach)
      this.openDialog(trxn,trxn.query_id)
  }

  openDialog(transaction, __quertId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'Q',
      query_id: __quertId,
      trxn: transaction,
      title: 'Attachments',
      attachments:transaction.solveattach,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __quertId.toString();
    try {
      const dialogref = this.__dialog.open(
        DocViewComponent,
        dialogConfig
      );
      // dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'Q',
      });
    }
  }
  showReport(scheme){
      console.log(scheme);
      this.md_scheme = [];
      this.md_scheme = scheme;
  }
}

export class queryColumn{
  public static QueryColumn:column[] = [
    {
      field:'status_name',
      header:'Query Status',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'entry_name',
      header:'Query Receive By',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_solve_by',
      header:'Query Solve By',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_id',
      header:'Query ID',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    // {
    //   field:'status_name',
    //   header:'Query Status',
    //   width:'5rem',
    //   isVisible:[1,2,3,4]
    // },
    {
      field:'date_time',
      header:'Date & Time',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'investor_name',
      header:'Investor',
      width:'5rem',
      isVisible:[1,2,3]
    },
    {
      field:'investor_name',
      header:'FD Holder',
      width:'5rem',
      isVisible:[4]
    },
    {
      field:'investor_pan',
      header:'PAN',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'investor_email',
      header:'Email',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'investor_mobile',
      header:'Mobile',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    // {
    //   field:'invester_name',
    //   header:'Invester'
    // },
    {
      field:'folio_no',
      header:'Folio',
      width:'5rem',
      isVisible:[1,2]
    }, 
    {
      field:'application_no',
      header:'Application No',
      width:'5rem',
      isVisible:[1,2]
    }, 
    {
      field:'policy_no',
      header:'Policy No',
      width:'5rem',
      isVisible:[3]
    }, 
    {
      field:'fd_no',
      header:'FD No',
      width:'5rem',
      isVisible:[4]
    },
    {
      field:'query_given_by',
      header:'Query Given By',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'amc_name',
      header:'AMC',
      width:'20rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'20rem',
      isVisible:[1,2,4]
    },
    {
      field:'product_name',
      header:'Product',
      width:'10rem',
      isVisible:[3]
    },
    {
      field:'query_type',
      header:'Query Type',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_subtype',
      header:'Query Subtype',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_details',
      header:'Query Details',
      width:'30rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_receive_through',
      header:'Query Receive Through',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_nature',
      header:'Query Nature',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_given_to_amc_or_company',
      header:'Query Given To AMC/Company',
      width:'8rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_given_through',
      header:'Query Given Through',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'concern_person_name',
      header:'Concern Person Name',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'contact_no',
      header:'Concern Person Contact No.',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'email_id',
      header:'Concern Person Email',
      width:'10rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'level',
      header:'Level',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_tat',
      header:'Query TAT',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'expected_close_date',
      header:'Expected Closed Date',
      width:'5rem',
      isVisible:[1,2,3,4]
    },
    
    {
      field:'actual_close_date',
      header:'Actual Close Date Time',
      width:'8rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_inform_status',
      header:'Query Inform Status',
      width:'8rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_inform_date',
      header:'Query Inform Date Time',
      width:'20rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_inform_through',
      header:'Query Inform Through',
      width:'8rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'query_feedback',
      header:'Query Feedback Receive',
      width:'8rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'remarks',
      header:'Remarks',
      width:'8rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'view',
      header:'View Attachments',
      width:'3rem',
      isVisible:[1,2,3,4]
    },
    {
      field:'action',
      header:'Action',
      width:'10rem',
      isVisible:[1,2,3,4]
    }
  ]
}






