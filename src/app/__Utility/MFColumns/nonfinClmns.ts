export class nonFinClms {
  public static SUMMARY_COPY = [
    { field: 'folio_no', header: 'Folio No',width:'8rem'},
    { field: 'edit', header: 'Edit',width:'8rem'},
    {field:'ack_copy_scan',header:'ACK. View',width:'8rem'},
    { field: 'app_frm_view', header: 'APP View',width:'8rem'},
    { field: 'entry_date', header: 'Entry Date',width:'10rem'},
    { field: 'rnt_login_cutt_off', header: 'Login Cut Off' ,width:'10rem'},
    { field: 'rnt_login_dt', header: 'Login Date&Time',width:'15rem'},
    { field: 'tin_no', header: 'TIN',width:'8rem'},
    { field: 'branch_name', header: 'Branch',width:'10rem'},
    { field: 'sub_brk_cd', header: 'Sub Broker Code',width:'10rem'},
    { field: 'euin_no', header: 'EUIN' ,width:'8rem'},
    { field: 'first_client_name', header: 'First Holder Name',width:'15rem'},
    { field: 'first_client_code', header: 'First Holder Code',width:'10rem'},
    { field: 'first_client_pan', header: 'First Holder PAN' ,width:'8rem'},
    { field: 'trans_name', header: 'Transction Type',width:'12rem'},
    { field: 'scheme_name', header: 'Scheme',width:'20rem'},
    // { field: 'folio_no', header: 'Folio No',width:'8rem'},
    // { field: 'rnt_name', header: 'Form Submitted At',width:'12rem'},
    // { field: 'remarks', header: 'Remarks',width:'10rem'}
  ];

  /**** ADDRESS CHANGE (DONE)*/
  public static AC = [
    { field: 'new_address', header: 'New Address',width:'15rem'}
  ];
  /** END */

  /*** CHANGE MODE OF HOLDING (DONE)*/
  public static CMOH = [
    { field: 'existing_mode_of_holding', header: 'Existing Mode of Holding',width:'10rem'},
    { field: 'new_mode_of_holding', header: 'New Mode of Holding',width:'10rem'}
  ];
  /*** END */

  /**** CHANGE OF NAME (DONE)*/
  public static CON = [
    { field: 'reason_for_change', header: 'Reason For Change',width:'10rem'},
    { field: 'new_name', header: 'New Name',width:'15rem'}
  ];
   /***END */

  /***** CORE BANKING UPDATION (DONE)*/
  public static CBU = [
    // { field: 'acc_no', header: 'Account No',width:'12rem'},
    // { field: 'bank_name', header: 'Bank',width:'12rem'},
    // { field: 'ifsc', header: 'IFSC',width:'12rem'},
    // { field: 'micr_code', header: 'MICR',width:'12rem'},
    // { field: 'branch_name', header: 'Branch',width:'12rem'}
    { field: 'new_bank_acc_no', header: 'New Bank Account No',width:'12rem'},
    { field: 'new_bank_name', header: 'New Bank',width:'12rem'},
    { field: 'new_ifsc', header: 'New IFSC',width:'12rem'},
    { field: 'new_micr_code', header: 'New MICR',width:'12rem'},
    { field: 'new_branch_name', header: 'New Branch',width:'12rem'}
  ];
  /**** END */

  /**** CHANGE OF BANK (DONE) */
  public static COBK = [
    { field: 'existing_bank_acc_no', header: 'Existing Bank Account No',width:'12rem'},
    { field: 'existing_bank_name', header: 'Existing Bank',width:'12rem'},
    { field: 'existing_ifsc', header: 'Existing IFSC',width:'12rem'},
    { field: 'existing_micr_code', header: 'Existing MICR',width:'12rem'},
    { field: 'existing_branch_name', header: 'Existing Branch',width:'12rem'},
    { field: 'new_bank_acc_no', header: 'New Bank Account No',width:'12rem'},
    { field: 'new_bank_name', header: 'New Bank',width:'12rem'},
    { field: 'new_ifsc', header: 'New IFSC',width:'12rem'},
    { field: 'new_micr_code', header: 'New MICR',width:'12rem'},
    { field: 'new_branch_name', header: 'New Branch',width:'12rem'}
  ];
  /**** END */

  /*** FOLIO CONSOLIDATION MERGE (DONE)*/
  public static FCM = [
    {field:'targeted_folio',header:'Targeted Folio',width:'8rem'},
    {field:'source_folio',header:'Source Folio',width:'8rem'}
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
      {field:'percentage',header:'Percentage',width:'10rem'}
  ]
  /** END */

   /** SWP REGISTRATION (DONE)*/
   public static SWPR = [
    {field:'swp_type_name',header:'SWP Type',width:'12rem'},
    {field:'swp_frequency',header:'SWP Frequency',width:'12rem'},
    {field:'swp_date',header:'SWP Date',width:'12rem'},
    {field:'swp_start_date',header:'Start Date',width:'12rem'},
    {field:'swp_end_date',header:'End Date',width:'12rem'},
    {field:'swp_amount',header:'SWP Amount',width:'12rem'}
]

/** END */

   /** Transmission (DONE)*/
   public static TRANSMISSION = [
    {field:'transmission_type',header:'Transmission Type',width:'12rem'},
    {field:'claiment_name',header:'Claiment Name',width:'12rem'},
    {field:'claiment_code',header:'Claiment Code',width:'12rem'},
    {field:'claiment_pan',header:'PAN',width:'8rem'}
]
/** END */

   /** Redemption (DONE)*/
   public static REDEMPTION = [
    {field:'redemp_type',header:'Redemption Type',width:'12rem'},
    {field:'amount',header:'Amount',width:'10rem'},
    {field:'unit',header:'Unit',width:'10rem'},
    ]
    /** END */

  /** Cancelation (DONE)*/
  public static CANCELATION = [
    {field:'cancel_eff_dt',header:'Cancelation Effective Date',width:'15rem'},
    {field:'amount',header:'Amount',width:'12rem'}
    ]
    /** END */

    /** PAUSE (DONE)*/
    public static PAUSE = [
    // {field:'duration',header:'Duration',width:'12rem'},
    {field:'pause_duration',header:'Duration',width:'12rem'},
    {field:'pause_start_date',header:'Pause Start Date',width:'12rem'},
    {field:'pause_end_date',header:'Pause End Date',width:'12rem'},
    {field:'pause_amount',header:'Amount',width:'12rem'}
    ]
    /** END */

    /** STP REGISTRATION (DONE)*/
    public static STP_REGISTRATION = [
      {field:'stp_type_name',header:'STP Type',width:'12rem'},
      {field:'stp_frequency',header:'STP Frequency',width:'12rem'},
      {field:'stp_date',header:'STP Date',width:'12rem'},
      {field:'scheme_name_to',header:'Scheme Name (To Scheme)',width:'20rem'},
      { field: 'plan_name_to', header: 'Plan (To Plan)',width:'10rem' },
      { field: 'opt_name_to', header: 'Option (To Option)',width:'10rem' },
      {field:'stp_start_date',header:'STP Start Date',width:'12rem'},
      {field:'stp_end_date',header:'STP End Date',width:'12rem'},
      {field:'stp_amount',header:'STP Amount',width:'12rem'}
      ]
      /** END */

  /**CHANGE OF CONTACT DETAILS (DONE)*/
  public static COCD =[
    {field:'new_email',header:'New Email',width:'15rem'},
    {field:'new_mobile',header:'New Mobile',width:'10rem'}
  ]
  /** END */



  public static COLUMN_SELECTOR=[
    {field:'folio_no',header:'Folio No.',width:'8rem'},
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
    { field: 'amount', header: 'Amount',width:'10rem'},


  ]

  public static COMMON_COLUMN = [
    { field: 'rnt_name', header: 'Form Submitted At',width:'12rem'},
    { field: 'remarks', header: 'Remarks',width:'10rem'},
  ]
  
}

