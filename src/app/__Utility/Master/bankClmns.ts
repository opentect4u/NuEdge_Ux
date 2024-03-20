import { column } from "src/app/__Model/tblClmns";

export class bankClmns{
  public static COLUMN:column[]=[
  {field:'edit',header:'Edit',width:'5rem'},
  {field:'delete',header:'Delete',width:'5rem'},
  {field:'bank_name',header:'Bank',width:'25rem'},
  {field:'ifs_code',header:'IFSC',width:'10rem'},
  {field:'micr_code',header:'MICR',width:'10rem'},
  {field:'branch_name',header:'Branch',width:'20rem'},
  {field:'branch_addr',header:'Branch Address',width:'55rem'}
  ]
}
