export class clientColumns {
  public static EXISTING_CLIENT = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_name',
    'pan',
  ];



  public static COLUMN_SELECTOR = [
    { id: 'edit', text: 'Edit' },
    { id: 'delete', text: 'Delete' },
    { id: 'sl_no', text: 'Sl No' },
    { id: 'client_code', text: 'Client Code' },
    { id: 'client_name', text: 'Client Name' },
    { id: 'pan', text: 'PAN' },
    { id: 'dob', text: 'Date Of Birth' },
    { id:"maritial_status",text: 'Maritial Status'},
    { id:"anniversary_date",text: 'Anniversary Date'},
    { id: 'dob_actual', text: 'Actual Date Of Birth' },
    { id: 'guardians_pan', text: 'Gurdians PAN' },
    { id: 'guardians_name', text: 'Gurdians Name' },
    { id: 'relation', text: 'Relation' },
    { id: 'mobile', text: 'Mobile' },
    { id: 'sec_mobile', text: 'Alternative Mobile' },
    { id: 'email', text: 'Email' },
    { id: 'sec_email', text: 'Alternative Email' },
    { id: 'add_line_1', text: 'Address-1' },
    { id: 'add_line_2', text: 'Address-2' },
    { id: 'state', text: 'State' },
    { id: 'dist', text: 'District' },
    { id: 'city', text: 'City' },
    { id: 'pincode', text: 'Picode' },
    { id: 'upload_details',text:'Upload Details'}
  ];

  public static INITIAL_COLUMNS = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'cl_type',
    'pan'
  ]

  /** PAN HOLDER COLUMNS */
  public static INITIAL_COLUMNS_FOR_PAN = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'pan',
    'mobile',
    'email',
    'upload_details'
  ]
  public static PAN_HOLDER_CLIENT = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'pan',
    'dob',
    'dob_actual',
    'maritial_status',
    'anniversary_date',
    'mobile',
    'sec_mobile',
    'email',
    'sec_email',
    'add_line_1',
    'add_line_2',
    'state',
    'dist',
    'city',
    'pincode',
    'upload_details'
  ];
  /** End */

  /** NON PAN HOLDER COLUMNS */
  public static INITIAL_COLUMNS_FOR_NON_PAN = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'dob',
    'mobile',
    'email',
    'upload_details'
  ]
  public static NON_PAN_HOLDER_CLIENT = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'dob',
    'dob_actual',
    'maritial_status',
    'anniversary_date',
    'mobile',
    'sec_mobile',
    'email',
    'sec_email',
    'add_line_1',
    'add_line_2',
    'state',
    'dist',
    'city',
    'pincode',
    'upload_details'
  ];
  /* End */

  /** MINOR CLOUMNS */
  public static INITIAL_COLUMNS_FOR_MINOR = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'dob',
    'guardians_name',
    'guardians_pan',
    'relation',
    'mobile',
    'email',
    'upload_details'
  ]
  public static MINOR_CLIENT = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_code',
    'client_name',
    'dob',
    'dob_actual',
    'guardians_name',
    'guardians_pan',
    'relation',
    'mobile',
    'sec_mobile',
    'email',
    'sec_email',
    'add_line_1',
    'add_line_2',
    'state',
    'dist',
    'city',
    'pincode',
    'upload_details'
  ];
  /** END */


  /** TABLE DATA FOR UPLOAD CSV */

   public static TBL_DATA = [
    {
    sl_no: '1',
    client_type:'',
    client_name: 'SUMAN MITRA',
    pan: 'XXXXX1234X',
    dob: '31/07/1996',
    dob_actual: '',
    maritial_status:'SINGLE',
    anniversary_date: '',
    guardians_name: '',
    guardians_pan: '',
    relation: '',
    mobile: '',
    sec_mobile: '',
    email: '',
    sec_email: '',
    add_line_1: '',
    add_line_2: '',
    state: '',
    dist: '',
    city: '',
    pincode: '',
    }
   ]

  /** END */

}
