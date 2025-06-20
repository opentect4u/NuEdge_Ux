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
  /** * This function is used to handle the tab change event.
   * * It updates the tabindex with the index of the selected tab.
   * * @param {any} ev - The event containing the tab change information.
   * * @returns {void}
   */
  onTabChange(ev){
    this.tabindex = ev.index;
  }
  /** * * This function is used to set the product mapping details for the form based on the provided event data.
 * * It updates the productmappingDtlsForForm with the data from the event and calls the onTabChange function.
 * * @param {any} ev - The event containing the product mapping details.
 * * @returns {void}
 */
  setFormDT(ev){
    this.onTabChange(ev.index);
    this.productmappingDtlsForForm = ev?.data;
  }
  /**
   * * This function is used to modify the product mapping array based on the provided event data.
   * * If the event data contains an id greater than 0, it updates the existing product mapping entry in the array.
   * * If the id is not greater than 0, it adds a new product mapping entry to the array.
   * * @param {any} ev - The event containing the product mapping data to be modified.
   * * @returns {void}
   */
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
  /** * * This function is used to reset the product mapping details for the form based on the provided event data.
 * * It updates the productmappingDtlsForForm with the event data.
 * * @param {any} event - The event containing the product mapping details to be reset.
 * * @returns {void}
 */
  reset(event){
    console.log(event);

    this.productmappingDtlsForForm = event;
  }
}
