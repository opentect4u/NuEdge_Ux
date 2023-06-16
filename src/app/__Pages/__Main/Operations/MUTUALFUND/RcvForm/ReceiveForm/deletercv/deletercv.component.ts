import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-deletercv',
  templateUrl: './deletercv.component.html',
  styleUrls: ['./deletercv.component.css']
})
export class DeletercvComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeletercvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    private util: UtiliService
  ) { }

  ngOnInit() {
  }
  delete(){
    const __temp_tin_no = new FormData();
    __temp_tin_no.append('temp_tin_no',this.data.temp_tin_no)
    this.__dbIntr.api_call(1,'/formreceivedDelete',__temp_tin_no).subscribe((res: any) =>{
        if(res.suc == 1){
          this.dialogRef.close({temp_tin_no:this.data.temp_tin_no});
        
        }
        this.util.showSnackbar(res.suc == 1 ? 'Deleted Successfully' : 'Something went wrong ! PLease try again later',res.suc);
    })
  }
}
