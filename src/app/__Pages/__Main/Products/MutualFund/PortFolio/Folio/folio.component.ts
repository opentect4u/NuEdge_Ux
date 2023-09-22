import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folio',
  templateUrl: './folio.component.html',
  styleUrls: ['./folio.component.css']
})
export class FolioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}

export interface Ifolio{
    id:number;
    bu_type:string;
    branch_name:string;
    rm_name:string;
    sub_brk_cd:string;
    euin_no:string;
    investor_name:string;
    folio_no:number;
    scheme_name:string;
    product_code:string;
    addr_1:string;
    addr_2:string;
    addr_3:string;
    city:string;
    state:string;
    pincode:number;
    city_type:string;
    mode_of_holding:string;
    /*** First Holder Details */
    first_holder_pan:string;
    first_holder_ckyc_no:string;
    first_holder_dob:Date;
    first_holder_tax_state:string;
    first_holder_occupassion:string;
    first_holder_mob:string;
    first_holder_email:string;
    first_holder_pan_adhare_link_state:string;
    /*** End */
    /*** Second Holder Details */
    second_holder_pan:string;
    second_holder_ckyc_no:string;
    second_holder_dob:Date;
    second_holder_tax_state:string;
    second_holder_occupassion:string;
    second_holder_mob:string;
    second_holder_email:string;
    second_holder_pan_adhare_link_state:string;
    /*** End */
    /*** Third Holder Details */
    third_holder_pan:string;
    third_holder_ckyc_no:string;
    third_holder_dob:Date;
    third_holder_tax_state:string;
    third_holder_occupassion:string;
    third_holder_mob:string;
    third_holder_email:string;
    third_holder_pan_adhare_link_state:string;
    /*** End */






}
