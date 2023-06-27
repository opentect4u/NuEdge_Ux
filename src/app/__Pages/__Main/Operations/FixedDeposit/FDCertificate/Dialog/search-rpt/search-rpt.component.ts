import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import modeOfPremium from '../../../../../../../../assets/json/Master/modeofPremium.json'
import loginstatus from '../../../../../../../../assets/json/Master/loginStatus.json';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { fdTraxClm } from 'src/app/__Utility/fdColumns/TraxClm';
import subOpt from '../../../../../../../../assets/json/subOption.json';
import tdsInfo from '../../../../../../../../assets/json/TDSInfo.json'
import { EntryComponent } from '../entry/entry.component';
import { fdCertificateClm } from 'src/app/__Utility/fdColumns/fdcertificate';
@Component({
  selector: 'app-search-rpt',
  templateUrl: './search-rpt.component.html',
  styleUrls: ['./search-rpt.component.css']
})
export class SearchRPTComponent implements OnInit {
 // __insuredbu_type = [
  //   { id: 'F', insuredbu_type: 'Fresh' },
  //   { id: 'R', insuredbu_type: 'Renewal' },
  // ];

  // @ViewChildren('insbuTypeChecked')
  // private __insbuTypeChecked: QueryList<ElementRef>;
  @ViewChildren('buTypeChecked')
  private __buTypeChecked: QueryList<ElementRef>;

  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  __isClientPending: boolean =false;
  __isEuinPending:  boolean =false;
  __isSubArnPending: boolean = false;
  __clientMst: client[] =[];
  __euinMst: any= [];
  __subbrkArnMst: any=[];
  __loginStatus = loginstatus;
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: string [] = [];
  __insTrax = new MatTableDataSource<any>([]);

