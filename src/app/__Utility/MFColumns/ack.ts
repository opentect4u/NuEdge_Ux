// import { column } from 'src/app/__Model/tblClmns';
// export class MfackClmns {
//   public static Summary_common =
//   [
//     {field:'edit',header:'Edit',width:'7rem'},
//     {field:'app_frm_view',header:'APP View',width:'7rem'},
//     {field:'entry_date',header:'Entry Date',width:'7rem'},
//     { field: 'rnt_login_cutt_off', header: 'Login Cut Off' ,width:'12rem'},
//     { field: 'rnt_login_dt', header: 'Login Date&Time',width:'12rem'},
//     {field:'tin_no',header:'TIN',width:'7rem'},
//     {field:'branch_name',header:'Branch',width:'7rem'},
//      {field:'sub_brk_cd',header:'Sub Broker Code',width:'12rem'},
//      {field:'euin_no',header:'EUIN',width:'7rem'},
//      {field:'first_client_name',header:'First Holder Name',width:'18rem'},
//      {field:'first_client_code',header:'First Holder Code',width:'10rem'},
//      {field:'first_client_pan',header:'First Holder PAN',width:'10rem'},
//      {field:'trans_name',header:'Transction Type',width:'7rem'},
//      {field:'scheme_name',header:'Scheme',width:'20rem'},
//      {field:'application_no',header:'Application No',width:'7rem'},
//      {field:'folio_no',header:'Folio No',width:'7rem'},
//      {field:'amount',header:'Amount',width:'10rem'},
//   ]

//   public static Summary_Sip=[
//     {field:'sip_amount',header:'SIP Amount',width:'10rem'},
//     {field:'rnt_name',header:'Form Submitted At',width:'10rem'}
//   ]
//   public static Summary_Pip_Switch=[
//     {field:'rnt_name',header:'Form Submitted At',width:'10rem'}
//   ]
//   public static Deatils: column[] = [
//     { field: 'edit', header: 'Edit',width:'7rem' },
//     { field: 'app_frm_view', header: 'APP View',width:'7rem' },
//     { field: 'entry_date', header: 'Entry Date',width:'7rem' },
//     { field: 'rnt_login_cutt_off', header: 'Login Cut Off',width:'12rem' },
//     { field: 'rnt_login_dt', header: 'Login Date&Time',width:'12rem' },
//     { field: 'tin_no', header: 'TIN',width:'7rem' },
//     { field: 'bu_type', header: 'Business Type',width:'7rem' },
//     { field: 'first_client_name', header: 'First Holder Name',width:'18rem' },
//     { field: 'first_client_code', header: 'First Holder Code',width:'15rem' },
//     { field: 'first_client_pan', header: 'First Holder PAN',width:'10rem' },
//     { field: 'first_kyc', header: 'First Holder KYC Status',width:'15rem' },
//     { field: 'second_client_name', header: 'Second Holder Name',width:'15rem' },
//     { field: 'second_client_code', header: 'Second Holder Code',width:'15rem' },
//     { field: 'second_client_pan', header: 'Second Holder PAN',width:'10rem' },
//     { field: 'second_kyc', header: 'Second Holder KYC Status',width:'15rem' },
//     { field: 'third_client_name', header: 'Third Holder Name',width:'15rem' },
//     { field: 'third_client_code', header: 'Third Holder Code',width:'15rem' },
//     { field: 'third_client_pan', header: 'Third Holder PAN',width:'10rem' },
//     { field: 'third_kyc', header: 'Third Holder KYC Status',width:'15rem' },
//     { field: 'scheme_name', header: 'Scheme',width:'21rem' },
//     { field: 'branch_name', header: 'Branch',width:'7rem' },
//     { field: 'rm_name', header: 'RM Name',width:'12rem' },
//     { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'12rem' },
//     { field: 'euin_no', header: 'EUIN',width:'7rem' },
//     { field: 'mode_of_holding', header: 'Mode Of Holding',width:'7rem' },
//     { field: 'trans_name', header: 'Transaction Type',width:'7rem' },
//     { field: 'plan_name', header: 'Plan',width:'10rem' },
//     { field: 'opt_name', header: 'Option',width:'10rem' }
//   ];

