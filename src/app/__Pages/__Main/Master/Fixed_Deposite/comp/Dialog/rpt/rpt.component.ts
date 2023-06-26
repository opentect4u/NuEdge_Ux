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
import { compClmns } from 'src/app/__Utility/Master/FixedDepositClmn';
import { column } from 'src/app/__Model/tblClmns';
import ItemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
// import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RptComponent implements OnInit {
  selectBtn:selectBtn[] = [{ label: 'Reset', value: 'R',icon:'pi pi-refresh' }]

  isOpenMegaMenu:boolean = false;
  settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Company');
  cmp_typesettings = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type');
  itemsPerPage = ItemsPerPage;
  sort = new sort();
  __companyMst : fdComp[] = [];
  __cmpTypeMst: any=[];
  ClmnList:column[] = compClmns.Column_Selector;
  __columns: column[] = [];
  __exportedClmns: string[] = []
  SelectedClms:string[] =[];

  // __columns
  __levels = fdcmpMstClm.LEVELS;
  __isrntspinner: boolean = false;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  // __columns: string[] = [];
  __export = new MatTableDataSource<fdComp>([]);
  __isVisible: boolean = true;
  __rntSearchForm = new FormGroup({
    comp_type: new FormControl([]),
    options: new FormControl('2'),
    comp_name: new FormControl(''),
    contact_person: new FormControl(''),
    levels: new FormArray([])
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
    this.setColumns(2);
    this.getRntMst();
    this.getComponyMst();
    this.getCompanyTypeMst();
    this.addLevelsCheckBox(compClmns.LEVELS);
  }
  addLevelsCheckBox(levels){
    levels.forEach(el =>{
      this.levels.push(this.setFormControl(el))
    })
  }
  get levels(): FormArray{
    return this.__rntSearchForm.get('levels') as FormArray
  }

  setFormControl(level){
    return new FormGroup({
        isChecked: new FormControl(false),
        id: new FormControl(level? level.id : 0),
        name: new FormControl(level? level.value : ''),
        sub_menu:new FormControl(level? level.submenu : '')
    })
  }

  getCompanyTypeMst(){
    this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe(res =>{
      this.__cmpTypeMst = res;
    })
  }
  setColumns(res){
    const __columnToRemove =  ['edit','delete'];
  this.__columns = [];
    this.__columns = Number(res) == 2 ? compClmns.Summary  : compClmns.Column_Selector;
      this.SelectedClms = this.__columns.map((x) => x.field);
    this.__exportedClmns = this.__columns.map(res => {return res['field']}).filter(item => !__columnToRemove.includes(item));
  }
  getComponyMst(){
    this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe((res: fdComp[]) =>{
      this.__companyMst = res;
   })
  }
  ngAfterViewInit() {
    this.__rntSearchForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res);
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
    this.getRntMst();
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          +  ('&comp_name = ' + this.__rntSearchForm.value.comp_name ? JSON.stringify(this.__rntSearchForm.value.comp_name) : '')
          +  ('&contact_person=' + this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person : '')
          +('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
          +('&order='+ (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
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
  }

  getRntMst() {
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
    __amcSearch.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __amcSearch.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __amcSearch.append('comp_type', JSON.stringify(this.__rntSearchForm.value.comp_type));


    this.__dbIntr
      .api_call(1, '/fd/companyDetailSearch', __amcSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__amcSearch);
      });
    this.setColumnsAfterSubmit()

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
    this.sort= new sort;
     this.levels.controls.map(el => el.get('isChecked').setValue(false));
    this.__pageNumber.setValue(10);
    this.getRntMst();
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

    customSort(ev){
     this.sort.order=ev.sortOrder;
     this.sort.field=ev.sortField;
     if(ev.sortField){
      this.getRntMst();
     }

    }
    onselectItem(ev){
      this.__pageNumber.setValue(ev.option.value);
      this.getRntMst();
    }
    getSelectedColumns(column){
      const clm = ['edit', 'delete'];
      this.__columns = column.map(({ field, header }) => ({field, header}));
      this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
    }
    setColumnsAfterSubmit(){

        const clm = ['edit', 'delete'];
        //do operation with columns
        this.levels.value.forEach(el => {
                 el.sub_menu.forEach(element => {
                          if(el.isChecked){
                            if(this.__columns.findIndex(x => x.field == element.field) == -1){
                              this.__columns.push(element);
                            }
                          }
                          else{
                            if(this.__columns.findIndex(x => x.field == element.field) != -1){
                              this.__columns.splice(this.__columns.findIndex(x => x.field == element.field),1);
                            }
                          }

                 });
        });
        this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
        this.SelectedClms = this.__columns.map((x) => x.field);

    }
    onItemClick(ev){
      this.reset();
    }
    openURL(URL){
      window.open(URL,'_blank')
    }
}
