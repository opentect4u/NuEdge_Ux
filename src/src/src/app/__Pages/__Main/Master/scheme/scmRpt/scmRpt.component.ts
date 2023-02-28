import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmModificationComponent } from '../scmModification/scmModification.component';

@Component({
  selector: 'app-scmRpt',
  templateUrl: './scmRpt.component.html',
  styleUrls: ['./scmRpt.component.css']
})
export class ScmRptComponent implements OnInit {
  __scmForm = new FormGroup({
    amc_name: new FormControl(''),
    scheme_name: new FormControl(''),
    cat_id: new FormControl(''),
    subcat_id: new FormControl(''),
    options: new FormControl('2'),
    advanceFlt: new FormControl('')
  })
  __isVisible: boolean =false;
  __paginate: any=[];
  __pageNumber= new FormControl(10);
  __selectScm = new MatTableDataSource<scheme>([]);
  __exportedClmns: string [] = ['sl_no','scheme_name','scheme_type']
  __columns: string[] = []

  __columnsForsummary: string[] = [
    'edit','sl_no','scheme_name','scheme_type','delete'];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'scheme_name',
    'scheme_type',
    'amc_name',
    'cat_name',
    'subcat_name',
    'nfo_start_dt',
    'nfo_end_dt',
    'nfo_reopen_dt',
    'pip_fresh_min_amt',
    'pip_add_min_amt',
    'sip_fresh_min_amt',
    'sip_add_min_amt',
    'delete'
    ];
  __export = new MatTableDataSource<scheme>([]);
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
    this.__columns = this.__columnsForsummary;
    this.getSchememaster();
    this.tableExport();
  }
  populateDT(__scm: scheme){
    console.log(__scm);

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
            (value.gstin_no = row_obj.gstin_no);
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
            (value.gstin_no = row_obj.gstin_no);
        }
        return true;
      }
    );
  }
  ngAfterViewInit(){
    this.__scmForm.controls['options'].valueChanges.subscribe(res => {
       if(res == '1'){
             this.__columns = this.__columnsForDetails;
             this.__exportedClmns = [
              'sl_no','scheme_name','scheme_type','amc_name','cat_name','subcat_name','nfo_start_dt','nfo_end_dt',
              'nfo_reopen_dt','pip_fresh_min_amt','pip_add_min_amt','sip_fresh_min_amt','sip_add_min_amt'
             ];
       }
       else{
        this.__columns = this.__columnsForsummary;
        this.__exportedClmns = ['sl_no','scheme_name','scheme_type'];

       }
    })
  }

  refreshOrAdvanceFlt(){
    if(this.__scmForm.controls['advanceFlt'].value == 'R'){
         this.getSchememaster();
        this.tableExport();
        this.__scmForm.reset();
        this.__scmForm.get('options').setValue('2');
    }

  }
  submit(){
    const __scmExport = new FormData();
    __scmExport.append('scheme_name',this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : '');
    __scmExport.append('cat_id',this.__scmForm.value.cat_id ? this.__scmForm.value.cat_id : '');
    __scmExport.append('scheme_name',this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : '');
    __scmExport.append('subcat_id',this.__scmForm.value.subcat_id ? this.__scmForm.value.subcat_id : '');
    this.__dbIntr.api_call(1,'/schemeDetailSearch',__scmExport).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__paginate =res.links;
      this.setPaginator(res.data);
      //  this.showColumns();
      //  this.tableExport();
      this.__export = new MatTableDataSource(res.data);
     })
  }
  tableExport(){
    const __scmExport = new FormData();
    __scmExport.append('scheme_name',this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : '');
    __scmExport.append('cat_id',this.__scmForm.value.cat_id ? this.__scmForm.value.cat_id : '');
    __scmExport.append('scheme_name',this.__scmForm.value.scheme_name ? this.__scmForm.value.scheme_name : '');
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
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
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
    this.getSchememaster(this.__pageNumber.value);
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

}
