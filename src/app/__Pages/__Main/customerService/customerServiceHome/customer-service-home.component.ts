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
import moment from 'moment';
import { TatRemarksComponent } from './tat-remarks/tat-remarks.component';

enum API{
  'MF'='/cus_service/MutualFundQuery',
  'B'='/cus_service/BondQuery',
  'I'='/cus_service/InsuranceQuery',
  'FD'='/cus_service/FixedDepositQuery'
}

@Component({
  selector: 'app-customer-service-home',
  templateUrl: './customer-service-home.component.html',
  styleUrls: ['./customer-service-home.component.css']
})



export class CustomerServiceHomeComponent implements OnInit {

  @ViewChild('op') Overlay__pannel:OverlayPanel;


  md_holiday:any = []

  index:number = 0;
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

  md_dialog_data:any = [];

  visible:boolean = false;

  /**
   * Holding Buisness type
   */
  __bu_type: any = [];

  /**
   * Holding Relationship Manager
   */
  __RmMst: any = [];

  status_id:any;

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

  sys_info:any = [];
  queryDataSource = [];
  md_query_rec_given_through:any = [];
  md_product = [];
  md_query_status:Partial<IQueryStatus>[] = [];
  md_query_given_by:any = [];
  md_employee:any = [];


  ngOnInit(): void {
    this.fetchHoliday();
    this.fetchQueryStatus();
    this.fetchProduct();
    this.fetchQueryReceievGivenThrough();
    this.fetchQueryGivenBy();
    this.fetchEmployee();
    setTimeout(() => {
      this.customerServiceForm.get('date_periods').setValue('M',{emitEvent:true});
      }, 500);
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   * The response is then processed to extract relevant information such as holiday dates.
   */
  fetchCustomerServiceIndex = () =>{
          this.dbIntr.api_call(0,'/cus_service/index',null).pipe(pluck('data'))
          .subscribe((res:any) =>{
                let dt = [];
                let statusDtls:any = this.md_query_status;
                // let sys_info = [];
               
                this.md_product.forEach(el =>{
                        statusDtls = statusDtls.map((item:any) =>{

                            const hasProps = res?.hasOwnProperty(el.id.toString()) ? item?.id in res[el.id.toString()] : false;
                            //console.log(hasProps);
                            item[item.status_name] = hasProps ? res[el.id.toString()][item.id].length : 0;
                            item[`${item.status_name}_${item.id}`] = item.id;
                            item[`${item.status_name}_${item.id}_tat_expired`] = hasProps ? 0 : 0;
                            item[`${item.status_name}_color_code`] = this.hexToRgbA(item.color_code);
                            item[`${item.status_name}_tat_expire`] = this.getNo_of_tatExp(hasProps ? res[el.id.toString()][item.id] : []);
                            return  item;
                        })  
                        //console.log(statusDtls);
                      dt.push({
                        product_name:el.tab_name,
                        product_id:el.id,
                        short_name:el.flag,
                        ...statusDtls.reduce((acc, cur) => ({ ...acc, 
                          [cur.status_name]: cur[cur.status_name],
                          [`${cur.status_name}_${cur.id}`]: cur[`${cur.status_name}_${cur.id}`],
                          [`${cur.status_name}_color_code`]:cur[`${cur.status_name}_color_code`],
                          [`${cur.status_name}_tat_expire`]:cur[`${cur.status_name}_tat_expire`]
                        }), {})
                      });
                });
                // //console.log(dt);
                let sysInfo = [];
                this.md_dialog_data = dt;
                this.visible = !this.visible
                Object.keys(res).forEach((el,index) =>{                  
                  const productDtls = this.md_product.filter(item => item.id == el);
                  sysInfo.push({
                    product_id:el,
                    product_name:productDtls.length > 0 ? productDtls[0]?.tab_name : '',
                    queryDtls:[]
                  })
                 this.md_query_status.forEach((item:any) =>{
                  if(item.id != 7 && item.id != 5){
                    console.log(item.id)
                    const hasProp = res?.hasOwnProperty(el.toString()) ? item?.id in res[el.toString()] : false;
                    //console.log(hasProp);
                    if(hasProp ){
                      sysInfo[index].queryDtls.push({
                              status_name:item.status_name,
                              status_id:item.id,
                              color_code:item.color_code,
                              query_no:res[el.toString()][item.id].length,
                              innerQueryDtls:res[el.toString()][item.id].map(ele => {
                                return `${ele.query_subtype}-(${ele.query_id})`
                              })
                      })
                    }
                  }   
                  })
                });
                console.log(sysInfo)
                this.sys_info = sysInfo.filter(el =>{
                    if(el?.queryDtls.length == 0){
                      return false;
                    }
                    return true
                });
                console.log(this.sys_info);

          })
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   * The response is then processed to extract relevant information such as holiday dates.
   */
  getNo_of_tatExp = (query_dtls) :Number =>{
      let count_Query_dtls = 0;
      query_dtls.forEach((el,index) =>{
              if(el.actual_close_date){
                const actual_close_date = moment(el.actual_close_date,'YYYY-MM-DD');
                const expected_close_date = moment(el.expected_close_date,'YYYY-MM-DD');
                const diff = actual_close_date.diff(expected_close_date);
                //console.log(diff);
                count_Query_dtls+= diff <= 0 ? 0 : 1;
              }
              else{
                 if(el.expected_close_date){
                    var expected_close_date = moment(el.expected_close_date,'YYYY-MM-DD');
                    var to_day =  moment(moment(new Date()).format('YYYY-MM-DD'));
                    const isAfter = to_day.diff(expected_close_date);
                    count_Query_dtls+= isAfter <= 0 ? 0 : 1;
                }
                else{
                  var new_date = moment(el.date_time).add(el.query_tat, 'days').format('YYYY-MM-DD');
                  //console.log(new_date);
                  count_Query_dtls+= moment(moment(new Date()).format('YYYY-MM-DD'),'YYYY-MM-DD').diff(new_date) <= 0 ? 0 : 1;
                }
              }
            
      })
      return count_Query_dtls;
  }

  /**
   * @description This function used to convert hex color code to rgba format with 0.4 opacity.
   * It checks if the provided hex code is valid and then converts it to rgba format.
   */
  hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
    }
    throw new Error('Bad Hex');
}

/**
 * @description This function fetches the employee data from the server.
 */
  fetchEmployee(){
    this.dbIntr.api_call(0,'/cus_service/users',null)
    .pipe(pluck('data'))
    .subscribe(res =>{
        this.md_employee = res;
    })
  }


