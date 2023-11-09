import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-pincode-entry',
  templateUrl: './pincode-entry.component.html',
  styleUrls: ['./pincode-entry.component.css']
})
export class PincodeEntryComponent implements OnInit {
  __isVisible:boolean = false;
  countryMst: any=[];
  stateMst: any=[];
  districtMst: any=[];
  cityMst: any=[];
  cityTypeMst: any=[];
  __pincodeForm = new FormGroup({
    country_id: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
    district_id: new FormControl('', [Validators.required]),
    city_id:new FormControl('', [Validators.required]),
    // city_type_id: new FormControl('', [Validators.required]),
    pincode: new FormControl(this.data.id > 0 ? this.data.items.pincode : '', [Validators.required,Validators.minLength(6),Validators.maxLength(6)]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<PincodeEntryComponent>,
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
    this.getCityTypeMst();
    console.log(this.data.items);

    if(this.data.id > 0){
      setTimeout(() => {
        this.__pincodeForm.controls['country_id'].setValue(this.data.items.country_id,{emitEvent:true});
        this.__pincodeForm.controls['state_id'].setValue(this.data.items.state_id,{emitEvent:true});
        this.__pincodeForm.controls['district_id'].setValue(this.data.items.district_id,{emitEvent:true});
        this.__pincodeForm.controls['city_id'].setValue(this.data.items.city_id,{emitEvent:true});
        // this.__pincodeForm.controls['city_type_id'].setValue(this.data.items.city_type_id,{emitEvent:true});
      }, 200);
    }

  }
  getCityTypeMst(){
    this.__dbIntr.api_call(0,'/cityType',null).pipe(pluck("data")).subscribe(res =>{
      this.cityTypeMst = res;
    })
  }
  ngAfterViewInit(){
    this.__pincodeForm.controls['country_id'].valueChanges.subscribe(res =>{
      this.getStateMst(res);
      this.getDistrictMst(res,this.__pincodeForm.value.state_id);
    })
    this.__pincodeForm.controls['state_id'].valueChanges.subscribe(res =>{
      this.getDistrictMst(this.__pincodeForm.value.country_id,res);
      this.getCityMst(this.__pincodeForm.value.country_id,res,this.__pincodeForm.value.district_id);
    })

    this.__pincodeForm.controls['district_id'].valueChanges.subscribe(res =>{
      this.getCityMst(this.__pincodeForm.value.country_id,this.__pincodeForm.value.state_id,res);
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
      this.__pincodeForm.controls['state_id'].reset('',{emitEvent:true});
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
      this.__pincodeForm.controls['district_id'].reset('',{emitEvent:true});
    }
  }
  getCityMst(country_id,state_id,district_id){
    if(country_id && state_id && district_id){
      this.__dbIntr.api_call(0,'/city','country_id='+ country_id +'&state_id='+ state_id + '&district_id='+district_id).pipe(pluck("data")).subscribe(res=>{
        this.cityMst = res;
     })
    }
    else{
      this.cityMst.length = 0;
      this.__pincodeForm.controls['city_id'].reset('');
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
    const pincode = new FormData();
    pincode.append('country_id',this.__pincodeForm.value.country_id);
    pincode.append('state_id',this.__pincodeForm.value.state_id);
    pincode.append('district_id',this.__pincodeForm.value.district_id);
    pincode.append('city_id',this.__pincodeForm.value.city_id);
    pincode.append('pincode',this.__pincodeForm.value.pincode);
    // pincode.append('city_type_id',this.__pincodeForm.value.city_type_id)
    pincode.append('id',this.__pincodeForm.value.id);
    this.__dbIntr.api_call(1,'/pincodeAddEdit',pincode).subscribe((res: any) =>{
      if(res.suc == 1){
        this.dialogRef.close({data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? ('Pincode'+ (this.data.id > 0 ? ' updated ' : ' added ') + 'successfully') : res.msg ,res.suc)
    })
  }

}
