import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { amc } from 'src/app/__Model/amc';
import { column } from 'src/app/__Model/tblClmns';
import { Table } from 'primeng/table';
import { UtiliService } from 'src/app/__Services/utils.service';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { rnt } from 'src/app/__Model/Rnt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { MatStepper } from '@angular/material/stepper';
import { dates } from 'src/app/__Utility/disabledt';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { AmcDtlsPreviewComponent } from '../Dialog/amc-dtls-preview/amc-dtls-preview.component';
export class AmcTblClm{
  static column:column[] = [
    {
      field:'sl_no',header:"Sl No",width:'6rem'
    },
    {
      field:'amc_code',header:"AMC Code",width:'8rem'
    },
    {
      field:'amc_short_name',header:"AMC",width:'15rem'
    },
    {
      field:'rnt_name',header:"R&T",width:'10rem'
    },
    {
      field:'view_dtls',header:'View Details',width:'10rem'
    }
  ]
}

@Component({
  selector: 'mrg-rplc-acq-amc',
  templateUrl: './mrg-rplc-acq-amc.component.html',
  styleUrls: ['./mrg-rplc-acq-amc.component.css']
})
export class MrgRplcAcqAmcComponent implements OnInit {

  stepper_index:number = 0;

  @ViewChild('stepper') stepper:MatStepper;

  /**
    * For Showing / hiding spinner on search
    */
  __isAmcSpinner:boolean = false;


  amc_dtls:amc;

  @Input() flag:string;

  /**
   * For Showing / hiding seach list
   */
  displayMode_for_amc:string | undefined;

  // @ViewChild('primeTbl') primeTbl :Table

  @Input() parent_id:string | null;

  /**
   * Holding AMC Master data after search with particular amc/s
   */
  amcMstDt:amc[] = [];

  /**
   * Holding settings for AMC Multiselect Dropdown  comming from Parent Component
   */
  //  @Input() settings:any;


  /**
   * Search Form For AMC Search
   */
   @Input() search_amc:FormGroup | undefined;

   /**
    * holding datatable data
    */
   amcTblDT:amc[] = [];

   /**
    * Selected AMC Data
    */
  //  seletedAMC:amc[] = [];

  allowedExtensions = ['png','jpg','jpeg'];


   /**
    * Amc Entry Form
    */
   amcFrm = new FormGroup({
     amc_code:new FormControl('',[Validators.required]),
     amc_short_name:new FormControl('',[Validators.required]),
     amc_full_name:new FormControl('',[Validators.required]),
     rnt_id: new FormControl('',[Validators.required]),
     gst_in:new FormControl('',[Validators.required]),
     website:new FormControl(''),
     cus_care_whatsapp_no:new FormControl('',[Validators.pattern("^[0-9]*$")]),
     cus_care_no: new FormControl('',[Validators.pattern("^[0-9]*$")]),
     cus_care_email: new FormControl('', [Validators.email]),
     distributor_care_email: new FormControl('',[Validators.email]),
     distributor_care_no: new FormControl('',[Validators.pattern("^[0-9]*$")]),
     head_ofc_contact_per: new FormControl(''),
     head_contact_per_mob:new FormControl('',[Validators.pattern("^[0-9]*$")]),
     head_contact_per_email:new FormControl('',[Validators.email]),
     head_ofc_addr:new FormControl(''),
     local_ofc_contact_per:new FormControl(''),
     local_contact_per_mob:new FormControl('',[Validators.pattern("^[0-9]*$")]),
     local_contact_per_email:new FormControl('',[Validators.email]),
     local_ofc_addr:new FormControl(''),
     login_url:new FormControl(''),
     login_pass:new FormControl(''),
     login_id:new FormControl(''),
     l1_name: new FormControl(''),
     l1_email: new FormControl('', [Validators.email]),
     l1_contact_no: new FormControl('', [Validators.pattern("^[0-9]*$")]),
     l2_name: new FormControl(''),
     l2_email: new FormControl('',[Validators.email]),
     l2_contact_no: new FormControl('', [Validators.pattern("^[0-9]*$")]),
     l3_name: new FormControl(''),
     l3_email: new FormControl('',[Validators.email]),
     l3_contact_no: new FormControl('', [Validators.pattern("^[0-9]*$")]),
     l4_name: new FormControl(''),
     l4_email: new FormControl('',[Validators.email]),
     l4_contact_no: new FormControl('',[Validators.pattern("^[0-9]*$")]),
     l5_name: new FormControl(''),
     l5_email: new FormControl('',[Validators.email]),
     l5_contact_no: new FormControl('',[Validators.pattern("^[0-9]*$")]),
     l6_name: new FormControl(''),
     l6_email: new FormControl('',[Validators.email]),
     l6_contact_no: new FormControl('',[Validators.pattern("^[0-9]*$")]),
     is_same: new FormControl(false),
     sec_qusAns: new FormArray([]),
     logo: new FormControl('',[fileValidators.fileExtensionValidator(this.allowedExtensions)]),
     logo_file: new FormControl(''),
     logo_preview_file: new FormControl(''),
     effective_date: new FormControl(''),
   })


