import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject, ElementRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmModificationComponent } from '../scmModification/scmModification.component';
import {schemeClmns} from '../../../../../__Utility/Master/schemeClmns';
@Component({
  selector: 'app-scmRpt',
  templateUrl: './scmRpt.component.html',
  styleUrls: ['./scmRpt.component.css']
})
export class ScmRptComponent implements OnInit {

  __sortAscOrDsc: any = {active: '',direction:'asc'};
  @ViewChild('searchcat') __searchCat : ElementRef;
  @ViewChild('searchsubcat') searchsubcat : ElementRef;
  toppings = new FormControl();
  toppingList: any = [];
  __scmForm = new FormGroup({
    scheme_status: new FormControl('O'),
    amc_name: new FormControl(''),
    scheme_name: new FormControl(''),
    cat_id: new FormControl(''),
    cat_name: new FormControl(''),
    subcat_name: new FormControl(''),
    subcat_id: new FormControl(''),
    options: new FormControl('2'),
    advanceFlt: new FormControl('')
  });
  __isVisible: boolean =true;
  __paginate: any=[];
  __pageNumber= new FormControl(10);
  __selectScm = new MatTableDataSource<scheme>([]);
  __exportedClmns: string [] = []
  __columns: string[] = [];
  __catMst: category[] =[];
  __subcatMst: subcat[]=[];
  __columnsForsummary: string[] = [];
  __columnsForDetails: string[] = [];
  __export = new MatTableDataSource<scheme>([]);
  __iscatspinner: boolean =false;
  __issubcatspinner: boolean =false;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ScmRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }

  ngOnInit() {
    // this.__columns = this.__columnsForsummary;
    // this.toppings.setValue(this.__columns);
    this.getSchemeMst();
    this.setColumns(this.__scmForm.value.scheme_status,this.__scmForm.value.options)
  }


  setColumns(scm_status,option){
    const clmnsTobeRemoved = ['edit','delete'];
    const ClmsTobeAdded = ['nfo_start_dt','nfo_end_dt','nfo_reopen_dt'];
    if(option == '1'){
      this.__columns = scm_status == 'N' ? schemeClmns.COLUMNFORNFODETAILS : schemeClmns.COLUMNFORONGOINGDETAILS;
      this.__exportedClmns = this.__columns.filter((x: any) => !clmnsTobeRemoved.includes(x));
    }
    else{
      this.__columns = schemeClmns.COLUMN_SUMMARY;
      this.__exportedClmns = schemeClmns.COLUMN_SUMMARY.filter((x: any) => !clmnsTobeRemoved.includes(x));
    }
    this.toppingList = scm_status == 'N' ? schemeClmns.COLUMN_SELECTOR :
    (schemeClmns.COLUMN_SELECTOR.filter(x => !ClmsTobeAdded.includes(x.id)));
    this.toppings.setValue(this.__columns);
  }

  getSchemeMst(column_name: string | null  = '',sort_by: string | null = 'asc'){
    const __scmExport = new FormData();
    __scmExport.append('paginate',this.__pageNumber.value);
    __scmExport.append('scheme_type',this.__scmForm.value.scheme_status);
    __scmExport.append('column_name',column_name);
    __scmExport.append('sort_by',sort_by.toUpperCase());
    __scmExport.append('scheme_name',this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : '');
    __scmExport.append('cat_id',this.__scmForm.value.cat_id ? this.__scmForm.value.cat_id : '');
    __scmExport.append('amc_name',this.__scmForm.value.amc_name ? this.__scmForm.value.amc_name : '');
    __scmExport.append('subcat_id',this.__scmForm.value.subcat_id ? this.__scmForm.value.subcat_id : '');
    this.__dbIntr.api_call(1,'/schemeDetailSearch',__scmExport)
    .pipe(
      map((x: any) => x.data)
      ).subscribe(res => {
      this.__paginate =res.links;
      this.setPaginator(res.data);
      this.tableExport(column_name,sort_by);
     })
  }

  populateDT(__scm: scheme){
    this.openDialog(__scm, __scm.id, __scm.scheme_type);
  }
  openDialog(
    __scheme: scheme | null = null,
    __scmId: number,
    __scmType: string
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SC',
      id: __scmId,
      items: __scheme,
      title: __scmId == 0 ? 'Add Scheme' : 'Update Scheme',
      right: global.randomIntFromInterval(1, 60),
      product_id:this.data.product_id ? this.data.product_id : '',
      scheme_type: __scmType,
    };
    dialogConfig.id = __scmId > 0 ? __scmId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ScmModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectScm.data.unshift(dt.data);
            this.__selectScm._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SC',
      });
    }
  }
  updateRow(row_obj: scheme) {
    this.__selectScm.data = this.__selectScm.data.filter(
      (value: scheme, key) => {
        if (value.id == row_obj.id) {
          (value.product_id = row_obj.product_id),
          (value.amc_id = row_obj.amc_id),
          (value.category_id = row_obj.category_id),
          (value.subcategory_id = row_obj.subcategory_id),
          (value.scheme_name = row_obj.scheme_name),
          (value.id = row_obj.id),
          (value.scheme_type = row_obj.scheme_type),
          (value.nfo_start_dt = row_obj.nfo_start_dt),
          (value.nfo_end_dt = row_obj.nfo_end_dt),
          (value.nfo_reopen_dt = row_obj.nfo_reopen_dt),
          (value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt),
          (value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt),
          (value.pip_add_min_amt = row_obj.pip_add_min_amt),
          (value.sip_add_min_amt = row_obj.sip_add_min_amt),
          (value.sip_date = row_obj.sip_date),
          (value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt),
          (value.gstin_no = row_obj.gstin_no);
          (value.stp_date = row_obj.stp_date);
          (value.swp_date = row_obj.swp_date);
          (value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt);
          (value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt);
          (value.ava_special_sip = row_obj.ava_special_sip);
          (value.special_sip_name = row_obj.special_sip_name);

        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter(
      (value: scheme, key) => {
        if (value.id == row_obj.id) {
          (value.product_id = row_obj.product_id),
          (value.amc_id = row_obj.amc_id),
          (value.category_id = row_obj.category_id),
          (value.subcategory_id = row_obj.subcategory_id),
          (value.scheme_name = row_obj.scheme_name),
          (value.id = row_obj.id),
          (value.scheme_type = row_obj.scheme_type),
          (value.nfo_start_dt = row_obj.nfo_start_dt),
          (value.nfo_end_dt = row_obj.nfo_end_dt),
          (value.nfo_reopen_dt = row_obj.nfo_reopen_dt),
          (value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt),
          (value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt),
          (value.pip_add_min_amt = row_obj.pip_add_min_amt),
          (value.sip_add_min_amt = row_obj.sip_add_min_amt),
          (value.sip_date = row_obj.sip_date),
          (value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt),
          (value.gstin_no = row_obj.gstin_no);
          (value.stp_date = row_obj.stp_date);
          (value.swp_date = row_obj.swp_date);
          (value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt);
          (value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt);
          (value.ava_special_sip = row_obj.ava_special_sip);
          (value.special_sip_name = row_obj.special_sip_name);
        }
        return true;
      }
    );
  }
  ngAfterViewInit(){
    this.__scmForm.controls['options'].valueChanges.subscribe(res => {
      this.setColumns(this.__scmForm.get('scheme_status').value,res);
      //  if(res == '1'){
      //        this.__columns = this.__columnsForDetails;
      //        this.toppings.setValue(this.__columns);
      //        this.__exportedClmns = [
      //         'sl_no','scheme_name','scheme_type','amc_name','cat_name','subcate_name','nfo_start_dt','nfo_end_dt',
      //         'nfo_reopen_dt','pip_fresh_min_amt','pip_add_min_amt',
      //        ];
      //  }
      //  else{
      //   this.__columns = this.__columnsForsummary;
      //   this.toppings.setValue(this.__columns);
      //   this.__exportedClmns = ['sl_no','scheme_name','scheme_type'];
      //  }
    })
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit','delete']
      this.__columns = res;
      this.__exportedClmns = res.filter(item => !clm.includes(item))
    });

    this.__scmForm.controls['scheme_status'].valueChanges.subscribe(res =>{
        this.setColumns(res,this.__scmForm.get('options').value);
    })

    this.__scmForm.controls['cat_name'].valueChanges
    .pipe(
      tap(() => this.__iscatspinner = true),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1
          ? this.__dbIntr.searchItems(
            '/category',
            dt)
          : []
      ),
      map((x: responseDT) => x.data),
    )
    .subscribe({
      next: (value) => {
        this.__scmForm.controls['cat_id'].setValue('')
        this.__catMst = value;
        this.searchResultVisibility('block','C')
        this.__iscatspinner = false;
      },
      complete: () => console.log(''),
      error: (err) => console.log(),
    });


    this.__scmForm.controls['subcat_name'].valueChanges
    .pipe(
      tap(() => this.__issubcatspinner = true),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1
          ? this.__dbIntr.searchItems(
            '/subcategory',
            dt)
          : []
      ),
      map((x: responseDT) => x.data),
    )
    .subscribe({
      next: (value) => {
        this.__scmForm.controls['subcat_id'].setValue('');
        this.__subcatMst = value;
        this.searchResultVisibility('block','S')
        this.__issubcatspinner = false;
      },
      complete: () => console.log(''),
      error: (err) => console.log(),
    });
  }

  refreshOrAdvanceFlt(){
    if(this.__scmForm.controls['advanceFlt'].value == 'R'){
        this.__scmForm.patchValue({
          amc_name:'',
          scheme_name:'',
          cat_id:'',
          cat_name:'',
          subcat_name:'',
          subcat_id:'',
          options:'2',
          advanceFlt:'',
          scheme_status:'O'
        })
        this.getSchemeMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
    }

  }
  submit(){this.getSchemeMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);}
  tableExport(column_name: string | null  = '',sort_by: string | null = 'asc'){
    const __scmExport = new FormData();
    __scmExport.append('column_name',column_name);
    __scmExport.append('scheme_type',this.__scmForm.value.scheme_status);
    __scmExport.append('sort_by',sort_by);
    __scmExport.append('scheme_name',this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : '');
    __scmExport.append('cat_id',this.__scmForm.value.cat_id ? this.__scmForm.value.cat_id : '');
    __scmExport.append('amc_name',this.__scmForm.value.amc_name ? this.__scmForm.value.amc_name : '');
    __scmExport.append('subcat_id',this.__scmForm.value.subcat_id ? this.__scmForm.value.subcat_id : '');
    this.__dbIntr.api_call(1,'/schemeExport',__scmExport).pipe(map((x: any) => x.data)).subscribe((res: scheme[]) =>{
       console.log(res);
      this.__export = new MatTableDataSource(res);
    })
  }
  getSchememaster(__paginate: string | null = "10"){
    this.__dbIntr
    .api_call(0, '/scheme', 'paginate=' + __paginate)
    .pipe(map((x: responseDT) => x.data))
    .subscribe((res: any) => {
      console.log(res);

      this.setPaginator(res.data);
      this.__paginate = res.links;
    });
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          + ('&scheme_name='+ this.__scmForm.value.scheme_name)
          + ('&cat_id='+ this.__scmForm.value.cat_id)
          + ('&amc_name='+ this.__scmForm.value.amc_name)
          + ('&subcat_id='+ this.__scmForm.value.subcat_id)
          + ('&column_name='+ this.__sortAscOrDsc.active)
          + ('&sort_by='+ this.__sortAscOrDsc.direction)
          + ('&scheme_type=' + this.__scmForm.value.scheme_status)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.submit();
  }
  setPaginator(__res){
    this.__selectScm = new MatTableDataSource(__res);
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

  exportPdf(){
    this.__Rpt.downloadReport('#scheme',
    {
      title: 'Scheme '
    }, 'Scheme')
  }


  outsideClick(__ev,mode){
    if(__ev){
      this.searchResultVisibility('none',mode)
   }
  }
  getItems(__items,__type){
    console.log(__type);

    switch(__type){
     case 'S': this.__scmForm.controls['subcat_id'].setValue(__items.id)
                this.__scmForm.controls['subcat_name'].reset(__items.subcategory_name,{ onlySelf: true,emitEvent: false})
                this.searchResultVisibility('none','S');
                break;
     case 'C':   this.__scmForm.controls['cat_id'].setValue(__items.id)
                 this.__scmForm.controls['cat_name'].reset(__items.cat_name,{ onlySelf: true,emitEvent: false})
                 this.searchResultVisibility('none','C');
                 break;
     default: break;
    }
  }
  searchResultVisibility(display_mode,__type){
    console.log(__type);
    console.log(display_mode);


    switch(__type){
      case 'S' : this.searchsubcat.nativeElement.style.display = display_mode;break;
      case 'C' :this.__searchCat.nativeElement.style.display = display_mode;break;
    }

  }
  sortData(sort){
    this.__sortAscOrDsc = sort;
    this.getSchemeMst(sort.active,sort.direction);
  }
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'S',
        id: __el.id,
        title: 'Delete '  + __el.scheme_name,
        api_name:'/schemeDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selectScm.data.splice(index,1);
            this.__selectScm._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
  }

 convertSIPDates(__sipDt){
  //  return JSON.parse(__sipDt);
 }
}
