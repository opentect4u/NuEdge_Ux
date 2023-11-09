import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-city-entry',
  templateUrl: './city-entry.component.html',
  styleUrls: ['./city-entry.component.css']
})
export class CityEntryComponent implements OnInit {
  __isVisible:boolean = false;
  countryMst: any=[];
  stateMst: any=[];
  districtMst: any=[];
  __cityForm = new FormGroup({
    country_id: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
    district_id: new FormControl('', [Validators.required]),
    name: new FormControl(this.data.id > 0 ? this.data.items.name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<CityEntryComponent>,
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
    if(this.data.id > 0){
      setTimeout(() => {
      this.__cityForm.controls['country_id'].setValue(this.data.items.country_id,{emitEvent:true});
      this.__cityForm.controls['state_id'].setValue(this.data.items.state_id,{emitEvent:true});
      this.__cityForm.controls['district_id'].setValue(this.data.items.district_id,{emitEvent:true});

    }, 100);
    }

  }
  ngAfterViewInit(){

    this.__cityForm.controls['country_id'].valueChanges.subscribe(res =>{
      this.getStateMst(res);
      this.getDistrictMst(res,this.__cityForm.value.state_id);

    })
    this.__cityForm.controls['state_id'].valueChanges.subscribe(res =>{
      this.getDistrictMst(this.__cityForm.value.country_id,res);
    })
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
      this.stateMst.length  = 0;
      this.__cityForm.controls['state_id'].reset('',{emitEvent:true});
    }

  }
  getDistrictMst(country_id,state_id){
    if(country_id && state_id){
      this.__dbIntr.api_call(0,'/districts','country_id='+ country_id +'&state_id='+ state_id).pipe(pluck("data")).subscribe(res=>{
        this.districtMst = res;
     })
    }
    else{
      this.districtMst.length = 0;
      this.__cityForm.controls['district_id'].reset('');
    }

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
    const city = new FormData();
    city.append('country_id',this.__cityForm.value.country_id);
    city.append('state_id',this.__cityForm.value.state_id);
    city.append('district_id',this.__cityForm.value.district_id);
    city.append('name',this.__cityForm.value.name);
    city.append('id',this.__cityForm.value.id);
    this.__dbIntr.api_call(1,'/cityAddEdit',city).subscribe((res: any) =>{
      if(res.suc == 1){
        this.dialogRef.close({data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? ('City'+ (this.data.id > 0 ? ' updated ' : ' added ') + 'successfully') : res.msg ,res.suc)
    })
  }

}
