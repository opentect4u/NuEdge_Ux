import { DatePipe } from '@angular/common';
import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'reports-cmnDialog',
  templateUrl: './cmnDialog.component.html',
  styleUrls: ['./cmnDialog.component.css']
})
export class CmnDialogComponent implements OnInit {

  __searchReports = new FormGroup({
    searcDate: new FormControl(this.datePipe.transform(new Date(),'yyyy-MM-dd'),[Validators.required])
  })

  constructor(
    public dialogRef: MatDialogRef<CmnDialogComponent>,
    private datePipe: DatePipe,
    private __dbIntr: DbIntrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }
  searchReports(){
     console.log(this.__searchReports.value);
     this.__dbIntr.api_call(0,this.data.api_name,'date='+this.__searchReports.value.searcDate).subscribe((res: responseDT) =>{
       console.log(res);
       
      if(res.suc == 1){
        this.dialogRef.close({date:this.__searchReports.value.searcDate,data:res.data});
      }
     })
  }
}
