export class trxnTypeClmns{
        public static columns =[
                          {field:'sl_no',header:'Sl No',isVisible:[1,2]},
                          {field:'edit',header:'Edit',isVisible:[1,2]},
                          {field:'rnt_name',header:'R&T',isVisible:[1,2]},
                          {field:'trans_type',header:'Trxn Type',isVisible:[1,2]},
                          {field:'trans_sub_type',header:'Trxn Sub type',isVisible:[1,2]},
                          {field:'c_trans_type_code',header:'File Trxn Type Code',isVisible:[1]},
                          {field:'c_k_trans_type',header:'File Trxn Type',isVisible:[1,2]},
                          {field:'c_k_trans_sub_type',header:'File Trxn Sub Type',isVisible:[1,2]},
                          {field:'k_divident_flag',header:'Divident Flag',isVisible:[2]},
                          {field:'process_type',header:"MIS Type",isVisible:[1,2]},
                          {field:'xirr_process_type',header:"XIRR Process Type",isVisible:[1,2]},

        ]
}

export class systamaticTransClmns{
  public static columns =[
    {field:'sl_no',header:'Sl No',isVisible:[1,2]},
    {field:'edit',header:'Edit',isVisible:[1,2]},
    {field:'rnt_name',header:'R&T',isVisible:[1,2]},
    {field:'trans_type',header:'Trxn Type',isVisible:[1,2]},
    {field:'trans_sub_type',header:'Trxn Sub type',isVisible:[1,2]},
    {field:'trans_type_code',header:'File Trxn Type',isVisible:[1,2]},
]
}

export class systamaticFreqClmns{
  public static columns =[
    {field:'sl_no',header:'Sl No',isVisible:[1,2]},
    {field:'edit',header:'Edit',isVisible:[1,2]},
    {field:'rnt_name',header:'R&T',isVisible:[1,2]},
    {field:'freq_name',header:'Frequency',isVisible:[1,2]},
    {field:'freq_code',header:'Frequency Code',isVisible:[1,2]},
]
}


export class systamaticUnregisteredRemarksClmns{
  public static columns =[
    {field:'sl_no',header:'Sl No',isVisible:[1,2]},
    {field:'edit',header:'Edit',isVisible:[1,2],width:'15rem'},
    {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'25rem'},
    {field:'remarks',header:'Remarks',isVisible:[1,2],width:''}
]
}

export class FolioTaxStatus{
  public static columns = [
    {field:'sl_no',header:'Sl No',isVisible:[1,2]},
    {field:'edit',header:'Edit',isVisible:[1,2],width:'15rem'},
    {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'25rem'},
    {field:'status',header:'Status',isVisible:[1,2],width:''},
    {field:'status_code',header:'Code',isVisible:[1,2],width:''}
  ]
}


