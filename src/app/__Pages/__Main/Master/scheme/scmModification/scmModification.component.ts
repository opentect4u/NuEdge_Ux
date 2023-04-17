import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, skip } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { product } from 'src/app/__Model/__productMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { storage } from '../../../../../__Utility/storage';
import dateslist from '../../../../../../assets/json/dates.json';
import __sipFrequency from '../../../../../../assets/json/SipFrequency.json';
@Component({
  selector: 'app-scmModification',
  templateUrl: './scmModification.component.html',
  styleUrls: ['./scmModification.component.css']
})
export class ScmModificationComponent implements OnInit {

  __getPrevScmDT = storage.get_scmDtls ? storage.get_scmDtls : '';
  __dates = dateslist;
  __isVisible:boolean = false;
  __amcMaster: amc[];
  __catMaster: category[];
  __subcatMaster: subcat[];
  __ProductMaster:product[] = [];

  settings = {
    singleSelection: false,
    idField: 'id',
    textField: 'date',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 31,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No recors found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
  };

  __scmForm = new FormGroup({
      category_id: new FormControl('', [Validators.required]),
    subcategory_id: new FormControl(this.data.id > 0
      ?
      this.data.items.subcategory_id
      : '', [Validators.required]),
    product_id: new FormControl(this.data.product_id),
    amc_id: new FormControl(this.data.id > 0 ? this.data.items.amc_id : '', [Validators.required]),
    scheme_name: new FormControl(this.data.id > 0 ? this.data.items.scheme_name : '', [Validators.required]),
    scheme_type: new FormControl(this.data.scheme_type),
    sip_date:
    new FormControl(this.data.id > 0 ? JSON.parse(this.data.items.sip_date)
    : global.getActualVal(this.__getPrevScmDT) ? JSON.parse(this.__getPrevScmDT.sip_date) : '',[Validators.required]),
    id: new FormControl(this.data.id),
    nfo_entry_date: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.nfo_entry_dt) : (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.nfo_entry_dt : ''),this.data.scheme_type == 'N' ? [Validators.required] : []),
    nfo_start_dt: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.nfo_start_dt ): (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.nfo_start_dt : ''),this.data.scheme_type == 'N' ? [Validators.required] : []),
    nfo_end_dt: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.nfo_end_dt) : (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.nfo_end_dt : ''),this.data.scheme_type == 'N' ? [Validators.required] : []),
    nfo_reopen_dt: new FormControl(this.data.id > 0 ? global.getActualVal(this.data.items.nfo_reopen_dt) :  (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.nfo_reopen_dt : ''),this.data.scheme_type == 'N' ? [Validators.required] : []),
    pip_fresh_min_amt: new FormControl(this.data.id > 0 ?
      this.data.items.pip_fresh_min_amt : (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.pip_fresh_min_amt : ''),
      [Validators.required,Validators.pattern("^[0-9]*$")]),
    // sip_fresh_min_amt: new FormControl(this.data.id > 0 ? this.data.items.sip_fresh_min_amt : '',[Validators.required,Validators.pattern("^[0-9]*$")]),
    pip_add_min_amt: new FormControl(this.data.id > 0 ?
      this.data.items.pip_add_min_amt :  (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.pip_add_min_amt : ''),
      [Validators.required,Validators.pattern("^[0-9]*$")]),
    // sip_add_min_amt: new FormControl(this.data.id > 0 ? this.data.items.sip_add_min_amt : '',[Validators.required,Validators.pattern("^[0-9]*$")]),
    gstin_no:new FormControl(this.data.id > 0 ? this.data.items.gstin_no : ''),
    frequency: new FormArray([]),
    is_selectall: new FormControl(false),
    swp_date: new FormControl(this.data.id > 0 ?
      JSON.parse(this.data.items.swp_date)
      : global.getActualVal(this.__getPrevScmDT) ? JSON.parse(this.__getPrevScmDT.swp_date) : '',[Validators.required]),
    swp_frequency: new FormArray([]),
    is_selectall_for_swp: new FormControl(false),
    stp_date: new FormControl(this.data.id > 0 ?
      JSON.parse(this.data.items.stp_date)
      :  global.getActualVal(this.__getPrevScmDT) ? JSON.parse(this.__getPrevScmDT.stp_date) : '',[Validators.required]),
    stp_frequency: new FormArray([]),
    is_selectall_for_stp: new FormControl(false),
    ava_special_sip: new FormControl(
      this.data.id > 0 ?
      (this.data.items.ava_special_sip == "true" ? true : false)
      : (
        (global.getActualVal(this.__getPrevScmDT) ?
        ((this.__getPrevScmDT.ava_special_sip == "true")
        ? true : false) : false))

      ),
    special_sip_name: new FormControl(this.data.id > 0 ? this.data.items.special_sip_name : (global.getActualVal(this.__getPrevScmDT) ? this.__getPrevScmDT.special_sip_name : ''))

  })
  constructor(
    public dialogRef: MatDialogRef<ScmModificationComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog) {
      this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
        if(this.data.id == res.id && this.data.flag == res.flag){
          this.__isVisible = res.isVisible
        }
      })
    }

  ngOnInit() {
    console.log(this.data);
    console.log(this.__getPrevScmDT);

    this.getProductMaster();
    this.setFrequencyAmt(this.data.id > 0 ?
      JSON.parse(this.data.items.sip_freq_wise_amt)
      : global.getActualVal(this.__getPrevScmDT) ? JSON.parse(this.__getPrevScmDT.sip_freq_wise_amt) : __sipFrequency);
    this.setSwpfrequencyAmt(this.data.id > 0 ? JSON.parse(this.data.items.swp_freq_wise_amt)
    : global.getActualVal(this.__getPrevScmDT) ? JSON.parse(this.__getPrevScmDT.swp_freq_wise_amt) : __sipFrequency);
    this.setStpFrequency(this.data.id > 0 ? JSON.parse(this.data.items.stp_freq_wise_amt)
    :  global.getActualVal(this.__getPrevScmDT) ? JSON.parse(this.__getPrevScmDT.stp_freq_wise_amt) : __sipFrequency);
    if(this.data.id > 0){
      this.getamcMasterbyproductId(this.data.items.product_id);
        this.getcatMasterbyproductId(this.data.items.product_id);
        this.getsubcatMasterbyproductId(this.data.items.category_id);
        this.__scmForm.controls['category_id'].setValue(this.data.items.category_id,{emitEvent:false,onlySelf:true});
    }
    else{
      this.getamcMasterbyproductId(this.data.product_id);
      this.getcatMasterbyproductId(this.data.product_id);
    }

  }
  setFrequencyAmt(freq_dtls){
    console.log(freq_dtls);
   freq_dtls.forEach(freqDtls =>{
    console.log(freqDtls);
      this.addFrequency(freqDtls);
    })
  }
  setSwpfrequencyAmt(freq_dtls){
    console.log(freq_dtls);

    freq_dtls.forEach(freqDtls =>{
      this.addSwpFrequency(freqDtls);
    })
  }
  setStpFrequency(freq_dtls){
    freq_dtls.forEach(freqDtls =>{
      this.addStpFrequency(freqDtls);
    })
  }
  ngAfterViewInit(){
    this.__scmForm.controls['is_selectall_for_stp'].valueChanges.subscribe(res =>{
      this.stp_frequency.controls.map((value,index) =>{
        value.get('is_checked').patchValue(res,{ emitEvent: false })
        this.setStpFormControldependOnCheckbox(index,res);
      })
   })
   this.__scmForm.get('stp_frequency').valueChanges.subscribe((val) => {
    //For checking or Unchecking the select All checkbox base on select check box inside the table body
      const allSelected = val.every(bool => bool.is_checked);
      if (this.__scmForm.get('is_selectall_for_stp').value !== allSelected) {
        this.__scmForm.get('is_selectall_for_stp').patchValue(allSelected, { emitEvent: false });
      }
  })

   this.__scmForm.controls['is_selectall'].valueChanges.subscribe(res =>{
           this.frequency.controls.map((value,index) =>{
             value.get('is_checked').patchValue(res,{ emitEvent: false })
             this.setFormControldependOnCheckbox(index,res);
           })
   })

   this.__scmForm.get('frequency').valueChanges.subscribe((val) => {
     //For checking or Unchecking the select All checkbox base on select check box inside the table body
    const allSelected = val.every(bool => bool.is_checked);
    if (this.__scmForm.get('is_selectall').value !== allSelected) {
      this.__scmForm.get('is_selectall').patchValue(allSelected, { emitEvent: false });
    }
   })

   this.__scmForm.controls['is_selectall_for_swp'].valueChanges.subscribe(res =>{
    console.log(res);

    this.swp_frequency.controls.map((value,index) =>{
      value.get('is_checked').patchValue(res,{ emitEvent: false })
      this.setSwpFormControldependOnCheckbox(index,res);
    })
   })

   this.__scmForm.get('swp_frequency').valueChanges.subscribe((val) => {
    //For checking or Unchecking the select All checkbox base on select check box inside the table body
   const allSelected = val.every(bool => bool.is_checked);
   if (this.__scmForm.get('is_selectall_for_swp').value !== allSelected) {
     this.__scmForm.get('is_selectall_for_swp').patchValue(allSelected, { emitEvent: false });
   }
  })


      /*--------------Trigger when Category changes---------------*/
      this.__scmForm.controls["category_id"].valueChanges.subscribe(res => {
        console.log(res);
        this.getsubcatMasterbyproductId(res);
      })
      /*--------------End---------------*/

      // Available Special SIP
      this.__scmForm.controls['ava_special_sip'].valueChanges.subscribe(res =>{
         this.__scmForm.controls['special_sip_name'].setValidators(res ? [Validators.required] : null);
         this.__scmForm.controls['special_sip_name'].updateValueAndValidity({emitEvent: false});
         if(!res){
          this.__scmForm.controls['special_sip_name'].setValue('');
         }
      })
  }
  private getamcMasterbyproductId(product_id) {
    this.__dbIntr.api_call(0, '/amcUsingPro', 'product_id=' + product_id).pipe(map((x: responseDT) => x.data)).subscribe((res: amc[]) => {
      this.__amcMaster = res;
    })
  }
  private getcatMasterbyproductId(product_id) {
    this.__dbIntr.api_call(0, '/catUsingPro', 'product_id=' + product_id).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
       console.log(res);

      this.__catMaster = res;
    })
  }
  private getsubcatMasterbyproductId(cat_id) {
    this.__dbIntr.api_call(0, '/subcatUsingPro', 'category_id=' + cat_id).pipe(map((x: responseDT) => x.data)).subscribe((res: subcat[]) => {
      this.__subcatMaster = res;
    })
  }
  getProductMaster(){
    this.__dbIntr.api_call(0, '/product', null).pipe(map((x: responseDT) => x.data)).subscribe((res: product[]) => {
      this.__ProductMaster = res;
    })
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("100%");
    this.__isVisible = !this.__isVisible;
  }
  submit(){
    //  console.log(this.__scmForm.value.frequency);
    if (this.__scmForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error',0);
      return;
    }
    const __scm =new FormData();
    __scm.append("ava_special_sip", this.__scmForm.value.ava_special_sip);
    __scm.append("special_sip_name", this.__scmForm.value.ava_special_sip ? this.__scmForm.value.special_sip_name : '');
    __scm.append("product_id", this.__scmForm.value.product_id);
    __scm.append("amc_id", this.__scmForm.value.amc_id);
    __scm.append("category_id", this.__scmForm.value.category_id);
    __scm.append("subcategory_id", this.__scmForm.value.subcategory_id);
    __scm.append("scheme_name", this.__scmForm.value.scheme_name);
    __scm.append("id",this.__scmForm.value.id);
    __scm.append("scheme_type", this.__scmForm.value.scheme_type);
    __scm.append("nfo_start_dt",this.__scmForm.value.nfo_start_dt);
      __scm.append("nfo_end_dt",this.__scmForm.value.nfo_end_dt);
      __scm.append("nfo_reopen_dt",this.__scmForm.value.nfo_reopen_dt);
      __scm.append("pip_fresh_min_amt",this.__scmForm.value.pip_fresh_min_amt);
      __scm.append("pip_add_min_amt",this.__scmForm.value.pip_add_min_amt);
      __scm.append("frequency",JSON.stringify(this.__scmForm.value.frequency));
      __scm.append("swp_freq_wise_amt",JSON.stringify(this.__scmForm.value.swp_frequency));
      __scm.append("stp_freq_wise_amt",JSON.stringify(this.__scmForm.value.stp_frequency));
      __scm.append("sip_date",JSON.stringify(this.__scmForm.value.sip_date));
      __scm.append("swp_date",JSON.stringify(this.__scmForm.value.swp_date));
      __scm.append("stp_date",JSON.stringify(this.__scmForm.value.stp_date));
      __scm.append("gstin_no",this.__scmForm.value.gstin_no);
      __scm.append("nfo_entry_date",this.data.scheme_type == 'N' ? this.__scmForm.value.nfo_entry_date : '');
        this.__dbIntr.api_call(1, '/schemeAddEdit', __scm,true).subscribe((res: any) => {
      if (res.suc == 1) {
           this.reset();
           storage.setScmDtls(res.data);
           this.dialogRef.close({id:this.data.id,data:res.data});
      }
      this.__utility.showSnackbar(res.suc == 1 ? (this.data.id > 0 ? 'Scheme updated successfully' : 'Scheme added successfully') : res.msg, res.suc);
    })
  }
  reset(){
    this.__scmForm.reset();
  }
  get  frequency(): FormArray {
    return this.__scmForm.get("frequency") as FormArray;
  }

  get swp_frequency():FormArray{
    return this.__scmForm.get('swp_frequency') as FormArray;
   }
   get stp_frequency():FormArray{
    return this.__scmForm.get('stp_frequency') as FormArray;
   }

   addSwpFrequency(__freDtls){
    this.swp_frequency.push(this.createFrequencyforSWP_STP(__freDtls))
   }
   addStpFrequency(__freDtls){
    this.stp_frequency.push(this.createFrequencyforSWP_STP(__freDtls));
   }

  addFrequency(_freDtls){
  this.frequency.push(this.createFrequcncy(_freDtls));
  }
  createFrequcncy(_freDtls): FormGroup {
    return new FormGroup({
      id: new FormControl(_freDtls.id),
      freq_name: new FormControl(_freDtls.freq_name),
      is_checked: new FormControl(global.getType(_freDtls.is_checked)),
      sip_fresh_min_amt: new FormControl(_freDtls.sip_fresh_min_amt,[Validators.pattern("^[0-9]*$")]),
      sip_add_min_amt: new FormControl(_freDtls.sip_add_min_amt,[Validators.pattern("^[0-9]*$")]),
    });
  }

  createFrequencyforSWP_STP(_freDtls): FormGroup {
    console.log(_freDtls);

    return new FormGroup({
      id: new FormControl(_freDtls.id),
      freq_name: new FormControl(_freDtls.freq_name),
      is_checked: new FormControl(global.getType(_freDtls.is_checked)),
      sip_add_min_amt: new FormControl(_freDtls.sip_add_min_amt,[Validators.pattern("^[0-9]*$")]),
    });
  }
  preventNonumeric(__ev,index) {
    dates.numberOnly(__ev)
  }
  getCheckboxVal(i,checked,__id){
    switch(__id){
     case '1':this.setFormControldependOnCheckbox(i,checked);break;
     case '2':this.setSwpFormControldependOnCheckbox(i,checked);break;
     default: this.setStpFormControldependOnCheckbox(i,checked);break;
    }
  }
  setFormControldependOnCheckbox(i,__res){
    this.frequency.controls[i].get('sip_fresh_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
    this.frequency.controls[i].get('sip_add_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
    this.frequency.controls[i].get('sip_fresh_min_amt').updateValueAndValidity();
    this.frequency.controls[i].get('sip_add_min_amt').updateValueAndValidity();
  }
  setSwpFormControldependOnCheckbox(i,__res){
    // this.swp_frequency.controls[i].get('sip_fresh_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
    this.swp_frequency.controls[i].get('sip_add_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
    // this.swp_frequency.controls[i].get('sip_fresh_min_amt').updateValueAndValidity();
    this.swp_frequency.controls[i].get('sip_add_min_amt').updateValueAndValidity();
  }
  setStpFormControldependOnCheckbox(i,__res){
    // this.stp_frequency.controls[i].get('sip_fresh_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
    this.stp_frequency.controls[i].get('sip_add_min_amt').setValidators(__res ? [Validators.required,Validators.pattern("^[0-9]*$")] : null);
    // this.stp_frequency.controls[i].get('sip_fresh_min_amt').updateValueAndValidity();
    this.stp_frequency.controls[i].get('sip_add_min_amt').updateValueAndValidity();
  }

}
