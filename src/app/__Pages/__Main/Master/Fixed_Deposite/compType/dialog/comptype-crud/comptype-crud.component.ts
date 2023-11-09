import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-comptype-crud',
  templateUrl: './comptype-crud.component.html',
  styleUrls: ['./comptype-crud.component.css']
})
export class ComptypeCrudComponent implements OnInit {
  __cmpTypeForm = new FormGroup({
    comp_type: new FormControl(this.data.id > 0 ? this.data.items.comp_type : '',[Validators.required])
  })
  __isVisible:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ComptypeCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.data);

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
  submitComapnyType(){
    const __fd = new FormData();
    __fd.append('comp_type',this.__cmpTypeForm.value.comp_type);
    __fd.append('id',this.data.id);

    this.__dbIntr.api_call(1,'/fd/companyTypeAddEdit',__fd).subscribe((res: any) =>{
         this.__utility.showSnackbar(res.suc == 1 ? ('Company type '+ (this.data.id > 0 ?  'updated' : 'added') + ' successfully'): res.msg,res.suc);
         if(res.suc == 1){
          this.dialogRef.close({id:this.data.id,data:res.data});
         }
    })
  }
}
