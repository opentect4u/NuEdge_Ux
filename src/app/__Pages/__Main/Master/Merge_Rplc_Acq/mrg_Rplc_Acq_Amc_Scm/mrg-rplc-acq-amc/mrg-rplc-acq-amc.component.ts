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
import { environment } from 'src/environments/environment';
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

  ALERT_MSG:string;

  MAX_AMC_LIMITATION:number;

  FINAL_PREVIEW_CARD_TITLE:string;

  stepper_index:number = 0;

  @ViewChild('stepper') stepper:MatStepper;

  /**
    * For Showing / hiding spinner on search
    */
  __isAmcSpinner:boolean = false;

  acq_amc_spinner:boolean = false;


  amc_dtls:amc;

  acq_amc_dtls:amc;

  @Input() flag:string;

  /**
   * For Showing / hiding seach list
   */
  displayMode_for_amc:string | undefined;

  displayMode_for_acq_amc:string | undefined;

  // @ViewChild('primeTbl') primeTbl :Table

  @Input() parent_id:string | null;

  /**
   * Holding AMC Master data after search with particular amc/s
   */
  amcMstDt:amc[] = [];

  acq_amc_mst:amc[] = [];

  /**
   * Holding settings for AMC Multiselect Dropdown  comming from Parent Component
   */
  //  @Input() settings:any;

  /**
   * Search Form For AMC Search
   */
   @Input() search_amc:FormGroup | undefined;

   /**
    * Search For  For AMC Search FOr Acquisition only
    */

  acq_srch_frm:FormGroup | undefined = new FormGroup({
    amc_name:new FormControl(''),
    amc_id: new FormControl('')
  })

   /**
    * holding datatable data
    */
   amcTblDT:amc[] = [];

   amcTblDT_foracq:amc[] = [];


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


   final_preview_dt:amc[] = [];

    final_preview_acq_amc:amc[] = [];

  constructor(private utility:UtiliService,private __dbIntr:DbIntrService,
    private __dialog: MatDialog,private __utility:UtiliService,
    private overlay: Overlay
    ) { }

  ngOnInit(): void {
    if(this.parent_id != '48'){
      this.getrntMst();
      this.addSecurityQuesAns();
    }
      this.MAX_AMC_LIMITATION = this.parent_id == '46' ? 2 : 1;
      this.ALERT_MSG = this.parent_id == '46' ? 'Please select atleast two AMC in step-1' : 'Please select AMC in step-1'
      this.FINAL_PREVIEW_CARD_TITLE = this.parent_id == '46' ? 'New AMC to be merged with' : (this.parent_id == '47' ? 'New AMC to be replaced with' : 'New AMC to be acquisition with')


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
        this.amcTblDT = [...this.amcTblDT,this.amc_dtls];
          if(this.parent_id != '46'){
             this.final_preview_dt.length = 0;
            //  setTimeout(() => {
            //   this.setFormControl(this.amc_dtls);
            //  }, 200);
            switch(this.parent_id){
              case '47':
               setTimeout(() => {
                this.setFormControl(this.amc_dtls);
              }, 200);
                break;
              default:break;
            }
          }
          this.final_preview_dt.push(this.amc_dtls);
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
      this.amc_dtls = ev.item;
      this.search_amc.get('amc_id').setValue(ev.item.id);
      this.search_amc.get('amc_name').setValue(ev.item.amc_short_name,{emitEvent:false});
      this.searchResultVisibility('none');
      // if(this.parent_id == '48'){
      //   this.amcTblDT = [];
      //   this.amcTblDT = [...this.amcTblDT, ev.item];
      //   this.final_preview_dt.length = 0;
      //   this.final_preview_dt.push(ev.item)
      // }
      this.populateAMC();
    }

    getSelectedItemsFromParentFor_acq_amc = <T extends {flag:string,item:amc}> (ev:T) =>{
      this.acq_amc_dtls = ev.item;
      this.acq_srch_frm.get('amc_id').setValue(ev.item.id);
      this.acq_srch_frm.get('amc_name').setValue(ev.item.amc_short_name,{emitEvent:false});
      this.searchResultVisibility_foracq('none');
      // this.amcTblDT_foracq = [];
      // this.amcTblDT_foracq = [...this.amcTblDT_foracq,ev.item];
      // this.final_preview_acq_amc.length = 0;
      // this.final_preview_acq_amc.push(ev.item)
      this.acquisition();
    }

    ngAfterViewInit(){
      this.search_amc.controls['amc_name'].valueChanges
      .pipe(
        tap(()=> {
          this.search_amc.get('amc_id').setValue('');
          if(this.parent_id == '46'){
            this.amc_dtls = null
          }
         }),
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
       * Search AMC For Acquisition
       */
      this.acq_srch_frm.controls['amc_name'].valueChanges.pipe(
        tap(()=> {
          this.acq_srch_frm.get('amc_id').setValue('')
         }),
        tap(() => (this.acq_amc_spinner = true)),
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
          this.acq_amc_mst = value;
          this.searchResultVisibility_foracq('block');
          this.acq_amc_spinner = false;
        },
        complete: () =>{},
        error: (err) => {
          this.acq_amc_spinner = false;
        },
      });
      /** End */

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

    searchResultVisibility_foracq = (display_mode:string) =>{
      this.displayMode_for_acq_amc = display_mode;
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
      if(step == 2){
        this.stepper.next();
      }
      else{
      let api_name = `${this.parent_id == '46'
      ? '/amcMerge' : (this.parent_id == '47'
      ? '/amcReplace' : '/amcAcquisition')}`;
      let getFrm_value =  Object.assign({}, this.amcFrm.value, {sec_qusAns: JSON.stringify(this.sec_qusAns.value)})
      let dt;

      if(this.parent_id == '48'){
       dt={
        product_id:'1',
        amc_ids:JSON.stringify(this.final_preview_dt.map(item=> {return item.id})),
        acquisition_to_id:this.final_preview_acq_amc.map(item=> item.id),
        effective_date:this.amcFrm.value.effective_date
      }
      }
      else{
      dt = {
          ...getFrm_value,
            amc_ids:JSON.stringify(this.final_preview_dt.map(item=> {return item.id})),
            product_id:'1',
          }
      }

        this.__dbIntr.api_call(1,api_name,this.utility.convertFormData(dt))
        .subscribe((res: any) =>{
          this.utility.showSnackbar(res.suc == 1 ? `AMC ${this.parent_id == '47' ? ' Replace ' : ' Merge '} Successfully` : res.msg,res.suc);
          this.search_amc.get('amc_name').setValue('',{emitEvent:false});
          this.search_amc.get('amc_id').setValue('');
          this.amcFrm.reset('',{emitEvent:false,onlySelf:false});
          this.stepper.previous();
          this.stepper.previous();
          this.amcTblDT = [];
          this.amc_dtls = null;
          this.final_preview_dt = [];
          if(this.parent_id == '48'){
            this.amcTblDT_foracq = [];
            this.final_preview_acq_amc = [];
            this.acq_amc_dtls= null;
          }
        })
      }
    }

    setFinalPreviewList = (ev) =>{
      this.setFinalSelectedAMC(ev);
          if(this.parent_id == '46'){
            if(ev.length >= this.MAX_AMC_LIMITATION){
              this.stepper.next();
              return;
            }
          }
          else if(this.parent_id == '47' || this.parent_id == '48'){
            if(ev){
              this.stepper.next();
              return;
            }
          }
          // else{
          //   return;
          // }
        this.utility.showSnackbar(`Please select ${this.parent_id == '46' ? 'atlease two' : ''} AMC`,2);
    }

    setFinalSelectedAMC = (ev) =>{
      if(this.parent_id == '46'){
        this.final_preview_dt = ev;
        return;
      }
        this.final_preview_dt.length = 0;
        if(ev){
          this.final_preview_dt.push(ev);
        }
        if(this.parent_id == '47'){
          this.setFormControl(ev);
         }


    }
    setFinalSelectedAMCFor_acqAMC = (ev: amc):void =>{
      this.final_preview_acq_amc.length = 0;
      this.amcFrm.reset();
      if(ev){
        this.final_preview_acq_amc.push(ev);
      }
      /** Need for Enable Button for Final Submit for Acquisition */
      this.amcFrm.patchValue({
        amc_code:global.getActualVal(ev) ? ev.amc_code : '',
        amc_short_name:global.getActualVal(ev) ? ev.amc_short_name : '',
        amc_full_name:global.getActualVal(ev) ? ev.amc_name : '',
        rnt_id: global.getActualVal(ev) ? ev.rnt_id : '',
        gst_in:global.getActualVal(ev) ? ev.gstin : '',
        website:global.getActualVal(ev) ? ev.website : '',
      });
      /*** End */
    }
    setFinalPreviewListFor_acqAMC = (ev):void =>{
      if(ev){
       this.stepper.next();
       this.setFinalSelectedAMCFor_acqAMC(ev);
      }
      else{
       this.utility.showSnackbar(`Please select AMC`,2);
      }
    }

    setFormControl(ev: amc){
       this.amcFrm.patchValue({
        amc_code:global.getActualVal(ev) ? ev.amc_code : '',
        amc_short_name:global.getActualVal(ev) ? ev.amc_short_name : '',
        amc_full_name:global.getActualVal(ev) ? ev.amc_name : '',
        rnt_id: global.getActualVal(ev) ? ev.rnt_id : '',
        gst_in:global.getActualVal(ev) ? ev.gstin : '',
        website:global.getActualVal(ev) ? ev.website : '',
        cus_care_whatsapp_no:global.getActualVal(ev) ? ev.cus_care_whatsapp_no : '',
        cus_care_no: global.getActualVal(ev) ? ev.cus_care_no : '',
        cus_care_email: global.getActualVal(ev) ? ev.cus_care_email : '',
        distributor_care_email: global.getActualVal(ev) ? ev.distributor_care_email : '',
        distributor_care_no:  global.getActualVal(ev) ? ev.distributor_care_no : '',
        head_ofc_contact_per:global.getActualVal(ev) ? ev.head_ofc_contact_per : '',
        head_contact_per_mob:global.getActualVal(ev) ? ev.head_contact_per_mob : '',
        head_contact_per_email:global.getActualVal(ev) ? ev.head_contact_per_email : '',
        head_ofc_addr:global.getActualVal(ev) ? ev.head_ofc_addr : '',
        local_ofc_contact_per:global.getActualVal(ev) ? ev.local_ofc_contact_per : '',
        local_contact_per_mob:global.getActualVal(ev) ? ev.local_contact_per_mob : '',
        local_contact_per_email:global.getActualVal(ev) ? ev.local_contact_per_email : '',
        local_ofc_addr:global.getActualVal(ev) ? ev.local_ofc_addr : '',
        login_url:global.getActualVal(ev) ? ev.login_url : '',
        login_pass:global.getActualVal(ev) ? ev.login_pass : '',
        login_id:global.getActualVal(ev) ? ev.login_id : '',
        l1_name: global.getActualVal(ev) ? ev.l1_name : '',
        l1_email: global.getActualVal(ev) ? ev.l1_email : '',
        l1_contact_no: global.getActualVal(ev) ? ev.l1_contact_no : '',
        l2_name: global.getActualVal(ev) ? ev.l2_name : '',
        l2_email: global.getActualVal(ev) ? ev.l2_email : '',
        l2_contact_no:global.getActualVal(ev) ? ev.l2_contact_no : '',
        l3_name: global.getActualVal(ev) ? ev.l3_name : '',
        l3_email: global.getActualVal(ev) ? ev.l3_email : '',
        l3_contact_no: global.getActualVal(ev) ? ev.l3_contact_no : '',
        l4_name: global.getActualVal(ev) ? ev.l4_name : '',
        l4_email: global.getActualVal(ev) ? ev.l4_email : '',
        l4_contact_no:global.getActualVal(ev) ? ev.l4_contact_no : '',
        l5_name: global.getActualVal(ev) ? ev.l5_name : '',
        l5_email: global.getActualVal(ev) ? ev.l5_email : '',
        l5_contact_no: global.getActualVal(ev) ? ev.l5_contact_no : '',
        l6_name: global.getActualVal(ev) ? ev.l6_name : '',
        l6_email: global.getActualVal(ev) ? ev.l6_email : '',
        l6_contact_no:global.getActualVal(ev) ? ev.l6_contact_no : '',
        logo_preview_file: global.getActualVal(ev) ? `${environment.amc_logo_url+ev.logo}` : '',
      });

      this.sec_qusAns.clear();
      if(ev?.security_qus_ans){
        JSON.parse(ev?.security_qus_ans).forEach(el =>{
          this.sec_qusAns.push(this.SecurityQuesAns(el?.id,el?.sec_qus,el?.sec_ans));
       })
      }
      else{
          this.sec_qusAns.push(this.SecurityQuesAns());
      }
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
        title: __amc.amc_name,
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

    acquisition = () =>{
        // const dt = {
        //    acq_from:this.final_preview_dt.map(item => {return item.id}),
        //    acq_to:this.final_preview_acq_amc.map(item => {return item.id}),
        //    product_id:'1',
        //   }
        // this.__dbIntr.api_call(1,'/amcAcquisition',this.utility.convertFormData(dt))
        // .subscribe((res: any) =>{
        //   this.utility.showSnackbar(res.suc == 1 ? 'Acquistion of AMC Successfully' : res.msg,res.suc);
        //   this.search_amc.get('amc_name').setValue('',{emitEvent:false});
        //   this.search_amc.get('amc_id').setValue('');
        //   this.acq_srch_frm.get('amc_name').setValue('',{emitEvent:false});
        //   this.acq_srch_frm.get('amc_id').setValue('');
        //   this.amcTblDT_foracq=[];
        //   this.amcTblDT = [];
        //   this.final_preview_dt = [];
        //   this.final_preview_acq_amc = [];
        // })
        // console.log(this.final_preview_dt);
        // console.log(this.final_preview_acq_amc);
        if(this.acq_amc_dtls && this.acq_srch_frm.value.amc_id){
          if(
            this.amcTblDT_foracq.findIndex((item:amc) => item.id == this.acq_amc_dtls.id) > -1
            ){
             this.utility.showSnackbar('AMC already populated',2);
          }
          else{
            this.amcTblDT_foracq = [...this.amcTblDT_foracq,this.acq_amc_dtls];
            this.final_preview_acq_amc.length = 0;
            this.final_preview_acq_amc.push(this.acq_amc_dtls);

          }
        }
        else{
          this.utility.showSnackbar('Please select AMC',2);
        }
        /** Need for Enable Button for Final Submit for Acquisition */
        this.amcFrm.patchValue({
          amc_code:global.getActualVal(this.acq_amc_dtls) ? this.acq_amc_dtls.amc_code : '',
          amc_short_name:global.getActualVal(this.acq_amc_dtls) ? this.acq_amc_dtls.amc_short_name : '',
          amc_full_name:global.getActualVal(this.acq_amc_dtls) ? this.acq_amc_dtls.amc_name : '',
          rnt_id: global.getActualVal(this.acq_amc_dtls) ? this.acq_amc_dtls.rnt_id : '',
          gst_in:global.getActualVal(this.acq_amc_dtls) ? this.acq_amc_dtls.gstin : '',
        });
    /*** End */
        // console.log(this.final_preview_acq_amc);
        // console.log(this.final_preview_dt);
    }
}

