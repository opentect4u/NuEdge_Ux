import { column } from 'src/app/__Model/tblClmns';
export class MfackClmns {
  public static Summary_common =
  [
    {field:'edit',header:'Edit'},
    {field:'app_frm_view',header:'DOC View'},
    {field:'entry_date',header:'Entry Date'},
    {field:'tin_no',header:'TIN'},
    {field:'branch_name',header:'Branch'},
     {field:'sub_brk_cd',header:'Sub Broker Code'},
     {field:'euin_no',header:'EUIN'},
     {field:'first_client_name',header:'First Holder Name'},
     {field:'first_client_code',header:'First Holder Code'},
     {field:'first_client_pan',header:'First Holder PAN'},
     {field:'trans_name',header:'Transction Type'},
     {field:'scheme_name',header:'Scheme'},
     {field:'application_no',header:'Application No'},
     {field:'folio_no',header:'Folio No'},
     {field:'amount',header:'Amount'},
  ]

  public static Summary_Sip=[
    {field:'sip_amount',header:'SIP Amount'},
    {field:'rnt_name',header:'Form Submitted At'}
  ]
  public static Summary_Pip_Switch=[
    {field:'rnt_name',header:'Form Submitted At'}
  ]
  public static Deatils: column[] = [
    { field: 'edit', header: 'Edit' },
    { field: 'app_frm_view', header: 'DOC View' },
    { field: 'entry_date', header: 'Entry Date' },
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off' },
    { field: 'rnt_login_dt', header: 'Login Date' },
    { field: 'tin_no', header: 'TIN' },
    { field: 'bu_type', header: 'Business Type' },
    { field: 'first_client_name', header: 'First Holder Name' },
    { field: 'first_client_code', header: 'First Holder Code' },
    { field: 'first_client_pan', header: 'First Holder PAN' },
    { field: 'first_client_kyc_status', header: 'First Holder KYC Status' },
    { field: 'second_client_name', header: 'Second Holder Name' },
    { field: 'second_client_code', header: 'Second Holder Code' },
    { field: 'second_client_pan', header: 'Second Holder PAN' },
    { field: 'second_client_kyc_status', header: 'Second Holder KYC Status' },
    { field: 'third_client_name', header: 'Third Holder Name' },
    { field: 'third_client_code', header: 'Third Holder Code' },
    { field: 'third_client_pan', header: 'Third Holder PAN' },
    { field: 'third_client_kyc_status', header: 'Third Holder KYC Status' },
    { field: 'scheme_name', header: 'Scheme' },
    { field: 'branch_name', header: 'Branch' },
    { field: 'rm_name', header: 'RM Name' },
    { field: 'sub_brk_cd', header: 'Sub Broker Code' },
    { field: 'euin_no', header: 'EUIN' },
    { field: 'mode_of_holding', header: 'Mode Of Holding' },
    { field: 'trans_name', header: 'Transaction Type' },
    { field: 'plan_name', header: 'Plan' },
    { field: 'opt_name', header: 'Option' }
  ];

  public static Columns_for_Switch: column[] = [
    { field: 'scheme_name_to', header: 'Scheme Name (To Scheme)' },
    { field: 'amount', header: 'Amount' },
    { field: 'chq_no', header: 'Cheque No' },
    { field: 'bank', header: 'Bank' },
    { field: 'inv_type', header: 'Investment Type' },
    { field: 'application_no', header: 'Application No' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'rnt_name', header: 'Form Submitted At' },
    { field: 'remarks', header: 'Remarks' },
  ];

