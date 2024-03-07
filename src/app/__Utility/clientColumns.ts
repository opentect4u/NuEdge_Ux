import { column } from "../__Model/tblClmns";

export class clientColumns {
  public static EXISTING_CLIENT = [
    'edit',
    'delete',
    'client_type',
    'client_name',
    'pan',
  ];

  public static Existing_Client=[
    { field: 'edit', header: 'Edit',width:'7rem'},
    { field: 'delete', header: 'Delete',width:'7rem'},
    { field: 'client_type', header: 'Client Type',width:'50rem'},
    { field: 'client_name', header: 'Client Name',width:'50rem'},
    { field: 'pan', header: 'PAN',width:'20rem'}
  ]

  /** PAN HOLDER COLUMNS */
  public static initial_column_for_pan = [
    { field: 'edit', header: 'Edit',width:'5rem'},
    { field: 'delete', header: 'Delete',width:'5rem'},
    { field: 'client_code', header: 'Client Code',width:'10rem'},
    { field: 'client_type', header: 'Client Type',width:'10rem'},
    { field: 'client_name', header: 'Client Name',width:'20rem'},
    { field: 'pan', header: 'PAN',width:'10rem'},
    { field: 'mobile', header: 'Mobile',width:'10rem'},
    { field: 'email', header: 'Email',width:'20rem'},
    { field: 'upload_details', header: 'Document',width:'5rem'}
  ]

  public static pan_holder_client = [
    { field: 'edit', header: 'Edit',width:'5rem'},
    { field: 'delete', header: 'Delete',width:'5rem'},
    { field: 'client_code', header: 'Client Code',width:'10rem'},
    { field: 'client_type', header: 'Client Type',width:'10rem'},
    { field: 'client_name', header: 'Client Name',width:'20rem'},
    { field: 'pan', header: 'PAN',width:'10rem'},
    { field: 'dob', header: 'Date Of Birth',width:'10rem'},
    { field: 'dob_actual', header: 'Actual Date Of Birth',width:'10rem'},
    { field:"maritial_status",header: 'Maritial Status',width:'10rem'},
    { field:"anniversary_date",header: 'Anniversary Date',width:'10rem'},
    { field: 'mobile', header: 'Mobile',width:'10rem'},
    { field: 'sec_mobile', header: 'Alternative Mobile',width:'10rem'},
    { field: 'email', header: 'Email',width:'20rem'},
    { field: 'sec_email', header: 'Alternative Email',width:'20rem'},
    { field: 'add_line_1', header: 'Address-1',width:'20rem'},
    { field: 'add_line_2', header: 'Address-2',width:'20rem'},
    { field: 'state_name', header: 'State',width:'10rem'},
    { field: 'district_name', header: 'District',width:'10rem'},
    { field: 'city_name', header: 'City',width:'10rem'},
    { field: 'pincode', header: 'Pincode',width:'10rem'},
    { field: 'upload_details',header:'Document',width:'5rem'}
  ];

  public static initial_column_for_minor=[
    { field: 'edit', header: 'Edit',width:'5rem'},
    { field: 'delete', header: 'Delete',width:'5rem'},
    { field: 'client_type', header: 'Client Type',width:'7rem'},
    { field: 'client_name', header: 'Client Name',width:'15rem'},
    { field: 'dob', header: 'Date Of Birth',width:'10rem'},
    { field: 'guardians_name', header: 'Gurdians Name',width:'15rem'},
    { field: 'guardians_pan', header: 'Gurdians PAN',width:'10rem'},
    { field: 'relation', header: 'Relation',width:'10rem'},
    { field: 'mobile', header: 'Mobile',width:'10rem'},
    { field: 'email', header: 'Email',width:'15rem'},
    { field: 'upload_details', header: 'Document',width:'5rem'},
  ]
  public static Minor_Client:column[] = [
    { field: 'edit', header: 'Edit',width:'5rem'},
    { field: 'delete', header: 'Delete',width:'5rem'},
    { field: 'client_type', header: 'Client Type',width:'7rem'},
    { field: 'client_code', header: 'Client Code',width:'8rem'},
    { field: 'client_name', header: 'Client Name',width:'15rem'},
    { field: 'dob', header: 'Date Of Birth',width:'10rem'},
    { field: 'dob_actual', header: 'Actual Date Of Birth',width:'10rem'},
    { field: 'guardians_name', header: 'Gurdians Name',width:'15rem'},
    { field: 'guardians_pan', header: 'Gurdians PAN',width:'10rem'},
    { field: 'relation', header: 'Relation',width:'10rem'},
    { field: 'mobile', header: 'Mobile',width:'10rem'},
    { field: 'sec_mobile', header: 'Alternative Mobile',width:'10rem'},
    { field: 'email', header: 'Email',width:'15rem'},
    { field: 'sec_email', header: 'Alternative Email',width:'15rem'},
    { field: 'add_line_1', header: 'Address-1',width:'20rem'},
    { field: 'add_line_2', header: 'Address-2',width:'20rem'},
    { field: 'state_name', header: 'State',width:'15rem'},
    { field: 'district_name', header: 'District',width:'15rem'},
    { field: 'city_name', header: 'City',width:'15rem'},
    { field: 'pincode', header: 'Pincode',width:'10rem'},
    { field: 'upload_details',header:'Upload Details',width:'5rem'}
  ]
  /** END */