//   public static Columns_for_Switch: column[] = [
//     { field: 'scheme_name_to', header: 'Scheme Name (To Scheme)',width:'25rem'},
//     { field: 'amount', header: 'Amount',width:'10rem'},
//     { field: 'chq_no', header: 'Cheque No',width:'10rem'},
//     { field: 'bank_name', header: 'Bank',width:'12rem'},
//     { field: 'inv_type', header: 'Investment Type',width:'12rem'},
//     { field: 'application_no', header: 'Application No',width:'10rem'},
//     { field: 'folio_no', header: 'Folio No',width:'10rem'},
//     { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
//     { field: 'remarks', header: 'Remarks',width:'15rem'},
//   ];

//   public static Columns_for_Sip = [
//     { field: 'amount', header: 'Amount',width:'10rem'},
//     { field: 'chq_no', header: 'Cheque No',width:'10rem'},
//     { field: 'bank_name', header: 'Bank',width:'12rem'},
//     { field: 'inv_type', header: 'Investment Type',width:'12rem'},
//     { field: 'application_no', header: 'Application No',width:'10rem'},
//     { field: 'folio_no', header: 'Folio No',width:'10rem'},
//     { field: 'sip_type_name', header: 'SIP Type',width:'10rem'},
//     { field: 'sip_swp_stp_frequency', header: 'SIP Frequency',width:'7rem'},
//     { field: 'sip_date', header: 'SIP Date',width:'10rem'},
//     { field: 'sip_start_date', header: 'SIP Start Date',width:'10rem'},
//     { field: 'sip_end_date', header: 'SIP End Date',width:'10rem'},
//     { field: 'sip_amount', header: 'SIP Amount',width:'10rem'},
//     { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
//     { field: 'remarks', header: 'Remarks',width:'12rem'}
//   ];
//   public static Columns_for_Pip = [
//     { field: 'amount', header: 'Amount',width:'10rem'},
//     { field: 'chq_no', header: 'Cheque No',width:'10rem'},
//     { field: 'bank_name', header: 'Bank',width:'12rem'},
//     { field: 'inv_type', header: 'Investment Type',width:'10rem'},
//     { field: 'application_no', header: 'Application No',width:'10rem'},
//     { field: 'folio_no', header: 'Folio No',width:'10rem'},
//     { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
//     { field: 'remarks', header: 'Remarks',width:'12rem'},
//   ];


//   public static Columns_for_nfoCombo=[
//     {field:'inv_type',header:'Investment Type',width:'10rem'},
//     {field:'application_no',header:'Application No',width:'10rem'},
//     {field:'folio_no',header:'Folio No',width:'10rem'},
//     {field:'amount',header:'Amount',width:'10rem'},
//     {field:'chq_no',header:'Cheque No',width:'10rem'},
//     {field:'bank_name',header:'Bank',width:'12rem'},
//     {field:'scheme_name_to',header:'Scheme Name (To Scheme)',width:'25rem'},
//     {field:'switch_amt',header:'Switch Amount / Unit',width:'10rem'},
//     {field:'rnt_name',header:'Form Submitted At',width:'10rem'},
//     {field:'remarks',header:'Remarks',width:'12rem'}
//   ]
// }



// export class nonFinAckClms {
//   public static SUMMARY_COPY = [
//     { field: 'edit', header: 'Edit',width:'7rem'},
//     { field: 'app_frm_view', header: 'APP View',width:'7rem'},
//     { field: 'entry_date', header: 'Entry Date',width:'7rem'},
//     { field: 'rnt_login_cutt_off', header: 'Login Cut Off',width:'12rem'},
//     { field: 'rnt_login_dt', header: 'Login Date&Time',width:'12rem' },
//     { field: 'tin_no', header: 'TIN',width:'10rem'},
//     { field: 'branch_name', header: 'Branch',width:'10rem'},
//     { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'12rem'},
//     { field: 'euin_no', header: 'EUIN',width:'10rem'},
//     { field: 'first_client_name', header: 'First Holder Name',width:'18rem' },
//     { field: 'first_client_code', header: 'First Holder Code',width:'15rem' },
//     { field: 'first_client_pan', header: 'First Holder PAN',width:'10rem' },
//     { field: 'trans_name', header: 'Transction Type',width:'15rem'},
//     { field: 'scheme_name', header: 'Scheme',width:'25rem'},
//     { field: 'folio_no', header: 'Folio No',width:'7rem'},
//     { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
//     { field: 'remarks', header: 'Remarks',width:'7rem'}
//   ];

