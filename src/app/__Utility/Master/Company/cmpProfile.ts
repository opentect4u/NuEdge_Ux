import { column } from "src/app/__Model/tblClmns";

export class cmpProfile{
  public static column:column[] =[
    {field:'edit',header:'Edit'},
    {field:'logo',header:'Logo'},
    {field:'comp_type_name',header:'Company Type'},
    {field:'name',header:'Company Name'},
    // {field:'establishment_name',header:'Establishment Name'},
    {field:'proprietor_name',header:'Proprietor Name'},
    {field:'cin_no',header:'CIN'},
    {field:'date_of_inc',header:'Date Of Incorporation'},
    {field:'pan',header:'PAN'},
    {field:'gstin',header:'GSTIN'},
    {field:'contact_no',header:'Contact No'},
    {field:'add_1',header:'Address-1'},
    {field:'country_name',header:'Country'},
    {field:'state_name',header:'State'},
    {field:'district_name',header:'District'},
    {field:'city_name',header:'City'},
    {field:'pincode',header:'Pincode'},
    {field:'website',header:'Website'},
    {field:'facebook',header:'Facebook URL'},
    {field:'twitter',header:'Twitter URL'},
    {field:'instagram',header:'Instagram URL'},
    {field:'blog',header:'Blog URL'},
    {field:'comp_default',header:'Default Status'}
  ]
}
