export class compClmns{
  public static Summary =[
    {field:'edit',header:'Edit'},
    {field:'delete',header:'Delete'},
    {field:'ins_type',header:'Insurance Type'},
    {field:'comp_full_name',header:'Company Full Name'},
    {field:'comp_short_name',header:'Company Short Name'}
  ];
  public static Column_Selector =[
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'ins_type', header: 'Insurance Type' },
    { field: 'comp_full_name', header: 'Company Full name' },
    { field: 'comp_short_name', header: 'Company Short Name' },
    { field: 'website', header: 'Website' },
    { field: 'cus_care_whatsApp_no', header: 'Customer Care WhatsApp Number' },
    { field: 'cus_care_no', header: 'Customer Care Number' },
    { field: 'cus_care_email', header: 'Customer Care Email' },
    {field:'distributor_care_no',header:'Distributor Care Number'},
    {field:'distributor_care_email',header:'Distributor Care Email'},
    { field: 'head_ofc_contact_per', header: 'Head Office Contact Person' },
    {field: 'head_contact_per_mobile',header: 'Head Office Contact Person Mobile',},
    { field: 'head_contact_per_email', header: 'Head Office Contact Person Email'},
    { field: 'head_ofc_addr', header: 'Head Office Contact Person Address'},
    { field: 'local_ofc_contact_per', header: 'Local Office Contact Person'},
    {field: 'local_contact_per_mobile',header: 'Local Office Contact Person Mobile',},
    {field: 'local_contact_per_email',header: 'Local Office Contact Person Email'},
    {field: 'local_ofc_addr',header: 'Local Office Contact Person Address'},
    { field: 'login_url', header: 'Login URL' },
    { field: 'login_id', header: 'Login ID' },
    { field: 'login_pass', header: 'Login Password' },
    {field:'l1_name',header:'Level-1 Name'},
    {field:'l1_email',header:'Level-1 Email'},
    {field:'l1_contact_no',header:'Level-1 Contact Number'},
    {field:'l2_name',header:'Level-2 Name'},
    {field:'l2_email',header:'Level-2 email'},
    {field:'l2_contact_no',header:'Level-2 Contact Number'},
    {field:'l3_name',header:'Level-3 Name'},
    {field:'l3_email',header:'Level-3 Email'},
    {field:'l3_contact_no',header:'Level-3 Contact Number'},
    {field:'l4_name',header:'Level-4 Name'},
    {field:'l4_email',header:'Level-4 Email'},
    {field:'l4_contact_no',header:'Level-4 Contact Number'},
    {field:'l5_name',header:'Level-5 Name'},
    {field:'l5_email',header:'Level-5 Email'},
    {field:'l5_contact_no',header:'Level-5 Contact Number'},
    {field:'l6_name',header:'Level-6 Name'},
    {field:'l6_email',header:'Level-6 Email'},
    {field:'l6_contact_no',header:'Level-6 Contact Number'},
  ]
  public static LEVELS = [
    {id:1,value:"Level-1(Operation)",submenu:[{field:'l1_name',header:'Level-1 Name'},{field:'l1_email',header:'Level-1 Email'},{field:'l1_contact_no',header:'Level-1 Contact Number'}]},
    {id:2,value:"Level-2(Operation Head)",submenu:[{field:'l2_name',header:'Level-2 Name'},{field:'l2_email',header:'Level-2 Email'},{field:'l2_contact_no',header:'Level-2 Contact Number'}]},
    {id:3,value:"Level-3(RM - Sales)",submenu:[{field:'l3_name',header:'Level-3 Name'},{field:'l3_email',header:'Level-3 Email'},{field:'l3_contact_no',header:'Level-3 Contact Number'}]},
    {id:4,value:"Level-4(Area Manager/Regional Manager)",submenu:[{field:'l4_name',header:'Level-4 Name'},{field:'l4_email',header:'Level-4 Email'},{field:'l4_contact_no',header:'Level-4 Contact Number'}]},
    {id:5,value:"Level-5(Zonal Manager/State Head)",submenu:[{field:'l5_name',header:'Level-5 Name'},{field:'l5_email',header:'Level-5 Email'},{field:'l5_contact_no',header:'Level-5 Contact Number'}]},
    {id:6,value:"Level-6(National Sales Head/Product Head)",submenu:[{field:'l6_name',header:'Level-6 Name'},{field:'l6_email',header:'Level-6 Email'},{field:'l6_contact_no',header:'Level-6 Contact Number'}]}
  ]
}

export class productClmns{
  public static Columns =[
    {field:'edit',header:'Edit'},
    {field:'delete',header:'Delete'},
    {field:'ins_type_name',header:'Insurance Type'},
    {field:'comp_full_name',header:'Company Full Name'},
    {field:'comp_short_name',header:'Company Short Name'},
    {field:'product_type',header:'Product Type'},
    {field:'product_name',header:'Product'}
  ];
}
export class productTypeClmns{
  public static Columns =[
    {field:'edit',header:'Edit'},
    {field:'delete',header:'Delete'},
    {field:'ins_type',header:'Insurance Type'},
    {field:'product_type',header:'Product Type'}
  ]
}
