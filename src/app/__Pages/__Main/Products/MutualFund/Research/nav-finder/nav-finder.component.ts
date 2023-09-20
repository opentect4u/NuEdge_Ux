import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { DOCUMENT } from '@angular/common';
import { Calendar } from 'primeng/calendar';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-nav-finder',
  templateUrl: './nav-finder.component.html',
  styleUrls: ['./nav-finder.component.css'],
})
export class NavFinderComponent implements OnInit, Nav {

  @ViewChild('amcDrpdown') amcDrpdown:MultiSelectComponent;
  @ViewChild('dateRng') date_range:Calendar;
  @ViewChild('primeTbl') primeTbl :Table;
  searchNavForm = new FormGroup({
    amc_id: new FormControl([], { updateOn: 'blur' }),
    cat_id: new FormControl([], { updateOn: 'blur' }),
    subcat_id: new FormControl([], { updateOn: 'blur' }),
    scheme_id: new FormControl([]),
    date_periods:new FormControl('D'),
    date_range:new FormControl(''),
    plan_type:new FormControl('D')
  });

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

  navClmns: column[] = NavFinderColumns.column;

  navDt: nav[] = [];

  amc_dtls: amc[] = [];

  cat_dtls: category[] = [];

  subcat_dtls: subcat[] = [];

  scheme_dtls: scheme[] = [];

  period:{id:string,periods:string}[] = periods;

  constructor(
    private utility: UtiliService,
    private dbIntr: DbIntrService,
    @Inject(DOCUMENT) private document: Document
    ) {}

  ngOnInit(): void {
    this.getAmcMst();
  }

  getNavDt(): void {}

  filterNav(): void {}

  ngAfterViewInit() {
    /*** AMC Event Change */
    this.searchNavForm.controls['amc_id'].valueChanges.subscribe((res) => {
      this.getCategoryMst(res);
      this.getSubCategoryMst(res,this.searchNavForm.value.cat_id);
      this.getSchemeMst(
        res,
        this.searchNavForm.value.cat_id,
        this.searchNavForm.value.subcat_id)
    });
    /*** END */

    /*** Category Event Change */
    this.searchNavForm.controls['cat_id'].valueChanges.subscribe((res) => {
      this.getSubCategoryMst(this.searchNavForm.value.amc_id,res);
      this.getSchemeMst(
        this.searchNavForm.value.amc_id,
        res,
        this.searchNavForm.value.subcat_id);
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


    this.searchNavForm.controls['date_periods'].valueChanges.subscribe(res =>{
      this.searchNavForm.get('date_range').setValue('');
    })
  }

  getColumnsForFilter(): string[] {
    return this.utility.getColumns(this.navClmns);
  }

  getAmcMst = () => {
    this.dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {this.amc_dtls = res;});
  };

  getCategoryMst = (amc_id:amc[]) => {
    if(amc_id.length > 0){
      this.dbIntr
      .api_call(0, '/category', 'arr_amc_id='+ this.utility.mapIdfromArray(amc_id,'id'))
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {this.cat_dtls = res;});
    }
    else{
      this.cat_dtls = [];
      this.searchNavForm.controls['cat_id'].setValue([]);
    }

  };


  getSubCategoryMst =  (amc_id: amc[], cat: category[]) => {
    if(amc_id.length > 0 && cat.length > 0){
      this.dbIntr
      .api_call(0, '/subcategory',
      'arr_amc_id='+ this.utility.mapIdfromArray(amc_id,'id')
      + '&arr_cat_id='+ this.utility.mapIdfromArray(cat,'id')
      )
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {this.subcat_dtls = res;});
    }
    else{
      this.subcat_dtls = [];
      this.searchNavForm.controls['subcat_id'].setValue([]);
    }
  }

  getSchemeMst = (amc:amc[],cat:category[],subcat:subcat[]) =>{
    if(amc.length > 0 && cat.length > 0 && subcat.length > 0){
      this.dbIntr
      .api_call(0,
      '/scheme',
      'arr_amc_id='+ this.utility.mapIdfromArray(amc,'id')
      + '&arr_cat_id='+ this.utility.mapIdfromArray(cat,'id')
      + '&arr_subcat_id='+ this.utility.mapIdfromArray(subcat,'id'))
      .pipe(pluck('data'))
      .subscribe((res: scheme[]) => {this.scheme_dtls = res;});
    }
    else{
      this.scheme_dtls = [];
      this.searchNavForm.controls['scheme_id'].setValue([]);
    }

  }


  deSelect = (ev,mode: string) => {
    // console.log(ev);
    // console.log(mode);
    // // console.log(this.amcDrpdown.);
    // switch(mode){
    //   case 'A':
    //     this.searchNavForm.controls['amc_id'].setValue(
    //       this.amc_dtls.filter(el =>
    //         this.amcDrpdown.selectedItems.map(item => item.id).includes(el.id)
    //         )
    //       );
    //   break;
    //   case 'C':
    //   this.searchNavForm.controls['cat_id'].setValue(this.searchNavForm.value.cat_id.filter(item => item.id != ev.id))
    //   break;
    //   case 'S':
    //   this.searchNavForm.controls['subcat_id'].setValue(this.searchNavForm.value.subcat_id.filter(item => item.id != ev.id))
    //   break;
    //   case 'S':
    //   this.searchNavForm.controls['scheme_id'].setValue(this.searchNavForm.value.scheme_id.filter(item => item.id != ev.id))
    //   break;
    // }
  }

  searchNav = () =>{
    console.log(this.date_range.inputFieldValue);
    let dt =  Object.assign({}, this.searchNavForm.getRawValue(), {
         amc_id:this.utility.mapIdfromArray(this.searchNavForm.getRawValue().amc_id,'id'),
         cat_id:this.utility.mapIdfromArray(this.searchNavForm.getRawValue().cat_id,'id'),
         subcat_id:this.utility.mapIdfromArray(this.searchNavForm.getRawValue().subcat_id,'id'),
         scheme_id:this.utility.mapIdfromArray(this.searchNavForm.getRawValue().scheme_id,'id'),
        date_range: this.date_range.inputFieldValue
    });
    console.log(dt);
    this.dbIntr.api_call(1,'/showNAVDetails',
    this.utility.convertFormData(dt)
    ).pipe(pluck('data')).subscribe((res: nav[]) =>{
      console.log(res);
      this.navDt = res;

    })
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

}

export class NavFinderColumns {
  static column: column[] = [
    { field: 'sl_no', header: 'Sl No', width: '10rem' },
    { field: 'amc_short_name', header: 'AMC', width: '30rem' },
    { field: 'scheme_name', header: 'Scheme', width: '30rem' },
    { field: 'cat_name', header: 'Category', width: '15rem' },
    { field: 'subcat_name', header: 'Sub category', width: '20rem' },
    { field: 'nav_date', header: 'Nav Date', width: '15rem' },
    { field: 'nav', header: 'Nav', width: '15rem' },
  ];
}

export interface Nav {
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
  deSelect: (ev,mode: string) => void;

  /**
   * get Scheme against selected AMC & Category & Subcategory
   * @param amc_id
   * @param cat
   * @param subcat
   * @returns
   */
  getSchemeMst: (amc_id:amc[],cat:category[],subcat:subcat[]) => void

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
  amc_name:string;
  scheme_name: string;
  cat_name: string;
  subcat_name: string;
  nav_date: Date | null;
  nav: Number;
  id: Number;
}