  /**
   * @description This function fetches dtaa according to TAT Expired
   */
  getItemsAccording_TAT_Expired = (data,item,index) =>{
    const _index = this.md_product.findIndex(el => el.id == data.product_id);
    if(this.index == _index){
      if(this.customerServiceForm?.value.query_status_id != item.id)
      {
        this.customerServiceForm.patchValue({
          query_status_id:this.md_query_status.filter(el => el.id == item.id)[0]?.id,
        });
        this.queryDataSource = [];
        this.productId = this.__utility.EncryptText(data.product_id.toString());
        this.customerServiceForm.get('date_periods').setValue('')
        this.fetchQuery(data.short_name,true);
        this.setColumns(data.product_id);
      }
    }
    else{
      this.status_id = this.md_query_status.filter(el => el.id == item.id)[0]?.id;
      this.index = _index
    }
    this.visible = !this.visible;
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   */
  getItems = (data,item,index) =>{
      const _index = this.md_product.findIndex(el => el.id == data.product_id);
      if(this.index == _index){
        if(this.customerServiceForm?.value.query_status_id != item.id)
        {
          console.log('ASASDASD')
          this.customerServiceForm.patchValue({
            query_status_id:this.md_query_status.filter(el => el.id == item.id)[0]?.id,
          });
          this.queryDataSource = [];
          this.customerServiceForm.get('date_periods').setValue('')

          this.productId = this.__utility.EncryptText(data.product_id.toString());
          this.fetchQuery(data.short_name);
          this.setColumns(data.product_id)
        }
      }
      else{
          console.log('ASASDASD')
          this.customerServiceForm.patchValue({
            query_status_id:this.md_query_status.filter(el => el.id == item.id)[0]?.id,
          });
          this.queryDataSource = [];
          this.customerServiceForm.get('date_periods').setValue('')

        this.status_id = this.md_query_status.filter(el => el.id == item.id)[0]?.id;
        this.index = _index
      }
      this.visible = !this.visible;
  }


  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   * The response is then processed to extract relevant information such as holiday dates.
   */
  fetchQueryGivenBy(){
      this.dbIntr.api_call(0,'/cus_service/queryGivenBy',null)
      .pipe(pluck('data'))
      .subscribe(res => {
        // //console.log(res);  
        this.md_query_given_by = res
      })
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   * The response is then processed to extract relevant information such as holiday dates.
   */
  fetchQueryReceievGivenThrough(){
        this.dbIntr.api_call(0,'/cus_service/queryGivenThrough',null)
        .pipe(pluck('data'))
        .subscribe(res =>{
              // //console.log(res)
              this.md_query_rec_given_through = res;
        })
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   */
  disabledSubBroker(bu_type_ids) {
    if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
      this.customerServiceForm.controls['sub_brk_cd'].enable();
    } else {
      this.customerServiceForm.controls['sub_brk_cd'].disable();
      this.customerServiceForm.controls['sub_brk_cd'].setValue([],{emitEvent:false});
      this.__subbrkArnMst = [];
    }
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   * The response is then processed to extract relevant information such as holiday dates.
   */
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

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   */
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

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   */
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

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   */
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

  /** * @description This function control scrolls in table container 
   */
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

  ngAfterViewInit(){
    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    this.changeWheelSpeed(el, 0.99);
     /**
       * Event Trigger after change Branch
       */
     this.customerServiceForm.controls['brn_cd'].valueChanges.subscribe((res) => {
      this.getBusinessTypeMst(res);
    });

    this.customerServiceForm.controls['query_id'].valueChanges
    .pipe(
      tap(() => {
        this.__isQuery_id_pending =  this.customerServiceForm.getRawValue().query_id?.length > 2 
      }),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 2 ? this.dbIntr.searchItems('/cus_service/searchQueryId',`${dt}&product_id=${this.__utility.DcryptText(this.productId)}`) : []
      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        // //console.log(value);
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
        tap(()=> this.customerServiceForm.patchValue({
         pan_no:'',
         client_id:''
        })),
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
          // //console.log(res);
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
        // //console.log(res);
        this.setEuinDropdown(res, this.customerServiceForm.value.rm_id);
      });
      /**** End */

  }
  /**
   * @description This function used to change status of visibility of search result for Query ID
   */
  searchResultVisibilityForQueryID(mode){
      this.displayMode_forQueryId = mode;
  } 
  /**
   * @description This function used to change status of visibility of search result for Client
   * @param mode - The mode to set for the visibility of the search result.
   * It can be 'block' or 'none'.
   */
  searchResultVisibilityForClient(mode){
      this.displayMode_forClient = mode;
  }

  /**
   * @description This function used to set columns.
   */
  setColumns = (productId:number) =>{
      this.query_column = queryColumn.QueryColumn.filter(el => el.isVisible.includes(Number(productId)))
  }
  
  /** * @description This function used to populate tab details and fetch query data based on the selected tab.
   * @param ev - The event object containing the tab details.
   * It updates the customerServiceForm with the selected query status and resets the query mode.
   * It also fetches the query data based on the selected tab and sets the columns accordingly.
   */
  TabDetails(ev){
      this.customerServiceForm.patchValue({
        query_status_id:this.status_id ? this.status_id : '',
        query_mode_id: ''
      });
      this.queryDataSource = [];
      this.productId = this.__utility.EncryptText(ev.tabDtls?.id.toString());
      this.fetchQuery(ev.tabDtls?.flag);
      this.setColumns(ev.tabDtls?.id)
  }
  /**
   * @description This function filter global search in the table.
   * @param $event - The event object containing the search input value.
   * It filters the table data based on the search input value using the 'contains' filter mode.
   */
  filterGlobal($event){
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
}

/**
 * @description This function fetches the query data based on the provided flag and other form values.
 * It constructs a FormData object with the necessary parameters and makes an API call to fetch the query data.
 * The response is then processed to filter and format the query data before updating the queryDataSource.
 * @param flag - The flag indicating the type of query to fetch (e.g., 'A', 'R').
 * @param isTATClicked - Optional boolean parameter indicating if TAT was clicked, defaulting to false.
 */
  fetchQuery = (flag,isTATClicked:boolean | undefined = false) =>{
      const fb = new FormData();
      fb.append('query_id',global.getActualVal(this.customerServiceForm.getRawValue().query_id));
      fb.append('client_name',global.getActualVal(this.customerServiceForm.getRawValue().client_name));
      fb.append('client_id',this.customerServiceForm.getRawValue().client_name ? global.getActualVal(this.customerServiceForm.getRawValue().client_id) : '');
      fb.append('pan_no',this.customerServiceForm.getRawValue().client_name ? global.getActualVal(this.customerServiceForm.getRawValue().pan_no) : '');
      fb.append('query_rec_by_id',global.getActualVal(this.customerServiceForm.getRawValue().query_receive_by));
      fb.append('query_solve_by_id',global.getActualVal(this.customerServiceForm.getRawValue().query_solve_by));
      fb.append('query_given_by_id',global.getActualVal(this.customerServiceForm.getRawValue().query_given_by));
      fb.append('date_periods',global.getActualVal(this.customerServiceForm.getRawValue().date_periods));
      fb.append('date_range',global.getActualVal(this.date_range.inputFieldValue));
      fb.append('query_status_id',global.getActualVal(this.customerServiceForm.getRawValue().query_status_id));
      fb.append('query_given_thrugh_id',global.getActualVal(this.customerServiceForm.getRawValue().query_receive_given_thrugh));
      fb.append('query_excleted_level_id',global.getActualVal(this.customerServiceForm.getRawValue().query_excleted_level));
      fb.append('product_id',global.getActualVal(this.__utility.DcryptText(this.productId)));
      if(this.btn_type == 'A'){
        fb.append('euin_no',this.__utility.mapIdfromArray(this.customerServiceForm.getRawValue().euin_no, 'euin_no'));
        fb.append('brn_cd',this.__utility.mapIdfromArray(this.customerServiceForm.getRawValue().brn_cd, 'id'));
        fb.append('rm_id',this.__utility.mapIdfromArray(this.customerServiceForm.getRawValue().rm_id, 'euin_no'));
        fb.append('bu_type',this.__utility.mapIdfromArray(this.customerServiceForm.getRawValue().bu_type_id, 'bu_code'));
        fb.append('sub_brk_cd',this.__utility.mapIdfromArray(this.customerServiceForm.getRawValue().sub_brk_cd, 'code'));
      }

      this.dbIntr.api_call(1,'/cus_service/queryShow',fb)
      .pipe(pluck('data'))
      .subscribe((res:any) =>{
        this.queryDataSource = res.filter((el,index) =>{
          let isExpired;
          console.log(el);
          el.expected_close_date = el?.expected_close_date ? el.expected_close_date : this.globalFuncForExpectedCloseDate(el.date_time,el.query_tat);
          if(el.actual_close_date){
            const actual_close_date = moment(el.actual_close_date,"YYYY-MM-DD");
            const expected_close_date = moment(el.expected_close_date);
            const diff = actual_close_date.diff(expected_close_date);
            isExpired = diff<=0;
          }
          else{
            //  el.
             if(el.expected_close_date){
                console.log(el.expected_close_date);
                var expected_close_date1 = moment(el.expected_close_date,'YYYY-MM-DD');
                var to_day =  moment(moment(new Date()).format('YYYY-MM-DD'),'YYYY-MM-DD');
                const isAfter = to_day.diff(expected_close_date1)
                isExpired = isAfter <= 0;
            }
            else{
              var new_date = moment(el.date_time).add(el.query_tat, 'days').format('YYYY-MM-DD');
                const isAfter = moment(moment(new Date()).format('YYYY-MM-DD'),'YYYY-MM-DD').diff(new_date)
                isExpired = isAfter <= 0;
            }
          }
          if(isTATClicked){
              if(isExpired){
                 return false
              }
          }
          // console.log(isExpired)
          el.tat_expired = isExpired ? "NO" : "YES"
        
          el.solveattach = [];
           const outerDt = el.allscheme?.map(el =>{
              el.scheme_name = el.schemename ? `${el?.schemename?.scheme_name}-${el?.schemename?.plan_name}-${el?.schemename?.option_name}` : 'N/A';
              return el;
           });
          el.scheme_dtls = outerDt;
          el.scheme_name = (el.product_id == 1 || el.product_id == 12) ? `${outerDt.length > 0 ? outerDt[0]?.scheme_name : ''}` : (el.product_id == 4 ? el.scheme_name : '');
          el.amc_name = (el.product_id == 1  || el.product_id == 12) ? `${outerDt.length > 0 ? outerDt[0]?.schemename?.amc_name : ''}` :  '';
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
          // el.tat_expired = 
          // el.rating = 3;
          return el
        });
        // //console.log(this.queryDataSource);
      })
  }
 

  /**
   * @description This function calculates the expected close date based on the provided date and query TAT.
   * It adds the query TAT to the date and checks for holidays and weekends to adjust
   */
 globalFuncForExpectedCloseDate = (date,query_tat) =>{
     let  daysAfteradd;
     if(date){
       daysAfteradd = moment(date).add(Number(query_tat),'d');
     }
     else{
       daysAfteradd = moment().add(Number(query_tat),'d');
     }
     let expected_close_date = daysAfteradd;
     this.md_holiday.forEach(element => {
         if(expected_close_date.isSame(element)){
            //  console.log("SAME")
             daysAfteradd = daysAfteradd.add(Number(query_tat),'d');
         }
        //  console.log(daysAfteradd);
         const isweekDay =  daysAfteradd.format('ddd');           
         if(isweekDay == 'Sat'){
           expected_close_date = moment(daysAfteradd,"DD-MM-yyyy").add(2, 'days');
         }
         else if(isweekDay == 'Sun'){
           expected_close_date = moment(daysAfteradd,"DD-MM-yyyy").add(1, 'days');
         }
     })
    //  console.log(expected_close_date);
     return expected_close_date.format('YYYY-MM-DD');
   }

   /**
    * @description This function fetches the product data from the server.
    * It makes an API call to the backend service to retrieve the product data.
    * The response is then processed to extract relevant information such as product IDs and names.
    * The product ID is encrypted for security purposes.
    */
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
        // //console.log(this.productId);
        // //console.log()
        // this.fetchQuery(this.md_product[0].flag);
    })
  }

  /**
   * @description This function fetches the holiday data from the server.
   * It makes an API call to the backend service to retrieve the holiday data.
   * The response is then processed to extract relevant information such as holiday dates.
   * The holiday dates are stored in the md_holiday array for further use.
   */
  fetchHoliday = () =>{
        this.dbIntr.api_call(0,'/cus_service/holiday',null)
        .pipe(pluck("data"))
        .subscribe((res:any) =>{
            // console.log(res);
            this.md_holiday = res.map(el => el.occ_date);
        })

  }

  

 
  getColumns = () =>{
    return this.__utility.getColumns(this.query_column);
  }

  /**
   * @description This function fetches the query status data from the server.
   * It makes an API call to the backend service to retrieve the query status data.
   * The response is then processed to extract relevant information such as query status IDs and names.
   * The query status data is stored in the md_query_status array for further use.
   */
  fetchQueryStatus = () =>{
    this.dbIntr.api_call(0,'/cus_service/queryStatus',null).pipe(pluck('data')).subscribe((res:Partial<IQueryStatus>[]) =>{
          this.md_query_status = res;
          //console.log(res);
        this.fetchCustomerServiceIndex();

    })
  }

  /**
   *  * @description This function used to return initials from words.
   * @param words - The input string containing words from which initials are to be extracted.
   * It replaces each word with its first letter, removes spaces, and converts the result to uppercase.
   * @returns A string containing the initials of the words in uppercase.
   */
  initialName(words) {
    return words
        .replace(/\b(\w)\w+/g, '$1')
        .replace(/\s/g, '')
        .replace(/\.$/, '')
        .toUpperCase();
  }

  /**
   * @description This function fetches the customer service index data from the server.
   * It makes an API call to the backend service to retrieve the customer service index data.
   * The response is then processed to extract relevant information such as product IDs and names.
   */
  searchQuery = () =>{
    // //console.log(this.customerServiceForm.getRawValue());
    // const product_id = this.__utility.decrypt_dtls(this.productId);
    const product_id = this.__utility.DcryptText(this.productId);
    const flag = this.md_product.filter(el => el.id == product_id);
    this.fetchQuery(flag[0].flag)
  }

  /**
   * @description This function opens a dialog to modify the query status.
   * It sets the dialog configuration and passes the query details to the dialog component.
   * After the dialog is closed, it updates the query data source with the modified status if applicable.
   * @param queryDtls - The details of the query to be modified.
   */
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

  /** 
   * @description This function is triggered when a search result is selected from the parent component.
   * It resets the query_id field in the customerServiceForm with the selected item's query_id
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) =>{
        // //console.log(ev);
        this.customerServiceForm.get('query_id').reset(searchRlt.item.query_id, { emitEvent: false });
        // this.customerServiceForm.get('pan_no').reset(searchRlt.item.pan);
        this.searchResultVisibilityForQueryID('none');
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
      this.customerServiceForm.get('client_id').reset(searchRlt.item.id);
      this.searchResultVisibilityForClient('none');
      // if(this.Rpt.value.view_type == 'F'){
      //   this.getFamilyMembersAccordingTo_Id(searchRlt.item.client_id);
      // }
    };

    /**
     * @description This function is triggered when an item is clicked in the search result.
     * It checks the value of the clicked item and performs actions accordingly.
     * If the value is 'A', it fetches the branch master data.
     * Otherwise, it resets the form and prepares for a new search.
     * @param ev - The event object containing the clicked item's value.
     */
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

    /**
     * @description This function resets the form values in the customerServiceForm.
     * It sets the client_id, pan_no, query_receive_by, query_solve_by
     */
    resetForm = () => {
      // //console.log(`SUB TYPE: ${this.sub_type}`);
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

  /**
   * @description This function is triggered when an item is selected from the business type dropdown.
   * It updates the customerServiceForm with the selected business type and fetches the relationship manager
   */
    onbuTypeDeSelect = (ev) =>{
      // this.misTrxnRpt.get('bu_type_id').setValue(this.misTrxnRpt.value.bu_type_id.filter(item => item.bu_code != ev.bu_code));
    }
    /**
     * @description This function is triggered when an item is selected from the branch dropdown.
     * It updates the customerServiceForm with the selected branch and fetches the relationship manager
     */
    onbrnCdDeSelect = (ev) =>{
      // this.misTrxnRpt.get('brn_cd').setValue(this.misTrxnRpt.value.brn_cd.filter(item => item.id != ev.id));
    }
    /**
     * @description This function is triggered when an item is selected from the relationship manager dropdown.
     * It updates the customerServiceForm with the selected relationship manager and fetches the sub broker
     */
    onRmDeSelect = (ev) =>{
      // this.misTrxnRpt.get('rm_id').setValue(this.misTrxnRpt.value.rm_id.filter(item => item.euin_no != ev.euin_no));
    }
    /**
     * @description This function is triggered when an item is selected from the sub broker dropdown.
     * It updates the customerServiceForm with the selected sub broker and sets the euin dropdown based on the selected sub broker.
     * @param ev - The event object containing the selected sub broker details.
     */
    onSubBrkDeSelect = (ev) =>{
      // this.misTrxnRpt.get('sub_brk_cd').setValue(this.misTrxnRpt.value.sub_brk_cd.filter(item => item.code != ev.code));

    }
    
    /**
     * @description This function clears the advance filter values in the customerServiceForm.
     * It resets the branch code, sub broker code, and euin number fields to their default values.
     * It also sets the button type to 'R' for resetting the filter.
     * This function is typically called when the user wants to clear the advanced filter criteria.
     */
  clearAdvanceFilter = () =>{
    this.btn_type = 'R';
    this.customerServiceForm.get('brn_cd').setValue([], { emitEvent: true });
    this.__subbrkArnMst = [];
    this.customerServiceForm.controls['sub_brk_cd'].setValue([]);
    this.customerServiceForm.controls['euin_no'].setValue([]);
  }
  /**
   * @description This function opens the attachments dialog for a given transaction.
   * It filters the attachments based on their query status and constructs a URL for each attachment.
   * It groups the attachments by their query status name and opens a dialog to display them.
   * @param trxn - The transaction object containing the attachments to be opened.
   */
  openAttachments(trxn){
      const modifyAttachment = trxn.allattach.filter(el =>{
        if(el.query_status_id == 2 || el.query_status_id == trxn.query_status_id){
          el.url=`${environment.query_attachments}${el.name}`;
          el.ext = el.name.substr(el.name.lastIndexOf('.') + 1);
          return el
        }
        // return false
      })
      var groupBy = (xs, key) => {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      console.log(modifyAttachment);
      const attachments =modifyAttachment.length > 0 ? groupBy(modifyAttachment,'query_status_name') : null;
      this.openDialog(trxn,trxn.query_id,attachments);
  }

  /**
   * @description This function copies the provided text to the clipboard.
   * It uses the Clipboard API to write the text to the clipboard.
   * If the text is not empty, it writes the text to the clipboard.
   * @param text - The text to be copied to the clipboard.
   */
  copyText(text){
      if(text){
        navigator.clipboard.writeText(text);
      }
  }

  /**
   * @description This function opens a dialog to view attachments for a given transaction.
   * It sets the dialog configuration, including the data to be passed to the dialog component.
   * The dialog displays the attachments related to the transaction and allows users to view them.
   */
  openDialog(transaction, __quertId,attachments) {
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
      // attachments:transaction.solveattach,
      attachments:attachments,
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
  /**
   * @description This function is triggered when a scheme is selected.
   * It updates the md_scheme property with the selected scheme data.
   * This function is typically called when a user selects a scheme from a list or dropdown.
   * @param scheme - The selected scheme data to be displayed in the report.
   */
  showReport(scheme){
      // //console.log(scheme);
      this.md_scheme = [];
      this.md_scheme = scheme;
  }
  /**
   * @description This function opens a dialog to add TAT remarks for a given transaction.
   * It sets the dialog configuration, including the data to be passed to the dialog component.
   * The dialog allows users to add remarks related to the TAT (Turnaround Time) of the transaction.
   * @param trxn - The transaction object for which TAT remarks are to be added.
   */
  openTatRemarks(trxn){
      //console.log(trxn);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '40%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.data = {
        flag: 'ATR',
        query_id: trxn.query_id,
        trxn: trxn,
        title: 'ADD TAT REMARKS',
        right: global.randomIntFromInterval(1, 60),
      };
      dialogConfig.id = trxn.query_id.toString();
      try {
        const dialogref = this.__dialog.open(
          TatRemarksComponent,
          dialogConfig
        );
        dialogref.afterClosed().subscribe((dt) => {
          //console.log(dt)
          if(dt){
            this.queryDataSource = this.queryDataSource.filter(el =>{
                  if(el.id == dt.id){
                    el.tat_remarks = dt.tat_remarks;
                  }
                  return el;
            })
          }
        });
      } catch (ex) {
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.updateSize('40%');
        this.__utility.getmenuIconVisible({
          id: Number(dialogConfig.id),
          isVisible: false,
          flag: 'ATR',
        });
      }
  }

  /**
   * @description This function copies the provided text to the clipboard.
   * It uses the Clipboard API to write the text to the clipboard.
   * If the Clipboard API is not available, it falls back to a manual copy method using a textarea element.
   * @param textToCopy - The text to be copied to the clipboard.
   */
  copyToClipboard(textToCopy){
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Copied to clipboard:', textToCopy);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    } else {
      // Fallback for older browsers
      this.fallbackCopyText(textToCopy);
    }
  }
  /**
   * @description This function provides a fallback method for copying text to the clipboard.
   * It creates a temporary textarea element, sets its value to the text to be copied,
   * and uses the execCommand method to copy the text.
   * After copying, it removes the temporary textarea element from the document.
   * @param text - The text to be copied to the clipboard.
   */
  fallbackCopyText(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
  
    try {
      document.execCommand('copy');
      console.log('Copied using fallback');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
  
    document.body.removeChild(textarea);
  }
}

export class queryColumn{
  public static QueryColumn:column[] = [
    {
      field:'status_name',
      header:'Query Status',
      width:'10rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'entry_name',
      header:'Query Receive By',
      width:'10rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_solve_by',
      header:'Query Solve By',
      width:'12rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_id',
      header:'Query ID',
      width:'8rem',
      isVisible:[1,2,3,4,12]
    },
    // {
    //   field:'status_name',
    //   header:'Query Status',
    //   width:'5rem',
    //   isVisible:[1,2,3,4,12]
    // },
    {
      field:'date_time',
      header:'Date & Time',
      width:'12rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'investor_name',
      header:'Investor',
      width:'20rem',
      isVisible:[1,2,12]
    },
    {
      field:'investor_name',
      header:'Policy Holder',
      width:'20rem',
      isVisible:[3]
    },
    {
      field:'investor_name',
      header:'FD Holder',
      width:'20rem',
      isVisible:[4]
    },
    {
      field:'investor_pan',
      header:'PAN',
      width:'8rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'investor_email',
      header:'Email',
      width:'20rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'investor_mobile',
      header:'Mobile',
      width:'7rem',
      isVisible:[1,2,3,4,12]
    },
    // {
    //   field:'invester_name',
    //   header:'Invester'
    // },
    {
      field:'folio_no',
      header:'Folio',
      width:'9rem',
      isVisible:[1,12]
    }, 
    {
      field:'policy_no',
      header:'Policy No',
      width:'9rem',
      isVisible:[3]
    }, 
    {
      field:'fdr_no',
      header:'FDR No',
      width:'9rem',
      isVisible:[2,4]
    },
    {
      field:'application_no',
      header:'Application No',
      width:'9rem',
      isVisible:[1,2,3]
    }, 
    {
      field:'client_code',
      header:'Client Code',
      width:'9rem',
      isVisible:[12]
    }, 
    {
      field:'query_given_by',
      header:'Query Given By',
      width:'9rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'amc_name',
      header:'AMC',
      width:'20rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'20rem',
      isVisible:[1,2,4,12]
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
      width:'17rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_subtype',
      header:'Query Subtype',
      width:'17rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_details',
      header:'Query Details',
      width:'30rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_receive_through',
      header:'Query Receive Through',
      width:'12rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_nature',
      header:'Query Nature',
      width:'11rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_given_to_amc_or_company',
      header:'Query Given To AMC/Company',
      width:'10rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_given_through',
      header:'Query Given Through',
      width:'13rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'concern_person_name',
      header:'Concern Person Name',
      width:'16rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'contact_no',
      header:'Concern Person Contact No.',
      width:'10rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'email_id',
      header:'Concern Person Email',
      width:'15rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'level',
      header:'Level',
      width:'5rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_tat',
      header:'Query TAT',
      width:'5rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'expected_close_date',
      header:'Expected Closed Date',
      width:'14rem',
      isVisible:[1,2,3,4,12]
    },
    
    {
      field:'actual_close_date',
      header:'Actual Close Date Time',
      width:'14rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'tat_expired',
      header:'TAT Expired ',
      width:'5rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'tat_remarks',
      header:'TAT Remarks ',
      width:'15rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_inform_status',
      header:'Query Inform Status',
      width:'8rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_inform_date',
      header:'Query Inform Date Time',
      width:'16rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_inform_through',
      header:'Query Inform Through',
      width:'14rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'feedback_url',
      header:'Feedback URL',
      width:'7rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_feedback_received',
      header:'Query Feedback Receive',
      width:'8rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'suggestion',
      header:'Query Suggestion',
      width:'15rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'query_feedback',
      header:'Query Feedback',
      width:'15rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'rating',
      header:'Rating',
      width:'5rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'remarks',
      header:'Remarks',
      width:'18rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'view',
      header:'View Attachments',
      width:'3rem',
      isVisible:[1,2,3,4,12]
    },
    {
      field:'action',
      header:'Action',
      width:'5rem',
      isVisible:[1,2,3,4,12]
    }
  ]
}






