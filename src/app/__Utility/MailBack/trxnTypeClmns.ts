export class trxnTypeClmns{
        public static columns =[
                          {field:'edit',header:'Edit',isVisible:[1,2]},
                          {field:'rnt_name',header:'R&T',isVisible:[1,2]},
                          {field:'trans_type',header:'Trxn Type',isVisible:[1,2]},
                          {field:'trans_sub_type',header:'Trxn Sub type',isVisible:[1,2]},
                          {field:'c_trans_type_code',header:'File Trxn Type Code',isVisible:[1]},
                          {field:'c_k_trans_type',header:'File Trxn Type',isVisible:[1,2]},
                          {field:'c_k_trans_sub_type',header:'File Trxn Sub Type',isVisible:[1,2]},
                          {field:'k_divident_flag',header:'Divident Flag',isVisible:[2]}
        ]
}

export class systamaticTransClmns{
  public static columns =[
    {field:'edit',header:'Edit',isVisible:[1,2]},
    {field:'rnt_name',header:'R&T',isVisible:[1,2]},
    {field:'trans_type',header:'Trxn Type',isVisible:[1,2]},
    {field:'trans_type_code',header:'File Trxn Type',isVisible:[1,2]},
]
}

export class systamaticFreqClmns{
  public static columns =[
    {field:'edit',header:'Edit',isVisible:[1,2]},
    {field:'rnt_name',header:'R&T',isVisible:[1,2]},
    {field:'freq_name',header:'Frequency',isVisible:[1,2]},
    {field:'freq_code',header:'Frequency Code',isVisible:[1,2]},
]
}


