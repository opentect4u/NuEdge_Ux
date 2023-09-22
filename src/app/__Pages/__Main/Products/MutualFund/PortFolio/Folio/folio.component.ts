import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-folio',
  templateUrl: './folio.component.html',
  styleUrls: ['./folio.component.css'],
})
export class FolioComponent implements OnInit, IFolioMasterStructure {
  @ViewChild('primeTbl') primeTbl: Table;

  folio_dt: Ifolio[] = [];

  column: column[] = FolioColumn.column;

  constructor(private dbIntr: DbIntrService, private utility: UtiliService) {}

  ngOnInit(): void {
    this.getfolioMaster();
  }

  ngAfterViewInit(){
    // console.log();
    // console.log(this.primeTbl.wrapperViewChild);

  }

  getfolioMaster = () => {
    this.dbIntr
      .api_call(0, '/showFolioDetails', null)
      .pipe(pluck('data'))
      .subscribe((res: Ifolio[]) => {
        this.folio_dt = res;
      });
  };

  filterGlobal = (ev) => {
    console.log(ev);
    this.primeTbl.filterGlobal(ev.target.value, 'contains');
  };

  getColumns = (): string[] => {
    return this.utility.getColumns(this.column);
  };
}

export interface IFolioMasterStructure {
  /**
   *
   * @returns Folio Master Data
   */
  getfolioMaster: () => void;

  /** hold folio master data */
  folio_dt: Ifolio[];

  /**
   *
   * @param ev
   * @returns search table data
   */
  filterGlobal: (ev) => void;

  /**
   *
   * @returns  column
   */
  getColumns: () => string[];

  /**
   * Folio Column
   */
  column: column[];
}

export interface Ifolio {
  id: number;
  bu_type: string;
  branch_name: string;
  rm_name: string;
  sub_brk_cd: string;
  euin_no: string;
  first_client_name: string;
  folio_no: string;
  scheme_name: string;
  product_code: string;
  add_1: string;
  add_2: string;
  add_3: string;
  city: string;
  state: string;
  pincode: number;
  city_type: string;
  mode_of_holding: string;
  /*** First Holder Details */
  pan_2_holder: string;
  ckyc_no_1st: string;
  dob: Date;
  tax_status: string;
  occupation_des: string;
  mobile: string;
  email: string;
  pa_link_ststus_1st: string;
  /*** End */
  /*** Second Holder Details */
  pan_3_holder: string;
  ckyc_no_2nd: string;
  dob_2nd_holder: Date;
  tax_status_2_holder: string;
  occupation_des_2nd: string;
  mobile_2nd_holder: string;
  email_2nd_holder: string;
  pa_link_ststus_2nd: string;
  /*** End */
  /*** Third Holder Details */
  third_holder_pan: string;
  ckyc_no_3rd: string;
  dob_3rd_holder: Date;
  tax_status_3_holder: string;
  occupation_des_3rd: string;
  mobile_3rd_holder: string;
  email_3rd_holder: string;
  pa_link_ststus_3rd: string;
  /*** End */
  /** Gurdian Details */
  guardian_name: string;
  guardian_pan: string;
  guardian_ckyc_no: string;
  guardian_dob: Date;
  guardian_tax_status: string;
  guardian_occu_des: string;
  guardian_mobile: string;
  guardian_email: string;
  guardian_pa_link_ststus: string;
  guardian_relation: string;
  /*** End */
  bank_name: string;
  bank_acc_no: number;
  acc_type: string;
  bank_ifsc: string;
  bank_micr: string;
  bank_branch: string;
  nom_optout_status: string;
  /*** Nominee (1st,2nd,3rd) details */
  nom_name_1: string;
  nom_pan_1: string;
  nom_relation_1: string;
  nom_per_1: string;
  nom_name_2: string;
  nom_pan_2: string;
  nom_relation_2: string;
  nom_per_2: string;
  nom_name_3: string;
  nom_pan_3: string;
  nom_relation_3: string;
  nom_per_3: string;
  /*** End */
}