  public static column_selector = [
    { field: 'edit', header: 'Edit',width:'5rem'},
    { field: 'delete', header: 'Delete',width:'5rem'},
    { field: 'client_code', header: 'Client Code',width:'10rem'},
    { field: 'client_type', header: 'Client Type',width:'10rem'},
    { field: 'client_name', header: 'Client Name',width:'20rem'},
    { field: 'pan', header: 'PAN',width:'7rem'},
    { field: 'dob', header: 'Date Of Birth',width:'10rem'},
    { field:"maritial_status",header: 'Maritial Status',width:'10rem'},
    { field:"anniversary_date",header: 'Anniversary Date',width:'10rem'},
    { field: 'dob_actual', header: 'Actual Date Of Birth',width:'10rem'},
    { field: 'guardians_pan', header: 'Gurdians PAN',width:'10rem'},
    { field: 'guardians_name', header: 'Gurdians Name',width:'20rem'},
    { field: 'relation', header: 'Relation',width:'10rem'},
    { field: 'mobile', header: 'Mobile',width:'10rem'},
    { field: 'sec_mobile', header: 'Alternative Mobile',width:'10rem'},
    { field: 'email', header: 'Email',width:'20rem'},
    { field: 'sec_email', header: 'Alternative Email',width:'20rem'},
    { field: 'add_line_1', header: 'Address-1',width:'20rem'},
    { field: 'add_line_2', header: 'Address-2',width:'20rem'},
    { field: 'state_name', header: 'State',width:'10rem'},
    { field: 'district_name', header: 'District',width:'10rem'},
    { field: 'city_name', header: 'City',width:'10rem'},
    { field: 'pincode', header: 'Pincode',width:'7rem'},
    { field: 'upload_details',header:'Document',width:'5rem'}
  ];



  public static COLUMN_SELECTOR = [
    { id: 'edit', text: 'Edit',width:'5rem'},
    { id: 'delete', text: 'Delete',width:'5rem'},
    { id: 'client_code', text: 'Client Code',width:'10rem'},
    { id: 'client_name', text: 'Client Name',width:'20rem'},
    { id: 'pan', text: 'PAN',width:'10rem'},
    { id: 'dob', text: 'Date Of Birth',width:'10rem'},
    { id:"maritial_status",text: 'Maritial Status',width:'10rem'},
    { id:"anniversary_date",text: 'Anniversary Date',width:'10rem'},
    { id: 'dob_actual', text: 'Actual Date Of Birth',width:'10rem'},
    { id: 'guardians_pan', text: 'Gurdians PAN',width:'10rem'},
    { id: 'guardians_name', text: 'Gurdians Name',width:'20rem'},
    { id: 'relation', text: 'Relation',width:'10rem'},
    { id: 'mobile', text: 'Mobile',width:'10rem'},
    { id: 'sec_mobile', text: 'Alternative Mobile',width:'10rem'},
    { id: 'email', text: 'Email',width:'20rem'},
    { id: 'sec_email', text: 'Alternative Email',width:'20rem'},
    { id: 'add_line_1', text: 'Address-1',width:'20rem'},
    { id: 'add_line_2', text: 'Address-2',width:'20rem'},
    { id: 'state_name', text: 'State',width:'10rem'},
    { id: 'district_name', text: 'District',width:'10rem'},
    { id: 'city_name', text: 'City',width:'10rem'},
    { id: 'pincode', text: 'Pincode',width:'10rem'},
    { id: 'upload_details',text:'Upload Details',width:'5rem'}
  ];

  public static INITIAL_COLUMNS = [
    'edit',
    'delete',
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
    'district',
    'city',
    'pincode',
    'upload_details'
  ];
  /** End */

  /** NON PAN HOLDER COLUMNS */
  public static INITIAL_COLUMNS_FOR_NON_PAN = [
    'edit',
    'delete',
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
    'district',
    'city',
    'pincode',
    'upload_details'
  ];
  /* End */

  /** MINOR CLOUMNS */
  public static INITIAL_COLUMNS_FOR_MINOR = [
    'edit',
    'delete',
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
    'district',
    'city',
    'pincode',
    'upload_details'
  ];



  /** TABLE DATA FOR UPLOAD CSV */

   public static TBL_DATA = [
    {
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
