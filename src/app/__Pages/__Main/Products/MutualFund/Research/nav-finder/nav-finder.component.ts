import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { amc } from 'src/app/__Model/amc';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-nav-finder',
  templateUrl: './nav-finder.component.html',
  styleUrls: ['./nav-finder.component.css'],
})
export class NavFinderComponent implements OnInit, Nav {
  searchNavForm = new FormGroup({
    amc_id: new FormControl([], { updateOn: 'blur' }),
    cat_id: new FormControl([], { updateOn: 'blur' }),
    subcat_id: new FormControl([], { updateOn: 'blur' }),
    scheme_id: new FormControl([]),
  });

  amc_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'amc_short_name',
    'Select AMC'
  );

  cat_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Select Category'
  );

  subcat_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'subcat_name',
    'Select Sub Category'
  );

  scheme_settings = this.utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Select Scheme'
  );

  navClmns: column[] = NavFinderColumns.column;

  navDt: nav[] = [];

  amc_dtls: amc[] = [];

  cat_dtls: category[] = [];

  subcat_dtls: subcat[] = [];

  scheme_dtls: scheme[] = [];

  constructor(private utility: UtiliService, private dbIntr: DbIntrService) {}

  ngOnInit(): void {
    // console.log(this.amc_settings.);
    // this.getAmcMst();
  }

  getNavDt(): void {}

  filterNav(): void {}

  ngAfterViewInit() {
    /*** AMC Event Change */
    this.searchNavForm.controls['amc_id'].valueChanges.subscribe((res) => {
      console.log(res);
    });
    /*** END */

    /*** Category Event Change */
    this.searchNavForm.controls['cat_id'].valueChanges.subscribe((res) => {
      console.log(res);
    });
    /*** END */

    /*** SubCategory Event Change */
    this.searchNavForm.controls['subcat_id'].valueChanges.subscribe((res) => {
      console.log(res);
    });
    /*** END */
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
    this.dbIntr
      .api_call(0, '/category', 'arr_amc_id='+ this.utility.mapIdfromArray(amc_id,'id'))
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {this.cat_dtls = res;});
  };


  getSubCategoryMst =  (amc_id: amc[], cat: category[]) => {
    this.dbIntr
    .api_call(0, '/subCategory',
    'arr_amc_id='+ this.utility.mapIdfromArray(amc_id,'id')
    + '&arr_cat_id='+ this.utility.mapIdfromArray(cat,'id')
    )
    .pipe(pluck('data'))
    .subscribe((res: subcat[]) => {this.subcat_dtls = res;});
  }

  deSelect = (mode: string) => {
    console.log(mode);
    switch(mode){
      case 'A': break;
      case 'C': break;
      case 'S': break;
    }
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
   * @returns
   */
  deSelect: (mode: string) => void;

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
  scheme_name: string;
  cat_name: string;
  subcat_name: string;
  nav_date: Date | null;
  nav: Number;
  id: Number;
}
