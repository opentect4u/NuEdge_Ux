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
import { TraxEntryComponent } from '../trax-entry/trax-entry.component';
@Component({
  selector: 'app-ins-trax-rpt',
  templateUrl: './ins-trax-rpt.component.html',
  styleUrls: ['./ins-trax-rpt.component.css']
})
export class InsTraxRPTComponent implements OnInit {
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
  __isVisible: boolean = false;
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
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N')

  })
  toppings = new FormControl();
  toppingList = insTraxClm.COLUMN_SELECTOR;
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<InsTraxRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) { }


  setColumns(options){
    const actions = ['edit','delete'];
    if(options == '1'){
       this.__columns = insTraxClm.COLUMNFORDETAILS;
    }
    else if(options == '2'){
       this.__columns = insTraxClm.INITIAL_COLUMNS;
    }
    this.toppings.setValue(this.__columns );
    this.__exportedClmns = this.__columns.filter((x: any) => !actions.includes(x));
    console.log(this.__exportedClmns);
    console.log(this.__columns);
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
    __fd.append('sort_by',sort_by ? sort_by : '');
    __fd.append('paginate',this.__pageNumber.value);
    __fd.append('option',global.getActualVal(this.__insTraxForm.value.options));
    if(this.__insTraxForm.value.options == '3'){
      __fd.append('login_status',global.getActualVal(this.__insTraxForm.value.options));
      __fd.append('date_status',global.getActualVal(this.__insTraxForm.value.date_status));
      __fd.append('start_date',global.getActualVal(this.__insTraxForm.value.start_date));
      __fd.append('end_date',global.getActualVal(this.__insTraxForm.value.end_date));
    }
    else{
      __fd.append('sub_brk_cd',global.getActualVal(this.__insTraxForm.value.sub_brk_cd));
      __fd.append('tin_no',global.getActualVal(this.__insTraxForm.value.tin_no));
      __fd.append('ins_type_id',global.getActualVal(this.__insTraxForm.value.ins_type_id));
      __fd.append('insured_bu_type',global.getActualVal(this.__insTraxForm.value.insured_bu_type));
      __fd.append('proposer_name',global.getActualVal(this.__insTraxForm.value.proposer_code));
      __fd.append('euin_no',global.getActualVal(this.__insTraxForm.value.euin_no));
    }
    this.__dbIntr.api_call(1,'/ins/insTraxDetailSearch',__fd).pipe(pluck("data")).subscribe((res: any) =>{
            this.__insTrax = new MatTableDataSource(res.data);
            this.__paginate =res.links;
            this.tableExport(__fd);
    })
  }
  tableExport(formData: FormData){
    formData.delete('paginate');
    this.__dbIntr.api_call(1,'/ins/insTraxExport',formData).pipe(pluck("data")).subscribe((res: any) =>{
      this.__exportTrax = new MatTableDataSource(res);
})
  }
  getInsuranceType(){
   this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
    this.__insType = res;
   })
  }
  ngAfterViewInit(){
    this.__insTraxForm.controls['date_status'].valueChanges.subscribe(res =>{
      this.__insTraxForm.controls['start_date'].setValue(res == 'T' ? this.getTodayDate() : "");
      this.__insTraxForm.controls['end_date'].setValue(res == 'T' ? this.getTodayDate() : "");
    })
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
              + ('&sort_by=' +  this.__sortAscOrDsc.direction ? this.__sortAscOrDsc.direction : '')
              + ('&tin_no='+ this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.tin_no))
              + ('&euin_no=' + this.__insTraxForm.value.options == '3' ? '' : global.getActualVal(this.__insTraxForm.value.euin_no))
              + ('&bu_type' + this.__insTraxForm.value.options == '3' ? "[]" : (this.__insTraxForm.value.bu_type.length > 0 ? JSON.stringify(this.__insTraxForm.value.bu_type): ''))
              +('&date_status=' + this.__insTraxForm.value.options == '3' ? global.getActualVal(this.__insTraxForm.value.date_status) : '')
              +('&start_date=' + this.__insTraxForm.value.options == '3' ? global.getActualVal(this.__insTraxForm.value.start_date) : '')
              +('&end_date=' + this.__insTraxForm.value.options == '3' ? global.getActualVal(this.__insTraxForm.value.end_date) : '')
              +('&login_status=' + this.__insTraxForm.value.options == '3' ? global.getActualVal(this.__insTraxForm.value.login_status) : '')
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
    populateDT(__el){
      console.log(__el);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.width = '80%';
      dialogConfig.id = __el.tin_no;
      console.log(dialogConfig.id);
      dialogConfig.hasBackdrop = false;
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      try{
        dialogConfig.data = {
        flag:'INSTRAX_'+ __el.tin_no,
        id: 0,
        title: 'Insurance Trax',
        right:global.randomIntFromInterval(1,60),
        tin_no: __el.tin_no ? __el.tin_no : '',
        data:__el
      };
      console.log(dialogConfig.data);
      const   dialogref = this.__dialog.open(TraxEntryComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {});
      }
      catch(ex){
        console.log(ex);
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.updateSize("80%");
        this.__utility.getmenuIconVisible({
          id:Number(dialogConfig.id),
          isVisible:false,
          flag:'INSTRAX_'+ __el.tin_no})
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
        date_status:'T',
        login_status:'N'
      })
      this.__sortAscOrDsc= {active:'',direction:'asc'};
      this.searchInsurance();

    }
}
