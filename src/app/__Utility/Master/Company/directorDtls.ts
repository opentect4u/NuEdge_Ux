import { column } from "src/app/__Model/tblClmns";

export class directorDtlsClm{
  public static column:column[] = [
    {field:'edit',header:'Edit'},
    {field:'cm_profile_name',header:'Company'},
    {field:'name',header:'Director'},
    {field:'dob',header:'Date Of Birth'},
    {field:'pan',header:'PAN'},
    {field:'add_1',header:'Address-1'},
    {field:'add_2',header:'Address-2'},
    {field:'country_name',header:'Country'},
    {field:'state_name',header:'State'},
    {field:'district_name',header:'District'},
    {field:'city_name',header:'City'},
    {field:'pincode',header:'Pincode'},
    {field:'mob',header:'Mobile'},
    {field:'email',header:'Email'},
    {field:'din_no',header:'DIN'},
    {field:'Valid_from',header:'Valid From'},
    {field:'Valid_to',header:'Valid To'}
  ]
}
