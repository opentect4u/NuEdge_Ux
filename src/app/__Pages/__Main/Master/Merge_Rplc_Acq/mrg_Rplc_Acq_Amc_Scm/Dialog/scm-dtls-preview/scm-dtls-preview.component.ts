import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MultiSelectComponent } from 'ng-multiselect-dropdown';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-scm-dtls-preview',
  templateUrl: './scm-dtls-preview.component.html',
  styleUrls: ['./scm-dtls-preview.component.css']
})
export class ScmDtlsPreviewComponent implements OnInit {


  @ViewChildren('dates_inp') dates_inp:QueryList<MultiSelectComponent>;

  __isVisible:boolean = false;
  scheme_form = new FormGroup({
   amc_name:new FormControl({value:this.data.items.amc_short_name,disabled:true}),
   benchmark: new FormControl({value:global.getActualVal(this.data.items.benchmark),disabled:true}),
   step_up_min_per: new FormControl({value:global.getActualVal(this.data.items.step_up_min_per),disabled:true}),
   step_up_min_amt: new FormControl({value:global.getActualVal(this.data.items.step_up_min_amt),disabled:true}),
   category_name: new FormControl({value:global.getActualVal(this.data.items.cat_name),disabled:true}),
   subcategory_name: new FormControl({value:global.getActualVal(this.data.items.subcate_name),disabled:true}),
   scheme_name: new FormControl({value:global.getActualVal(this.data.items.scheme_name),disabled:true}),
   pip_add_min_amt: new FormControl({value:global.getActualVal(this.data.items.pip_add_min_amt),disabled:true}),
   pip_fresh_min_amt: new FormControl({value:global.getActualVal(this.data.items.pip_fresh_min_amt),disabled:true}),
   sip_date:new FormControl({value:global.getActualVal(JSON.parse(this.data.items.sip_date)),disabled:true}),
   swp_date:new FormControl({value:global.getActualVal(JSON.parse(this.data.items.swp_date)),disabled:true}),
   stp_date:new FormControl({value:global.getActualVal(JSON.parse(this.data.items.stp_date)),disabled:true}),
   ava_special_sip:new FormControl({value:global.getActualVal(global.getType(this.data.items.ava_special_sip)),disabled:true}),
   ava_special_swp:new FormControl({value:global.getActualVal(global.getType(this.data.items.ava_special_swp)),disabled:true}),
   ava_special_stp:new FormControl({value:global.getActualVal(global.getType(this.data.items.ava_special_stp)),disabled:true}),
   special_sip_name:new FormControl({value:global.getActualVal(this.data.items.special_sip_name),disabled:true}),
   special_swp_name:new FormControl({value:global.getActualVal(this.data.items.special_swp_name),disabled:true}),
   special_stp_name:new FormControl({value:global.getActualVal(this.data.items.special_stp_name),disabled:true}),
   sip_freq_wise_amt:new FormArray([]),
   stp_freq_wise_amt:new FormArray([]),
   swp_freq_wise_amt:new FormArray([]),
  });

  constructor(
    public dialogRef: MatDialogRef<ScmDtlsPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public __dialog: MatDialog,
    private utility:UtiliService) { }

  ngOnInit(): void {


    JSON.parse(this.data.items.sip_freq_wise_amt).forEach(el =>{
      this.sip_freq_wise_amt.push(this.createFrequency(el));
    })

    JSON.parse(this.data.items.swp_freq_wise_amt).forEach(el =>{
      this.swp_freq_wise_amt.push(this.createFrequency(el));
    })

    JSON.parse(this.data.items.stp_freq_wise_amt).forEach(el =>{
      this.stp_freq_wise_amt.push(this.createFrequency(el));
    })

  }
  ngAfterViewInit(){
   setTimeout(() => {
    this.dates_inp.forEach(el => {
      el.disabled = true;
    })
   }, 100);

  }


  get sip_freq_wise_amt(): FormArray {
    return this.scheme_form.get('sip_freq_wise_amt') as FormArray;
  }

  get swp_freq_wise_amt(): FormArray {
    return this.scheme_form.get('swp_freq_wise_amt') as FormArray;
  }
  get stp_freq_wise_amt(): FormArray {
    return this.scheme_form.get('stp_freq_wise_amt') as FormArray;
  }

 createFrequency = (freq_dtls) =>{
    return new FormGroup({
      freq_name: new FormControl(freq_dtls.freq_name),
      is_checked: new FormControl({value: global.getType(freq_dtls.is_checked),disabled:true}),
      sip_fresh_min_amt: new FormControl({value:global.getType(freq_dtls.is_checked) ? freq_dtls?.sip_fresh_min_amt : '',disabled:true}),
      sip_add_min_amt: new FormControl({value:global.getType(freq_dtls.is_checked) ? freq_dtls.sip_add_min_amt : '',disabled:true}),
    })
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
}
