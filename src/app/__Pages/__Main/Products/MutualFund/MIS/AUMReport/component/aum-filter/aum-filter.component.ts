import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import filterOpt from '../../../../../../../../../assets/json/filterOption.json';
import { Calendar } from 'primeng/calendar';
import moment from 'moment';
export enum AUTMTYPE{
    "Fund House" = 'Fund House',
    Families = 'Families',
    Clients = 'Clients',
    Schemes = 'Scheme',
    "Assets Allocation"="Assets Allocation",
    Registrar="Registrar",
    Branch="Branch"
}

@Component({
  selector: 'aum-filter',
  templateUrl: './aum-filter.component.html',
  styleUrls: ['./aum-filter.component.css']
})
export class AumFilterComponent implements OnInit {




 /**
 *  getAccess of Prime Ng Calendar
 */
  @ViewChild('dateRng') daterRnge:Calendar;
  settingsforSubCatDropdown = this.utility.settingsfroMultiselectDropdown('id','subcategory_name','Search Sub-Category',1);
  settingsforCatDropdown = this.utility.settingsfroMultiselectDropdown('id','cat_name','Search Category',1);
  settingsforAMCDropdown = this.utility.settingsfroMultiselectDropdown('id','amc_short_name','Search AMC',1);
  settingsforSchemeDropdown = this.utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforBrnchDropdown = this.utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1,90);
  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',1,90);
  settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
  settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
  settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);


  aum_type: 'Fund House' | 'Families' | 'Clients' | 'Scheme' | 'Assets Allocation' | 'Registrar' | 'Branch' | 'City Type' | 'Growth' | 'Top Clients' = 'Fund House';

  aum_report_filter_frm = new FormGroup({
      date: new FormControl(new Date()),
      city_type_id:new FormControl(''),
      arn_no: new FormControl(''),
      folio_type: new FormControl('C'),
      export_type: new FormControl('W'),
      amc_id: new FormControl([], { updateOn: 'change' }),
      cat_id: new FormControl([], { updateOn: 'change' }),
      sub_cat_id: new FormControl([], { updateOn: 'change' }),
      scheme_id: new FormControl([]),
      brn_cd: new FormControl([], { updateOn: 'change' }),
      bu_type_id: new FormControl([], { updateOn: 'change' }),
      rm_id: new FormControl([], { updateOn: 'change' }),
      sub_brk_cd: new FormControl([], { updateOn: 'change' }),
      euin_no: new FormControl([]),
  })

  md_arn:string[]= [];

  date_range:string[] = [];

  amcMst:amc[] = [];

  catMst:category[] = [];
  
  subcatMst:subcat[] = [];

  schemeMst:scheme[] = [];

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
     * Holding EUIN Data
    */
  euinMst: any = [];

    /**
   * Holding Advance Filter / Normal Filter
   */
    selectBtn = filterOpt;

   /**
   * hold Button Type Advance Filter / Normal Filter
   */
   btn_type: 'R' | 'A' = 'R';

  @Output() onPress:EventEmitter<FormGroup> = new EventEmitter();

  constructor(private utility:UtiliService,private RouteData:ActivatedRoute,private dbIntr:DbIntrService) {
    RouteData.data.subscribe(res =>{
      console.log(res);
      switch(res?.type){
        case AUTMTYPE['Fund House']: this.aum_type = AUTMTYPE['Fund House'];break;
        case AUTMTYPE.Families: this.aum_type = AUTMTYPE.Families;break;
        case AUTMTYPE.Schemes: this.aum_type = AUTMTYPE.Schemes;break;
        default: this.aum_type = res?.type;break;
      }
    })
  }


  ngOnInit(): void {
    // this.callARN_api();
    // this.getDates();
    // console.log(this.aum_type)
    this.fetchAMC();
  }

  // getDates(){
  //   global.getLastDate(11,5).then((res:string[]) =>{
  //     try{
  //       this.date_range = res;
  //       this.aum_report_filter_frm.get('date').setValue(res.length > 0 ? res[0] : '');
  //     }
  //     catch(err){

  //     }
  //   })
  // }

   ngAfterViewInit(){
        /**
     * Event Trigger after change amc
     */
        this.aum_report_filter_frm.controls['amc_id'].valueChanges.subscribe((res) => {
          this.getCategoryMst(res);
          this.getSubcategoryMst(res, this.aum_report_filter_frm.value.cat_id);
          this.getSchemeMst(
            res,
            this.aum_report_filter_frm.value.cat_id,
            this.aum_report_filter_frm.value.sub_cat_id
          );
        });
        /**
         * Event Trigger after change category
         */
        this.aum_report_filter_frm.controls['cat_id'].valueChanges.subscribe((res) => {
          this.getSubcategoryMst(this.aum_report_filter_frm.value.amc_id, res);
          this.getSchemeMst(
            this.aum_report_filter_frm.value.amc_id,
            res,
            this.aum_report_filter_frm.value.sub_cat_id
          );
        });
        /**
         * Event Trigger after change subcategory
         */
        this.aum_report_filter_frm.controls['sub_cat_id'].valueChanges.subscribe((res) => {
          this.getSchemeMst(
            this.aum_report_filter_frm.value.amc_id,
            this.aum_report_filter_frm.value.cat_id,
            res
          );
        });


         /**
     * Event Trigger after change Branch
     */
    this.aum_report_filter_frm.controls['brn_cd'].valueChanges.subscribe((res) => {
      console.log(res);
      this.getBusinessTypeMst(res);
    });

    /**
     * Event Trigger after Business Type
     */
    this.aum_report_filter_frm.controls['bu_type_id'].valueChanges.subscribe((res) => {
      console.log(res);
      if(res.length > 0){
        this.disabledSubBroker(res);
        this.getRelationShipManagerMst(res, this.aum_report_filter_frm.value.brn_cd);
      }
      else{
          this.RmMst = [];
          this.subbrkArnMst =[];
          this.euinMst = [];
          this.aum_report_filter_frm.get('euin_no').setValue([]);
          this.aum_report_filter_frm.get('sub_brk_cd').setValue([]);
          this.aum_report_filter_frm.get('rm_id').setValue([]);
      }
      
    });

    /**
     * Event Trigger after Rlationship Manager
     */
    this.aum_report_filter_frm.controls['rm_id'].valueChanges.subscribe((res) => {
      if (
        this.aum_report_filter_frm.value.bu_type_id.findIndex(
          (item) => item.bu_code == 'B'
        ) != -1
      ) {
        this.getSubBrokerMst(res);
      } else {
        this.euinMst=[];
        this.euinMst = res;
      }
    });
   }

  /* Call API For Getting ARN NUMBER */
  callARN_api = () =>{
        this.dbIntr.api_call(0,'/employee',null).pipe(pluck('data')).subscribe((res:any) =>{
          this.md_arn = res.map(el => el.arn_no)
        })
  }
  /* END */

  clickToSend = () =>{
      console.log(this.aum_report_filter_frm.value.date);
      const payload = {
        ...this.aum_report_filter_frm.value,
        date:this.aum_report_filter_frm.value.date ? moment(this.aum_report_filter_frm.value.date).format('YYYY-MM-DD') : '',
        amc_id:this.aum_report_filter_frm.value.amc_id.map(el => el.id),
        scheme_id:this.aum_report_filter_frm.value.scheme_id.map(el => el.id),
        sub_cat_id:this.aum_report_filter_frm.value.sub_cat_id.map(el => el.id),
        cat_id:this.aum_report_filter_frm.value.cat_id.map(el => el.id),
        bu_type_id:this.btn_type == 'A' ? this.aum_report_filter_frm.value.bu_type_id.map(el => el.bu_code) : [],
        brn_cd:this.btn_type == 'A' ? this.aum_report_filter_frm.value.brn_cd.map(el => el.id) : [],
        sub_brk_cd:this.btn_type == 'A' ? this.aum_report_filter_frm.value.sub_brk_cd.map(el => el.code) : [],
        rm_id:this.btn_type == 'A' ? this.aum_report_filter_frm.value.rm_id.map(el => el.euin_no) : [],
        euin_no:this.btn_type == 'A' ? this.aum_report_filter_frm.value.euin_no.map(el => el.euin_no) : [],
      }
      this.onPress.emit(payload)

  }

  // clickToSend = () =>{
  //   var formdata = new FormData();
  //   for(let key in this.aum_report_filter_frm.value){
  //     formdata.append(key,this.aum_report_filter_frm.value[key])
  //   }
  //   this.dbIntr.api_call(1,`/clients/${this.getApiName()}`,formdata)
  //   .pipe(pluck('data')).subscribe(res =>{
  //     this.onPress.emit(res)
  //   })
  // }

  // getApiName = () =>{
  //   const key = Object.getOwnPropertyNames(AUM_API).find(el => el == this.aum_type);
  //   return AUM_API[key];
  // }

  fetchAMC = () =>{
    this.dbIntr
    .api_call(0, '/amc', null)
    .pipe(pluck('data'))
    .subscribe((res: amc[]) => {
      this.amcMst = res;
    });
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
      this.aum_report_filter_frm.get('cat_id').reset([], { emitEvent: true });
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
      this.aum_report_filter_frm.get('sub_cat_id').reset([], { emitEvent: true });
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
      this.aum_report_filter_frm.get('scheme_id').reset([]);
    }
  };


  onItemClick = (ev) => {
    if (ev.option.value == 'A') {
      this.getBranchMst();
    } else {
         this.aum_report_filter_frm.patchValue({
          amc_id:[],
          date:'',
         });

         this.aum_report_filter_frm.get('brn_cd').setValue([],{emitEvent:true});
         this.subbrkArnMst = [];
         this.aum_report_filter_frm.controls['sub_brk_cd'].setValue([]);
         this.aum_report_filter_frm.controls['euin_no'].setValue([]);
         this.aum_report_filter_frm.controls['client_name'].setValue('',{emitEvent:false});
        //  this.searchTrxnReport();
    }
  };
  getBranchMst = () =>{
    if(this.branchMst == 0){
      this.dbIntr
      .api_call(0, '/branch', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.branchMst = res;
      });
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
          const code = this.subbrkArnMst.map(el => el.code);
          const dt = this.aum_report_filter_frm.get('sub_brk_cd').value.filter(el => code.includes( el.code));
          this.aum_report_filter_frm.get('sub_brk_cd').setValue(dt,{emitEvent:false});
        });
    } else {
      this.subbrkArnMst = [];
      this.aum_report_filter_frm.controls['sub_brk_cd'].setValue([]);
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
          this.bu_type = res;
          const bu_code = this.bu_type.map(el => el.bu_code);
          const dt = this.aum_report_filter_frm.get('bu_type_id').value.filter(el => bu_code.includes( el.bu_code));
          this.aum_report_filter_frm.get('bu_type_id').setValue(dt,{emitEvent:false});
        });
    } else {
      this.aum_report_filter_frm.controls['bu_type_id'].setValue([], { emitEvent: true });
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
          const euin_no = this.RmMst.map(el => el.euin_no);
          const dt = this.aum_report_filter_frm.get('rm_id').value.filter(el => euin_no.includes( el.euin_no));
          this.aum_report_filter_frm.get('rm_id').setValue(dt,{emitEvent:false});
        });
    } else {
      this.RmMst = [];
      this.aum_report_filter_frm.controls['rm_id'].setValue([],{emitEvent:true});
    }
  }

  disabledSubBroker(bu_type_ids) {
    if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
      this.aum_report_filter_frm.controls['sub_brk_cd'].enable();
    } else {
      this.aum_report_filter_frm.controls['sub_brk_cd'].disable();
      this.aum_report_filter_frm.controls['sub_brk_cd'].setValue([],{emitEvent:false});
      this.subbrkArnMst = [];
    }
  }

}