  __exportedClmns: string[]
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  __pageNumber = new FormControl(10);
  __paginate: any= [];
  // __insType: any= [];
  __bu_type = buType;
  __isVisible: boolean = true;
  __insTraxForm  = new FormGroup({
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    // ins_type_id: new FormArray([]),
    // insured_bu_type: new FormArray([]),
    brn_cd: new FormControl(''),
    proposer_code: new FormControl(''),
    euin_no: new FormControl(''),
    bu_type: new FormArray([]),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl(''),
    // is_all_ins_bu_type: new FormControl(false),
    is_all_bu_type: new FormControl(false)
  })
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<SearchRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) { }


  setColumns(){
       this.__columns = fdCertificateClm.COLUMNFORDETAILS;
  }

  ngOnInit(): void {
    this.getFDMstRPT();
    this.setColumns();
  }

  ngAfterViewInit(){
    // this.__insTraxForm.controls['is_all_ins_bu_type'].valueChanges.subscribe(
    //   (res) => {
    //     const ins_type: FormArray = this.__insTraxForm.get(
    //       'insured_bu_type'
    //     ) as FormArray;
    //     ins_type.clear();
    //     if (!res) {
    //       this.uncheckAllForInsBuType();
    //     } else {
    //       this.__insuredbu_type.forEach((__el) => {
    //         ins_type.push(new FormControl(__el.id));
    //       });
    //       this.checkAllForInsBuType();
    //     }
    //   }
    // );

    this.__insTraxForm.controls['is_all_bu_type'].valueChanges.subscribe(
      (res) => {
        const bu_type: FormArray = this.__insTraxForm.get(
          'bu_type'
        ) as FormArray;
        bu_type.clear();
        if (!res) {
          this.uncheckAllbuType();
        } else {
          this.__bu_type.forEach((__el) => {
            bu_type.push(new FormControl(__el.id));
          });
          this.checkAllbuType();
        }
      }
    );



       // EUIN NUMBER SEARCH
       this.__insTraxForm.controls['euin_no'].valueChanges
       .pipe(
         tap(() => (this.__isEuinPending = true)),
         debounceTime(200),
         distinctUntilChanged(),
         switchMap((dt) =>
           dt?.length > 1 ? this.__dbIntr.searchItems('/employee', dt) : []
         ),
         map((x: responseDT) => x.data)
       )
       .subscribe({
         next: (value) => {
           this.__euinMst = value;
           this.searchResultVisibility('block');
           this.__isEuinPending = false;
         },
         complete: () => console.log(''),
         error: (err) => {
           this.__isEuinPending = false;
         },
       });

     /**change Event of sub Broker Arn Number */
     this.__insTraxForm.controls['sub_brk_cd'].valueChanges
       .pipe(
         tap(() => (this.__isSubArnPending = true)),
         debounceTime(200),
         distinctUntilChanged(),
         switchMap((dt) =>
           dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
         ),
         map((x: responseDT) => x.data)
       )
       .subscribe({
         next: (value) => {
           this.__subbrkArnMst = value;
           this.searchResultVisibilityForSubBrk('block');
           this.__isSubArnPending = false;
         },
         complete: () => console.log(''),
         error: (err) => {
           this.__isSubArnPending = false;
         },
       });

     this.__insTraxForm.controls['proposer_code'].valueChanges
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
         },
         complete: () => console.log(''),
         error: (err) => {
           this.__isClientPending = false;
         },
       });
  }

  getFDMstRPT(column_name: string | null | undefined = '',sort_by: string | null | undefined = 'asc'){
    const __fd = new FormData();

    __fd.append('login_status',global.getActualVal(this.__insTraxForm.value.login_status));
    __fd.append('bu_type',JSON.stringify(this.__insTraxForm.value.bu_type));
    __fd.append('column_name',column_name ? column_name : '');
    __fd.append('sort_by',sort_by ? sort_by : 'asc');
    __fd.append('paginate',this.__pageNumber.value);
    __fd.append('sub_brk_cd',global.getActualVal(this.__insTraxForm.value.sub_brk_cd));
    __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
    // __fd.append('ins_type_id',JSON.stringify(this.__insTraxForm.value.ins_type_id));
    // __fd.append('insured_bu_type',JSON.stringify(this.__insTraxForm.value.insured_bu_type));
    __fd.append('investor_name',global.getActualVal(this.__insTraxForm.value.proposer_code));
    __fd.append('euin_no',global.getActualVal(this.__insTraxForm.value.euin_no));
    __fd.append('start_date',global.getActualVal(this.__insTraxForm.value.start_date));
    __fd.append('end_date',global.getActualVal(this.__insTraxForm.value.end_date));
    this.__dbIntr.api_call(1,'/fd/deliveryUpdateDetailSearch',__fd).pipe(pluck("data")).subscribe((res: any) =>{
            console.log(res);
            this.__insTrax = new MatTableDataSource(res.data);
            this.__paginate =res.links;
    })
  }


  searchInsurance(){
    this.getFDMstRPT(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
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
    getTodayDate(){
      return dates.getTodayDate();
    }
    getval(__paginate) {
       this.__pageNumber.setValue(__paginate.toString());
      this.searchInsurance();
    }
    getPaginate(__paginate: any | null = null) {
      if (__paginate) {
        this.__dbIntr
          .getpaginationData(
            __paginate.url +
              ('&paginate=' + this.__pageNumber)
              + ('&login_status='+ global.getActualVal(this.__insTraxForm.value.login_status))
              // + ('&ins_type_id=' + this.__insTraxForm.value.options == '3' ? '[]' : JSON.stringify(this.__insTraxForm.value.ins_type_id))
              + ('&column_name=' +  this.__sortAscOrDsc.active ? this.__sortAscOrDsc.active : '')
              + ('&sort_by=' +  this.__sortAscOrDsc.direction ? this.__sortAscOrDsc.direction : 'asc')
              + ('&tin_no='+ this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.tin_no))
              + ('&euin_no=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.euin_no))
              + ('&bu_type' + this.__insTraxForm.value.options == '3' ? "[]" : (this.__insTraxForm.value.bu_type.length > 0 ? JSON.stringify(this.__insTraxForm.value.bu_type): ''))
              +('&start_date=' + this.__insTraxForm.value.options == '3' ? global.getActualVal(this.__insTraxForm.value.start_date) : '')
              +('&end_date=' + this.__insTraxForm.value.options == '3' ? global.getActualVal(this.__insTraxForm.value.end_date) : '')
              +('&investor_name=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.proposer_code))
              // + ('&insured_bu_type=' + this.__insTraxForm.value.options == '3' ? '[]' : JSON.stringify(this.__insTraxForm.value.insured_bu_type))
              )
          .pipe(map((x: any) => x.data))
          .subscribe((res: any) => {
            // this.setPaginator(res);
            this.__insTrax = new MatTableDataSource(res);
          });
      } else {

      }
    }
    onbuTypeChange(e: any) {
      const bu_type: FormArray = this.__insTraxForm.get('bu_type') as FormArray;
      if (e.checked) {
        bu_type.push(new FormControl(e.source.value));
      } else {
        let i: number = 0;
        bu_type.controls.forEach((item: any) => {
          if (item.value == e.source.value) {
            bu_type.removeAt(i);
            return;
          }
          i++;
        });
      }
      this.__insTraxForm.get('is_all_bu_type').setValue(
        bu_type.controls.length == 3 ? true : false,
        {emitEvent: false}
      )
    }
    sortData(__ev){
      this.__sortAscOrDsc = __ev;
      this.searchInsurance();
    }
    getModeOfPremium(premium){
      return premium ? this.__mode_of_premium.filter((x: any) => x.id = premium)[0].name : '';
    }
    populateDT(__el) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.width = '50%';
      dialogConfig.id = __el.tin_no;
      console.log(dialogConfig.id);
      dialogConfig.hasBackdrop = false;
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      try {
        dialogConfig.data = {
          flag: 'FDC_' + __el.tin_no,
          id: 0,
          title: 'FD Certificate Delivery - ' + (__el.certificate_delivery_opt == 'H' ? 'Hand Delivery' : 'Postal Delivery'),
          right: global.randomIntFromInterval(1, 60),
          tin_no: __el.tin_no ? __el.tin_no : '',
          data: __el,
        };
        console.log(dialogConfig.data);
        const dialogref = this.__dialog.open(EntryComponent, dialogConfig);
        dialogref.afterClosed().subscribe((dt) => {

          if(dt){
            this.updateRow(dt.data);
          }

        });
      } catch (ex) {
        console.log(ex);
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.updateSize('40%');
        this.__utility.getmenuIconVisible({
          id: Number(dialogConfig.id),
          isVisible: false,
          flag: 'FDC_' + __el.tin_no,
        });
      }
    }
    updateRow(row_obj){
      console.log(row_obj);
      this.__insTrax.data = this.__insTrax.data.filter((value: any, key) => {
        if (value.tin_no == row_obj.tin_no) {
          value.cert_collect_by = row_obj.cert_collect_by;
          value.cert_collect_by_dt = row_obj.cert_collect_by_dt;
          value.cert_collect_from_comp = row_obj.cert_collect_from_comp;
          value.cert_delivery_by = row_obj.cert_delivery_by;
          value.cert_delivery_contact_no = row_obj.cert_delivery_contact_no;
          value.cert_delivery_cu_comp_name = row_obj.cert_delivery_cu_comp_name;
          value.cert_delivery_cu_dt = row_obj.cert_delivery_cu_dt;
          value.cert_delivery_cu_pod = row_obj.cert_delivery_cu_pod;
          value.cert_delivery_cu_pod_scan = row_obj.cert_delivery_cu_pod_scan;
          value.cert_delivery_dt = row_obj.cert_delivery_dt;
          value.cert_delivery_flag = row_obj.cert_delivery_flag;
          value.cert_delivery_name = row_obj.cert_delivery_name;
          value.cert_pending_remarks = row_obj.cert_pending_remarks;
          value.cert_rec_by_dt = row_obj.cert_rec_by_dt;
          value.cert_rec_by_name = row_obj.cert_rec_by_name;
          value.cert_rec_by_scan = row_obj.cert_rec_by_scan;
          value.certificate_delivery_opt = row_obj.certificate_delivery_opt;
        }
        return true;
      });
     }
     finalSubmitManualUpdate(){
      const __finalSubmit =  new FormData();
      __finalSubmit.append('product_id','4');
      this.__dbIntr.api_call(1,'/fd/manualUpdateFinalSubmit',__finalSubmit).subscribe((res: any) => {
        this.__utility.showSnackbar(res.msg,res.suc)
      })
     }
     outsideClickforClient(__ev) {
      if (__ev) {
        this.searchResultVisibilityForClient('none');
      }
    }
    searchResultVisibilityForClient(display_mode) {
      this.__clientCode.nativeElement.style.display = display_mode;
    }
    getItems(__items, __mode) {
      switch (__mode) {
        case 'C':
          this.__insTraxForm.controls['proposer_code'].reset(
            __items.client_name,
            { onlySelf: true, emitEvent: false }
          );
          this.searchResultVisibilityForClient('none');
          break;
        case 'E':
          this.__insTraxForm.controls['euin_no'].reset(__items.emp_name, {
            onlySelf: true,
            emitEvent: false,
          });
          this.searchResultVisibility('none');
          break;
        case 'T':
          // this.__insTraxForm.controls['temp_tin_no'].reset(__items.temp_tin_no,{ onlySelf: true, emitEvent: false });
          // this.searchResultVisibilityForTempTin('none');
          break;
        case 'S':
          this.__insTraxForm.controls['sub_brk_cd'].reset(__items.code, {
            onlySelf: true,
            emitEvent: false,
          });
          this.searchResultVisibilityForSubBrk('none');
          break;
      }
    }
    outsideClick(__ev) {
      if (__ev) {
        this.__isEuinPending = false;
        this.searchResultVisibility('none');
      }
    }
    searchResultVisibility(display_mode) {
      this.__searchRlt.nativeElement.style.display = display_mode;
    }
    outsideClickforSubBrkArn(__ev) {
      if (__ev) {
        this.searchResultVisibilityForSubBrk('none');
      }
    }
    /** Search Result Off against Sub Broker */
    searchResultVisibilityForSubBrk(display_mode) {
      this.__subBrkArn.nativeElement.style.display = display_mode;
    }

    checkAllbuType(){
      this.__buTypeChecked.forEach((element: any) => {
        element.checked = true;
      });
    }
    uncheckAllbuType(){
      this.__buTypeChecked.forEach((element: any) => {
        element.checked = false;
      });
    }
    // onInsBuTypeChange(e) {
    //   const ins_bu_type: FormArray = this.__insTraxForm.get(
    //     'insured_bu_type'
    //   ) as FormArray;
    //   if (e.checked) {
    //     ins_bu_type.push(new FormControl(e.source.value));
    //   } else {
    //     let i: number = 0;
    //     ins_bu_type.controls.forEach((item: any) => {
    //       if (item.value == e.source.value) {
    //         ins_bu_type.removeAt(i);
    //         return;
    //       }
    //       i++;
    //     });
    //   }
    //   this.__insTraxForm
    //     .get('is_all_ins_bu_type')
    //     .setValue(ins_bu_type.controls.length == 2 ? true : false, {
    //       emitEvent: false,
    //     });
    // }

    // uncheckAllForInsBuType() {
    //   this.__insbuTypeChecked.forEach((element: any) => {
    //     element.checked = false;
    //   });
    // }
    // checkAllForInsBuType() {
    //   this.__insbuTypeChecked.forEach((element: any) => {
    //     element.checked = true;
    //   });
    // }
    getSub_option(__subOpt){
      return subOpt.filter(x => x.id == __subOpt)[0]?.value;
    }
    getTDSInfo(__id){
      return tdsInfo.filter(x => x.id == __id)[0]?.name
    }

}