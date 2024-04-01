import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
selector: 'deleteMst-component',
templateUrl: './deleteMst.component.html',
styleUrls: ['./deleteMst.component.css']
})
export class DeletemstComponent implements OnInit {

constructor(
  public dialogRef: MatDialogRef<DeletemstComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr: DbIntrService,
  private util: UtiliService
) {
}

ngOnInit(){

}
delete(){
    const __fb = new FormData();
    if(this.data.flag === 'F'){
      /********* For Delete Family only */
      __fb.append('client_id',this.data.id);
      /********** End */
    }
    else if(this.data.flag === 'N'){
      __fb.append('id',this.data.id);
      __fb.append('isin_no',this.data.isin_no);
      __fb.append('product_code',this.data.product_code);
      __fb.append('rnt_id',this.data.rnt_id);
    }
    else{
      __fb.append('id',this.data.id);

    }
    this.__dbIntr.api_call(1,this.data.api_name,__fb).subscribe((res: any) =>{
        this.dialogRef.close({suc: res.suc,id:this.data.id});
        this.util.showSnackbar(res.suc == 1 ? 'Deletion Successfull' : res.msg,res.suc);
    })
}
}
