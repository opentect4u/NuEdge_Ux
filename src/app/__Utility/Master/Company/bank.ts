import { column } from "src/app/__Model/tblClmns";

export class bankClmns{
    public static columns:column[] =[
      {field:'edit',header:'Edit'},
      {field:'upload_chq',header:'Document'},
      {field:'cm_profile_name',header:'Company'},
      {field:'acc_no',header:'Account No.'},
      {field:'bank_name',header:'Bank'},
      {field:'ifsc',header:'IFSC'},
      {field:'micr',header:'MICR'},
      {field:'branch_name',header:'Branch'},
      {field:'branch_add',header:'Branch Address'}
    ]


}
