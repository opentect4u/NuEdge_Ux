import { column } from "../__Model/tblClmns";

export class clientColumns {
  public static EXISTING_CLIENT = [
    'edit',
    'delete',
    'sl_no',
    'client_type',
    'client_name',
    'pan',
  ];

  public static Existing_Client=[
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'sl_no', header: 'Sl No' },
    { field: 'type_name', header: 'Client Type' },
    { field: 'client_name', header: 'Client Name' },
    { field: 'pan', header: 'PAN' }
  ]

  /** PAN HOLDER COLUMNS */
  public static initial_column_for_pan = [
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'sl_no', header: 'Sl No' },
    { field: 'client_code', header: 'Client Code' },
    { field: 'type_name', header: 'Client Type' },
    { field: 'client_name', header: 'Client Name' },
    { field: 'pan', header: 'PAN' },
    { field: 'mobile', header: 'Mobile' },
    { field: 'email', header: 'Email' },
    { field: 'upload_details', header: 'Document' }
  ]

  public static pan_holder_client = [
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'sl_no', header: 'Sl No' },
    { field: 'type_name', header: 'Client Type' },
    { field: 'client_code', header: 'Client Code' },
    { field: 'client_name', header: 'Client Name' },
    { field: 'pan', header: 'PAN' },
    { field: 'dob', header: 'Date Of Birth' },
    { field: 'dob_actual', header: 'Actual Date Of Birth' },
    { field:"maritial_status",header: 'Maritial Status'},
    { field:"anniversary_date",header: 'Anniversary Date'},
    { field: 'mobile', header: 'Mobile' },
    { field: 'sec_mobile', header: 'Alternative Mobile' },
    { field: 'email', header: 'Email' },
    { field: 'sec_email', header: 'Alternative Email' },
    { field: 'add_line_1', header: 'Address-1' },
    { field: 'add_line_2', header: 'Address-2' },
    { field: 'state', header: 'State' },
    { field: 'dist', header: 'District' },
    { field: 'city', header: 'City' },
    { field: 'pincode', header: 'Picode' },
    { field: 'upload_details',header:'Document'}
  ];

  public static initial_column_for_minor=[
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'sl_no', header: 'Sl No' },
    { field: 'type_name', header: 'Client Type' },
    { field: 'client_name', header: 'Client Name' },
    { field: 'dob', header: 'Date Of Birth' },
    { field: 'guardians_name', header: 'Gurdians Name' },
    { field: 'guardians_pan', header: 'Gurdians PAN' },
    { field: 'relation', header: 'Relation' },
    { field: 'mobile', header: 'Mobile' },
    { field: 'email', header: 'Email' },
    { field: 'upload_details', header: 'Document' },
  ]
  public static Minor_Client:column[] = [
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'sl_no', header: 'Sl No' },
    { field: 'client_code', header: 'Client Code' },
    { field: 'client_name', header: 'Client Name' },
    { field: 'dob', header: 'Date Of Birth' },
    { field: 'dob_actual', header: 'Actual Date Of Birth' },
    { field: 'guardians_pan', header: 'Gurdians PAN' },
    { field: 'guardians_name', header: 'Gurdians Name' },
    { field: 'relation', header: 'Relation' },
    { field: 'mobile', header: 'Mobile' },
    { field: 'sec_mobile', header: 'Alternative Mobile' },
    { field: 'email', header: 'Email' },
    { field: 'sec_email', header: 'Alternative Email' },
    { field: 'add_line_1', header: 'Address-1' },
    { field: 'add_line_2', header: 'Address-2' },
    { field: 'state', header: 'State' },
    { field: 'dist', header: 'District' },
    { field: 'city', header: 'City' },
    { field: 'pincode', header: 'Picode' },
    { field: 'upload_details',header:'Upload Details'}
  ]
  /** END */

  public static column_selector = [
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'sl_no', header: 'Sl No' },
    { field: 'client_code', header: 'Client Code' },
    { field: 'type_name', header: 'Client Type' },
    { field: 'client_name', header: 'Client Name' },
    { field: 'pan', header: 'PAN' },
    { field: 'dob', header: 'Date Of Birth' },
    { field:"maritial_status",header: 'Maritial Status'},
    { field:"anniversary_date",header: 'Anniversary Date'},
    { field: 'dob_actual', header: 'Actual Date Of Birth' },
    { field: 'guardians_pan', header: 'Gurdians PAN' },
    { field: 'guardians_name', header: 'Gurdians Name' },
    { field: 'relation', header: 'Relation' },
    { field: 'mobile', header: 'Mobile' },
    { field: 'sec_mobile', header: 'Alternative Mobile' },
    { field: 'email', header: 'Email' },
    { field: 'sec_email', header: 'Alternative Email' },
    { field: 'add_line_1', header: 'Address-1' },
    { field: 'add_line_2', header: 'Address-2' },
    { field: 'state', header: 'State' },
    { field: 'dist', header: 'District' },
    { field: 'city', header: 'City' },
    { field: 'pincode', header: 'Picode' },
    { field: 'upload_details',header:'Document'}
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
