import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { amc } from 'src/app/__Model/amc';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import periods from '../../../../../../../assets/json/Product/MF/ScmBenchmark/periods.json';
import { MultiSelectComponent } from 'ng-multiselect-dropdown';
import { tempProfile } from 'src/app/__Utility/Master/Company/tempProfile';
import { DOCUMENT, DatePipe } from '@angular/common';
import { Calendar } from 'primeng/calendar';
import { Table } from 'primeng/table';
import { dates } from 'src/app/__Utility/disabledt';
import { plan } from 'src/app/__Model/plan';
import navFinderType from '../../../../../../../assets/json/Product/MF/Reasearch/navfinderType.json';
@Component({
  selector: 'app-nav-finder',
  templateUrl: './nav-finder.component.html',
  styleUrls: ['./nav-finder.component.css'],
})
export class NavFinderComponent implements OnInit, Nav {
  @ViewChild('amcDrpdown') amcDrpdown: MultiSelectComponent;
  @ViewChild('dateRng') date_range: Calendar;
  @ViewChild('primeTbl') primeTbl: Table;
  searchNavForm = new FormGroup({
    amc_id: new FormControl([], { updateOn: 'blur' }),
    cat_id: new FormControl([], { updateOn: 'blur' }),
    subcat_id: new FormControl([], { updateOn: 'blur' }),
    scheme_id: new FormControl([]),
    date_periods: new FormControl(''),
    date_range: new FormControl(''),
    plan_type: new FormControl(),
  });


  navTab = navFinderType;

