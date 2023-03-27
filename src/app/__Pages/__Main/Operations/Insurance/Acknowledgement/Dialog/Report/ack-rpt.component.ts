import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { pipe } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { insTraxClm } from 'src/app/__Utility/InsuranceColumns/insTrax';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import modeOfPremium from '../../../../../../../../assets/json/Master/modeofPremium.json';
import { AckEntryComponent } from '../Entry/ack-entry/ack-entry.component';
@Component({
  selector: 'app-ack-rpt',
  templateUrl: './ack-rpt.component.html',
  styleUrls: ['./ack-rpt.component.css']
})
export class AckRPTComponent implements OnInit {
  divToPrint: any;
  WindowObject: any;
  __mode_of_premium = modeOfPremium;
  __columns: string [] = [];
  __insTrax = new MatTableDataSource<any>([]);
  __exportTrax= new MatTableDataSource<any>([]);

  __exportedClmns: string[]
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  __pageNumber = new FormControl(10);
  __paginate: any= [];
  __insType: any= [];
  __bu_type = buType;
  __isVisible: boolean = true;
  __insTraxMst = new MatTableDataSource<any>([]);
  __insTraxForm  = new FormGroup({
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    ins_type_id: new FormControl(''),
    insured_bu_type: new FormControl(''),
    brn_cd: new FormControl(''),
    proposer_code: new FormControl(''),
    euin_no: new FormControl(''),
    bu_type: new FormArray([]),
  })
  toppings = new FormControl();
  toppingList = insTraxClm.COLUMN_SELECTOR.filter((x: any) => x.id != 'delete')
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<AckRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) { }


  setColumns(options){
    const actions = ['edit','delete'];
    const actionsToRemoveFromMainTable = ['delete'];
    if(options == '1'){
       this.__columns = insTraxClm.COLUMNFORDETAILS.filter((x: any) => !actionsToRemoveFromMainTable.includes(x));
    }
    else if(options == '2'){
       this.__columns = insTraxClm.INITIAL_COLUMNS.filter((x: any) => !actionsToRemoveFromMainTable.includes(x));;
    }
    this.toppings.setValue(this.__columns );
    this.__exportedClmns = this.__columns.filter((x: any) => !actions.includes(x));
  }

  ngOnInit(): void {
    this.getInsuranceType();
    this.getInsMstRPT();
    this.setColumns(this.__insTraxForm.value.options);
  }
  getInsMstRPT(column_name: string | null | undefined = '',sort_by: string | null | undefined = 'asc'){
    const __fd = new FormData();
    __fd.append('bu_type',JSON.stringify(this.__insTraxForm.value.bu_type));
    __fd.append('column_name',column_name ? column_name : '');
    __fd.append('sort_by',sort_by ? sort_by : 'asc');
    __fd.append('paginate',this.__pageNumber.value);
    __fd.append('option',global.getActualVal(this.__insTraxForm.value.options));
      __fd.append('sub_brk_cd',global.getActualVal(this.__insTraxForm.value.sub_brk_cd));
      __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
      __fd.append('ins_type_id',global.getActualVal(this.__insTraxForm.value.ins_type_id));
      __fd.append('insured_bu_type',global.getActualVal(this.__insTraxForm.value.insured_bu_type));
      __fd.append('proposer_name',global.getActualVal(this.__insTraxForm.value.proposer_code));
      __fd.append('euin_no',global.getActualVal(this.__insTraxForm.value.euin_no));
    this.__dbIntr.api_call(1,'/ins/ackDetailSearch',__fd).pipe(pluck("data")).subscribe((res: any) =>{
            this.__insTrax = new MatTableDataSource(res.data);
            this.__paginate =res.links;
            this.tableExport(__fd);
    })
  }
  tableExport(formData: FormData){
    formData.delete('paginate');
    this.__dbIntr.api_call(1,'/ins/ackExport',formData).pipe(pluck("data")).subscribe((res: any) =>{
      this.__exportTrax = new MatTableDataSource(res);
})
  }
  getInsuranceType(){
   this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
    this.__insType = res;
   })
  }
  ngAfterViewInit(){
    this.__insTraxForm.controls['options'].valueChanges.subscribe(res =>{
      if(res != '3'){
        this.setColumns(res);
      }
    })
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit','delete']
      this.__columns = res;
      this.__exportedClmns = res.filter(item => !clm.includes(item))
    });
  }
  searchInsurance(){
    this.getInsMstRPT(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
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
      this.__pageNumber = __paginate.toString();
      this.searchInsurance();
    }
    getPaginate(__paginate: any | null = null) {
      if (__paginate) {
        this.__dbIntr
          .getpaginationData(
            __paginate.url +
              ('&paginate=' + this.__pageNumber)
              + ('&option=' + this.__insTraxForm.value.options)
              + ('&ins_type_id=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.ins_type_id))
              + ('&column_name=' +  this.__sortAscOrDsc.active ? this.__sortAscOrDsc.active : '')
              + ('&sort_by=' +  this.__sortAscOrDsc.direction ? this.__sortAscOrDsc.direction : 'asc')
              + ('&tin_no='+ this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.tin_no))
              + ('&euin_no=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.euin_no))
              + ('&bu_type' + this.__insTraxForm.value.options == '3' ? "[]" : (this.__insTraxForm.value.bu_type.length > 0 ? JSON.stringify(this.__insTraxForm.value.bu_type): ''))
              +('&proposer_name=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.proposer_code))
              + ('&insured_bu_type=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.insured_bu_type))
              )
          .pipe(map((x: any) => x.data))
          .subscribe((res: any) => {
            // this.setPaginator(res);
            this.__insTrax = new MatTableDataSource(res);
          });
      } else {
        this.__dbIntr
          .api_call(0, '/mfTraxShow', 'paginate=' + this.__pageNumber)
          .pipe(map((x: any) => x.data))
          .subscribe((res: any) => {
            // this.setPaginator(res);
          });
      }
    }
    onbuTypeChange(e: any) {
      const bu_type: FormArray = this.__insTraxForm.get('bu_type') as FormArray;
      if (e.target.checked) {
        bu_type.push(new FormControl(e.target.value));
      } else {
        let i: number = 0;
        bu_type.controls.forEach((item: any) => {
          if (item.value == e.target.value) {
            bu_type.removeAt(i);
            return;
          }
          i++;
        });
      }
    }
    sortData(__ev){
      this.__sortAscOrDsc = __ev;
      this.searchInsurance();
    }
    getModeOfPremium(premium){
      return premium ? this.__mode_of_premium.filter((x: any) => x.id = premium)[0].name : '';
    }
    populateDT(__items){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '50%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.data = {
        flag: 'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
        isViewMode: __items.form_status == 'P' ? false : true,
        tin: __items.tin_no,
        tin_no: __items.tin_no,
        title: 'Upload Acknowledgement',
        right: global.randomIntFromInterval(1, 60),
        data:__items
      };
      dialogConfig.id = 'ACKUPLNONFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0');
      try {
        const dialogref = this.__dialog.open(
          AckEntryComponent,
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
          flag: 'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
        });
      }
    }
    exportPdf(){
      if(this.__insTraxForm.get('options').value == '3'){
       this.__Rpt.printRPT('InsRPT')
      }
      else{
        this.__Rpt.downloadReport(
          '#InsRPT',
          {
            title: 'Insurance Report',
          },
          'Insurance Report  '
        );
      }

    }
    refresh(){
      this.__insTraxForm.reset({emitEvent:false});
      this.__insTraxForm.patchValue({
        options:'2',
        start_date:this.getTodayDate(),
        end_date:this.getTodayDate(),
        ins_type_id:'',
        insured_bu_type:'',
      })
      this.__sortAscOrDsc= {active:'',direction:'asc'};
      this.searchInsurance();

    }
    updateRow(row_obj){
      console.log(row_obj);

      this.__insTrax.data = this.__insTrax.data.filter((value: any, key) => {
        if (value.tin_no == row_obj.tin_no) {
         value.comp_login_cutt_off = row_obj.comp_login_cutt_off,
         value.comp_login_dt = row_obj.comp_login_dt,
         value.comp_login_time = row_obj.comp_login_dt?.split(' ')[1],
         value.ack_copy_scan = `${row_obj.ack_copy_scan}`,
         value.form_status = row_obj.form_status,
         value.ack_remarks = row_obj.ack_remarks
        }
        return true;
      });
     }
}
