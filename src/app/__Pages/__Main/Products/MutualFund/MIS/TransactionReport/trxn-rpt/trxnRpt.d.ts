import { totalAmt } from "src/app/__Model/TotalAmt"

/**
 * Make the file a module by using export {}.
 */
 export {}

declare  global{

interface TrxnRpt{
     id:number
     rnt_id:number;
     bu_type:string | null
     cat_name:string | null;
     subcat_name:string | null;
     branch:string | null
     rm_name:string | null
      arn_no:string | null
      amc_name:string | null;
      sub_brk_cd:string | null
      euin_no:string | null
      first_client_name:string | null
      first_client_pan:string | null
      amc_code:string | null
      folio_no:string | null
      product_code:string | null
      trans_no:string | null
      trans_mode:string | null
      trans_status:string | null
      user_trans_no:string | null
      trans_date:string | null
      post_date:string | null
      pur_price:string | null
      units:string | null
      amount:string | null
      rec_date:string | null
      transaction_type:string | null;
      trans_type:string | null
      trans_sub_type:string | null
      transaction_subtype:string | null
      trans_nature:string | null
      te_15h:string | null
      micr_code:string | null
      remarks:string | null
      sw_flag:string | null
      old_folio:string | null
      seq_no:string | null
      reinvest_flag:string | null
      stt:string | null
      stamp_duty:string | null
      tds:string | null
      acc_no:string | null
      bank_name:string | null
      gross_amount:string|null
      scheme_name:string | null
      plan_name:string | null
      option_name:string | null
      tot_amount:string | null
      tot_stamp_duty:string | null
      tot_tds:string | null
      trxn_code:string | null
      tot_gross_amount:string | null,
      lock_status:string | null,
      divi_lock_flag: string | null,
      isin_no:string | null,
      bu_type_lock_flag:string | null
      process_type?:string | null
   }
}

/**
 * Function for getting Transaction Report data  from backend API
 */
export function  getTrxnRptMst():void;


