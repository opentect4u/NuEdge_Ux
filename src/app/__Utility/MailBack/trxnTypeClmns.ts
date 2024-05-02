export class trxnTypeClmns{
        public static columns =[
                          {field:'sl_no',header:'Sl No',isVisible:[1,2],width:'3rem'},
                          {field:'edit',header:'Edit',isVisible:[1,2],width:'3rem'},
                          {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'5rem'},
                          {field:'trans_type',header:'Trxn Type',isVisible:[1,2],width:'10rem'},
                          {field:'trans_sub_type',header:'Trxn Sub type',isVisible:[1,2],width:'10rem'},
                          {field:'c_trans_type_code',header:'File Trxn Type Code',isVisible:[1],width:'10rem'},
                          {field:'c_k_trans_type',header:'File Trxn Type',isVisible:[1,2],width:'10rem'},
                          {field:'c_k_trans_sub_type',header:'File Trxn Sub Type',isVisible:[1,2],width:'10rem'},
                          {field:'k_divident_flag',header:'Divident Flag',isVisible:[2],width:'7rem'},
                          {field:'process_type',header:"MIS Type",isVisible:[1,2],width:'7rem'},
                          {field:'xirr_process_type',header:"XIRR Process Type",isVisible:[1,2],width:'8rem'},
                          {field:'lmf_pl',header:"P&l Calc. Flag",isVisible:[1,2],width:'7rem'},
        ]
}

export class systamaticTransClmns{
  public static columns =[
    {field:'sl_no',header:'Sl No',isVisible:[1,2],width:'2rem'},
    {field:'edit',header:'Edit',isVisible:[1,2],width:'2rem'},
    {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'2rem'},
    {field:'trans_type',header:'Trxn Type',isVisible:[1,2],width:'15rem'},
    {field:'trans_sub_type',header:'Trxn Sub type',isVisible:[1,2],width:'15rem'},
    {field:'trans_type_code',header:'File Trxn Type',isVisible:[1,2],width:'2rem'},
    {field:'process_type',header:'Process Type',isVisible:[1,2],width:'2rem'},
]
}

export class systamaticFreqClmns{
  public static columns =[
    {field:'sl_no',header:'Sl No',isVisible:[1,2],width:'2rem'},
    {field:'edit',header:'Edit',isVisible:[1,2],width:'2rem'},
    {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'2rem'},
    {field:'freq_name',header:'Frequency',isVisible:[1,2],width:'15rem'},
    {field:'freq_code',header:'Frequency Code',isVisible:[1,2],width:'15rem'},
]
}


export class systamaticUnregisteredRemarksClmns{
  public static columns =[
    {field:'sl_no',header:'Sl No',isVisible:[1,2],width:'1rem'},
    {field:'edit',header:'Edit',isVisible:[1,2],width:'1rem'},
    {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'1rem'},
    {field:'remarks',header:'Remarks',isVisible:[1,2],width:'15rem'}
]
}

export class FolioTaxStatus{
  public static columns = [
    {field:'sl_no',header:'Sl No',isVisible:[1,2],width:'2rem'},
    {field:'edit',header:'Edit',isVisible:[1,2],width:'2rem'},
    {field:'rnt_name',header:'R&T',isVisible:[1,2],width:'2rem'},
    {field:'status',header:'Status',isVisible:[1,2],width:'10rem'},
    {field:'status_code',header:'Code',isVisible:[1,2],width:'10rem'}
  ]
}


