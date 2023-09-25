import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { pluck } from 'rxjs/operators';
import { scheme } from 'src/app/__Model/__schemeMst';
import { amc } from 'src/app/__Model/amc';
import { option } from 'src/app/__Model/option';
import { plan } from 'src/app/__Model/plan';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';

@Component({
  selector: 'app-manual-entr',
  templateUrl: './manual-entr.component.html',
  styleUrls: ['./manual-entr.component.css']
})
export class ManualEntrComponent implements OnInit {
  __scmDtls:scheme;
   amcMst: amc[] =[];
   planMst: plan[] =[];
   optionMst: option[] = [];
   schemeMst: scheme[] =[];
   isinForm = new FormGroup({
       amc_id:new FormControl('',[Validators.required]),
       scheme_id: new FormControl('',[Validators.required]),
       isin_dtls: new FormArray([])
   })
   __isVisible:boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ManualEntrComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAMCMst();
    console.log(this.data.isinDtls);

    this.setISINFormDetailsForCorrospondingId(this.data.isinDtls);

  }
  setISINFormDetailsForCorrospondingId(dt){

    if(dt){
      setTimeout(() => {
              this.isinForm.patchValue({
              amc_id:dt.amc_id,
              scheme_id:{id:dt.scheme_id,scheme_name:dt.scheme_name}
            })
            this.populateDTFromReport(dt);
      }, 100);
    }

  }
  getPlan(){
   this.__dbIntr.api_call(0,'/plan',null).pipe(pluck('data')).subscribe((res: plan[]) =>{
     this.planMst = res;
   })
  }
  getOption(){
    this.__dbIntr.api_call(0,'/option',null).pipe(pluck('data')).subscribe((res: option[]) =>{
      this.optionMst = res;
    })
  }
  getAMCMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck('data')).subscribe((res: amc[]) =>{
      this.amcMst = res
    })
  }
  get isin_dtls(): FormArray {
    return this.isinForm.get('isin_dtls') as FormArray;
  }
  setISIN(id,scheme_id,scheme_name,plan_id,opt_id,isin_name,product_code){
    return new FormGroup({
      row_id:new FormControl(id ? id : 0),
      scheme_id: new FormControl({value: scheme_id ? scheme_id : '',disabled:this.data.isViewMode},[Validators.required]),
      scheme_name: new FormControl({value:scheme_name ? scheme_name : '',disabled:true},[Validators.required]),
      option_id: new FormControl({value:opt_id ? opt_id : '',disabled:this.data.isViewMode},[Validators.required]),
      plan_id: new FormControl({value:plan_id ? plan_id : '',disabled:this.data.isViewMode},[Validators.required]),
      isin_no: new FormControl({value:isin_name ? isin_name : '',disabled:this.data.isViewMode}),
      product_code: new FormControl({value:product_code ? product_code : '',disabled:this.data.isViewMode},[Validators.required])
    })

  }
  ngAfterViewInit(){
     this.isinForm.controls['amc_id'].valueChanges.subscribe(res =>{
        this.getSchemeMasterAgainstAMC(res);
     })
  }

  getSchemeMasterAgainstAMC(amc_id){
    if(amc_id){
      this.__dbIntr.api_call(0,'/scheme','amc_id='+amc_id).pipe(pluck("data")).subscribe((res: scheme[]) =>{
        this.schemeMst = res;
      })
    }
    else{
      this.schemeMst.length = 0;
    }

  }

  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  populateScheme(){
    this.isin_dtls.clear();
    this.getPlan();
    this.getOption();
    this.__scmDtls = this.isinForm.controls['scheme_id'].value ? this.isinForm.controls['scheme_id'].value  : '';
    this.__dbIntr.api_call(0,'/schemeISIN','scheme_id='+this.__scmDtls.id)
    .pipe(pluck("data")).subscribe((res: any) =>{
     if(res.length > 0){
          res.forEach(el =>{
            this.isin_dtls.push(this.setISIN(
              el.id,
              el.scheme_id,
              el.scheme_name,
              el.plan_id,
              el.option_id,
              el.isin_no,
              el?.product_code
              ))
          })
     }
     else{
      this.isin_dtls.push(this.setISIN(
       0,
       this.__scmDtls?.id,
       this.__scmDtls?.scheme_name,
       '',
       '',
       '',
       ''
       ))
     }
    })
  }
  addControls(){
    this.isin_dtls.push(this.setISIN(
      0,
      this.__scmDtls?.id,
      this.__scmDtls?.scheme_name,
      '',
      '',
      '',
      ''
      ))
  }
  populateDTFromReport(el){
    this.isin_dtls.clear();
    this.getPlan();
    this.getOption();
    this.__scmDtls = this.isinForm.controls['scheme_id'].value ? this.isinForm.controls['scheme_id'].value  : '';
    this.isin_dtls.push(this.setISIN(
      el.id,
      el.scheme_id,
      el.scheme_name,
      el.plan_id,
      el.option_id,
      el.isin_no,
      el.product_code
      ));
      console.log(this.isin_dtls);

  }
  submitISIN(){
    const fd = new FormData();
    fd.append('isin_dtls',JSON.stringify(this.isin_dtls.value))
    this.__dbIntr.api_call(1,'/schemeISINAddEdit',fd).subscribe((res: any) =>{
        this.dialogRef.close({data:res.data});
        this.__utility.showSnackbar(res.suc == 1 ? 'ISIN saved successfully' : res.msg ,res.suc);
    })
  }
  removeAt(index,row_id,isin_no){
    if(Number(row_id) > 0){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'I',
        id: row_id,
        title: 'Delete '  + (isin_no ? isin_no : ''),
        api_name:'/schemeISINDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
                this.RemoveControls(index);
          }
        }

      })
    }
    else{
      this.RemoveControls(index);
    }
  }

  RemoveControls(index){
    this.isin_dtls.removeAt(index);
  }
  compareWith(existing, toCheckAgainst) {
    if (!toCheckAgainst) {
      return false;
    }
    return existing.id === toCheckAgainst.id;
  }
}