//   /**** ADDRESS CHANGE (DONE)*/
//   public static AC = [
//     { field: 'new_address', header: 'New Address',width:'15rem'}
//   ];
//   /** END */

//   /*** CHANGE MODE OF HOLDING (DONE)*/
//   public static CMOH = [
//     { field: 'existing_mode_of_holding', header: 'Existing Mode of Holding',width:'10rem'},
//     { field: 'new_mode_of_holding', header: 'New Mode of Holding',width:'10rem'}
//   ];
//   /*** END */

//   /**** CHANGE OF NAME (DONE)*/
//   public static CON = [
//     { field: 'reason_for_change', header: 'Reason For Change',width:'15rem'},
//     { field: 'new_name', header: 'New Name',width:'15rem'}
//   ];
//    /***END */

//   /***** CORE BANKING UPDATION (DONE)*/
//   public static CBU = [
//     { field: 'acc_no', header: 'Account No',width:'7rem'},
//     { field: 'bank_name', header: 'Bank',width:'10rem'},
//     { field: 'ifsc', header: 'IFSC',width:'7rem'},
//     { field: 'micr_code', header: 'MICR',width:'7rem'},
//     { field: 'branch_name', header: 'Branch',width:'7rem'}
//   ];
//   /**** END */

//   /**** CHANGE OF BANK (DONE) */
//   public static COBK = [
//     { field: 'existing_bank_acc_no', header: 'Existing Bank Account No',width:'7rem'},
//     { field: 'existing_bank_name', header: 'Existing Bank',width:'10rem'},
//     { field: 'existing_ifsc', header: 'Existing IFSC',width:'7rem'},
//     { field: 'existing_micr_code', header: 'Existing MICR',width:'7rem'},
//     { field: 'existing_branch_name', header: 'Existing Branch',width:'7rem'},
//     { field: 'new_bank_acc_no', header: 'New Bank Account No',width:'7rem'},
//     { field: 'new_bank_name', header: 'New Bank',width:'10rem'},
//     { field: 'new_ifsc', header: 'New IFSC',width:'7rem'},
//     { field: 'new_micr_code', header: 'New MICR',width:'7rem'},
//     { field: 'new_branch_name', header: 'New Branch',width:'10rem'}
//   ];
//   /**** END */

//   /*** FOLIO CONSOLIDATION MERGE (DONE)*/
//   public static FCM = [
//     {field:'targeted_folio',header:'Targeted Folio',width:'7rem'},
//     {field:'source_folio',header:'Source Folio',width:'7rem'}
//   ]
//   /*** END */

//   /***CHANGE OF BROKER (DONE)*/
//   public static COB =[
//     {field:'new_broker_code',header:'New Sub Broker Code',width:'12rem'}
//   ]
//   /**** END */

//   /** NOMINEE CHANGE OR ADDITION (DONE)*/
//   public static NA_OR_NC = [
//       {field:'new_nominee_name',header:'New Nominee Name',width:'15rem'},
//       {field:'percentage',header:'Percentage',width:'7rem'}
//   ]
//   /** END */

//    /** SWP REGISTRATION (DONE)*/
//    public static SWPR = [
//     {field:'swp_type_name',header:'SWP Type',width:'7rem'},
//     {field:'swp_frequency',header:'SWP Frequency',width:'10rem'},
//     {field:'swp_date',header:'SWP Date',width:'10rem'},
//     {field:'start_date',header:'Start Date',width:'10rem'},
//     {field:'end_date',header:'End Date',width:'10rem'},
//     {field:'swp_amount',header:'SWP Amount',width:'10rem'}
// ]
// /** END */

//    /** Transmission (DONE)*/
//    public static TRANSMISSION = [
//     {field:'transmission_type',header:'Transmission Type',width:'10rem'},
//     {field:'claiment_name',header:'Claiment Name',width:'15rem'},
//     {field:'claiment_code',header:'Claiment Code',width:'10rem'},
//     {field:'claiment_pan',header:'PAN',width:'10rem'}
// ]
// /** END */

