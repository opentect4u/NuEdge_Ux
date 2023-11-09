import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-city-type-entry',
  templateUrl: './city-type-entry.component.html',
  styleUrls: ['./city-type-entry.component.css']
})
export class CityTypeEntryComponent implements OnInit {
  __isVisible:boolean = false;
  cityMst: any=[];
  __cityTypeForm = new FormGroup({
    name: new FormControl(this.data.id > 0 ? this.data.items.name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<CityTypeEntryComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }

  ngOnInit(): void {
  }
  minimize(){
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("40%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  submit(){
    const cityType = new FormData();
        cityType.append('name',this.__cityTypeForm.value.name);
        cityType.append('id',this.__cityTypeForm.value.id);
    this.__dbIntr.api_call(1,'/cityTypeAddEdit',cityType).subscribe((res: any) =>{
      if(res.suc == 1){
        this.dialogRef.close({data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? ('City Type'+ (this.data.id > 0 ? ' updated ' : ' added ') + 'successfully') : res.msg ,res.suc)
    })
  }
}
