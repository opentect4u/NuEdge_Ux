import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject, ElementRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { AmcModificationComponent } from '../amcModification/amcModification.component';

@Component({
  selector: 'amc-amcRpt',
  templateUrl: './amcRpt.component.html',
  styleUrls: ['./amcRpt.component.css'],
})
export class AmcrptComponent implements OnInit {
  @ViewChild('searchAmc') __searchAmc: ElementRef;
  @ViewChild('searchRnt') __searchRnt: ElementRef;

  __isamcspinner: boolean =false;
  __isrntspinner: boolean =false;
  __isshowSearchBtn: boolean =false;
  __isVisible:boolean= false;
  __amcMst: amc[] = [];
  __rntMst: rnt[] = [];
  __export= new MatTableDataSource<amc>([]);
  __exportedClmns: string[] =[ 'sl_no','amc_name','R&T'];
  __columnsForsummary: string[] = [
    'edit',
    'sl_no',
    'amc_name',
    'R&T',
    'delete'];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'amc_name',
    'R&T',
    'web_site',
    'cust_care_number',
    'cust_care_email',
    'head_contact_per',
    'head_contact_per_mobile',
    'head_contact_per_email',
    'head_contact_per_addr',
    'local_contact_per',
    'local_contact_per_mobile',
    'local_contact_per_email',
    'local_contact_per_addr',
    'l1_name',
    'l1_email',
    'l1_contact_no',

    'l2_name',
    'l2_email',
    'l2_contact_no',

    'l3_name',
    'l3_email',
    'l3_contact_no',

    'l4_name',
    'l4_email',
    'l4_contact_no',

    'l5_name',
    'l5_email',
    'l5_contact_no',

    'l6_name',
    'l6_email',
    'l6_contact_no',


