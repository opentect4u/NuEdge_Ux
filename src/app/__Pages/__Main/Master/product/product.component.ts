import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductModificationComponent } from './ProductModification/ProductModification.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  __selectProduct: any=[]
  constructor(private __dialog: MatDialog) { }

  ngOnInit() {}
  getSearchItem(__ev){
    this.__selectProduct.length =0;
     if(__ev.flag == 'A'){
           this.openDialog(__ev.id,'');
     }
     else{
      this.__selectProduct.push(__ev.item);
     }
  }
  populateDT(__items){
    this.openDialog(__items.id,__items.product_name);
  }
  openDialog(id,product_name){
    const disalogConfig=new MatDialogConfig();
      disalogConfig.width='30%';
      disalogConfig.data= {
        id:id,
        title: id == 0 ? 'Add Product' : 'Update Product',
        product_name:product_name
      };
      const dialogref=this.__dialog.open(ProductModificationComponent,disalogConfig);
      dialogref.afterClosed().subscribe(dt=>{
         if(dt?.id > 0){
                this.__selectProduct[this.__selectProduct.findIndex(x => x.id == dt.id)].product_name = dt.product_name;
         }
      });
  }
}
