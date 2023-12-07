import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ERROR_MESSAGE, MAP_PLAN_OPT } from 'src/app/strings/message';

@Component({
  selector: 'app-map-plan-option',
  templateUrl: './map-plan-option.component.html',
  styleUrls: ['./map-plan-option.component.css']
})
export class MapPlanOptionComponent implements OnInit {

  isin_no_master_data:any = [];

  mapPlanOptionForm = new FormGroup({
        scheme_name:new FormControl({value:'',disabled:true},[Validators.required]),
        isin_no: new FormControl('',[Validators.required]),
        folio_no: new FormControl(this.data.transaction_dtls.folio_no),
        product_code: new FormControl(this.data.transaction_dtls.product_code),
  })

  constructor(
    public dialogRef: MatDialogRef<MapPlanOptionComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {console.log(this.data)}
  ngAfterViewInit(){
      this.getIsincorrospondingToProduct_code(this.data.transaction_dtls.product_code);
  }

  getIsincorrospondingToProduct_code = (product_code:string)  : void =>{
      this.__dbIntr.api_call(0,'/showISIN',`product_code=${product_code}`)
      .pipe(pluck('data'))
      .subscribe(res =>{
        this.mapPlanOptionForm.get('scheme_name').setValue(this.data.transaction_dtls.scheme_name);
        this.isin_no_master_data = res;
      })
  }

  submitIsin = () =>{
    const object = {
      ...this.mapPlanOptionForm.value,
      file_type:this.data.file_type,
      sub_file_type:this.data.sub_file_type,
    }
    this.__dbIntr.api_call(1,'/mailbackMismatchLock',this.__utility.convertFormData(object))
    .subscribe((res: any) =>{
      console.log(res);
      if(res.suc == 1){
          this.dialogRef.close(res);
      }
      this.__utility.showSnackbar(res.suc == 1 ? MAP_PLAN_OPT : ERROR_MESSAGE,res.suc);
    })
  }
}
