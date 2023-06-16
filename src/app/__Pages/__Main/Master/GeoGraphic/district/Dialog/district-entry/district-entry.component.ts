import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-district-entry',
  templateUrl: './district-entry.component.html',
  styleUrls: ['./district-entry.component.css']
})
export class DistrictEntryComponent implements OnInit {
  __isVisible:boolean = false;
  countryMst: any=[];
  stateMst: any=[];

  __districtForm = new FormGroup({
    country_id: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<DistrictEntryComponent>,
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
    this.getCountryMst();
    if(this.data.id > 0 ){
      setTimeout(() => {
      this.__districtForm.controls['country_id'].setValue(this.data.items.country_id,{emitEvent:true});
      this.__districtForm.controls['state_id'].setValue(this.data.items.state_id,{emitEvent:true});
      this.__districtForm.controls['name'].setValue(this.data.items.name,{emitEvent:true});
      }, 100);


    }
  }
  getCountryMst(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck("data")).subscribe(res=>{
       this.countryMst = res;
    })
  }
  getStateMst(country_id){
    if(country_id){
      this.__dbIntr.api_call(0,'/states','country_id='+ country_id).pipe(pluck("data")).subscribe(res=>{
        this.stateMst = res;
     })
    }
    else{
      this.stateMst.length = 0;
    }

  }
  ngAfterViewInit(){
    this.__districtForm.controls['country_id'].valueChanges.subscribe(res =>{
      console.log(res);

      this.getStateMst(res);
    })
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
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
    const district = new FormData();
    district.append('country_id',this.__districtForm.value.country_id);
    district.append('state_id',this.__districtForm.value.state_id);
    district.append('name',this.__districtForm.value.name);
    district.append('id',this.__districtForm.value.id);
    this.__dbIntr.api_call(1,'/districtAddEdit',district).subscribe((res: any) =>{
      if(res.suc == 1){
        this.dialogRef.close({data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? ('District'+ (this.data.id > 0 ? ' updated ' : ' added ') + 'successfully') : res.msg ,res.suc)
    })
  }
}
