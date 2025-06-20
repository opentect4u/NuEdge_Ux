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

  /**
   * @description This function is used to close the dialog
   * It updates the size of the dialog to 30% width and 47px height
   */
  unlockTransactions =() =>{
    this.toggleLoader();
    this.dbInr.api_call(1,this.data.api_name,
    this.utility.convertFormData({id:this.data.id,filte_type:this.data.file_type}),true)
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
  /**
   * @description This function toggles the loader state
   * It switches the value of __is_loader between true and false
   * This is used to show or hide a loading indicator in the UI
   */
  toggleLoader = () =>{
    this.__is_loader = !this.__is_loader;
  }

}