    'delete'];

    __columns: string[];
  __selectAMC = new MatTableDataSource<amc>([]);
  __pageNumber = new FormControl(10);
  __detalsSummaryForm = new FormGroup({
       options: new FormControl('2'),
       rnt_name: new FormControl(''),
       amc_name: new FormControl(''),
       rnt_id: new FormControl(''),
       amc_id: new FormControl(''),
       contact_per: new FormControl(''),
       gst_in: new FormControl(''),
       l1: new FormControl(''),
       l2: new FormControl(''),
       l3: new FormControl(''),
       l4: new FormControl(''),
       l5: new FormControl(''),
       l6: new FormControl(''),
  })
  constructor(private __acRt: ActivatedRoute,
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<AmcrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
     private __dbIntr: DbIntrService) {}
     __paginate: any=[];
  ngOnInit() {
    // this.getAMCMaster();
       if (this.data.amc_id) {
      // this.getParticularAMCMaster();
       }
       this.getAMCMaster(
          this.data.rnt_id == null
        ? ''
        : '&rnt_id=' + atob(this.data.rnt_id)
    );
    this.__columns =  this.__columnsForsummary;
    this.tableExport();
  }



  private getAMCMaster(
    __params: string | null = null,
    __paginate: string | null = '10'
  ) {
    console.log(__params);

    this.__dbIntr
      .api_call(0, '/amc', 'paginate=' + __paginate + __params)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
      });
  }
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
  }
  populateDT(__items: amc) {
    // this.__utility.navigatewithqueryparams('/main/master/amcModify',{queryParams:{id: btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  ngAfterViewInit(){
    this.__detalsSummaryForm.controls['amc_name'].valueChanges
      .pipe(
        tap(() => this.__isamcspinner = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
              '/amc',
              dt)
            : []
        ),
        map((x: responseDT) => x.data),
      )
      .subscribe({
        next: (value) => {
          this.__amcMst = value;
          this.searchResultVisibility('block','A')
          this.__isamcspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

      this.__detalsSummaryForm.controls['rnt_name'].valueChanges
      .pipe(
        tap(() => this.__isrntspinner = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
              '/rnt',
              dt)
            : []
        ),
        map((x: responseDT) => x.data),
      )
      .subscribe({
        next: (value) => {
          this.__rntMst = value;
          this.searchResultVisibility('block','R')
          this.__isrntspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

      this.__detalsSummaryForm.controls['options'].valueChanges.subscribe(res =>{
        // this.__columns = res == '1' ?  this.__columnsForDetails : this.__columnsForsummary;
        if(res == '1'){
          this.__columns = this.__columnsForDetails;
          this.__exportedClmns = ['sl_no','amc_name','R&T',
          'l1_name',
          'l1_email',
          'l1_contact_no',

          'l2_name',
          'l2_email',
          'l2_contact_no',

          'l3_name',
          'l3_email',
          'l3_contact_no',

          'l4_name',
          'l4_email',
          'l4_contact_no',

          'l4_name',
          'l4_email',
          'l4_contact_no',

          'l5_name',
          'l5_email',
          'l5_contact_no',

          'l6_name',
          'l6_email',
          'l6_contact_no'
        ]
        }
        else{
          this.showColumns();
        }
      })
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
      flag: 'A',
      id: __amcId,
      amc: __amc,
      title: __amcId == 0 ? 'Add AMC' : 'Update AMC',
      product_id:this.data.id,
      right: global.randomIntFromInterval(1,60)
    };
    dialogConfig.id = __amcId > 0 ? __amcId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        AmcModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.addRow(dt.data);
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'A',
      });
    }
  }
  getval(__itemsPerPage){
    this.__pageNumber.setValue(__itemsPerPage);
    this.getAMCMaster('', __itemsPerPage);
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }

  updateRow(row_obj: amc) {
    this.__selectAMC.data = this.__selectAMC.data.filter((value: amc, key) => {
      if (value.id == row_obj.id) {
        value.amc_name = row_obj.amc_name;
        value.product_id = row_obj.product_id;
        value.rnt_id = row_obj.rnt_id;
        value.website = row_obj.website;
        value.sip_start_date = row_obj.sip_start_date;
        value.sip_end_date = row_obj.sip_end_date;

        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;
        value.gstin = row_obj.gstin;


        value.l1_name = row_obj.l1_name;
        value.l1_email = row_obj.l1_email;
        value.l1_contact_no = row_obj.l1_contact_no;

        value.l2_name = row_obj.l2_name;
        value.l2_email = row_obj.l2_email;
        value.l2_contact_no = row_obj.l2_contact_no;

        value.l3_name = row_obj.l3_name;
        value.l3_email = row_obj.l3_email;
        value.l3_contact_no = row_obj.l3_contact_no;

        value.l4_name = row_obj.l4_name;
        value.l4_email = row_obj.l3_email;
        value.l4_contact_no = row_obj.l4_contact_no;

        value.l5_name = row_obj.l5_name;
        value.l5_email = row_obj.l5_email;
        value.l5_contact_no = row_obj.l5_contact_no;

        value.l6_name = row_obj.l6_name;
        value.l6_email = row_obj.l6_email;
        value.l6_contact_no = row_obj.l6_contact_no;

        value.head_ofc_contact_per = row_obj.head_ofc_contact_per
        value.head_contact_per_mob = row_obj.head_contact_per_mob
        value.head_contact_per_email = row_obj.head_contact_per_email
        value.head_ofc_addr = row_obj.head_ofc_addr

        value.local_ofc_contact_per = row_obj.local_ofc_contact_per
        value.local_contact_per_mob = row_obj.local_contact_per_mob
        value.local_contact_per_email = row_obj.local_contact_per_email
        value.local_ofc_addr = row_obj.local_ofc_addr
      }
      return true;
    });
  }
  addRow(row_obj: amc) {
    this.__selectAMC.data.unshift(row_obj);
    this.__selectAMC._updateChangeSubscription();
  }
  // getSearchItem(__ev){
  //   if (__ev.flag == 'A') {
  //   } else if (__ev.flag == 'F') {
  //     this.setPaginator([__ev.item]);
  //   } else {
  //     this.getAMCMaster(
  //       this.data.rnt_id == null
  //         ? ''
  //         : '&rnt_id=' + atob(this.data.rnt_id)
  //     );
  //   }
  // }
  submit(){
    const __amcSearch = new FormData();
    __amcSearch.append('rnt_id',this.__detalsSummaryForm.value.rnt_id);
    __amcSearch.append('amc_id',this.__detalsSummaryForm.value.amc_id);
   __amcSearch.append('gstin',this.__detalsSummaryForm.value.gst_in);
   __amcSearch.append('contact_person',this.__detalsSummaryForm.value.contact_per);

     this.__dbIntr.api_call(1,'/amcDetailSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__paginate =res.links;
      this.setPaginator(res.data);
       this.showColumns();
       this.tableExport();
     })
  }

  tableExport(){
    const __amcExport = new FormData();
    __amcExport.append('amc_id',this.__detalsSummaryForm.value.amc_id ? this.__detalsSummaryForm.value.amc_id : '');
    __amcExport.append('rnt_id',this.__detalsSummaryForm.value.rnt_id ? this.__detalsSummaryForm.value.rnt_id : '');
    __amcExport.append('gstin',this.__detalsSummaryForm.value.gst_in ? this.__detalsSummaryForm.value.gst_in : '');
    __amcExport.append('contact_person',this.__detalsSummaryForm.value.contact_per ? this.__detalsSummaryForm.value.contact_per : '');
    this.__dbIntr.api_call(1,'/amcExport',__amcExport).pipe(map((x: any) => x.data)).subscribe((res: amc[]) =>{
       console.log(res);
      this.__export = new MatTableDataSource(res);
    })
  }

  showColumns(){
    if( this.__detalsSummaryForm.value.options == '1'){
      if(this.__detalsSummaryForm.value.l1
       || this.__detalsSummaryForm.value.l2
       || this.__detalsSummaryForm.value.l3
       || this.__detalsSummaryForm.value.l4
       || this.__detalsSummaryForm.value.l5
       || this.__detalsSummaryForm.value.l6){
         var columnDt =  [ 'edit','sl_no','amc_name','R&T'];
         this.__exportedClmns = ['sl_no','amc_name','R&T'];
         if(this.__detalsSummaryForm.value.l1){
           columnDt = [...columnDt,'l1_name','l1_email','l1_contact_no'];
          this.__exportedClmns = [ ...this.__exportedClmns ,'l1_name','l1_email','l1_contact_no'];
         }
         if(this.__detalsSummaryForm.value.l2){
           columnDt = [...columnDt,'l2_name','l2_email','l2_contact_no'];
          this.__exportedClmns = [ ...this.__exportedClmns ,'l2_name','l2_email','l2_contact_no'];
         }
         if(this.__detalsSummaryForm.value.l3){
           columnDt = [...columnDt,'l3_name','l3_email','l3_contact_no'];
          this.__exportedClmns = [ ...this.__exportedClmns ,'l3_name','l3_email','l3_contact_no'];
         }
         if(this.__detalsSummaryForm.value.l4){
           columnDt = [...columnDt,'l4_name','l4_email','l4_contact_no'];
          this.__exportedClmns = [ ...this.__exportedClmns ,'l4_name','l4_email','l4_contact_no'];
         }
         if(this.__detalsSummaryForm.value.l5){
           columnDt = [...columnDt,'l5_name','l5_email','l5_contact_no'];
          this.__exportedClmns = [ ...this.__exportedClmns ,'l5_name','l5_email','l5_contact_no'];
         }
         if(this.__detalsSummaryForm.value.l6){
           columnDt = [...columnDt,'l6_name','l6_email','l6_contact_no'];
          this.__exportedClmns = [ ...this.__exportedClmns ,'l6_name','l6_email','l6_contact_no'];
         }
         columnDt = [...columnDt,'delete'];
         console.log(columnDt);
         this.__columns = columnDt;
         console.log(this.__exportedClmns);

       }
       else{
         this.__columns = this.__columnsForDetails;
         this.__exportedClmns = ['sl_no','amc_name','R&T',
                                  'l1_name',
                                  'l1_email',
                                  'l1_contact_no',

                                  'l2_name',
                                  'l2_email',
                                  'l2_contact_no',

                                  'l3_name',
                                  'l3_email',
                                  'l3_contact_no',

                                  'l4_name',
                                  'l4_email',
                                  'l4_contact_no',

                                  'l4_name',
                                  'l4_email',
                                  'l4_contact_no',

                                  'l5_name',
                                  'l5_email',
                                  'l5_contact_no',

                                  'l6_name',
                                  'l6_email',
                                  'l6_contact_no',
                                ]
       }
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
  getItems(__amc,__type){
    console.log(__type);

   switch(__type){
    case 'A':  this.__detalsSummaryForm.controls['amc_id'].setValue(__amc.id)
                this.__detalsSummaryForm.controls['amc_name'].reset(__amc.amc_name,{ onlySelf: true,emitEvent: false})
                this.searchResultVisibility('none','A');
                break;
    case 'R':   this.__detalsSummaryForm.controls['rnt_id'].setValue(__amc.id)
                this.__detalsSummaryForm.controls['rnt_name'].reset(__amc.rnt_name,{ onlySelf: true,emitEvent: false})
                this.searchResultVisibility('none','R');
                break;
    default: break;
   }
  }
  outsideClick(__ev,__mode){
    if(__ev){
       this.searchResultVisibility('none',__mode)
    }
  }
  searchResultVisibility(display_mode,__mode) {
    switch(__mode){
      case 'A':
    this.__searchAmc.nativeElement.style.display = display_mode;
     break;
     case 'R':
      this.__searchRnt.nativeElement.style.display = display_mode;
       break;
    }
  }
  exportPdf(){
    this.__Rpt.downloadReport('#daySheetRpt',
    {
      title: 'AMC '
    }, 'AMC')
  }
}
