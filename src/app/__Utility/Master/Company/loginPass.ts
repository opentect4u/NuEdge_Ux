
import { column } from "src/app/__Model/tblClmns";

export class loginPassClmns{
  public static columns:column[] =[
    {field:'edit',header:'Edit'},
    {field:'product_name',header:'Product'},
    {field:'login_url',header:'LoginURL'},
    {field:'login_id',header:'Login ID'},
    {field:'login_pass',header:'Password'}
  ]
}