export class FolioColumn {
  static column: column[] = [
    { field: 'sl_no', header: 'Sl No', width: '6rem' },
    { field: 'bu_type', header: 'Business Type', width: '10rem' },
    { field: 'brnach_name', header: 'Branch', width: '10rem' },
    { field: 'rm_name', header: 'RM', width: '16rem' },
    { field: 'sub_brk_code', header: 'Sub Broker Code', width: '16rem' },
    { field: 'euin_no', header: 'Euin', width: '8rem' },
    { field: 'first_client_name', header: 'Investor Name', width: '16rem' },
    { field: 'folio_no', header: 'Folio', width: '11rem' },
    { field: 'scheme_name', header: 'Scheme', width: '28rem' },
    { field: 'add_1', header: 'Address1', width: '25rem' },
    { field: 'add_2', header: 'Address2', width: '25rem' },
    { field: 'add_3', header: 'Address3', width: '25rem' },
    { field: 'city', header: 'City', width: '15rem' },
    { field: 'state', header: 'State', width: '15rem' },
    { field: 'pincode', header: 'Pincode', width: '9rem' },
    { field: 'city_type', header: 'City Type', width: '8rem' },
    { field: 'mode_of_holding', header: 'Mode Of Holding', width: '10rem' },
    { field: 'pan', header: '1st Holder PAN', width: '12rem' },
    {
      field: 'ckyc_no_1st',
      header: '1st Holder CKYC',
      width: '15rem',
    },
    { field: 'dob', header: '1st Holder DOB', width: '12rem' },
    {
      field: 'tax_status',
      header: '1st Holder Tax Status',
      width: '15rem',
    },
    {
      field: 'occupation_des',
      header: '1st Holder Occupassion',
      width: '15rem',
    },
    { field: 'mobile', header: '1st Holder Phone', width: '12rem' },
    { field: 'email', header: '1st Holder Email', width: '15rem' },
    {
      field: 'pa_link_ststus_1st',
      header: '1st Holder PAN Adhare Link',
      width: '15rem',
    },
    { field: 'pan_2_holder', header: '2nd Holder PAN', width: '12rem' },
    {
      field: 'ckyc_no_2nd',
      header: '2nd Holder CKYC',
      width: '15rem',
    },
    { field: 'dob_2nd_holder', header: '2nd Holder DOB', width: '12rem' },
    {
      field: 'tax_status_2_holder',
      header: '2nd Holder Tax Status',
      width: '15rem',
    },
    {
      field: 'occupation_des_2nd',
      header: '2nd Holder Occupassion',
      width: '15rem',
    },
    { field: 'mobile_2nd_holder', header: '2nd Holder Phone', width: '12rem' },
    {
      field: 'email_2nd_holder',
      header: '2nd Holder Email',
      width: '15rem',
    },
    {
      field: 'pa_link_ststus_2nd',
      header: '2nd Holder PAN Adhare Link',
      width: '15rem',
    },
    { field: 'pan_3_holder', header: '3rd Holder PAN', width: '12rem' },
    {
      field: 'ckyc_no_3rd',
      header: '3rd Holder CKYC',
      width: '15rem',
    },
    { field: 'dob_3rd_holder', header: '3rd Holder DOB', width: '12rem' },
    {
      field: 'tax_status_3_holder',
      header: '3rd Holder Tax Status',
      width: '15rem',
    },
    {
      field: 'occupation_des_3rd',
      header: '3rd Holder Occupassion',
      width: '15rem',
    },
    { field: 'mobile_3rd_holder', header: '3rd Holder Phone', width: '12rem' },
    { field: 'email_3rd_holder', header: '3rd Holder Email', width: '15rem' },
    {
      field: 'pa_link_ststus_3rd',
      header: '3rd Holder PAN Adhare Link',
      width: '15rem',
    },
    { field: 'guardian_name', header: 'Gurdian Name', width: '15rem' },
    { field: 'guardian_pan', header: 'Gurdian PAN', width: '9rem' },
    { field: 'guardian_ckyc_no', header: 'Gurdian CKYC', width: '15rem' },
    { field: 'guardian_dob', header: 'Gurdian DOB', width: '10rem' },
    { field: 'guardian_tax_status', header: 'Gurdian Tax', width: '15rem' },
    {
      field: 'guardian_occu_des',
      header: 'Gurdian Occupassion',
      width: '15rem',
    },
    { field: 'guardian_mobile', header: 'Gurdian Phone', width: '15rem' },
    { field: 'guardian_email', header: 'Gurdian Email', width: '20rem' },
    {
      field: 'guardian_pa_link_ststus',
      header: 'Gurdian PAN Adhaar Link',
      width: '15rem',
    },
    {
      field: 'guardian_relation',
      header: 'Gurdian Relation',
      width: '15rem',
    },
    { field: 'bank_name', header: 'Bank', width: '15rem' },
    { field: 'bank_acc_no', header: 'Account No', width: '15rem' },
    { field: 'acc_type', header: 'Account Type', width: '15rem' },
    { field: 'bank_ifsc', header: 'IFSC', width: '15rem' },
    { field: 'bank_micr', header: 'MICR', width: '15rem' },
    { field: 'bank_branch', header: 'Bank Branch', width: '15rem' },
    { field: 'nom_optout_status', header: 'Nominee Status', width: '15rem' },
    { field: 'nom_name_1', header: '1st Nominee', width: '15rem' },
    { field: 'nom_pan_1', header: '1st Nominee PAN', width: '12rem' },
    {
      field: 'nom_relation_1',
      header: '1st Nominee Relation',
      width: '15rem',
    },
    {
      field: 'nom_per_1',
      header: '% of 1st Nominee',
      width: '10rem',
    },
    { field: 'nom_name_2', header: '2nd Nominee', width: '15rem' },
    { field: 'nom_pan_2', header: '2nd Nominee PAN', width: '12rem' },
    {
      field: 'nom_relation_2',
      header: '2nd Nominee Relation',
      width: '15rem',
    },
    {
      field: 'nom_per_2',
      header: '% of 2nd Nominee',
      width: '10rem',
    },
    { field: 'nom_name_3', header: '3rd Nominee', width: '15rem' },
    { field: 'nom_pan_3', header: '3rd Nominee PAN', width: '12rem' },
    {
      field: 'nom_relation_3',
      header: '3rd Nominee Relation',
      width: '15rem',
    },
    {
      field: 'nom_per_3',
      header: '% of 3rd Nominee',
      width: '10rem',
    },
  ];
}
