import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck, skip } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-state-entry',
  templateUrl: './state-entry.component.html',
  styleUrls: ['./state-entry.component.css']
})
export class StateEntryComponent implements OnInit {
  __isVisible:boolean = false;
  countryMst: any=[];
  __stateForm = new FormGroup({
    country_id: new FormControl(this.data.id > 0 ? this.data.items.country_id : '', [Validators.required]),
    name: new FormControl(this.data.id > 0 ? this.data.items.name : '', [Validators.required]),
    id: new FormControl(this.data.id)
  })
  constructor(
    public dialogRef: MatDialogRef<StateEntryComponent>,
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
  }
  getCountryMst(){
    this.__dbIntr.api_call(0,'/country',null).pipe(pluck("data")).subscribe(res=>{
       this.countryMst = res;
    } )
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
    const state = new FormData();
    state.append('country_id',this.__stateForm.value.country_id);
    state.append('name',this.__stateForm.value.name);
    state.append('id',this.__stateForm.value.id);
    this.__dbIntr.api_call(1,'/stateAddEdit',state).subscribe((res: any) =>{
      if(res.suc == 1){
        this.dialogRef.close({data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? ('State'+ (this.data.id > 0 ? ' updated ' : ' added ') + 'successfully') : res.msg ,res.suc)
    })
  }
}