  amc_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'amc_short_name',
    'Select AMC',
    1
  );

  cat_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Select Category'
  );

  subcat_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Select Sub Category',
    1
  );

  scheme_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Select Scheme',
    1
  );

  maxDt:Date = dates.calculateDates('T');

  minDt:Date = null;

  navClmns: column[] = NavFinderColumns.column;

  navDt: nav[] = [];

  amc_dtls: amc[] = [];

  cat_dtls: category[] = [];

  subcat_dtls: subcat[] = [];

  scheme_dtls: scheme[] = [];

  md_plan:plan[] = [];

  nav_type_flag:string = navFinderType[0].flag;

  period: { id: string; periods: string }[] = periods;

  constructor(
    private utility: UtiliService,
    private dbIntr: DbIntrService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.getPlan();
    this.getAmcMst();
    // setTimeout(() => {
    //   this.getNav();
    // }, 500);
  }

  getNavDt(): void {}

  filterNav(): void {}



  ngAfterViewInit() {

    /*** AMC Event Change */
    this.searchNavForm.controls['amc_id'].valueChanges.subscribe((res) => {
      this.getCategoryMst(res);
      this.getSubCategoryMst(res, this.searchNavForm.value.cat_id);
      this.getSchemeMst(
        res,
        this.searchNavForm.value.cat_id,
        this.searchNavForm.value.subcat_id
      );
    });
    /*** END */

    /*** Category Event Change */
    this.searchNavForm.controls['cat_id'].valueChanges.subscribe((res) => {
      this.getSubCategoryMst(this.searchNavForm.value.amc_id, res);
      this.getSchemeMst(
        this.searchNavForm.value.amc_id,
        res,
        this.searchNavForm.value.subcat_id
      );
    });
    /*** END */

    /*** SubCategory Event Change */
    this.searchNavForm.controls['subcat_id'].valueChanges.subscribe((res) => {
      this.getSchemeMst(
        this.searchNavForm.value.amc_id,
        this.searchNavForm.value.cat_id,
        res
      );
    });
    /*** END */

    this.searchNavForm.controls['date_periods'].valueChanges.subscribe(
      (res) => {
        this.searchNavForm.get('date_range').setValue('');
        this.maxDt =dates.calculateDates('T');
        this.minDt = null;
      }
    );


    this.searchNavForm.controls['scheme_id'].valueChanges.subscribe(
      (res) => {
        if(this.searchNavForm.value.date_periods == 'Y' || this.searchNavForm.value.date_periods == 'H'){
            this.minDt = null;
            this.maxDt = dates.calculateDates('T');
            // this.searchNavForm.get('date_periods').setValue('D');
        }
        else{
        if(this.searchNavForm.value.date_range!=null){
        if(this.searchNavForm.value.date_range[0] != null && this.searchNavForm.value.date_range[1]!= null){
          if(res.length == 1){
              this.minDt = null;
              this.maxDt = dates.calculateDates('T');
           }
           else{
            console.log(this.searchNavForm.value.date_range[0]);
            let dt = new Date(this.searchNavForm.value.date_range[0]);
            dt.setFullYear(dt.getFullYear() + 1);
            this.minDt = this.searchNavForm.value.date_range[0];
            this.setMaxDate(this.minDt);
            console.log(this.searchNavForm.value.date_range[1])
            if(this.searchNavForm.value.date_range[1] > this.maxDt){
              this.searchNavForm.get('date_range').setValue(
                this.searchNavForm.value.date_range[0],
                this.maxDt
              );
            }
            }
            }
       }
       }
    }
    );


    this.searchNavForm.controls['date_range']
     .valueChanges.subscribe(res =>{
           if(res == null){
            this.maxDt =dates.calculateDates('T');
            this.minDt = null;
           }
     })
  }

  getColumnsForFilter(): string[] {
    return this.utility.getColumns(this.navClmns);
  }

  getAmcMst = () => {
    this.dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.amc_dtls = res;
      });
  };

  getPlan = () =>{
    this.dbIntr.api_call(0,'/plan',null).pipe(pluck('data')).subscribe((res:plan[]) =>{
     this.md_plan = res;
     this.searchNavForm.controls['plan_type'].setValue(res.length > 0 ? res[0]?.id : res.length);
     this.getNav();
    })
  }

  getCategoryMst = (amc_id: amc[]) => {
    if (amc_id.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/category',
          'arr_amc_id=' + this.utility.mapIdfromArray(amc_id, 'id')
        )
        .pipe(pluck('data'))
        .subscribe((res: category[]) => {
          this.cat_dtls = res;
        });
    } else {
      this.cat_dtls = [];
      this.searchNavForm.controls['cat_id'].setValue([]);
    }
  };

  getSubCategoryMst = (amc_id: amc[], cat: category[]) => {
    if (amc_id.length > 0 && cat.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/subcategory',
          'arr_amc_id=' +
            this.utility.mapIdfromArray(amc_id, 'id') +
            '&arr_cat_id=' +
            this.utility.mapIdfromArray(cat, 'id')
        )
        .pipe(pluck('data'))
        .subscribe((res: subcat[]) => {
          this.subcat_dtls = res;
        });
    } else {
      this.subcat_dtls = [];
      this.searchNavForm.controls['subcat_id'].setValue([]);
    }
  };

  getSchemeMst = (amc: amc[], cat: category[], subcat: subcat[]) => {
    if (amc.length > 0 && cat.length > 0 && subcat.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/scheme',
          'arr_amc_id=' +
            this.utility.mapIdfromArray(amc, 'id') +
            '&arr_cat_id=' +
            this.utility.mapIdfromArray(cat, 'id') +
            '&arr_subcat_id=' +
            this.utility.mapIdfromArray(subcat, 'id')
        )
        .pipe(pluck('data'))
        .subscribe((res: scheme[]) => {
          this.scheme_dtls = res;
        });
    } else {
      this.scheme_dtls = [];
      this.searchNavForm.controls['scheme_id'].setValue([]);
    }
  };

  deSelect = (ev, mode: string) => {};

  setTodayDate():Date{
     return dates.calculateDates('T');
  }

  setEndDate  =  () =>{
  this.minDt = null;
  this.maxDt = this.setTodayDate();
  console.log(this.searchNavForm.value.scheme_id.length);
  if(this.searchNavForm.value.scheme_id.length == 1){
    this.maxDt = this.setTodayDate();
  }
  else{
    switch(this.searchNavForm.value.date_periods){
      case 'D':
      case 'F':
      case 'M':
      case 'W':
        this.minDt = this.searchNavForm.get('date_range').value[0];
        this.setMaxDate(this.minDt);
        break;
      default:break;

    }
  }
    if(this.searchNavForm.get('date_range').value[1]){
      this.date_range.toggle();
    }
  }

  setMaxDate = (start_date:Date) =>{
    const  dt = new Date(start_date);
    dt.setFullYear(start_date.getFullYear() + 1);
    if(dt > new Date()){
      this.maxDt = dates.calculateDates('T');
    }
    else{
      this.maxDt = dt;
    }
  }

  searchNav = () => {
   if(this.nav_type_flag  == 'H'){
     if(this.searchNavForm.invalid){
      this.utility.showSnackbar('Please Select Valid date range and date periods',2);
      return;
     }
    }
     this.getNav();
  };

  getNav = () =>{
    let dt = Object.assign({}, this.searchNavForm.getRawValue(), {
      amc_id: this.utility.mapIdfromArray(
        this.searchNavForm.getRawValue().amc_id,
        'id'
      ),
      cat_id: this.utility.mapIdfromArray(
        this.searchNavForm.getRawValue().cat_id,
        'id'
      ),
      subcat_id: this.utility.mapIdfromArray(
        this.searchNavForm.getRawValue().subcat_id,
        'id'
      ),
      scheme_id: this.utility.mapIdfromArray(
        this.searchNavForm.getRawValue().scheme_id,
        'id'
      ),
      date_periods: this.nav_type_flag == 'L' ? 'D' : this.searchNavForm.value.date_periods,
      date_range:this.nav_type_flag == 'L' ? this.getPreviousDate() :  this.date_range.inputFieldValue
    });
    this.dbIntr
      .api_call(1, '/showNAVDetails', this.utility.convertFormData(dt))
      .pipe(pluck('data'))
      .subscribe((res: nav[]) => {
        this.navDt = res;
      });
  }


  getPreviousDate():string{
      let dt = new Date();
      let datePipe = new DatePipe('en-US');
      dt.setDate(dt.getDate() - 1);
      return `${datePipe.transform(dt,'dd/MM/YYYY')} - ${datePipe.transform(dt,'dd/MM/YYYY')}`
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value, 'contains');
  };

  changeTabDtls = (ev) =>{
    this.nav_type_flag = navFinderType[ev.index].flag;
    /**
     * set or remove validators depending on tab choose
     */
    this.setValidators(this.nav_type_flag);
    /**
     * If Latest Nav is selected then call api by default otherwise no need to
     * call API
     */
    this.reset();
    if(this.nav_type_flag == 'L'){
      this.getNav()
    }
    else{
         this.navDt = [];
    }

  }

  reset = () =>{
    this.searchNavForm.patchValue({
      amc_id: [],
      cat_id: [],
      subcat_id: [],
      scheme_id: [],
      date_periods: 'D',
      date_range: '',
      plan_type: 1,
    });
    this.minDt = null;
    this.maxDt = dates.calculateDates('T');
  }

  setValidators(flag:string){
    this.searchNavForm.get('date_periods').setValidators(flag == 'L' ? null : [Validators.required]);
    this.searchNavForm.get('date_range').setValidators(flag == 'L' ? null : [Validators.required]);

  }

}



