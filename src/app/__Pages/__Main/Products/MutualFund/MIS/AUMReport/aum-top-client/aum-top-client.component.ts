import { Component, OnInit, ViewChild } from '@angular/core';
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
import moment from 'moment';
import { global } from 'src/app/__Utility/globalFunc';
import { Calendar } from 'primeng/calendar';
@Component({
  selector: 'app-aum-top-client',
  templateUrl: './aum-top-client.component.html',
  styleUrls: ['./aum-top-client.component.css']
})
export class AumTopClientComponent implements OnInit {

  selectNumber:number[] = [];

  __formDate:any;

    has_sub_column:boolean = true;

    aum_client_Column:column[] = [];
  
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

  /**
   *  getAccess of Prime Ng Calendar
   */
  @ViewChild('dateRng') dateRange:Calendar;

  duplicateDt = [];

  md_aum_client = [];
  private worker: Worker | null = null;
  private worker_for_footer: Worker | null = null;

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
      date: new FormControl(new Date()),
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

  searchTrxnReport = () => {
    this.__formDate = moment(this.misTrxnRpt.value.date).format('YYYY-MM-DD');
    this.md_aum_client = [];
    this.duplicateDt = [];
    this.isLoaderShown = false;
        console.log(this.misTrxnRpt.value.view_type )
        if(this.misTrxnRpt.value.view_type == 'F'){
            if(!this.misTrxnRpt.value.pan_no){
              this.utility.showSnackbar('Please select family head',2)
              return;
            }
            else if(this.misTrxnRpt.value.family_members.length == 0){
              this.utility.showSnackbar('Please select atleast one family member',2)
              return;
            }
          }
        else if(this.misTrxnRpt.value.view_type == 'C'){
          if(this.misTrxnRpt.value.pan_no || this.misTrxnRpt.getRawValue().client_name){}
          else{
              this.utility.showSnackbar('Please select investor',2)
                return;
          }
        }
    this.has_sub_column = this.misTrxnRpt.value.view_type != 'F';

        const TrxnDt = new FormData();
        TrxnDt.append('view_type',this.misTrxnRpt.value.view_type);
        TrxnDt.append('client_name',this.misTrxnRpt.getRawValue().client_name);
        TrxnDt.append('family_members_pan',this.misTrxnRpt.value.view_type == 'F' ? this.utility.mapIdfromArray(this.misTrxnRpt.value.family_members.filter(item => item.pan),'pan') : '[]');
        TrxnDt.append('family_members_name',this.misTrxnRpt.value.view_type == 'F' ? this.utility.mapIdfromArray(this.misTrxnRpt.value.family_members.filter(item => !item.pan),'client_name') : '[]');
        // TrxnDt.append('date_range',global.getActualVal(this.dateRange.inputFieldValue));
        TrxnDt.append('date',this.misTrxnRpt.value.date ?  moment(this.misTrxnRpt.value.date).format('YYYY-MM-DD') : '');
        TrxnDt.append('folio_no',global.getActualVal(this.misTrxnRpt.value.folio_no));
        TrxnDt.append('number',global.getActualVal(this.misTrxnRpt.value.number));
        // TrxnDt.append('client_id',global.getActualVal(this.misTrxnRpt.value.client_id));
        TrxnDt.append('amc_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.amc_id, 'id'));
        TrxnDt.append('cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.cat_id, 'id'));
        TrxnDt.append('sub_cat_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.sub_cat_id, 'id'));
        TrxnDt.append('pan_no',this.misTrxnRpt.value.pan_no ? this.misTrxnRpt.value.pan_no : '');
        TrxnDt.append('scheme_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.scheme_id, 'id'));
        // TrxnDt.append('trans_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_type_id,'trans_type'));
        // TrxnDt.append('trans_sub_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.trxn_sub_type_id,'trans_sub_type'));
        if (this.btn_type == 'A') {
          TrxnDt.append('euin_no',this.utility.mapIdfromArray(this.misTrxnRpt.value.euin_no, 'euin_no'));
          TrxnDt.append('brn_cd',this.utility.mapIdfromArray(this.misTrxnRpt.value.brn_cd, 'id'));
          TrxnDt.append('rm_id',this.utility.mapIdfromArray(this.misTrxnRpt.value.rm_id, 'euin_no'));
          TrxnDt.append('bu_type',this.utility.mapIdfromArray(this.misTrxnRpt.value.bu_type_id, 'bu_code'));
          TrxnDt.append('sub_brk_cd',this.utility.mapIdfromArray(this.misTrxnRpt.getRawValue().sub_brk_cd, 'code'));
        }
        if(this.worker_for_footer){
          this.worker_for_footer.terminate();
        }
        if(this.worker){
          this.worker.terminate();
        }
          
          this.dbIntr.api_call(1,'/clients/aumClient',TrxnDt)
          .pipe(pluck('data')).subscribe((res:any) =>{
            console.log(this.misTrxnRpt.value.view_type);
            this.aum_client_Column = AumClientColumn.column.map(el =>{
                if(el.field == 'client_name'){
                  if(this.misTrxnRpt.value.view_type == 'F'){
                    el.field =  'family_head_name';
                    el.header = 'Family Head / Individual';
                    console.log(el);
                  }
                    
                }
                return el;
              })
            if(this.misTrxnRpt.value.view_type != 'F'){
              this.duplicateDt = res;
              this.isLoaderShown = true;
              this.backgroundProcessing(res);
            }
            else{
              this.populateDtForFamily(res);
            }
        
          })  
     
          
  }


  populateDtForFamily = (res) =>{
                console.log(this.misTrxnRpt.getRawValue().client_name)
                let dt = [];
                let  all_amount_arr = [...(res.map(el => JSON.parse(el.all_amount_arr)))];
                let  all_date_arr = [...res.map(el => JSON.parse(el.all_date_arr))];
                const inv_cost = global.Total__Count(res,(x:any) => x?.total_inv_cost ? Number(x?.total_inv_cost) : 0);
                const idcw_paid = global.Total__Count(res,(x:any) => x?.idcw_paid ? Number(x?.idcw_paid) : 0);
                const idcw_reinv = global.Total__Count(res,(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0);
                const curr_aum = global.Total__Count(res,(x:any) => x?.curr_aum ? Number(x?.curr_aum) : 0);
                const totGainLoss = global.Total__Count(res,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
                const tot_ret_abs = Number(inv_cost) > 0 ? ((totGainLoss / inv_cost) * 100)?.toFixed(2) : 0;
                const xirr = 0;
                const family_head_name = res.filter(el => el.first_client_name == this.misTrxnRpt.getRawValue().client_name?.toUpperCase());
                console.log(family_head_name)
                const xirr_amt_arr = [...all_amount_arr.reduce((acc, val) => acc.concat(val), []),Number(curr_aum.toFixed(2))];
                const xirr_date_arr = [...all_date_arr.reduce((acc, val) => acc.concat(val), []),moment(this.misTrxnRpt.value.date).format('YYYY-MM-DD')];
                dt.push({
                 id:res[0]?.id,
                 client_id:this.utility.EncryptText(family_head_name[0].client_id.toString()),
                  date:this.utility.EncryptText( moment(this.misTrxnRpt.value.date).format('YYYY-MM-DD')),
                 client_name:family_head_name.length > 0 ? `${family_head_name[0]?.first_client_name} [${family_head_name[0]?.first_client_pan}]` : '',
                 pan:family_head_name.length > 0 ? family_head_name[0]?.first_client_pan : '',
                 family_head_name:family_head_name.length > 0 ?  `${family_head_name[0]?.first_client_name} [${family_head_name[0]?.first_client_pan}]` : '',
                 inv_cost:inv_cost,
                 idcw_paid:idcw_paid,
                 idcw_reinv:idcw_reinv,
                 curr_aum:curr_aum,
                 gain_loss:totGainLoss,
                 Investment:inv_cost,
                 AUM:curr_aum,
                 "IDCW Reinv.":idcw_reinv,
                 "IDCWP":idcw_paid,
                 "Abs. Return":tot_ret_abs,
                 xirr:xirr,
                 xirr_amt_arr:xirr_amt_arr,
                 xirr_date_arr:xirr_date_arr,
                  ret_abs:tot_ret_abs,
                  schemes:res,
                  total:{
                    inv_cost:inv_cost,
                    idcw_paid:idcw_paid,
                    idcw_reinv:idcw_paid,
                    curr_aum:curr_aum,
                    abs_rtn:tot_ret_abs,
                    family_head_name:"TOTAL",
                    xirr:0
                  }
                });
                console.log(dt)
                this.duplicateDt = res;
                this.isLoaderShown = false;
                this.md_aum_client = dt;
                this.createParentFooter(dt);
    }


    backgroundProcessing = (res) =>{
      try{
        if (typeof Worker !== 'undefined') {
          // Create a new
          this.worker = new Worker(new URL('../aum-client/aum-by-client-calculations.worker', import.meta.url));
          this.worker.onmessage = ({ data }) => {
            const main_res = data.sort((firstEl,secondEl)=> secondEl.curr_aum - firstEl.curr_aum).slice(0,this.misTrxnRpt.value.number ? this.misTrxnRpt.value.number : data.length)
            this.createParentFooter(main_res);
            // this.worker.terminate();
            // this.recursiveBackgroundProcess(data);
            this.md_aum_client = main_res
            this.isLoaderShown = false;
          };
          this.worker.postMessage({
            res:res,
            date:this.__formDate
          });
        } else {
            this.isLoaderShown = false;
            // this.spinner.hide();
        }
      }
      catch(err){
        this.isLoaderShown = false;
        // this.spinner.hide();
      }
      
    }
    createParentFooter = (value) =>{
      const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
      const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
      const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
      let obj = {}
      const dt = value.map(({id,total,schemes,cat_name,amc_weightage_in,
        family_head_name,client_id,date,
        amc_name,gain_loss,amc_code,inv_cost,idcw_paid,idcw_reinv,xirr_amt_arr,xirr_date_arr,
        curr_aum,ret_abs,client_code,client_name,pan,...rest}) => {return {...rest}})
      for(let object of dt) {Object.assign(obj, object)}
      Object.keys(obj).forEach(el =>{
        this.footerDT = {
          ...this.footerDT,
          [el]:el == 'Abs. Return' ? tot_ret_abs.toFixed(2) : (el == 'xirr' ? 'Calculating' : global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)).toFixed(2)),
        }
      })
      this.calculate_XIRR_For_footer(value)
    }

    calculate_XIRR_For_footer(data){
      if (typeof Worker !== 'undefined') {
        // Create a new
        this.worker_for_footer = new Worker(new URL('../aum-client/aum-by-client-footer-calculation.worker', import.meta.url));
        this.worker_for_footer.onmessage = ({ data }) => {
              this.footerDT = {
                ...this.footerDT,
                xirr:data
              }
        };
        this.worker_for_footer.postMessage({
          res:data,
          date:this.__formDate,
          footerDT: this.footerDT
        });
      } else {
      }
    }

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