  public static Columns_for_Sip = [
    { field: 'amount', header: 'Amount' },
    { field: 'chq_no', header: 'Cheque No' },
    { field: 'bank', header: 'Bank' },
    { field: 'inv_type', header: 'Investment Type' },
    { field: 'application_no', header: 'Application No' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'sip_type_name', header: 'SIP Type' },
    { field: 'sip_frequency', header: 'SIP Frequency' },
    { field: 'sip_date', header: 'SIP Date' },
    { field: 'sip_start_date', header: 'SIP Start Date' },
    { field: 'sip_end_date', header: 'SIP End Date' },
    { field: 'sip_amount', header: 'SIP Amount' },
    { field: 'rnt_name', header: 'Form Submitted At' },
    { field: 'remarks', header: 'Remarks' },
  ];
  public static Columns_for_Pip = [
    { field: 'amount', header: 'Amount' },
    { field: 'chq_no', header: 'Cheque No' },
    { field: 'bank', header: 'Bank' },
    { field: 'inv_type', header: 'Investment Type' },
    { field: 'application_no', header: 'Application No' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'rnt_name', header: 'Form Submitted At' },
    { field: 'remarks', header: 'Remarks' },
  ];


  public static Columns_for_nfoCombo=[
    {field:'inv_type',header:'Investment Type'},
    {field:'application_no',header:'Application No'},
    {field:'folio_no',header:'Folio No'},
    {field:'amount',header:'Amount'},
    {field:'chq_no',header:'Cheque No'},
    {field:'bank',header:'Bank'},
    {field:'scheme_name_to',header:'Scheme Name (To Scheme)'},
    {field:'switch_amt',header:'Switch Amount / Unit'},
    {field:'rnt_name',header:'Form Submitted At'},
    {field:'remarks',header:'Remarks'}
  ]
}



export class nonFinAckClms {
  public static SUMMARY_COPY = [
    { field: 'edit', header: 'Edit' },
    { field: 'app_frm_view', header: 'DOC View' },
    { field: 'entry_date', header: 'Entry Date' },
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off' },
    { field: 'rnt_login_dt', header: 'Login Date' },
    { field: 'tin_no', header: 'TIN' },
    { field: 'branch_name', header: 'Branch' },
    { field: 'sub_brk_cd', header: 'Sub Broker Code' },
    { field: 'euin_no', header: 'EUIN' },
    { field: 'first_client_name', header: 'First Holder Name' },
    { field: 'first_client_code', header: 'First Holder Code' },
    { field: 'first_client_pan', header: 'First Holder PAN' },
    { field: 'trans_name', header: 'Transction Type' },
    { field: 'scheme_name', header: 'Scheme' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'rnt_name', header: 'Form Submitted At' },
    { field: 'remarks', header: 'Remarks' }
  ];

  /**** ADDRESS CHANGE (DONE)*/
  public static AC = [
    { field: 'new_address', header: 'New Address'}
  ];
  /** END */

  /*** CHANGE MODE OF HOLDING (DONE)*/
  public static CMOH = [
    { field: 'existing_mode_of_holding', header: 'Existing Mode of Holding'},
    { field: 'new_mode_of_holding', header: 'New Mode of Holding'}
  ];
  /*** END */

  /**** CHANGE OF NAME (DONE)*/
  public static CON = [
    { field: 'reason_for_change', header: 'Reason For Change'},
    { field: 'new_name', header: 'New Name'}
  ];
   /***END */

  /***** CORE BANKING UPDATION (DONE)*/
  public static CBU = [
    { field: 'acc_no', header: 'Account No'},
    { field: 'bank_name', header: 'Bank'},
    { field: 'ifsc', header: 'IFSC'},
    { field: 'micr_code', header: 'MICR'},
    { field: 'branch_name', header: 'Branch'}
  ];
  /**** END */

  /**** CHANGE OF BANK (DONE) */
  public static COBK = [
    { field: 'existing_bank_acc_no', header: 'Existing Bank Account No'},
    { field: 'existing_bank_name', header: 'Existing Bank'},
    { field: 'existing_ifsc', header: 'Existing IFSC'},
    { field: 'existing_micr_code', header: 'Existing MICR'},
    { field: 'existing_branch_name', header: 'Existing Branch'},
    { field: 'new_bank_acc_no', header: 'New Bank Account No'},
    { field: 'new_bank_name', header: 'New Bank'},
    { field: 'new_ifsc', header: 'New IFSC'},
    { field: 'new_micr_code', header: 'New MICR'},
    { field: 'new_branch_name', header: 'New Branch'}
  ];
  /**** END */

