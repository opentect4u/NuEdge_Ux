export interface scheme {
    created_at?: string
    created_by?: number
    id?: number
    updated_at?: string
    updated_by?: any
    category_id?: number
    subcategory_id?: number
    product_id?: number
    product_code?:string,
    amc_id?: number,
    cat_name?:string;
    subcate_name?:string;
    scheme_name?:string
    scheme_type?:string
    nfo_start_dt?:string
  nfo_end_dt?:string
  nfo_entry_date?:string
  nfo_reopen_dt?:string
  pip_fresh_min_amt?:string
  sip_fresh_min_amt?:string
  pip_add_min_amt?:string
  sip_add_min_amt?:string
  isin_no?:string,
  gstin_no?:string,
  sip_freq_wise_amt?: any,
  sip_date?:any
  benchmark?:string,
  benchmark_id?:number,
  stp_date?:any;
  stp_freq_wise_amt?:any;
  swp_date?:any;
  swp_freq_wise_amt?:any
  ava_special_sip?: any;
  special_sip_name?: string;
  ava_special_swp?:any
  special_swp_name?:string
  ava_special_stp?:any
  special_stp_name?:string
  step_up_min_amt?:string;
  step_up_min_per?:string;
  A_sip_min_A_amount?:string | null;
  A_sip_min_F_amount?:string | null;
  A_stp_min_amount?:string | null;
  A_swp_min_amount?:string | null;
  D_sip_min_A_amount?:string | null;
  D_sip_min_F_amount?:string | null;
  D_stp_min_amount?:string | null;
  D_swp_min_amount?:string | null;
  F_sip_min_A_amount?:string | null;
  F_sip_min_F_amount?:string | null;
  F_stp_min_amount?:string | null;
  F_swp_min_amount?:string | null;
  M_sip_min_A_amount?:string | null;
  M_sip_min_F_amount?:string | null;
  M_stp_min_amount?:string | null;
  M_swp_min_amount?:string | null;
  Q_sip_min_A_amount?:string | null;
  Q_sip_min_F_amount?:string | null;
  Q_stp_min_amount?:string | null;
  Q_swp_min_amount?:string | null;
  S_sip_min_A_amount?:string | null;
  S_sip_min_F_amount?:string | null;
  S_stp_min_amount?:string | null;
  S_swp_min_amount?:string | null;
  W_sip_min_A_amount?:string | null;
  W_sip_min_F_amount?:string | null;
  W_stp_min_amount?:string | null;
  W_swp_min_amount?:string | null;
  switch_min_amt?: any;
  switch_mul_amt?: any;
  exit_load?: string | null;
  sip_allowed?: string;
  swp_allowed?: string;
  stp_allowed?: string;
  purchase_allowed?: string;
  switch_allowed?: string;
  pip_multiple_amount?:number;
  tax_implication_id:Partial<number>;
  tax_implication:Partial<string>;
  plan_name:Partial<string>;
  option_name:Partial<string>
  }


