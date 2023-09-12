import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-nav-finder',
  templateUrl: './nav-finder.component.html',
  styleUrls: ['./nav-finder.component.css'],
})
export class NavFinderComponent implements OnInit, Nav {
  navClmns: column[] = NavFinderColumns.column;

  navDt: nav[] = [];

  constructor(private utility:UtiliService) {}

  ngOnInit(): void {}

  getNavDt(): void {}

  filterNav(): void {}

  getColumnsForFilter():string[]{
    return this.utility.getColumns(this.navClmns);
  }
}

export class NavFinderColumns {
  static column: column[] = [
    { field: 'sl_no', header: 'Sl No',width:'10rem'},
    { field: 'amc_short_name', header: 'AMC',width:'30rem'},
    { field: 'scheme_name', header: 'Scheme',width:'30rem'},
    { field: 'cat_name', header: 'Category',width:'15rem'},
    { field: 'subcat_name', header: 'Sub category',width:'20rem'},
    { field: 'nav_date', header: 'Nav Date',width:'15rem'},
    { field: 'nav', header: 'Nav',width:'15rem'},
  ];
}

export interface Nav {
  /**
   * Call API to get nav details
   */
  getNavDt(): void;

  /**
   * Apply filter for getting nav details
   */
  filterNav(): void;

  /**
   * holding nav details
   */
  navDt: nav[];

  /**
   * Holding Columns for NAV
   */
  navClmns: column[];


  getColumnsForFilter():string[];
}

export interface nav {
  amc_short_name: string;
  scheme_name: string;
  cat_name: string;
  subcat_name: string;
  nav_date: Date | null;
  nav: Number;
}
