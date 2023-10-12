import { Component, OnInit ,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'unlock-trxn',
  templateUrl: './unlock-trxn.component.html',
  styleUrls: ['./unlock-trxn.component.css'],

})
export class UnlockTrxnComponent implements OnInit {

  __is_loader:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UnlockTrxnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbInr:DbIntrService,
    private utility:UtiliService
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  unlockTransactions =() =>{
    this.toggleLoader();
    this.dbInr.api_call(1,'/unlockTransDetails',this.utility.convertFormData({id:this.data.id}),true)
    .subscribe((res: any) =>{
      this.toggleLoader();
      this.dialogRef.close(res.suc);
      this.utility.showSnackbar(res.suc == 1 ? 'Transaction Unlocked successfully' : res.msg,res.suc);
    },
    err =>{
      this.toggleLoader();
    }
    )
  }
  toggleLoader = () =>{
    this.__is_loader = !this.__is_loader;
  }

}
