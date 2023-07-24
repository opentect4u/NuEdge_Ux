import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit,Inject, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { insComp } from 'src/app/__Model/insComp';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { cmpMstClm } from 'src/app/__Utility/InsuranceColumns/compMst';
import { CmpCrudComponent } from '../cmp-crud/cmp-crud.component';
import { compClmns } from 'src/app/__Utility/Master/isnClmns';
import { column } from 'src/app/__Model/tblClmns';
import ItemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-cmp-rpt',
  templateUrl: './cmp-rpt.component.html',
  styleUrls: ['./cmp-rpt.component.css']
})
export class CmpRPTComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  itemsPerPage = ItemsPerPage;
  sort = new sort();
  selectBtn:selectBtn[] = [{ label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  settings_ins = this.__utility.settingsfroMultiselectDropdown('id','type','Search Type Of Insurance',1);
  settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Company',2);
  settings_for_Levels = this.__utility.settingsfroMultiselectDropdown('id','value','Search Levels',2);

  __companyMst : insComp[] = [];
  __levels = compClmns.LEVELS;
  __isrntspinner: boolean = false;
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  ClmnList:column[] = compClmns.Column_Selector;
  __columns: column[] = [];
  __exportedClmns: string[] = []
  SelectedClms:string[] =[];
  __insType:any=[];
  __export = new MatTableDataSource<insComp>([]);
  __isVisible: boolean = true;
  __rntSearchForm = new FormGroup({
    btnType: new FormControl('R'),
    ins_type: new FormControl([],{updateOn:'blur'}),
    options: new FormControl('2'),
    comp_name: new FormControl([]),
    contact_person: new FormControl(''),
    is_all: new FormControl(false),
    // levels: new FormArray([]),
    level:new FormControl([])
  });
  __selectRNT = new MatTableDataSource<insComp>([]);
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<CmpRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.setColumns(2);
    this.getRntMst();
    this.getInstTypeMSt();
    // this.addLevelsCheckBox(compClmns.LEVELS);
  }
  // addLevelsCheckBox(levels){
  //   levels.forEach(el =>{
  //     this.levels.push(this.setFormControl(el))
  //   })
  // }
  // get levels(): FormArray{
  //   return this.__rntSearchForm.get('levels') as FormArray
  // }
  setFormControl(level){
    return new FormGroup({
        isChecked: new FormControl(false),
        id: new FormControl(level? level.id : 0),
        name: new FormControl(level? level.value : ''),
        sub_menu:new FormControl(level? level.submenu : '')
    })
  }
  setColumns(res){
      const __columnToRemove =  ['edit','delete'];
      this.__columns = Number(res) == 2 ? compClmns.Summary  : compClmns.Column_Selector;
        this.SelectedClms = this.__columns.map((x) => x.field);
      this.__exportedClmns = this.__columns.map(res => {return res['field']}).filter(item => !__columnToRemove.includes(item));
  }
  getComponyMst(arr_ins_type_id){
    if(arr_ins_type_id.length > 0){
    this.__dbIntr.api_call(0,'/ins/company','arr_ins_type_id=' +JSON.stringify(arr_ins_type_id.map(item => item.id)))
    .pipe(pluck("data")).subscribe((res: insComp[]) =>{
      this.__companyMst = res;
   })
  }
  else{
    this.__companyMst.length =0;
     this.__rntSearchForm.controls['comp_name'].setValue([]);
  }
  }
  getInstTypeMSt(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe((res: any) =>{
      console.log(res);

      this.__insType = res;
   })
  }

  ngAfterViewInit() {
    this.__rntSearchForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res);
    });
    this.__rntSearchForm.controls['ins_type'].valueChanges.subscribe((res) => {
      this.getComponyMst(res);
    })

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
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          +  ('&comp_name=' + (JSON.stringify(this.__rntSearchForm.value.comp_name.map(item => item.id))))
          +  ('&contact_person=' + (this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person : ''))
          +  ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
          +  ('&order='+ (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
          +  ('&ins_type_id=' + (JSON.stringify(this.__rntSearchForm.value.ins_type.map(res => {return res['id']})))))
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  private updateRow(row_obj: insComp) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: insComp, key) => {
      if (value.id == row_obj.id) {
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
    this.__export.data = this.__export.data.filter((value: insComp, key) => {
      if (value.id == row_obj.id) {
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
    const clm = ['edit', 'delete'];
    const colmn = this.__levels.filter(x => this.__rntSearchForm.value.level.map(item => item.id).includes(x.id))
    // colmn.forEach(el => {
    //   console.log(el);
    //   el.submenu.forEach(element => {
    //     if(this.__columns.findIndex(x => x.field == element.field) == -1){
    //                     this.__columns.push(element);
    //     }
    //   });
    // })
    this.__levels.forEach(el =>{
          el.submenu.forEach(element=>{
             if(colmn.findIndex(x => x.id == el.id)!=-1){
              if(this.__columns.findIndex(x => x.field == element.field) == -1){
                this.__columns.push(element);
              }
             }
             else{
              if(this.__columns.findIndex(x => x.field == element.field) != -1){
              this.__columns.splice(this.__columns.findIndex(x => x.field == element.field),1);
                }
             }
          })
    })
    // this.levels.value.forEach(el => {
    //          el.sub_menu.forEach(element => {
    //                   if(el.isChecked){
    //                     if(this.__columns.findIndex(x => x.field == element.field) == -1){
    //                       this.__columns.push(element);
    //                     }
    //                   }
    //                   else{
    //                     if(this.__columns.findIndex(x => x.field == element.field) != -1){
    //                       this.__columns.splice(this.__columns.findIndex(x => x.field == element.field),1);
    //                     }
    //                   }
    //          });
    // });
    this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
    this.SelectedClms = this.__columns.map((x) => x.field);
  }


  getRntMst(column_name: string | null = null, sort_by: string | null = null) {
    const __insComp = new FormData();
    __insComp.append(
      'comp_name',JSON.stringify(this.__rntSearchForm.value.comp_name.map(item => item.id)));
    __insComp.append(
      'contact_person',
      this.__rntSearchForm.value.contact_person
        ? this.__rntSearchForm.value.contact_person
        : ''
    );
    __insComp.append('paginate', this.__pageNumber.value);
    __insComp.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __insComp.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __insComp.append('ins_type_id',JSON.stringify(this.__rntSearchForm.value.ins_type.map(res => {return res['id']})));
    this.__dbIntr
      .api_call(1, '/ins/companyDetailSearch', __insComp)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__insComp);
      });
  }

  tableExport(
    insTypeExport
  ) {
    insTypeExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/ins/companyExport', insTypeExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: insComp[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  exportPdf() {
    this.__Rpt.downloadReport(
      '#comp_rpt',
      {
        title: 'Insurance Company - ' + new Date().toLocaleDateString(),
      },
      'InsCompany',
      this.__rntSearchForm.value.options == 2 ? 'portrait' : "landscape",
      this.__rntSearchForm.value.options == 2 ? [] : [3000,792],
      this.__exportedClmns.length
    );
  }
  populateDT(__items: insComp) {
    this.openDialog(__items, __items.id);
  }

  openDialog(__cmp: insComp | null = null, __id: number) {
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
        CmpCrudComponent,
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
  private addRow(row_obj: insComp) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
    this.__export.data.unshift(row_obj);
    this.__export._updateChangeSubscription();
  }
  reset() {
    this.__rntSearchForm.patchValue({
      options: '2',
      contact_person: '',
      level:[]
    });
    this.sort= new sort;
    this.__rntSearchForm.controls['ins_type'].setValue([],{emitEvent:true});
    // this.levels.controls.map(el => el.get('isChecked').setValue(false));
    this.__rntSearchForm.get('is_all').setValue(false);
   this.__pageNumber.setValue('10');
   this.getRntMst();
  }

  delete(__el,index){
    console.log(__el);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      flag: 'CMP',
      id: __el.id,
      title: 'Delete '  + __el.comp_short_name,
      api_name:'/ins/companyDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectRNT.data.splice(index,1);
          this.__selectRNT._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
          this.__export._updateChangeSubscription();
        }
      }

    })
  }
    openProduct(__el){
      this.dialogRef.close();
      this.__utility.navigatewithqueryparams('/main/master/insurance/product',{queryParams:{product_id:btoa(this.data.product_id),comp_id:btoa(__el.id)}});
    }
    onItemClick(ev){
      this.reset();
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
    openURL(URL){
      window.open(URL,'_blank')
    }
}
