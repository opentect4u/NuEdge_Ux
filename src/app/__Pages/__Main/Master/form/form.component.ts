import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormModificationComponent } from './formModification/formModification.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  __selectFormType: any=[]
  constructor(private __dialog: MatDialog) { }

  ngOnInit() {}
  getSearchItem(__ev){
    this.__selectFormType.length =0;
     if(__ev.flag == 'A'){
           this.openDialog(__ev.id,'');
     }
     else{
      this.__selectFormType.push(__ev.item);
     }
  }
  populateDT(__items){
    this.openDialog(__items.id,__items);
  }
  openDialog(id,__items){
    const disalogConfig=new MatDialogConfig();
      disalogConfig.width='30%';
      disalogConfig.data= {
        id:id,
        title: id == 0 ? 'Add Form Type' : 'Update Form Type',
        items:__items
      };
      const dialogref=this.__dialog.open(FormModificationComponent,disalogConfig);
      dialogref.afterClosed().subscribe(dt=>{
         if(dt?.id > 0){
                this.__selectFormType[this.__selectFormType.findIndex(x => x.id == dt.id)].form_name = dt?.form_name;
                this.__selectFormType[this.__selectFormType.findIndex(x => x.id == dt.id)].product_id = dt?.product_id;

         }
      });
  }

}
