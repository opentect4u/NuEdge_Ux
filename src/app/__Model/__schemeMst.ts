export interface scheme {
    created_at?: string
    created_by?: number
    id: number
    updated_at?: string
    updated_by?: any
    category_id?: number
    subcategory_id?: number
    product_id?: number
    amc_id?: number
    scheme_name?:string
    scheme_type?:string
    nfo_start_dt?:string
  nfo_end_dt?:string
  nfo_reopen_dt?:string
  pip_fresh_min_amt?:string
  sip_fresh_min_amt?:string
  pip_add_min_amt?:string
  sip_add_min_amt?:string
  isin_no?:string,
  gstin_no?:string,
  sip_freq_wise_amt?: any,
  sip_date?:any

  stp_date?:any;
  stp_freq_wise_amt?:any;
  swp_date?:any;
  swp_freq_wise_amt?:any
  ava_special_sip?: any;
  special_sip_name?: string;
  }
