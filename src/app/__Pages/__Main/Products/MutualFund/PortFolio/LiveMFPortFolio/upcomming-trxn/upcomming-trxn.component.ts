import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'upcomming-trxn',
  templateUrl: './upcomming-trxn.component.html',
  styleUrls: ['./upcomming-trxn.component.css']
})
export class UpcommingTrxnComponent implements OnInit {

  /*** Holding Upcomming Transactions */
  @Input() upcommingTrxn:Partial<IUpcommingTrxn>[] = [];
  /*** End */

  /** reference of primengTable */
  @ViewChild('dt') primaryTbl :Table;
  /*** End */

  /** Holding columns */
  column:column[] = UpcommingColumns.column;
  /** End */

  constructor(private utility:UtiliService) { }

  ngOnInit(): void {}

  filterGlobal_secondary = ($event) =>{
    let value = $event.target.value;
    this.primaryTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

}

export interface IUpcommingTrxn{
  id: number
  rnt_id: number
  arn_no: any
  product_code: string
  isin_no: any
  folio_no: string
  first_client_name: string
  auto_trans_type: string
  auto_trans_no: string
  auto_amount: number
  from_date: string
  to_date: string
  cease_terminate_date: any
  periodicity: string
  period_day: number
  inv_iin: string
  payment_mode: string
  reg_date: string
  sub_brk_cd: string
  euin_no: string
  old_euin_no: any
  remarks: string
  top_up_req: string
  top_up_amount: string
  ac_type: string
  bank: string
  bank_branch: string
  instrm_no: string
  chq_micr_no: string
  first_client_pan: string
  amc_code: string
  sub_trans_desc: string
  pause_from_date: any
  pause_to_date: any
  req_ref_no: string
  frequency: string
  f_status: any
  no_of_installment: any
  to_product_code: any
  to_scheme_code: any
  amc_flag: string
  scheme_flag: string
  bu_type_flag: string
  bu_type_lock_flag: string
  plan_option_flag: string
  plan_option_lock_flag: string
  idcw_mismatch_flag: string
  freq_mismatch_flag: string
  delete_flag: string
  deleted_at: any
  deleted_date: any
  created_at: string
  updated_at: string
  sip_date: string
  amount: number
  terminated_date: any
  pause_start_date: any
  pause_end_date: any
  bank_name: string
  acc_no: string
  scheme_name: string
  cat_name: string
  subcat_name: string
  amc_name: string
  amc_short_name: string
  plan_name: string
  option_name: string
  trans_type: string
  trans_sub_type: string
  to_scheme_name: any
  to_cat_name: any
  to_subcat_name: any
  freq: string
  terminate_logic_count: number
  terminate_datediff: any
  activate_status: string
  reg_no: string
  stp_date: string
  swp_date: string
  calculation_day: number
  duration: number
  date:string;
}

export class UpcommingColumns {
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No',
      width:'3rem'
    },
    {
      field:'first_client_name',
      header:'Client',
      width:'7rem'
    },
    {
      field:'scheme_name',
      header:'Scheme',
      width:'21rem'
    },
    {
      field:'trans_type',
      header:'Trans. type',
      width:'3rem'
    },
    {
      field:'folio_no',
      header:'Folio',
      width:'5rem'
    },
    {
      field:'freq',
      header:'Frq',
      width:'4rem'
    },
    {
      field:'reg_no',
      header:'Txn No.',
      width:'4rem'
    },
    {
      field:'from_date',
      header:'Start Date',
      width:'4rem'
    },
    {
      field:'to_date',
      header:'End Date',
      width:'4rem'
    },
    {
      field:'date',
      header:'Date',
      width:'4rem'
    },
    {
      field:'amount',
      header:'Amount',
      width:'3rem'
    },
    {
      field:'bank_name',
      header:'Bank',
      width:'5rem'
    }
  ]
}
