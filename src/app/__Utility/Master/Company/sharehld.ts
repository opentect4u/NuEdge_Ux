import { column } from "src/app/__Model/tblClmns";

export class shareholderClmns{
      public static column:column[] = [
        {field:'edit',header:'Edit'},
        {field:'cm_profile_name',header:'Company'},
        {field:'name',header:'Shareholder Name'},
        {field:'mob',header:'Mobile'},
        {field:'dob',header:'DOB'},
        {field:'email',header:'Email'},
        {field:'pan',header:'PAN'},
        {field:'percentage',header:'Percentage'},
        {field:'certificate_no',header:'Certificate No.'},
        {field:'date',header:'Date'},
        {field:'no_of_share',header:'No.Of Share'},
        {field:'registered_folio',header:'Registered Folio'},
        {field:'distinctive_no_from',header:'Distinctive No. From'},
        {field:'distinctive_no_to',header:'Distinctive No. To'},
        {field:'nominee',header:'Nominee'},
        {field:'type',header:'Shareholder Type'},
        {field:'transfer_from',header:'Transfer From'},
        {field:'add_1',header:'Address-1'},
        {field:'add_2',header:'Address-2'},
        {field:'country_name',header:'Country'},
        {field:'state_name',header:'State'},
        {field:'district_name',header:'District'},
        {field:'city_name',header:'City'},
        {field:'pincode_code',header:'Pincode'},
        {field:'upload_file',header:'Document'},
        {field:'remarks',header:'Remarks'}
      ]
}
