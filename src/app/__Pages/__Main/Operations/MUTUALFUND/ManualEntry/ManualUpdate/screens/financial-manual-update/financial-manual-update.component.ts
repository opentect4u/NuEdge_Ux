import { Component, Input, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { amc } from 'src/app/__Model/amc';
import { rnt } from 'src/app/__Model/Rnt';
import { sort } from 'src/app/__Model/sort';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import updateStatus from '../../../../../../../../../assets/json/updateStatus.json';
import { column } from 'src/app/__Model/tblClmns';
import { MfackClmns } from 'src/app/__Utility/MFColumns/ack';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { MatTableDataSource } from '@angular/material/table';
import { ManualUpdateEntryForMFComponent } from 'src/app/shared/manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import ItemsPerPage from '../../../../../../../../../assets/json/itemsPerPage.json';
import moment from 'moment';
import { Table } from 'primeng/table';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-financial-manual-update',
  templateUrl: './financial-manual-update.component.html',
  styleUrls: ['./financial-manual-update.component.css']
})
export class FinancialManualUpdateComponent implements OnInit,OnDestroy  {
  @ViewChild('dt') primeTbl :Table;
  tableWidth:number | undefined = 0;
  __transType: any = [];
  transaction_id:number;
  @Input() product_id:number = 1;
  private _trans_type_id:number;
    sort = new sort();
    brnchMst: any =[];
    __RmMst: any =[];
    __bu_type: any =[];
      @Input() amcMst: amc[] = [];
      itemsPerPage = ItemsPerPage;
    
    selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
    settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
    settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
    settingsforDropdown_forbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
    settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
   settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
   settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
   settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  __pageNumber = new FormControl('10');
  __financMst = new MatTableDataSource<any>([]);

  __ackForm = new FormGroup({
    is_all: new FormControl(false),
    is_all_status: new FormControl(false),
    update_status_id: new FormArray([]),
    tin_no: new FormControl(''),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    // date_range: new FormControl([new Date(dates.calculateDT("W")),new Date(dates.getTodayDate())]),
    // dt_type: new FormControl('W'),
    // frm_dt: new FormControl(dates.calculateDT("W")),
    // to_dt: new FormControl(dates.getTodayDate()),
    date_range: new FormControl(''),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    rnt_id: new FormArray([]),
    amc_id: new FormControl([],{updateOn:'blur'}),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    rm_id: new FormControl([],{updateOn:'blur'}),
    bu_type: new FormControl([],{updateOn:'blur'}),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    euin_no: new FormControl([]),
    options: new FormControl('2'),
    btnType: new FormControl('R'),
    scheme_id:new FormControl([])
})
__paginate: any = [];

__subbrkArnMst: any = [];
__euinMst: any = [];
    schemeMst:scheme[] =[];
    __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  tinMst: any = [];
  __clientMst: client[] = [];

  @Input() 
  public get trans_type_id():number {
    return this._trans_type_id;
  }
  __columns:column[] = []

  public set trans_type_id(transTypeId:number){
    if(transTypeId){
      this._trans_type_id = transTypeId;
      this.__transType = [];
      this.getTransactionType();
    }
  }
  constructor(private __dbIntr:DbIntrService,private __utility:UtiliService,
    public __dialog: MatDialog,
    private overlay: Overlay,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
    this.getRntMst();
    this.getupdateStatus();
  }

  get rnt_id():FormArray{
    return this.__ackForm.get('rnt_id') as FormArray;
   }
   get update_status_id(): FormArray{
    return this.__ackForm.get('update_status_id') as FormArray
   }

  TabDetails(ev){
    if(ev.index >= 0){
      this.transaction_id = ev.tabDtls.id;
      this.setColumns(this.transaction_id,1);
      console.log(this._trans_type_id)
      this.reset();

      // this.getAckRpt();
      console.log('trsns' + this.transaction_id);
      // this.setColumn(this.transaction_id);
      // 
    }
   }

