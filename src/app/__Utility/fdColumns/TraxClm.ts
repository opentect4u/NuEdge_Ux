export class fdTraxClm {
  public static COLUMNFORDETAILS = [
    'edit',
    'delete',
    "tin_no",
    "bu_type",
    "sub_brk_cd",
    "euin_no",
    'fd_bu_type',
    "company_type_name",
    "comp_full_name",
    "comp_short_name",
    "scheme_name",
    "investor_name",
    "investor_pan",
    "kyc_status",
    "option",
    "sub_option",
    "tenure_type",
    "tenure",
    'interest_rate',
    "maturity_instruction",
    "amount",
    "mode_of_transaction",
    'chq_bank',
    'acc_no',
    'payment_ref_no',
    'chq_no',
    "certificate_delivery_opt",
    "tds_info",
    "comp_login_at"
  ];
  public static COLUMN_SELECTOR = [
    {id:'edit',text: 'Edit'},
    {id:'delete',text: 'Delete'},
    {id:"tin_no",text: 'TIN No'},
    {id:"bu_type",text: 'Buisness Type'},
    {id:"sub_brk_cd",text: 'Sub Broker Code'},
    {id:"euin_no",text: 'Employee'},
    {id:'fd_bu_type',text:'Fixed Deposit Buisness Type'},
    {id:"company_type_name",text:"Company Type"},
    {id:"comp_full_name",text:"company Full Name"},
    {id:"comp_short_name",text:"company Short Name"},
    {id:"scheme_name",text:"Scheme Name"},
    {id:"investor_name",text:"Investor Name"},
    {id:"kyc_status",text:"KYC Status"},
    {id:"option",text:"Option"},
    {id:"sub_option",text:"Sub Option"},
    {id:"tenure_type",text:"Tenure Type"},
    {id:"tenure",text:"Tenure"},
    {id:"interest_rate",text:"Interest Rate"},
    {id:"maturity_instruction",text:"Maturity Instruction"},
    {id:"amount",text:"Amount"},
    {id:"mode_of_transaction",text:"Mode Of Transaction"},
    {id:"chq_bank",text:"Bank Name"},
    {id:"acc_no",text:"Account Number"},
    {id:"payment_ref_no",text:"Payment Reference Number"},
    {id:"chq_no",text:"Cheque Number"},
    {id:"certificate_delivery_opt",text:"Certificate Delivery Option"},
    {id:"tds_info",text:"TDS Information"},
    {id:"comp_login_at",text:"Company Login_ At"}
  ];

  public static INITIAL_COLUMNS = [
    'edit',
    'delete',
    "tin_no",
    "bu_type",
    "sub_brk_cd",
    "euin_no"
  ]
}
