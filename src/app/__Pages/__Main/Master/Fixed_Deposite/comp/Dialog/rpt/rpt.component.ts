import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { fdComp } from 'src/app/__Model/fdCmp';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fdcmpMstClm } from 'src/app/__Utility/fdColumns/company';
import { global } from 'src/app/__Utility/globalFunc';
import { CrudComponent } from '../crud/crud.component';

@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RptComponent implements OnInit {
  settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Company');
  cmp_typesettings = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type');

  __companyMst : fdComp[] = [];
  __cmpTypeMst: any=[];
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  toppings = new FormControl();
  toppingList: any = fdcmpMstClm.COLUMN_SELECTOR;

  __levels = fdcmpMstClm.LEVELS;
  __isrntspinner: boolean = false;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __export = new MatTableDataSource<fdComp>([]);
  __exportedClmns: string[] = []
  __isVisible: boolean = true;
  __rntSearchForm = new FormGroup({
    comp_type: new FormControl([]),
    options: new FormControl('2'),
    comp_name: new FormControl(''),
    contact_person: new FormControl(''),
    levels: new FormArray(this.__levels.map(x => new FormControl(false)))
  });
  __selectRNT = new MatTableDataSource<fdComp>([]);
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.setColumns(fdcmpMstClm.INITIAL_COLUMNS);
    this.getRntMst();
    this.getComponyMst();
    this.getCompanyTypeMst();
  }
  getCompanyTypeMst(){
    this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe(res =>{
      this.__cmpTypeMst = res;
    })
  }
  setColumns(clms){
    const __columnToRemove =  ['edit','delete'];
    this.__columns = clms;
    this.__exportedClmns = this.__columns.filter(x => !__columnToRemove.includes(x));
    this.toppings.setValue(this.__columns);
  }
  getComponyMst(){
    this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe((res: fdComp[]) =>{
      console.log(res);

      this.__companyMst = res;
   })
  }
  ngAfterViewInit() {

    this.__rntSearchForm.controls.levels.valueChanges.subscribe(res =>{
      this.__rntSearchForm.controls.levels.setValue(
      this.__rntSearchForm.controls.levels.value.map((value, i) => value ? this.__levels[i].name : false),
      { emitEvent: false }
      )
    })


    this.__rntSearchForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res == '2' ? fdcmpMstClm.INITIAL_COLUMNS : fdcmpMstClm.COLUMNFORDETAILS);
    });

    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit', 'delete'];
      this.__columns = res;
      this.__exportedClmns = res.filter((item) => !clm.includes(item));
    });
  }


  private setPaginator(__res) {
    this.__selectRNT = new MatTableDataSource(__res);
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getRntMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          +  ('&comp_name = ' + this.__rntSearchForm.value.comp_name ? JSON.stringify(this.__rntSearchForm.value.comp_name) : '')
          +  ('&contact_person=' + this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person : '')
          +  ('&column_name=' + this.__sortAscOrDsc.active ? this.__sortAscOrDsc.active : '')
          +  ('&sort_by=' + this.__sortAscOrDsc.direction ? this.__sortAscOrDsc.direction : 'asc')
          +  ('&comp_type=' + JSON.stringify(this.__rntSearchForm.value.comp_type))
          )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  private updateRow(row_obj: fdComp) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: fdComp, key) => {
      if (value.id == row_obj.id) {
        value.comp_type_id = row_obj.comp_type_id;
        value.comp_type = row_obj.comp_type;
        value.comp_short_name = row_obj.comp_short_name;
        value.comp_full_name = row_obj.comp_full_name;
        value.login_url = row_obj.login_url;
        value.login_pass = row_obj.login_pass;
        value.login_id = row_obj.login_id;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;
        value.id = row_obj.id;
        value.head_ofc_contact_per = row_obj.head_ofc_contact_per;
        value.head_contact_per_mob = row_obj.head_contact_per_mob;
        value.head_contact_per_email = row_obj.head_contact_per_email;
        value.head_ofc_addr = row_obj.head_ofc_addr;
        value.local_ofc_contact_per = row_obj.local_ofc_contact_per;
        value.local_contact_per_mob = row_obj.local_contact_per_mob;
        value.local_contact_per_email = row_obj.local_contact_per_email;
        value.local_ofc_addr = row_obj.local_ofc_addr;
        value.security_qus_ans = row_obj.security_qus_ans;
        value.gstin = row_obj.gstin;
        value.cus_care_whatsapp_no = row_obj.cus_care_whatsapp_no;
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
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: fdComp, key) => {
      if (value.id == row_obj.id) {
        value.comp_type_id = row_obj.comp_type_id;
        value.comp_type = row_obj.comp_type;
        value.comp_full_name = row_obj.comp_full_name;
        value.comp_short_name = row_obj.comp_short_name;
        value.login_url = row_obj.login_url;
        value.login_pass = row_obj.login_pass;
        value.login_id = row_obj.login_id;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;
        value.id = row_obj.id;
        value.head_ofc_contact_per = row_obj.head_ofc_contact_per;
        value.head_contact_per_mob = row_obj.head_contact_per_mob;
        value.head_contact_per_email = row_obj.head_contact_per_email;
        value.head_ofc_addr = row_obj.head_ofc_addr;
        value.local_ofc_contact_per = row_obj.local_ofc_contact_per;
        value.local_contact_per_mob = row_obj.local_contact_per_mob;
        value.local_contact_per_email = row_obj.local_contact_per_email;
        value.local_ofc_addr = row_obj.local_ofc_addr;
        value.security_qus_ans = row_obj.security_qus_ans;
        value.gstin = row_obj.gstin;
        value.cus_care_whatsapp_no = row_obj.cus_care_whatsapp_no;
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
      }
      return true;
    });
    // console.log( this.__export.data);

  }
  submit() {
    this.getRntMst();
    this.getColumnsAfterSubmit();
  }
  getColumnsAfterSubmit(){
    let clmns = this.__rntSearchForm.value.options == '2' ? fdcmpMstClm.INITIAL_COLUMNS : fdcmpMstClm.MODIFIEDCLM;
    var clmsforlevel;
    const checkboxControl = (this.__rntSearchForm.controls.levels as FormArray);
    const formValue = {
      levels: checkboxControl.value.filter(value => !!value)
    };
    if(formValue.levels.length > 0){
      formValue.levels.forEach(__el =>{

        switch(__el.toString()){
          case '1': clmsforlevel = fdcmpMstClm.l1;
                    clmns = [...clmns,...clmsforlevel];
                    break;
          case '2': clmsforlevel = fdcmpMstClm.l2;
                    clmns = [...clmns,...clmsforlevel];
                    break;
          case '3': clmsforlevel = fdcmpMstClm.l3;
                    clmns = [...clmns,...clmsforlevel];
                    break;
          case '4': clmsforlevel = fdcmpMstClm.l4;
                    clmns = [...clmns,...clmsforlevel];
                    break;
          case '5': clmsforlevel = fdcmpMstClm.l5;
                    clmns = [...clmns,...clmsforlevel];
                    break;
          case '6': clmsforlevel = fdcmpMstClm.l6;
                    clmns = [...clmns,...clmsforlevel];
                    break;
        }
      })
      this.setColumns(clmns);
    }

  }


  getRntMst(column_name: string | null = null, sort_by: string | null = null) {
    const __amcSearch = new FormData();
    __amcSearch.append(
      'comp_name',
      this.__rntSearchForm.value.comp_name ? JSON.stringify(this.__rntSearchForm.value.comp_name) : ''
    );
    __amcSearch.append(
      'contact_person',
      this.__rntSearchForm.value.contact_person
        ? this.__rntSearchForm.value.contact_person
        : ''
    );
    __amcSearch.append('paginate', this.__pageNumber.value);
    __amcSearch.append('column_name', (column_name ? column_name : ''));
    __amcSearch.append('sort_by', (sort_by ? sort_by : 'asc'));
    __amcSearch.append('comp_type', JSON.stringify(this.__rntSearchForm.value.comp_type));


    this.__dbIntr
      .api_call(1, '/fd/companyDetailSearch', __amcSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__amcSearch);
      });
  }

  tableExport(
    __amcExport: FormData
  ) {
    __amcExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/fd/companyExport', __amcExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: fdComp[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  exportPdf() {
    this.__Rpt.downloadReport(
      '#comp_rpt',
      {
        title: 'Company',
      },
      'Company'
    );
  }
  populateDT(__items: fdComp) {
    this.openDialog(__items, __items.id);
  }

  openDialog(__cmp: fdComp | null = null, __id: number) {
    console.log(__cmp);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'CMP',
      id: __id,
      cmp: __cmp,
      title: __id == 0 ? 'Add Company' : 'Update Company',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CrudComponent,
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
        flag: 'R',
      });
    }
  }
  private addRow(row_obj: fdComp) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
    this.__export.data.unshift(row_obj);
    this.__export._updateChangeSubscription();
  }
  reset() {
    this.__rntSearchForm.patchValue({
      options: '2',
      comp_name: [],
      comp_type: [],
      contact_person: '',
    });
    (<FormArray>this.__rntSearchForm.get('levels')).setValue(
    this.__levels.map(x => false)
    )
    this.getRntMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);

  }

  sortData(sort: any) {
    console.log(sort);

    this.__sortAscOrDsc  = sort;
    this.getRntMst(sort.active, sort.direction == '' ? 'asc' : sort.direction);
  }
  delete(__el,index){
    // console.log(__el);
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = {
    //   flag: 'CMP',
    //   id: __el.id,
    //   title: 'Delete '  + __el.comp_short_name,
    //   api_name:'/ins/companyDelete'
    // };
    // const dialogref = this.__dialog.open(
    //   DeletemstComponent,
    //   dialogConfig
    // );
    // dialogref.afterClosed().subscribe((dt) => {
    //   if(dt){
    //     if(dt.suc == 1){
    //       this.__selectRNT.data.splice(index,1);
    //       this.__selectRNT._updateChangeSubscription();
    //       this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
    //       this.__export._updateChangeSubscription();
    //     }
    //   }

    // })
  }
  onInsTypeChange(e){
    console.log(e.source.value);

    const ins_type: FormArray = this.__rntSearchForm.get('ins_type') as FormArray;
    if (e.checked) {
      ins_type.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      ins_type.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          ins_type.removeAt(i);
          return;
        }
        i++;
      });
    }
    }
    openProduct(__el){
      // this.dialogRef.close();
      // this.__utility.navigatewithqueryparams('/main/master/insurance/product',{queryParams:{product_id:btoa(this.data.product_id),comp_id:btoa(__el.id)}});
    }


}