   getTransactionType() {
       this.__dbIntr
         .api_call(0, '/transction', ('product_id=' +this.product_id +'&trans_type_id=' + this.trans_type_id))
         .pipe(pluck('data'))
         .subscribe((res: any) => {
           this.setColumns(res[0].id,1);
           this.transaction_id = res[0].id;
           // this.getAckRpt();
           this.reset();
           this.__transType = res.map(({id,trns_name}) => ({
             id,
             tab_name:trns_name,
             img_src:id == 1 ? '../../../../../assets/images/pip.png'
             : (id == 2 ? '../../../../../assets/images/sip.png'
             : '../../../../../assets/images/switch.png')}));
         });
     }
     getManualUpdateRPT(column_name: string | null = '', sort_by: string | null | '' = '') {
      const __mfTrax = new FormData();
      __mfTrax.append('paginate', this.__pageNumber.value);
      __mfTrax.append('option', this.__ackForm.value.options);
      __mfTrax.append('trans_id',this.transaction_id.toString());
      __mfTrax.append('trans_type_id' ,this._trans_type_id.toString());
      __mfTrax.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
      __mfTrax.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
      __mfTrax.append('update_status_id',JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})));
      __mfTrax.append('from_date',this.__ackForm.getRawValue().frm_dt? this.__ackForm.getRawValue().frm_dt: '');
      __mfTrax.append('to_date',this.__ackForm.getRawValue().to_dt? this.__ackForm.getRawValue().to_dt: '');
      __mfTrax.append('client_code',this.__ackForm.value.client_code? this.__ackForm.value.client_code: '');
      __mfTrax.append('tin_no',this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : '');
      __mfTrax.append('amc_name',this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]');
      __mfTrax.append('scheme_name',this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]');
     __mfTrax.append('rnt_name',JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']})));
        if(this.__ackForm.value.btnType == 'A'){
        __mfTrax.append('sub_brk_cd',this.__ackForm.value.sub_brk_cd ? JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item["code"]})) : '[]');
        __mfTrax.append('euin_no',this.__ackForm.value.euin_no ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["euin_no"]})) : '[]');
        __mfTrax.append('brn_cd',this.__ackForm.value.brn_cd ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]})) : '[]');
         __mfTrax.append('rm_id',this.__ackForm.value.rm_id ? JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item["euin_no"]})) : '[]')
        __mfTrax.append('bu_type',this.__ackForm.value.bu_type? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["bu_code"]})): '[]');
      }
      this.__dbIntr
        .api_call(1, '/manualUpdateDetailSearch', __mfTrax)
        .pipe(
          pluck('data')
          )
        .subscribe((res: any) => {
          // this.__paginate = res.links;
          console.log(res);
          this.setPaginator(res);
          // this.tableExport(__mfTrax);
        });
    }
    submit() {
      this.getManualUpdateRPT();
    }

    onItemClick(item){
      if(item.option.value == 'A'){
        //Advance Filter
        this.getBranchMst();
      }
      else{
        //Reset
        this.reset();
      }
     }

     getBranchMst(){
      this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
          this.brnchMst = res
      })
    }

    reset(){
      this.__RmMst.length = 0;
      this.__subbrkArnMst.length = 0;
      this.__euinMst.length = 0;
      this.__bu_type.length = 0;
      this.__ackForm.patchValue({
        client_code:'',
        date_range:'',
        dt_type:'',
        frm_dt:'',
        to_dt:'',
        scheme_id:[],
        options:'2'
      })
      this.__ackForm.get('amc_id').setValue([],{emitEvent:false});
      this.__ackForm.get('is_all').setValue(false,{emitEvent:true});
      this.__ackForm.get('is_all_status').setValue(false,{emitEvent:true});
      this.__ackForm.get('tin_no').reset('',{emitEvent:false});
      this.__ackForm.get('client_name').reset('',{emitEvent:false});
      this.__ackForm.get('brn_cd').reset([],{emitEvent:false});
      this.__ackForm.get('rm_id').reset([],{emitEvent:false});
      this.__ackForm.get('bu_type').reset([],{emitEvent:false});
      this.__ackForm.get('sub_brk_cd').reset([],{emitEvent:false});
      this.__ackForm.get('euin_no').reset([],{emitEvent:false});
      this.schemeMst.length = 0;
      this.sort = new sort();
      this.__pageNumber.setValue('10');
      this.submit();
  
     }
   close(ev){
    this.__ackForm.patchValue({
      frm_dt: this.__ackForm.getRawValue().date_range ? dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[0]) : '',
      to_dt: this.__ackForm.getRawValue().date_range ? (global.getActualVal(this.__ackForm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[1]) : '') : ''
     });
   }

   getSelectedItemsFromParent(res){
    this.getItems(res.item,res.flag)
   }
   getItems(__items, __mode) {
    switch (__mode) {
      // case 'A':
      //   this.__rcvForms.controls['amc_name'].reset(__items.amc_name, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForAMC('none');
      //   break;
      case 'C':
        this.__ackForm.controls['client_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__ackForm.controls['client_code'].reset(__items.id, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
      // case 'E':
      //   this.__rcvForms.controls['euin_no'].reset(__items.emp_name, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibility('none');
      //   break;
      case 'T':
        this.__ackForm.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
      // case 'S':
      //   this.__rcvForms.controls['sub_brk_cd'].reset(__items.code, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForSubBrk('none');
      //   break;
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  searchResultVisibilityForTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }

  private getAMCwiseScheme(amc_ids){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc_ids.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res:scheme[]) =>{
      this.schemeMst = res;
    })
   }
   changeWheelSpeed(container, speedY) {
      var scrollY = 0;
      var handleScrollReset = function() {
          scrollY = container.scrollTop;
      };
      var handleMouseWheel = function(e) {
          e.preventDefault();
          scrollY += speedY * e.deltaY
          if (scrollY < 0) {
              scrollY = 0;
          } else {
              var limitY = container.scrollHeight - container.clientHeight;
              if (scrollY > limitY) {
                  scrollY = limitY;
              }
          }
          container.scrollTop = scrollY;
      };

      var removed = false;
      container.addEventListener('mouseup', handleScrollReset, false);
      container.addEventListener('mousedown', handleScrollReset, false);
      container.addEventListener('mousewheel', handleMouseWheel, false);

      return function() {
        if (removed) {
            return;
        }
        container.removeEventListener('mouseup', handleScrollReset, false);
        container.removeEventListener('mousedown', handleScrollReset, false);
        container.removeEventListener('mousewheel', handleMouseWheel, false);
        removed = true;
      };
   }
   ngAfterViewInit() {

   
       this.__ackForm.controls['dt_type'].valueChanges.subscribe((res) => {
         this.__ackForm.controls['date_range'].reset(
            res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
          );
          this.__ackForm.controls['frm_dt'].reset(
            res && res != 'R' ? ((dates.calculateDT(res))) : ''
          );
          this.__ackForm.controls['to_dt'].reset(
            res && res != 'R' ? dates.getTodayDate() : ''
          );
   
          if (res && res != 'R') {
            this.__ackForm.controls['date_range'].disable();
          } else {
            this.__ackForm.controls['date_range'].enable();
          }
        });
          /** Change event occur when all rnt checkbox has been changed  */
          this.__ackForm.controls['is_all'].valueChanges.subscribe(res =>{
            this.rnt_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
          })
          /** End */
   
          /** Change event inside the formArray */
          this.rnt_id.valueChanges.subscribe(res =>{
          this.__ackForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
          })
          /*** End */
   
   
          /** Change event occur when all rnt checkbox has been changed  */
          this.__ackForm.controls['is_all_status'].valueChanges.subscribe(res =>{
            this.update_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
          })
          /** End */
   
          /** Change event inside the formArray */
          this.update_status_id.valueChanges.subscribe(res =>{
          this.__ackForm.controls['is_all_status'].setValue(res.every(item => item.isChecked),{emitEvent:false});
          })
          /*** End */
   
        this.__ackForm.controls['amc_id'].valueChanges.subscribe((res) => {
           this.getAMCwiseScheme(res);
        })
   
     //   /** Client Code Change */
       this.__ackForm.controls['client_name'].valueChanges
         .pipe(
           tap(() => (this.__isClientPending = true)),
           debounceTime(200),
           distinctUntilChanged(),
           switchMap((dt) =>
             dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
           ),
           map((x: any) => x.data)
         )
         .subscribe({
           next: (value) => {
             this.__clientMst = value.data;
             this.searchResultVisibilityForClient('block');
             this.__isClientPending = false;
             this.__ackForm.controls['client_code'].setValue('');
           },
           complete: () => {},
           error: (err) => {
             this.__isClientPending = false;
           },
         });
   
     //   /** End */
   
     //   // Tin Number Search
       this.__ackForm.controls['tin_no'].valueChanges
         .pipe(
           tap(() => (this.__isTinspinner = true)),
           debounceTime(200),
           distinctUntilChanged(),
           switchMap((dt) =>
             dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/mfTraxShow', dt) : []
           ),
           map((x: responseDT) => x.data)
         )
         .subscribe({
           next: (value) => {
             this.tinMst = value;
             this.searchResultVisibilityForTin('block');
             this.__isTinspinner = false;
           },
           complete: () => console.log(''),
           error: (err) => (this.__isTinspinner = false),
         });
         this.__ackForm.controls['options'].valueChanges.subscribe((res) => {
           this.setColumns(this.transaction_id,res);
       });
       this.__ackForm.controls['brn_cd'].valueChanges.subscribe(res =>{
         this.getBusinessTypeMst(res)
       })
       this.__ackForm.controls['bu_type'].valueChanges.subscribe(res =>{
         this.disabledSubBroker(res);
          this.getRelationShipManagerMst(res,this.__ackForm.value.brn_cd);
       })
       this.__ackForm.controls['rm_id'].valueChanges.subscribe(res =>{
         if(this.__ackForm.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
                  this.getSubBrokerMst(res);
         }
         else{
         this.__euinMst.length = 0;
           this.__euinMst = res;
         }
      })
      this.__ackForm.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
       // if(res.length > 0){
         this.setEuinDropdown(res,this.__ackForm.value.rm_id);
       // }
      })
      const el = document?.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
      this.changeWheelSpeed(el, 0.99);
       }
       getBusinessTypeMst(brn_cd){
        if(brn_cd.length > 0){
        this.__dbIntr
        .api_call(0,'/businessType','arr_branch_id='+JSON.stringify(brn_cd.map(item => {return item['id']})))
        .pipe(pluck("data")).subscribe(res =>{
                this.__bu_type = res;
        })
      }
      else{
        this.__ackForm.controls['bu_type'].reset([],{emitEvent:true});
        this.__bu_type.length = 0;
      }
      }
      getRelationShipManagerMst(bu_type_id,arr_branch_id){
        if(bu_type_id.length > 0 && arr_branch_id.length > 0){
        this.__dbIntr.api_call(0,'/employee',
        'arr_bu_type_id='+ JSON.stringify(bu_type_id.map(item => {return item['bu_code']}))
        +'&arr_branch_id=' + JSON.stringify(arr_branch_id.map(item  => {return item['id']}))
        ).pipe(pluck("data"))
        .subscribe(res =>{
             this.__RmMst = res;
        })
      }
      else{
        this.__RmMst.length =0;
        this.__ackForm.controls['rm_id'].reset([]);
      }
      }
      disabledSubBroker(bu_type_ids){
        if(bu_type_ids.findIndex(item => item.bu_code == 'B') != -1){
          this.__ackForm.controls['sub_brk_cd'].enable();
        }
        else{
          this.__ackForm.controls['sub_brk_cd'].disable();
        }
  
      }
      getSubBrokerMst(arr_euin_no){
        if(arr_euin_no.length > 0){
        this.__dbIntr.api_call(0,'/subbroker',
        'arr_euin_no='+ JSON.stringify(arr_euin_no.map(item => {return item['euin_no']})))
        .pipe(pluck("data")).subscribe((res: any) =>{
          this.__subbrkArnMst = res.map(({code,bro_name,emp_euin_no,euin_no}) => ({
          code,
          emp_euin_no,
          euin_no,
          bro_name:bro_name +'-'+code
          })
          );
        })
      }
      else{
        this.__subbrkArnMst.length =0;
        this.__ackForm.controls['sub_brk_cd'].setValue([]);
      }
      }
      setEuinDropdown(sub_brk_cd,rm){
        // this.__euinMst.length = 0;
        console.log(sub_brk_cd);
  
       this.__euinMst = rm.filter(item => !this.__subbrkArnMst.map(item=> {return item['emp_euin_no']}).includes(item.euin_no));
       if(sub_brk_cd.length > 0){
        sub_brk_cd.forEach(element => {
               if(this.__subbrkArnMst.findIndex((el) => element.code == el.code) != -1){
                  this.__euinMst.push(
                    {
                      euin_no:this.__subbrkArnMst[this.__subbrkArnMst.findIndex((el) => element.code == el.code)].euin_no,
                      emp_name:''
                    }
                    );
               }
        });
       }
       else{
         this.__euinMst = this.__euinMst.filter(item => !this.__subbrkArnMst.map(item => {return item['euin_no']}).includes(item.euin_no))
       }
      }
        getRntMst(){
          this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
            res.forEach(el =>{
                 this.rnt_id.push(this.addRntForm(el));
            })
          })
        }
      addRntForm(_rnt:rnt){
            return new FormGroup({
              id:new FormControl(_rnt ? _rnt?.id : 0),
              name:new FormControl(_rnt ? _rnt.rnt_name : ''),
              isChecked: new FormControl(false)
            })
    }
    getupdateStatus(){
      updateStatus.forEach(el =>{
      this.update_status_id.push(this.addUpdateStatusForm(el));
      })
    }
    addUpdateStatusForm(loggedStatus){
      return new FormGroup({
        id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
        name:new FormControl(loggedStatus ? loggedStatus?.name : 0),
        value:new FormControl(loggedStatus ? loggedStatus.value : ''),
        isChecked:new FormControl(false),
      })
    }


    customSort(ev){
      console.log(ev)
      this.sort.order = ev.sortOrder;
      this.sort.field = ev.sortField;
      if(ev.sortField){
       this.submit();
      }
     }

      setColumns(trans_id,option){
        this.__columns =  trans_id == 2  ? global.getColumnsAfterMerge(MfackClmns.Summary_common,MfackClmns.Summary_Sip)
        : global.getColumnsAfterMerge(MfackClmns.Summary_common,MfackClmns.Summary_Pip_Switch);
        this.tableWidth = this.__columns.map(el => el.width ? Number(el.width.split('rem')[0]) : 0).reduce(function (x, y) {return x + y;}, 0)
       }
        DocumentView(element){
           const dialogConfig = new MatDialogConfig();
           dialogConfig.autoFocus = false;
           dialogConfig.closeOnNavigation = true;
           dialogConfig.width = '80%';
           dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
           dialogConfig.data = {
             title: 'Uploaded Scan Copy',
             data: element,
             copy_url:`${environment.app_formUrl + element.app_form_scan}`,
             src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.app_formUrl + element.app_form_scan}`)
           };
           const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
         }
    onselectItem(__itemsPerPage) {
      this.submit();
    }
      getPaginate(__paginate: any | null = null) {
        if (__paginate.url) {
          this.__dbIntr
            .getpaginationData(
              __paginate.url +
                ('&paginate=' + this.__pageNumber.value) +
                (this.transaction_id ? '&trans_id=' + this.transaction_id : '') +
                ('&option=' + this.__ackForm.value.options) +
                ('&trans_type_id=' + this._trans_type_id) +
                ('&trans_id=' + this.transaction_id.toString()) +
                ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
                ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
                ('&client_code=' + (this.__ackForm.value.client_code ? this.__ackForm.value.client_code : '')) +
                ('&tin_no=' + (this.__ackForm.value.tin_no? this.__ackForm.value.tin_no : '')) +
                ('&amc_name=' + (this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]'))
                +('&rnt_name=' + (this.__ackForm.value.rnt_id ? JSON.stringify(this.__ackForm.value.rnt_id.filter(x=> x.isChecked).map(item => {return item["id"]})) : '[]'))
                 +('&update_status_id='+JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})))
                + ('&from_date=' + (global.getActualVal(this.__ackForm.getRawValue().frm_dt))) +
                ('&to_date=' +(global.getActualVal(this.__ackForm.getRawValue().to_dt)))
                +('&scheme_name='+this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]')
                + (this.__ackForm.value.btnType == 'A' ?
                (('&sub_brk_cd=' +(this.__ackForm.value.sub_brk_cd ? JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item["code"]})) : '[]'))
                  +('&euin_no=' +(this.__ackForm.value.euin_no ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["euin_no"]})) : '[]'))
                  +('&brn_cd=' + (this.__ackForm.value.brn_cd ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]})) : '[]'))
                  +('&bu_type=' + (this.__ackForm.value.bu_type ? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["bu_code"]})) : '[]'))
                  +('&rm_id=' + (this.__ackForm.value.rm_id ? JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item["euin_no"]})) : '[]'))
                )
                : '')
            )
            .pipe(map((x: any) => x.data))
            .subscribe((res: any) => {
              // this.__financMst = new MatTableDataSource(res.data);
              // this.__paginate = res.links;
              this.setPaginator(res);
            });
        }
      }
      setPaginator(res) {
        const final_dt =   res.filter((el) => {
            if(el.form_status != 'M'){
              if(!el.nfo_reopen_dt){
                return this.filterManualUpdateByTAT(el.rnt_login_dt,el.manual_update_tat)
              }
              else{
                  const nfoReopenDt = moment(el.nfo_reopen_dt,'YYYY-MM-DD');
                  const rntLoginDt =  moment(el.rnt_login_dt,'YYYY-MM-DD');
                  if(rntLoginDt.isBefore(nfoReopenDt)){
                    return this.filterManualUpdateByTAT(nfoReopenDt,el.manual_update_tat)
                  }
                  else{
                    return this.filterManualUpdateByTAT(rntLoginDt,el.manual_update_tat)
                  }
              }
            }
            else{
              return false;
            }
        })
        this.__financMst = new MatTableDataSource(final_dt);
        // this.__paginate = res.links;
      
      }

       filterManualUpdateByTAT(date,tat) {
                      const dateToCheck = moment(date, "YYYY-MM-DD").add(tat ? tat : 0, 'days');
                      let today = moment().startOf('day');
                      // let diffInDays = dateToCheck.diff(today, 'days');
                      let diffInDays = today.diff(dateToCheck, 'days');
      
                      // console.log(diffInDays)
                      return diffInDays > 0; 
        }

        
        filterGlobal = ($event) => {
          let value = $event.target.value;
          this.primeTbl.filterGlobal(value,'contains')
        }


      populateDT(__items) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = false;
          dialogConfig.closeOnNavigation = false;
          dialogConfig.disableClose = true;
          dialogConfig.hasBackdrop = false;
          dialogConfig.width = '50%';
          dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
          dialogConfig.data = {
            flag: 'MUFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
            isViewMode: __items.form_status == 'A' ? false : true,
            tin: __items.tin_no,
            tin_no: __items.tin_no,
            title: 'Manual Update For Financial',
            right: global.randomIntFromInterval(1, 60),
            id: 'MUFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
            data: __items,
          };
          dialogConfig.id =
            'MUFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0');
          try {
            const dialogref = this.__dialog.open(
              ManualUpdateEntryForMFComponent,
              dialogConfig
            );
            dialogref.afterClosed().subscribe((dt) => {
              if (dt) {
                this.updateRow(dt.data);
              }
            });
          } catch (ex) {
            const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
            dialogRef.updateSize('40%');
            this.__utility.getmenuIconVisible({
              id: Number(dialogConfig.id),
              isVisible: false,
              flag: 'MUFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
            });
          }
        }

        updateRow(row_obj) {
          this.__financMst.data = this.__financMst.data.filter((value: any, key) => {
            if (value.tin_no == row_obj.tin_no) {
              value.manual_update_remarks = row_obj.manual_update_remarks;
              value.pending_reason = row_obj.pending_reason;
              value.reject_reason_id = row_obj.reject_reason_id;
              value.contact_per_email = row_obj.contact_per_email;
              value.contact_per_phone = row_obj.contact_per_phone;
              value.contact_per_name = row_obj.contact_per_name;
              value.contact_via = row_obj.contact_via;
              value.contact_to_comp = row_obj.contact_to_comp;
              value.folio_no = row_obj.folio_no;
              value.process_date = row_obj.process_date;
              value.manual_trans_status = row_obj.manual_trans_status;
              value.reject_memo = row_obj.reject_memo;
              value.upload_soa = row_obj.upload_soa;
              value.form_status = row_obj.form_status;
            }
            return true;
          });
        }

        getColumns = () =>{
          return this.__utility.getColumns(this.__columns);
        }

        ngOnDestroy() {
          this.__financMst = new MatTableDataSource([]);
        }
}