     /** */
   __RntMaster:rnt[] = [];

   /**
    * columns for AMC
    */
   show_dtls_clm:column[] = AmcTblClm.column;

   amcClm:column[] =  AmcTblClm.column.filter(item => item.field!= 'view_dtls')


   final_preview_dt:any[] = [];

  constructor(private utility:UtiliService,private __dbIntr:DbIntrService,
    private __dialog: MatDialog,private __utility:UtiliService,
    private overlay: Overlay
    ) { }

  ngOnInit(): void {
    this.getrntMst();
    this.addSecurityQuesAns();
    console.log(this.parent_id);
  }

  get sec_qusAns(): FormArray {
    return this.amcFrm.get("sec_qusAns") as FormArray;
  }

  SecurityQuesAns(id: number | null = 0,
    sec_qus:string | null = '',
    sec_ans: string | null = '') : FormGroup{
    return new FormGroup({
      id: new FormControl(id),
      sec_qus: new FormControl(sec_qus),
      sec_ans: new FormControl(sec_ans)
    })
  }
  addSecurityQuesAns = () =>{
    this.sec_qusAns.push(this.SecurityQuesAns());
  }

  removeSecurityQuesAns(index){
    this.sec_qusAns.removeAt(index);
  }

  getrntMst = () =>{
    this.__dbIntr.api_call(0,'/rnt',null)
    .pipe(pluck('data'))
    .subscribe((res:rnt[]) =>{
     this.__RntMaster = res;
    })
  }

  populateAMC = () =>{
    if(this.amc_dtls){
      if(
        this.amcTblDT.findIndex((item:amc) => item.id == this.amc_dtls.id) > -1
        ){
         this.utility.showSnackbar('AMC already populated',2);
      }
      else{
        this.amcTblDT.push(this.amc_dtls);
        this.final_preview_dt.push(this.amc_dtls);
        console.log(this.final_preview_dt)
      }
    }
    else{
      this.utility.showSnackbar('Please select AMC',2);
    }
    }

    getColumns = () =>{
      return this.utility.getColumns(this.amcClm);
    }


    getSelectedItemsFromParent =<T extends {flag:string,item:amc}> (ev:T) =>{
      // this.amc_dtls = null;
      this.amc_dtls = ev.item;
      this.search_amc.get('amc_id').setValue(ev.item.id);
      this.search_amc.get('amc_name').setValue(ev.item.amc_short_name,{emitEvent:false});
      this.searchResultVisibility('none');
    }

    ngAfterViewInit(){
      this.search_amc.controls['amc_name'].valueChanges
      .pipe(
        tap(()=> (this.search_amc.get('amc_id').setValue(''),this.amc_dtls = null)),
        tap(() => (this.__isAmcSpinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                '/amc',
                dt
              )
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value:amc[]) => {
          this.amcMstDt = value;
          this.searchResultVisibility('block');
          this.__isAmcSpinner = false;
        },
        complete: () =>{},
        error: (err) => {
          this.__isAmcSpinner = false;
        },
      });

