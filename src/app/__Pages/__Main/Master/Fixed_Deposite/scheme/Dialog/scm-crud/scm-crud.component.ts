import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pluck } from 'rxjs/operators';
import { fdComp } from 'src/app/__Model/fdCmp';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-scm-crud',
  templateUrl: './scm-crud.component.html',
  styleUrls: ['./scm-crud.component.css']
})
export class ScmCrudComponent implements OnInit {
  fdcomptype: any=[];
  __cmpMst: fdComp[] = [];
  __isVisible:boolean = false;
  __compTypeForm = new FormGroup({
    scheme_name: new FormControl(this.data.id > 0 ? this.data.scheme.scheme_name : '',[Validators.required]),
    id: new FormControl(this.data.id),
    comp_type_id: new FormControl(this.data.id > 0 ? this.data.scheme.comp_type_id : '',[Validators.required]),
    comp_id: new FormControl(this.data.id > 0 ? this.data.scheme.comp_id : '',[Validators.required])
  })
  constructor(
    public dialogRef: MatDialogRef<ScmCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getcompType();
    if(this.data.id > 0){
      this.getCompanyMst(this.__compTypeForm.controls['comp_type_id'].value);
    }
  }
  getcompType(){
    this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe(res =>{
       this.fdcomptype = res;
    })
  }
  getCompanyMst(__comp_type_id){
    this.__dbIntr.api_call(0,'/fd/company','comp_type_id='+ __comp_type_id).pipe(pluck("data")).subscribe((res:fdComp[]) =>{
      this.__cmpMst = res;
   })
  }

  ngAfterViewInit(){
    this.__compTypeForm.controls['comp_type_id'].valueChanges.subscribe(res =>{
      console.log(res);

      if(res){
        this.getCompanyMst(res)
      }
      else{
        this.__cmpMst.length = 0;
      }
    })
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
    const fb = new FormData();
    fb.append('comp_type_id',global.getActualVal(this.__compTypeForm.value.comp_type_id));
    fb.append('comp_id',global.getActualVal(this.__compTypeForm.value.comp_id));
    fb.append('id',this.data.id);
    fb.append('scheme_name',global.getActualVal(this.__compTypeForm.value.scheme_name));


    this.__dbIntr.api_call(1, '/fd/schemeAddEdit', fb).subscribe((res: any) => {
      this.__utility.showSnackbar(res.suc ==1 ? 'Scheme Submitted Successfully' :  res.msg, res.suc);
      this.reset();
      this.dialogRef.close({ id: this.data.id, data: res.data })
    })
  }
  reset(){
    this.__compTypeForm.reset({emitEvent: false});
  }
}
