import { Component,EventEmitter,Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'product-mapping-entry',
  templateUrl: './product-mapping-entry.component.html',
  styleUrls: ['./product-mapping-entry.component.css']
})
export class ProductMappingEntryComponent implements OnInit {
  @Input() cmpDtlsMst : any = [];
  @Output() modifyProductMappingArray = new EventEmitter();
  @Output() resetFrmDt = new EventEmitter();

  @Input() set setProductMapping(value){
      if(value){
        this.setFormData(value);
      }
      else{
        this.reset();
      }
  }
  product_mapping = new FormGroup({
    id: new FormControl(0),
    cm_profile_id: new FormControl('',[Validators.required]),
    product_name: new FormControl('',[Validators.required])
  });

  constructor(private dbIntr: DbIntrService,private utility: UtiliService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){}
  /**
   * * This function is used to reset the product mapping form.
   * * It clears the form values and emits a reset event.
   * * @returns void
   */
  reset(){
    this.product_mapping.patchValue({
      cm_profile_id:'',
      product_name:'',
      id:0
    });
    this.resetFrmDt.emit('')
  }
  /** * * This function is used to set the form data for product mapping.
   * * It populates the form with the provided response data or sets default values if no data is provided.
   * * @param {any} res - The response data to populate the form with.
   * * @returns void
   */
  setFormData(res){
    this.product_mapping.patchValue({
      id:res ? res.id : 0,
      cm_profile_id:res ? res.cm_profile_id : '',
      product_name:res ? res.product_name : '',
    })
  }
  /** * * This function is used to submit the product mapping form.
   * * It creates a FormData object with the form values and sends it to the API for saving.
   * * If the API call is successful, it shows a success message and emits an event with the modified product mapping data.
   * * @returns void
   */
  submitProduct(){
    const product  = new FormData();
    product.append('cm_profile_id',this.product_mapping.value.cm_profile_id);
    product.append('product_name',this.product_mapping.value.product_name);
    product.append('id',this.product_mapping.value.id ? this.product_mapping.value.id : 0);
   this.dbIntr.api_call(1,'/comp/productAddEdit',product).subscribe((res: any) =>{
       this.utility.showSnackbar(res.suc == 1 ? 'Product saved successfully' : res.msg,res.suc);
      //  this.getProduct(res.data,this.product_mapping.value.id);
      this.modifyProductMappingArray.emit({id:this.product_mapping.value.id,data:res.data})
       this.reset();
   })
  }
}
