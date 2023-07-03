// visible:[1,2] : it is for identifying columns need to show as per Summary(2) & Details(1)
export class fdRcvFrmClmns{
  public static Detail_column = [
    {field:'edit',header:'Edit',isVisible:[1,2]},
    {field:'delete',header:'Delete',isVisible:[1,2]},
    {field:'entry_date',header:'Entry Date',isVisible:[1,2]},
    {field:'temp_tin_no',header:'Temporary TIN',isVisible:[1,2]},
    {field:'bu_type',header:'Business Type',isVisible:[1,2]},
    {field:'branch_name',header:'Branch',isVisible:[1,2]},
    {field:'rm_name',header:'RM Name',isVisible:[1,2]},
    {field:'sub_brk_cd',header:'Sub Broker Code',isVisible:[1]},
    {field:'emp_name',header:'Employee',isVisible:[1,2]},
    {field:'investor_name',header:'First Holder Name',isVisible:[1,2]},
    {field:'investor_code',header:'First Holder Code',isVisible:[1]},
    {field:'fd_bu_type',header:'FD Business Type',isVisible:[1]},
    {field:'scheme_name',header:'Scheme Name',isVisible:[1,2]},
    {field:'rec_datetime',header:'Receive Date Time',isVisible:[1,2]},
    {field:'recv_from',header:'Receive From',isVisible:[1,2]},
    {field:'remarks',header:'Remarks',isVisible:[1]}
  ]
}