//    /** Redemption (DONE)*/
//    public static REDEMPTION = [
//     {field:'redemption_type',header:'Redemption Type',width:'10rem'},
//     {field:'redemption_amount',header:'Amount/Unit',width:'10rem'}
//     ]
//     /** END */

//   /** Cancelation (DONE)*/
//   public static CANCELATION = [
//     {field:'cancelation_effective_date',header:'Cancelation Effective Date',width:'10rem'},
//     {field:'amount',header:'Amount',width:'10rem'}
//     ]
//     /** END */

//     /** PAUSE (DONE)*/
//     public static PAUSE = [
//     {field:'duration',header:'Duration',width:'7rem'},
//     {field:'pause_start_date',header:'Pause Start Date',width:'10rem'},
//     {field:'pause_end_date',header:'Pause End Date',width:'10rem'},
//     {field:'pause_amount',header:'Amount',width:'10rem'}
//     ]
//     /** END */

//     /** STP REGISTRATION (DONE)*/
//     public static STP_REGISTRATION = [
//       {field:'stp_type',header:'STP Type',width:'10rem'},
//       {field:'stp_frequency',header:'STP Frequency',width:'12rem'},
//       {field:'stp_date',header:'STP Date',width:'10rem'},
//       {field:'scheme_name_to',header:'Scheme Name (To Scheme)',width:'25rem'},
//       {field:'stp_start_date',header:'STP Start Date',width:'10rem'},
//       {field:'stp_end_date',header:'STP End Date',width:'10rem'},
//       {field:'stp_amount',header:'STP Amount',width:'10rem'}
//       ]
//       /** END */

//   /**CHANGE OF CONTACT DETAILS (DONE)*/
//   public static COCD =[
//     {field:'new_email',header:'New Email',width:'15rem'},
//     {field:'new_mobile',header:'New Mobile',width:'10rem'}
//   ]
//   /** END */



//   public static COLUMN_SELECTOR=[
//     { field: 'edit', header: 'Edit',width:'7rem'},
//     { field: 'app_frm_view', header: 'APP View' ,width:'7rem'},
//     { field: 'entry_date', header: 'Entry Date' ,width:'5rem'},
//     { field: 'rnt_login_cutt_off', header: 'Login Cut Off' ,width:'12rem'},
//     { field: 'rnt_login_dt', header: 'Login Date&Time' ,width:'12rem'},
//     { field: 'tin_no', header: 'TIN' ,width:'5rem'},
//     { field: 'bu_type', header: 'Business Type' ,width:'5rem'},
//     { field: 'branch_name', header: 'Branch' ,width:'10rem'},
//     { field: 'rm_name', header: 'RM Name',width:'12rem'},
//     { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'12rem'},
//     { field: 'euin_no', header: 'EUIN' ,width:'10rem'},
//     { field: 'first_client_name', header: 'First Holder Name' ,width:'18rem'},
//     { field: 'first_client_code', header: 'First Holder Code' ,width:'10rem'},
//     { field: 'first_client_pan', header: 'First Holder PAN' ,width:'10rem'},
//     { field: 'trans_name', header: 'Transction Type' ,width:'10rem'},
//     { field: 'scheme_name', header: 'Scheme',width:'25rem'},
//     { field: 'plan_name', header: 'Plan' ,width:'10rem'},
//     { field: 'opt_name', header: 'Option' ,width:'10rem'},
//     { field: 'folio_no', header: 'Folio No' ,width:'10rem'},
//     { field: 'amount', header: 'Amount' ,width:'6rem'},
//     { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
//     { field: 'remarks', header: 'Remarks',width:'10rem'},

//   ]
// }



