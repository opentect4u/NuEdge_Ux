import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
selector: 'deleteRnt-component',
templateUrl: './deleteRnt.component.html',
styleUrls: ['./deleteRnt.component.css']
})
export class DeleterntComponent implements OnInit {

constructor(
  public dialogRef: MatDialogRef<DeleterntComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private __dbIntr: DbIntrService,
  private util: UtiliService
) {
}

ngOnInit(){

}
delete(){
  const __fb = new FormData();
  __fb.append('id',this.data.id);
  this.__dbIntr.api_call(1,'/rntDelete',__fb).subscribe((res: any) =>{
      this.dialogRef.close({suc: res.suc,id:this.data.id});
      this.util.showSnackbar(res.suc == 1 ? 'Deletion Successfull' : res.msg,res.suc);
  })
}
}
