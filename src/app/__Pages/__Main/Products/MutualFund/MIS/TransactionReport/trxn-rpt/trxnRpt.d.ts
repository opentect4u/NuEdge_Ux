
/**
 * Make the file a module by using export {}.
 */
 export {}

declare  global{

interface TrxnRpt{
     id:number;
     folio_no:string | null,
     trans_no:string | null,
     trans_mode:string | null,
     trans_status:string | null,
     user_trans_no:string | null,
     trad_date:Date | null,
     post_date:Date | null,
     pur_price:number | null,
     units:number | null,
     amount:number | null,
     rec_date:Date | null,
     trans_sub_type:string | null,
     trans_nature:string | null,
     te_15h:string | null,
     micr_code:string | null,
     remarks:string | null,
     sw_flag:string | null,
     old_folio:string | null,
     seq_no:string | null,
     reinvest_flag:string | null,
     stt:string | null,
     updated_at?:string | null,
     created_at?:string | null
   }
}

/**
 * Function for getting Transaction Report data  from backend API
 */
export function  getTrxnRptMst():void;