import { column } from 'src/app/__Model/tblClmns';
export class MfackClmns {
  public static Summary_common =
  [
    {field:'edit',header:'Edit',width:'7rem'},
    {field:'app_frm_view',header:'APP View',width:'7rem'},
    {field:'entry_date',header:'Entry Date',width:'7rem'},
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off' ,width:'12rem'},
    { field: 'rnt_login_dt', header: 'Login Date&Time',width:'12rem'},
    {field:'tin_no',header:'TIN',width:'7rem'},
    {field:'branch_name',header:'Branch',width:'7rem'},
     {field:'sub_brk_cd',header:'Sub Broker Code',width:'12rem'},
     {field:'euin_no',header:'EUIN',width:'7rem'},
     {field:'first_client_name',header:'First Holder Name',width:'18rem'},
     {field:'first_client_code',header:'First Holder Code',width:'10rem'},
     {field:'first_client_pan',header:'First Holder PAN',width:'10rem'},
     {field:'trans_name',header:'Transction Type',width:'7rem'},
     {field:'scheme_name',header:'Scheme',width:'20rem'},
     {field:'application_no',header:'Application No',width:'7rem'},
     {field:'folio_no',header:'Folio No',width:'7rem'},
     {field:'amount',header:'Amount',width:'10rem'},
  ]

  public static Summary_Sip=[
    {field:'sip_amount',header:'SIP Amount',width:'10rem'},
    {field:'rnt_name',header:'Form Submitted At',width:'10rem'}
  ]
  public static Summary_Pip_Switch=[
    {field:'rnt_name',header:'Form Submitted At',width:'10rem'}
  ]
  public static Deatils: column[] = [
    { field: 'edit', header: 'Edit',width:'7rem' },
    {field:'ack_copy_scan',header:'ACK. View',width:'7rem'},
    { field: 'app_frm_view', header: 'APP View',width:'7rem' },
    { field: 'entry_date', header: 'Entry Date',width:'7rem' },
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off',width:'12rem' },
    { field: 'rnt_login_dt', header: 'Login Date&Time',width:'12rem' },
    { field: 'tin_no', header: 'TIN',width:'7rem' },
    { field: 'bu_type', header: 'Business Type',width:'7rem' },
    { field: 'branch_name', header: 'Branch',width:'7rem' },
    { field: 'rm_name', header: 'RM Name',width:'12rem' },
    { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'12rem' },
    { field: 'euin_no', header: 'EUIN',width:'7rem' },
    { field: 'first_client_name', header: 'First Holder Name',width:'18rem' },
    { field: 'first_client_code', header: 'First Holder Code',width:'15rem' },
    { field: 'first_client_pan', header: 'First Holder PAN',width:'10rem' },
    { field: 'first_kyc', header: 'First Holder KYC Status',width:'15rem' },
    { field: 'mode_of_holding', header: 'Mode Of Holding',width:'7rem' },
    { field: 'second_client_name', header: 'Second Holder Name',width:'15rem' },
    { field: 'second_client_code', header: 'Second Holder Code',width:'15rem' },
    { field: 'second_client_pan', header: 'Second Holder PAN',width:'10rem' },
    { field: 'second_kyc', header: 'Second Holder KYC Status',width:'15rem' },
    { field: 'third_client_name', header: 'Third Holder Name',width:'15rem' },
    { field: 'third_client_code', header: 'Third Holder Code',width:'15rem' },
    { field: 'third_client_pan', header: 'Third Holder PAN',width:'10rem' },
    { field: 'third_kyc', header: 'Third Holder KYC Status',width:'15rem' },
    { field: 'trans_name', header: 'Transaction',width:'7rem' },
    { field: 'scheme_name', header: 'Scheme',width:'21rem' },
    { field: 'plan_name', header: 'Plan',width:'10rem' },
    { field: 'opt_name', header: 'Option',width:'10rem' }
  ];

