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
  reset(){
    this.product_mapping.patchValue({
      cm_profile_id:'',
      product_name:'',
      id:0
    });
    this.resetFrmDt.emit('')
  }
  setFormData(res){
    this.product_mapping.patchValue({
      id:res ? res.id : 0,
      cm_profile_id:res ? res.cm_profile_id : '',
      product_name:res ? res.product_name : '',
    })
  }
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