export class NavFinderColumns {
  static column: column[] = [
    { field: 'sl_no', header: 'Sl No', width: '6rem' },
    { field: 'amc_short_name', header: 'AMC', width: '22rem' },
    { field: 'scheme_name', header: 'Scheme', width: '32rem' },
    { field: 'cat_name', header: 'Category', width: '10rem' },
    { field: 'subcat_name', header: 'Sub category', width: '20rem' },
    { field: 'nav_date', header: 'Nav Date', width: '10rem' },
    { field: 'nav', header: 'Nav', width: '10rem' },
    { field: 'change_nav', header: 'Change', width: '10rem' },
    { field: 'change_percentage', header: '% of change from prv', width: '12rem' }
  ];
}

export interface Nav {



  getPreviousDate():string;

  /**
   *  Event fired after change tab
   *  @params ev
   */
  changeTabDtls:(ev)=>void;

  /**
   *   for holding Plan Master data
   */
  md_plan:plan[];

  /**
   *  Maximum Date selection
   */
  maxDt: Date;

 /**
   *  Maximum Date selection
  */
  minDt:Date;

  /**
   * holding AMC details
   */
  amc_dtls: amc[];

  /**
   * holding Category details
   */
  cat_dtls: category[];

  /**
   * holding Sub-category details
   */
  subcat_dtls: subcat[];

  /**
   * holding Scheme details
   */
  scheme_dtls: scheme[];

  /**
   * holding nav details
   */
  navDt: nav[];

  /**
   * Holding Columns for NAV
   */
  navClmns: column[];

  /**
   * Form For Search Nav
   */
  searchNavForm: FormGroup | undefined;

  /**
   * Settings for AMC
   */
  amc_settings: any;

  /**
   * Settings for Category
   */
  cat_settings: any;

  /**
   * Settings for Subcategory
   */
  subcat_settings: any;

  /**
   * Settings for Scheme
   */
  scheme_settings: any;

  getAmcMst: () => void;

   /**
    *
    * @returns Get Plan Master data
    */
   getPlan:()=> void;

  /**
   * get category against selected AMC
   * @param amc_id
   * @returns
   */
  getCategoryMst: (amc_id: amc[]) => void;

  /**
   * get Subcategory against selected AMC & Category
   * @param amc_id
   * @param cat
   * @returns
   */
  getSubCategoryMst: (amc_id: amc[], cat: category[]) => void;

  /**
   * Function for deselect AMC / Category / Sub Category
   * @param mode
   * @param ev
   * @returns
   */
  deSelect: (ev, mode: string) => void;

  /**
   * get Scheme against selected AMC & Category & Subcategory
   * @param amc_id
   * @param cat
   * @param subcat
   * @returns
   */
  getSchemeMst: (amc_id: amc[], cat: category[], subcat: subcat[]) => void;

  /**
   * Call API to get nav details
   */
  getNavDt(): void;

  /**
   * Apply filter for getting nav details
   */
  filterNav(): void;

  /**
   * Get Columns for Filter
   */
  getColumnsForFilter(): string[];
}

export interface nav {
  amc_short_name: string;
  amc_name: string;
  scheme_name: string;
  plan_name:string;
  option_name:string;
  cat_name: string;
  subcat_name: string;
  nav_date: Date | null;
  nav: Number;
  id: Number;
  change_nav:string;
  change_percentage:string;
}