  public static Columns_for_Switch: column[] = [
    { field: 'scheme_name', header: 'Scheme Name (From Scheme)',width:'21rem' },
    { field: 'plan_name', header: 'Plan (From Plan)',width:'10rem' },
    { field: 'opt_name', header: 'Option (From Option)',width:'10rem' },
    { field: 'scheme_name_to', header: 'Scheme Name (To Scheme)',width:'25rem'},
    { field: 'plan_name_to', header: 'Plan (To Plan)',width:'10rem' },
    { field: 'opt_name_to', header: 'Option (To Option)',width:'10rem' },
    { field: 'amount', header: 'Amount',width:'10rem'},
    { field: 'unit', header: 'Unit',width:'8rem'},
    { field: 'chq_no', header: 'Cheque No',width:'10rem'},
    { field: 'bank_name', header: 'Bank',width:'12rem'},
    { field: 'inv_type', header: 'Investment Type',width:'12rem'},
    { field: 'application_no', header: 'Application No',width:'10rem'},
    { field: 'folio_no', header: 'Folio No',width:'10rem'},
    { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
    { field: 'remarks', header: 'Remarks',width:'15rem'},
  ];

  public static Columns_for_Sip = [
    { field: 'amount', header: 'Amount',width:'10rem'},
    { field: 'chq_no', header: 'Cheque No',width:'10rem'},
    { field: 'bank_name', header: 'Bank',width:'12rem'},
    { field: 'inv_type', header: 'Investment Type',width:'12rem'},
    { field: 'application_no', header: 'Application No',width:'10rem'},
    { field: 'folio_no', header: 'Folio No',width:'10rem'},
    { field: 'sip_type_name', header: 'SIP Type',width:'10rem'},
    { field: 'sip_swp_stp_frequency', header: 'SIP Frequency',width:'7rem'},
    { field: 'sip_date', header: 'SIP Date',width:'10rem'},
    { field: 'sip_start_date', header: 'SIP Start Date',width:'10rem'},
    { field: 'sip_end_date', header: 'SIP End Date',width:'10rem'},
    { field: 'sip_amount', header: 'SIP Amount',width:'10rem'},
    { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
    { field: 'remarks', header: 'Remarks',width:'12rem'}
  ];
  public static Columns_for_Pip = [
    { field: 'amount', header: 'Amount',width:'10rem'},
    { field: 'chq_no', header: 'Cheque No',width:'10rem'},
    { field: 'bank_name', header: 'Bank',width:'12rem'},
    { field: 'inv_type', header: 'Investment Type',width:'10rem'},
    { field: 'application_no', header: 'Application No',width:'10rem'},
    { field: 'folio_no', header: 'Folio No',width:'10rem'},
    { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
    { field: 'remarks', header: 'Remarks',width:'12rem'},
  ];


  public static Columns_for_nfoCombo=[
    { field: 'scheme_name', header: 'Scheme Name (From Scheme)',width:'21rem' },
    { field: 'plan_name', header: 'Plan (From Plan)',width:'10rem' },
    { field: 'opt_name', header: 'Option (From Option)',width:'10rem' },
    {field:'scheme_name_to',header:'Scheme Name (To Scheme)',width:'25rem'},
    { field: 'plan_name_to', header: 'Plan (To Plan)',width:'10rem' },
    { field: 'opt_name_to', header: 'Option (To Option)',width:'10rem' },
    {field:'inv_type',header:'Investment Type',width:'10rem'},
    {field:'application_no',header:'Application No',width:'10rem'},
    {field:'folio_no',header:'Folio No',width:'10rem'},
    // {field:'unit',header:'Unit',width:'8rem'},
    {field:'chq_no',header:'Cheque No',width:'10rem'},
    {field:'bank_name',header:'Bank',width:'12rem'},
    {field:'first_inv_amount',header:'Amount',width:'10rem'},
    {field:'switch_amt',header:'Switch Amount / Unit',width:'10rem'},
    {field:'rnt_name',header:'Form Submitted At',width:'10rem'},
    {field:'remarks',header:'Remarks',width:'12rem'}
  ]
}



export class nonFinAckClms {
  public static SUMMARY_COPY = [
    { field: 'edit', header: 'Edit',width:'7rem'},
    { field: 'app_frm_view', header: 'APP View',width:'7rem'},
    { field: 'entry_date', header: 'Entry Date',width:'7rem'},
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off',width:'12rem'},
    { field: 'rnt_login_dt', header: 'Login Date&Time',width:'12rem' },
    { field: 'tin_no', header: 'TIN',width:'10rem'},
    { field: 'branch_name', header: 'Branch',width:'10rem'},
    { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'12rem'},
    { field: 'euin_no', header: 'EUIN',width:'10rem'},
    { field: 'first_client_name', header: 'First Holder Name',width:'18rem' },
    { field: 'first_client_code', header: 'First Holder Code',width:'15rem' },
    { field: 'first_client_pan', header: 'First Holder PAN',width:'10rem' },
    { field: 'trans_name', header: 'Transction Type',width:'15rem'},
    { field: 'scheme_name', header: 'Scheme',width:'25rem'},
    { field: 'folio_no', header: 'Folio No',width:'7rem'},
    { field: 'rnt_name', header: 'Form Submitted At',width:'10rem'},
    { field: 'remarks', header: 'Remarks',width:'7rem'}
  ];

  /**** ADDRESS CHANGE (DONE)*/
  public static AC = [
    { field: 'new_address', header: 'New Address',width:'15rem'}
  ];
  /** END */

  /*** CHANGE MODE OF HOLDING (DONE)*/
  public static CMOH = [
    { field: 'change_existing_mode_of_holding', header: 'Existing Mode of Holding',width:'10rem'},
    { field: 'change_new_mode_of_holding', header: 'New Mode of Holding',width:'10rem'}
  ];
  /*** END */

  /**** CHANGE OF NAME (DONE)*/
  public static CON = [
    { field: 'reason_for_change', header: 'Reason For Change',width:'15rem'},
    { field: 'new_name', header: 'New Name',width:'15rem'}
  ];
   /***END */

  /***** CORE BANKING UPDATION (DONE)*/
  public static CBU = [
    // { field: 'acc_no', header: 'Account No',width:'7rem'},
    // { field: 'bank_name', header: 'Bank',width:'10rem'},
    // { field: 'ifsc', header: 'IFSC',width:'7rem'},
    // { field: 'micr_code', header: 'MICR',width:'7rem'},
    // { field: 'branch_name', header: 'Branch',width:'7rem'}

    { field: 'new_bank_acc_no', header: 'New Bank Account No',width:'7rem'},
    { field: 'new_bank_name', header: 'New Bank',width:'10rem'},
    { field: 'new_ifsc', header: 'New IFSC',width:'7rem'},
    { field: 'new_micr_code', header: 'New MICR',width:'7rem'},
    { field: 'new_branch_name', header: 'New Branch',width:'10rem'}
  ];
  /**** END */

  /**** CHANGE OF BANK (DONE) */
  public static COBK = [
    { field: 'existing_bank_acc_no', header: 'Existing Bank Account No',width:'7rem'},
    { field: 'existing_bank_name', header: 'Existing Bank',width:'10rem'},
    { field: 'existing_ifsc', header: 'Existing IFSC',width:'7rem'},
    { field: 'existing_micr_code', header: 'Existing MICR',width:'7rem'},
    { field: 'existing_branch_name', header: 'Existing Branch',width:'7rem'},
    { field: 'new_bank_acc_no', header: 'New Bank Account No',width:'7rem'},
    { field: 'new_bank_name', header: 'New Bank',width:'10rem'},
    { field: 'new_ifsc', header: 'New IFSC',width:'7rem'},
    { field: 'new_micr_code', header: 'New MICR',width:'7rem'},
    { field: 'new_branch_name', header: 'New Branch',width:'10rem'}
  ];
  /**** END */

  /*** FOLIO CONSOLIDATION MERGE (DONE)*/
  public static FCM = [
    {field:'folio_no',header:'Targeted Folio',width:'10rem'},
    {field:'source_folio',header:'Source Folio',width:'7rem'}
  ]
  /*** END */

  /***CHANGE OF BROKER (DONE)*/
  public static COB =[
    {field:'new_broker_code',header:'New Sub Broker Code',width:'12rem'}
  ]
  /**** END */

  /** NOMINEE CHANGE OR ADDITION (DONE)*/
  public static NA_OR_NC = [
      {field:'new_nominee_name',header:'New Nominee Name',width:'15rem'},
      {field:'percentage',header:'Percentage',width:'7rem'}
  ]
  /** END */

   /** SWP REGISTRATION (DONE)*/
   public static SWPR = [
    {field:'swp_type_name',header:'SWP Type',width:'7rem'},
    {field:'swp_frequency',header:'SWP Frequency',width:'10rem'},
    {field:'swp_date',header:'SWP Date',width:'10rem'},
    {field:'swp_start_date',header:'Start Date',width:'10rem'},
    {field:'swp_end_date',header:'End Date',width:'10rem'},
    {field:'swp_amount',header:'SWP Amount',width:'10rem'}
]
/** END */

   /** Transmission (DONE)*/
   public static TRANSMISSION = [
    {field:'transmission_type',header:'Transmission Type',width:'10rem'},
    {field:'claiment_name',header:'Claiment Name',width:'15rem'},
    {field:'claiment_code',header:'Claiment Code',width:'10rem'},
    {field:'claiment_pan',header:'PAN',width:'10rem'}
]
/** END */

   /** Redemption (DONE)*/
   public static REDEMPTION = [
    {field:'redemp_type',header:'Redemption Type',width:'10rem'},
    {field:'amount',header:'Amount',width:'10rem'},
    {field:'unit',header:'Unit',width:'10rem'}

    ]
    /** END */

  /** Cancelation (DONE)*/
  public static CANCELATION = [
    {field:'cancel_eff_dt',header:'Cancelation Effective Date',width:'10rem'},
    {field:'amount',header:'Amount',width:'10rem'}
    ]
    /** END */

    /** PAUSE (DONE)*/
    public static PAUSE = [
    // {field:'duration',header:'Duration',width:'7rem'},
    {field:'pause_duration',header:'Duration',width:'7rem'},
    {field:'pause_start_date',header:'Pause Start Date',width:'10rem'},
    {field:'pause_end_date',header:'Pause End Date',width:'10rem'},
    {field:'pause_amount',header:'Amount',width:'10rem'}
    ]
    /** END */

    /** STP REGISTRATION (DONE)*/
    public static STP_REGISTRATION = [
      {field:'stp_type_name',header:'STP Type',width:'10rem'},
      {field:'stp_frequency',header:'STP Frequency',width:'12rem'},
      {field:'stp_date',header:'STP Date',width:'10rem'},
      {field:'scheme_name_to',header:'Scheme Name (To Scheme)',width:'25rem'},
      { field: 'plan_name_to', header: 'Plan (To Plan)',width:'10rem' },
      { field: 'opt_name_to', header: 'Option (To Option)',width:'10rem' },
      {field:'stp_start_date',header:'STP Start Date',width:'10rem'},
      {field:'stp_end_date',header:'STP End Date',width:'10rem'},
      {field:'stp_amount',header:'STP Amount',width:'10rem'}
      ]
      /** END */

  /**CHANGE OF CONTACT DETAILS (DONE)*/
  public static COCD =[
    {field:'new_email',header:'New Email',width:'15rem'},
    {field:'new_mobile',header:'New Mobile',width:'10rem'}
  ]
  /** END */



  public static COLUMN_SELECTOR=[
    {field:'folio_no',header:'Folio No.',width:'10rem'},
    { field: 'edit', header: 'Edit',width:'8rem'},
    {field:'ack_copy_scan',header:'ACK. View',width:'8rem'},
    { field: 'app_frm_view', header: 'APP View',width:'8rem'},
    { field: 'entry_date', header: 'Entry Date',width:'10rem'},
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off' ,width:'10rem'},
    { field: 'rnt_login_dt', header: 'Login Date&Time',width:'15rem'},
    { field: 'tin_no', header: 'TIN',width:'8rem'},
    { field: 'bu_type', header: 'Business Type',width:'10rem'},
    { field: 'branch_name', header: 'Branch',width:'10rem'},
    { field: 'rm_name', header: 'RM Name',width:'15rem'},
    { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'10rem'},
    { field: 'euin_no', header: 'EUIN' ,width:'8rem'},
    { field: 'first_client_name', header: 'First Holder Name',width:'15rem'},
    { field: 'first_client_code', header: 'First Holder Code',width:'10rem'},
    { field: 'first_client_pan', header: 'First Holder PAN' ,width:'8rem'},
    { field: 'trans_name', header: 'Transction Type',width:'12rem'},
    { field: 'scheme_name', header: 'Scheme',width:'20rem'},
    { field: 'plan_name', header: 'Plan',width:'12rem'},
    { field: 'opt_name', header: 'Option',width:'12rem'},
    // { field: 'folio_no', header: 'Folio No',width:'8rem'},
    { field: 'amount', header: 'Amount',width:'10rem'}
  ]

  public static COMMON_COLUMN = [
    { field: 'rnt_name', header: 'Form Submitted At',width:'12rem'},
    { field: 'remarks', header: 'Remarks',width:'10rem'},
  ]
}
