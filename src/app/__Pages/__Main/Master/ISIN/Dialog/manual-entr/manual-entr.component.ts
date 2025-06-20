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
  /**
   * * This function is used to set the ISIN form details for the corresponding ID.
   * * It takes a data object as an argument and sets the form values based on the properties of the data object.
   * * @param dt - The data object containing the ISIN details.
   */
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
  /**
   * * This function is used to fetch the plan details from the database.
   * * It makes an API call to the '/plan' endpoint and retrieves the data.
   * * The retrieved data is then assigned to the planMst property.
   * * @returns void
   * * @memberof ManualEntrComponent
   * * @description
   * * This function is called when the component is initialized to populate the plan details.
   */
  getPlan(){
   this.__dbIntr.api_call(0,'/plan',null).pipe(pluck('data')).subscribe((res: plan[]) =>{
     this.planMst = res;
   })
  }
  /**
   *  * This function is used to fetch the option details from the database.
   *  * It makes an API call to the '/option' endpoint and retrieves the data.
   *  * The retrieved data is then assigned to the optionMst property.
   */
  getOption(){
    this.__dbIntr.api_call(0,'/option',null).pipe(pluck('data')).subscribe((res: option[]) =>{
      this.optionMst = res;
    })
  }
  /**
   * * This function is used to fetch the AMC master data from the database.
   * * It makes an API call to the '/amc' endpoint and retrieves the data.
   * * The retrieved data is then assigned to the amcMst property.
   * * @returns void
   */
  getAMCMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck('data')).subscribe((res: amc[]) =>{
      this.amcMst = res
    })
  }
  /**
   * * This function is used to get the FormArray of ISIN details from the ISIN form.
   * * It returns the 'isin_dtls' FormArray from the ISIN form.
   * * @returns {FormArray} - The FormArray of ISIN details.
   */
  get isin_dtls(): FormArray {
    return this.isinForm.get('isin_dtls') as FormArray;
  }
  /**
   * * This function is used to create a new FormGroup for ISIN details.
   * * It initializes the FormGroup with the provided parameters and sets the appropriate controls.
   * * @param {number} id - The ID of the ISIN detail (optional).
   * * @param {number} scheme_id - The ID of the scheme (optional).
   * * @param {string} scheme_name - The name of the scheme (optional).
   * * @param {number} plan_id - The ID of the plan (optional).
   * * @param {number} opt_id - The ID of the option (optional).
   * * @param {string} isin_name - The name of the ISIN (optional).
   * * @param {string} product_code - The product code (optional).
   * * @returns {FormGroup} - The FormGroup for ISIN details.
   */
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

  /**
   * * This function is used to get the scheme master data against a specific AMC (Asset Management Company) ID.
   * * It makes an API call to the '/scheme' endpoint with the AMC ID as a parameter.
   * * The retrieved data is then assigned to the schemeMst property.
   * * @param {number} amc_id - The ID of the AMC for which the scheme master data is to be fetched.
   * * @returns void
   */
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

  /**
   * * This function is used to toggle the visibility of the dialog.
   * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
   * * It also updates the position of the dialog to the top of the screen.
   */
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to minimize the dialog.
   * * * It removes the 'mat_dialog' and 'full_screen' panel classes from the dialog reference.
   * * * It updates the size of the dialog to 40% width and 55px height.
   * * * It also updates the position of the dialog to the bottom right corner of the screen.
   */
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   *  * This function is used to maximize the dialog.
   *  * It removes the 'full_screen' panel class and adds the 'mat_dialog' panel class to the dialog reference.
   *  * It updates the position of the dialog to the top of the screen.
   *  * It also toggles the visibility state of the dialog.
   *  * @returns void
   */
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to populate the scheme details in the ISIN form.
   * * * It clears the existing ISIN details, retrieves the plan and option details,
   * * * and fetches the scheme ISIN details based on the selected scheme ID.
   * * * @returns void
   * * * @memberof ManualEntrComponent
   * * * @description
   */
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
  /**
   * * * This function is used to add a new control to the ISIN details FormArray.
   * * * It pushes a new FormGroup created by the setISIN function into the isin_dtls FormArray.
   * * * @returns void
   * * * @memberof ManualEntrComponent
   * * * @description
   */
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
  /**
   * 
   * @param el - The element containing the ISIN details to be populated in the form.
   * * This function is used to populate the ISIN details in the form from a report.
   * * It clears the existing ISIN details, retrieves the plan and option details,
   *  * and sets the ISIN details in the form based on the provided element.
   * * @returns void
   * * @memberof ManualEntrComponent
   * * @description
   */
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
  /**
   * * This function is used to submit the ISIN details.
   * * It creates a FormData object, appends the ISIN details from the form, and makes an API call to save the ISIN details.
   * * If the API call is successful, it closes the dialog and shows a success message.
   * * @returns void
   * * @memberof ManualEntrComponent
   * * @description
   * * This function is called when the user clicks the submit button to save the ISIN details.
   */
  submitISIN(){
    const fd = new FormData();
    fd.append('isin_dtls',JSON.stringify(this.isin_dtls.value))
    this.__dbIntr.api_call(1,'/schemeISINAddEdit',fd).subscribe((res: any) =>{
        this.dialogRef.close({data:res.data});
        this.__utility.showSnackbar(res.suc == 1 ? 'ISIN saved successfully' : res.msg ,res.suc);
    })
  }
  /**
   *  * This function is used to remove an ISIN detail from the FormArray.
   *  * It checks if the row_id is greater than 0, and if so, it opens a confirmation dialog to delete the ISIN detail.
   *  * If the row_id is not greater than 0, it directly removes the control at the specified index.
   *  * @param index - The index of the ISIN detail to be removed.
   * @param row_id - The ID of the ISIN detail to be removed.
   * * This function is used to remove an ISIN detail at a specific index.
   * * If the row_id is greater than 0, it opens a confirmation dialog to delete the ISIN detail.
   * @param isin_no - The ISIN number of the detail to be removed.
   * * If the row_id is not greater than 0, it directly removes the control at the specified index.
   * * @returns void
   */
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

  /**
   * 
   * @param index - The index of the control to be removed from the FormArray.
   * * This function is used to remove a control from the ISIN details FormArray at a specific index.
   * * It removes the control at the specified index from the 'isin_dtls' FormArray.
   */
  RemoveControls(index){
    this.isin_dtls.removeAt(index);
  }
  /**
   * 
   * @param existing - The existing object to compare against.
   * * This function is used to compare an existing object with another object to check if they are the same.
   * * It checks if the 'id' property of the existing object matches the 'id' property of the object to check against.
   * * @param existing - The existing object to compare.
   * @param toCheckAgainst - The object to check against the existing object.
   * * @description
   * * This function is used to compare two objects based on their 'id' properties.
   * * If the 'id' properties match, it returns true; otherwise, it returns false.
   * @param toCheckAgainst 
   * @returns 
   */
  compareWith(existing, toCheckAgainst) {
    if (!toCheckAgainst) {
      return false;
    }
    return existing.id === toCheckAgainst.id;
  }
}