  /*** FOLIO CONSOLIDATION MERGE (DONE)*/
  public static FCM = [
    {field:'targeted_folio',header:'Targeted Folio'},
    {field:'source_folio',header:'Source Folio'}
  ]
  /*** END */

  /***CHANGE OF BROKER (DONE)*/
  public static COB =[
    {field:'new_broker_code',header:'New Sub Broker Code'}
  ]
  /**** END */

  /** NOMINEE CHANGE OR ADDITION (DONE)*/
  public static NA_OR_NC = [
      {field:'new_nominee_name',header:'New Nominee Name'},
      {field:'percentage',header:'Percentage'}
  ]
  /** END */

   /** SWP REGISTRATION (DONE)*/
   public static SWPR = [
    {field:'swp_type_name',header:'SWP Type'},
    {field:'swp_frequency',header:'SWP Frequency'},
    {field:'swp_date',header:'SWP Date'},
    {field:'start_date',header:'Start Date'},
    {field:'end_date',header:'End Date'},
    {field:'swp_amount',header:'SWP Amount'}
]
/** END */

   /** Transmission (DONE)*/
   public static TRANSMISSION = [
    {field:'transmission_type',header:'Transmission Type'},
    {field:'claiment_name',header:'Claiment Name'},
    {field:'claiment_code',header:'Claiment Code'},
    {field:'claiment_pan',header:'PAN'}
]
/** END */

   /** Redemption (DONE)*/
   public static REDEMPTION = [
    {field:'redemption_type',header:'Redemption Type'},
    {field:'redemption_amount',header:'Amount/Unit'}
    ]
    /** END */

  /** Cancelation (DONE)*/
  public static CANCELATION = [
    {field:'cancelation_effective_date',header:'Cancelation Effective Date'},
    {field:'amount',header:'Amount'}
    ]
    /** END */

    /** PAUSE (DONE)*/
    public static PAUSE = [
    {field:'duration',header:'Duration'},
    {field:'pause_start_date',header:'Pause Start Date'},
    {field:'pause_end_date',header:'Pause End Date'},
    {field:'pause_amount',header:'Amount'}
    ]
    /** END */

    /** STP REGISTRATION (DONE)*/
    public static STP_REGISTRATION = [
      {field:'stp_type',header:'STP Type'},
      {field:'stp_frequency',header:'STP Frequency'},
      {field:'stp_date',header:'STP Date'},
      {field:'scheme_name_to',header:'Scheme Name (To Scheme)'},
      {field:'stp_start_date',header:'STP Start Date'},
      {field:'stp_end_date',header:'STP End Date'},
      {field:'stp_amount',header:'STP Amount'}
      ]
      /** END */

  /**CHANGE OF CONTACT DETAILS (DONE)*/
  public static COCD =[
    {field:'new_email',header:'New Email'},
    {field:'new_mobile',header:'New Mobile'}
  ]
  /** END */



  public static COLUMN_SELECTOR=[
    { field: 'edit', header: 'Edit' },
    { field: 'app_frm_view', header: 'DOC View' },
    { field: 'entry_date', header: 'Entry Date' },
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off' },
    { field: 'rnt_login_dt', header: 'Login Date' },
    { field: 'tin_no', header: 'TIN' },
    { field: 'bu_type', header: 'Business Type' },
    { field: 'branch_name', header: 'Branch' },
    { field: 'rm_name', header: 'RM Name'},
    { field: 'sub_brk_cd', header: 'Sub Broker Code'},
    { field: 'euin_no', header: 'EUIN' },
    { field: 'first_client_name', header: 'First Holder Name' },
    { field: 'first_client_code', header: 'First Holder Code' },
    { field: 'first_client_pan', header: 'First Holder PAN' },
    { field: 'trans_name', header: 'Transction Type' },
    { field: 'scheme_name', header: 'Scheme'},
    { field: 'plan_name', header: 'Plan' },
    { field: 'opt_name', header: 'Option' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'amount', header: 'Amount' },
    { field: 'rnt_name', header: 'Form Submitted At'},
    { field: 'remarks', header: 'Remarks'},

  ]
}