     /**
      *  Same As Local Office
      */
    this.amcFrm.controls['is_same'].valueChanges.subscribe(res =>{
      console.log(res)
        this.amcFrm.patchValue({
          l3_name:res ? this.amcFrm.value.local_ofc_contact_per : '',
          l3_email:res ? this.amcFrm.value.local_contact_per_email : '',
          l3_contact_no:res ? this.amcFrm.value.local_contact_per_mob : '',
        })
    })
    }

    searchResultVisibility = (display_mode:string) =>{
      this.displayMode_for_amc = display_mode;
    }

    getFile = (__ev) => {
      this.amcFrm.controls['logo'].setValidators([fileValidators.fileSizeValidator(__ev.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
      this.amcFrm.controls['logo'].updateValueAndValidity();
      if (this.amcFrm.controls['logo'].status == 'VALID' && __ev.files.length > 0) {
        this.amcFrm.controls['logo_file'].setValue(__ev.files[0]);
        const file = __ev.files[0];
        const reader = new FileReader();
        reader.onload = e => this.amcFrm.controls['logo_preview_file'].patchValue(reader.result);
        reader.readAsDataURL(file);
      }
      else {
        this.amcFrm.controls['logo_file'].setValue('');
        this.amcFrm.controls['logo_preview_file'].patchValue('');
      }

    }

    mergeAMC = (step) =>{
      let frm_val = this.amcFrm.value;
      if(step == 2){
        this.stepper.next();
      }
      else{
        // console.log(this.amcFrm.value);
        let getFrm_value =  Object.assign({}, this.amcFrm.value, {sec_qusAns: JSON.stringify(this.sec_qusAns.value)})
        const dt = {
          ...getFrm_value,
           amc_ids:JSON.stringify(this.final_preview_dt.map(item=> {return item.id})),
           product_id:'1',
          }
        this.__dbIntr.api_call(1,'/amcMerge',this.utility.convertFormData(dt))
        .subscribe((res: any) =>{
          this.utility.showSnackbar(res.suc == 1 ? 'AMC Merge Successfully' : res.msg,res.suc);
          this.search_amc.get('amc_name').setValue('',{emitEvent:false});
          this.search_amc.get('amc_id').setValue('');
          this.amcFrm.reset('',{emitEvent:false,onlySelf:false});
          this.stepper.previous();
          this.stepper.previous();
          this.amcTblDT = [];
        })
      }
    }

    setFinalPreviewList = (ev) =>{
      this.setFinalSelectedAMC(ev);
      if(ev.length >= 2){
        this.stepper.next();
      }
      else{
        this.utility.showSnackbar('Please select atleast two AMC',2);
      }
    }

    setFinalSelectedAMC = (ev) =>{
      console.log(ev);
      // this.final_preview_dt.length = 0;
      this.final_preview_dt = ev;
    }

    preventNonumeric(__ev) {
      dates.numberOnly(__ev);
    }

    onStepChange = (ev) =>{
        this.stepper_index = ev.selectedIndex;
        this.amcFrm.get('effective_date').setValidators(ev.selectedIndex > 1 ?Validators.required : null);
        this.amcFrm.get('effective_date').updateValueAndValidity();
    }

    ViewDetails = (dtls:amc) => {
      console.log(dtls);
      this.openDialog(dtls,dtls.id);
    }

    openDialog(__amc: amc,__amcId){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '60%';
      dialogConfig.height = '100%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.data = {
        flag: `A${__amcId}`,
        id: __amcId,
        amc: __amc,
        title: 'View AMC',
        product_id:'1',
        rntMst:this.__RntMaster,
        right: global.randomIntFromInterval(1,60)
      };
      dialogConfig.id = __amcId > 0 ? __amcId.toString() : '0';
      try {
        const dialogref = this.__dialog.open(
          AmcDtlsPreviewComponent,
          dialogConfig
        );
        dialogref.afterClosed().subscribe((dt) => {

        });
      } catch (ex) {
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.addPanelClass('mat_dialog');
        this.__utility.getmenuIconVisible({
          id: Number(dialogConfig.id),
          isVisible: false,
          flag: `A${__amcId}`,
        });
      }
    }
}


// type message = {
//   error:[{severity:'warn',summary:'Warning',detail:'Please Select AMC from Step-1'}]
// }
