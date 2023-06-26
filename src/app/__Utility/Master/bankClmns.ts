import { column } from "src/app/__Model/tblClmns";

export class bankClmns{
  public static COLUMN:column[]=[
  {field:'edit',header:'Edit'},
  {field:'delete',header:'Delete'},
  {field:'bank_name',header:'Bank'},
  {field:'ifs_code',header:'IFSC'},
  {field:'micr_code',header:'MICR'},
  {field:'branch_name',header:'Branch'},
  {field:'branch_addr',header:'Branch Address'}
  ]
}
