import { Component,Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-mapping',
  templateUrl: './product-mapping.component.html',
  styleUrls: ['./product-mapping.component.css']
})
export class ProductMappingComponent implements OnInit {
  tabindex: number =0;
  public productmappingDtlsForForm;
  @Input() subTab=[];
  @Input() cmpDtlsMst : any = [];
  @Input() productMstDtls: any=[];

  ngOnInit(): void {}
  onTabChange(ev){
    this.tabindex = ev.index;
  }
  setFormDT(ev){
    this.onTabChange(ev.index);
    this.productmappingDtlsForForm = ev?.data;
  }
  modifyProductMappingArray(ev){
    if(ev.id > 0){
      this.productMstDtls = this.productMstDtls.filter((value,key) =>{
        if(value.id == Number(ev.id)){
          value.cm_profile_id = ev.data.cm_profile_id,
          value.cm_profile_name = ev.data.cm_profile_name,
          value.product_name = ev.data.product_name,
          value.establishment_name = ev.data.establishment_name,
          value.type_of_comp = ev.data.type_of_comp
        }
        return true;
      })
    }
    else{
      this.productMstDtls.push(ev.data);
    }
  }
  reset(event){
    console.log(event);

    this.productmappingDtlsForForm = event;
  }
}
