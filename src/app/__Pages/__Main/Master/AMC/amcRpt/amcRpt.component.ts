import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject, ElementRef, ViewChild} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { amc } from 'src/app/__Model/amc';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { AmcModificationComponent } from '../amcModification/amcModification.component';
import { environment } from 'src/environments/environment';
import { amcClmns } from 'src/app/__Utility/Master/amcClmns';
import { sort } from 'src/app/__Model/sort';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { column } from 'src/app/__Model/tblClmns';
import { AMCEntryComponent } from 'src/app/shared/amcentry/amcentry.component';
import { Table } from 'primeng/table';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'amc-amcRpt',
  templateUrl: './amcRpt.component.html',
  styleUrls: ['./amcRpt.component.css'],
})
export class AmcrptComponent implements OnInit {
  formValue;
  selectBtn:selectBtn[] = [{ label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  settings = this.__utility.settingsfroMultiselectDropdown('id',
  'amc_short_name','Search AMC',1);
  settings_for_Levels = this.__utility.settingsfroMultiselectDropdown('id','value','Search Levels',2);

  itemsPerPage = ItemsPerPage;
  amcLogoUrl = environment.amc_logo_url;
  sort=new sort();

  @ViewChild('dt') primeTbl :Table;

  __sortColumnsAscOrDsc: any= {active: '',direction:'asc'};
  __levels = amcClmns.LEVELS;
  __isamcspinner: boolean =false;
  __isrntspinner: boolean =false;
  __isshowSearchBtn: boolean =false;
  __isVisible:boolean= true;
  __amcMst: amc[] = [];
  __rntMst: rnt[] = [];
  __export= new MatTableDataSource<amc>([]);
  __exportedClmns: string[] =[ 'sl_no','amc_name','amc_short_name','rnt_name'];
  __columns:column[] =[];
  __selectAMC = new MatTableDataSource<amc>([]);
  __pageNumber = new FormControl('10');
  __detalsSummaryForm = new FormGroup({
       btnType: new FormControl('R'),
       options: new FormControl('2'),
       rnt_id: new FormArray([]),
       amc_id: new FormControl([]),
       is_all:new FormControl(false),
      //  level: new FormArray([]),
       level:new FormControl([])
  })
  constructor(

    private __acRt: ActivatedRoute,
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<AmcrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
     private __dbIntr: DbIntrService) {}
     __paginate: any=[];
  ngOnInit() {
    this.getRntMst();
    this.getAMCMasterForDropDown();
    // this.addLevelsCheckBox(amcClmns.LEVELS);
    this.showColumns(2);
    console.log(this.data);
  }
  /**
   *  This function is used to set the checkbox of RNT
   *  @param rntId - RNT id to be checked
   */
  setRntCheckBox = (rntId) =>{
            if(rntId){
              this.rnt_id.controls.map(item =>
                {
                  return item.get('isChecked').setValue((Number(item.value.id) == Number(rntId)),{emitEvent:false})
              });
            }
  }
  /**
   * This function is used to get the RNT Master data from the server
   * and set the RNT checkboxes in the form.
   */
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck('data')).subscribe((res:rnt[]) =>{
          res.forEach((el:rnt) =>{this.rnt_id.push(this.setRNTForm(el))});
         this.setRntCheckBox(this.data.rnt_id);
          this.formValue = this.__detalsSummaryForm.value;
          this.getAmcMst();
    })
  }
  /**
   * This function is used to add the RNT checkboxes in the form
   * @param rnt - RNT object to be added in the form
   * @returns FormGroup - returns the FormGroup of RNT
   */
  get rnt_id():FormArray{
      return this.__detalsSummaryForm.get('rnt_id') as FormArray;
  }

  /**
   * 
   * @param rnt - RNT object to be added in the form
   * This function is used to set the RNT form in the form array
   * It checks if the rnt object is present or not, if not it sets the default values
   * and returns the FormGroup of RNT.
   * @returns 
   */
  setRNTForm(rnt):FormGroup{
    return new FormGroup({
      id:new FormControl(rnt ? rnt?.id : 0),
      name:new FormControl(rnt ? rnt?.rnt_name : ''),
      isChecked:new FormControl(Number(this.data.rnt_id) == rnt.rnt_id ? true : false)
    })
  }

  /**
   * This function is used to get the AMC Master data from the server
   * and set the AMC data in the table.
   * It also sets the paginator for the table.
   * It also exports the data to excel.
   * @returns void
   */
   getAmcMst(){
    const __amcSearch = new FormData();
    __amcSearch.append('paginate',this.__pageNumber.value);
    __amcSearch.append('rnt_id',this.formValue?.rnt_id ? JSON.stringify(this.formValue?.rnt_id.filter(x => x.isChecked).map(item => {return item['id']})) : '[]');
    __amcSearch.append('amc_id',this.formValue?.amc_id ? JSON.stringify(this.formValue?.amc_id.map(item => {return item['id']})) : '[]');
   __amcSearch.append('gstin',this.formValue?.gst_in ? this.formValue?.gst_in : '');
   __amcSearch.append('contact_person',this.formValue?.contact_per ? this.formValue?.contact_per : '');
   __amcSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
   __amcSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : '1'));
     this.__dbIntr.api_call(1,'/amcDetailSearch',__amcSearch)
     .pipe(map((x: any) => x.data))
     .subscribe(res => {
      // this.__paginate = res.links;
      // this.setPaginator(res.data);
       this.setPaginator(res);
       this.tableExport(__amcSearch);
     })

   }

   /**
    *   This function is used to filter the global search in the table
    *   It takes the event object from the input field and filters the table data based on the value entered.
    *   It uses the PrimeNG Table filterGlobal method to filter the data.
    *   The filter is set to 'contains' which means it will filter the data based on the value entered in the input field.
    *   The filterGlobal method is used to filter the entire table data.
    * @param $event - The event object from the input field
    */
   filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  /**
   * This function is used to get the AMC Master data for the dropdown
   * It calls the API to get the AMC data and sets it to the __amcMst variable.
   */
  private getAMCMasterForDropDown() {
    this.__dbIntr
      .api_call(0, '/amc', null)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: amc[]) => {
        this.__amcMst = res;
      });
  }
  /**
   * 
   * @param __res - The response data from the API call
   * This function is used to set the paginator for the table
   * It takes the response data from the API call and sets it to the __selectAMC variable.
   * The __selectAMC variable is of type MatTableDataSource which is used to bind the data to the table.
   * It also sets the paginator for the table.
   */
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
  }
  /**
   * 
   * @param __items - The AMC item to be populated in the table
   * This function is used to populate the AMC item in the table
   * It opens the dialog for the AMC modification component and passes the AMC item and its id to the dialog.
   */
  populateDT(__items: amc) {
    // this.__utility.navigatewithqueryparams('/main/master/amcModify',{queryParams:{id: btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  /**
   * This function is used to add the RNT checkboxes in the form
   * It checks if the RNT checkboxes are already present in the form or not.
   * If not, it adds the RNT checkboxes to the form.
   */
  ngAfterViewInit(){
    /** Change event occur when all rnt checkbox has been changed  */
    this.__detalsSummaryForm.controls['is_all'].valueChanges.subscribe(res =>{
      this.rnt_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
    })
    /** End */

    /** Change event inside the formArray */
    this.rnt_id.valueChanges.subscribe(res =>{
    this.__detalsSummaryForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
    })
    /*** End */

      this.__detalsSummaryForm.controls['options'].valueChanges.subscribe(res =>{
       this.showColumns(res);
      })

  }

  /**
   * 
   * @param __amc - The AMC object to be passed to the dialog
   * This function is used to open the dialog for the AMC modification component
   * @param __amcId 
   */
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
      product_id:this.data.product_id,
      right: global.randomIntFromInterval(1,60)
    };
    dialogConfig.id = __amcId > 0 ? __amcId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        // AmcModificationComponent,
        AMCEntryComponent,
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

  /**
   * 
   * @param __paginate - The pagination object containing the URL for pagination
   * This function is used to get the pagination data from the server
   * It calls the API to get the pagination data and sets it to the __paginate variable.
   * It also sets the paginator for the table.
   * @returns void
   */
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          + ('&rnt_id=' + (JSON.stringify(this.formValue?.rnt_id.filter(x => x.isChecked).map(item => {return item['id']}))))
          + ('&amc_id=' + (JSON.stringify(this.formValue?.amc_id.map(item => {return item['id']}))))
          + ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
          ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }

  /**
   * 
   * @param row_obj - The AMC object to be updated in the table
   * This function is used to update the AMC row in the table
   * It filters the __selectAMC data and updates the row with the new values.
   * It also updates the __export data with the new values.
   * @returns void
   */
  updateRow(row_obj: amc) {
    this.__selectAMC.data = this.__selectAMC.data.filter((value: amc, key) => {
      if (value.id == row_obj.id) {
        value.login_id = row_obj.login_id;
        value.login_url = row_obj.login_url;
        value.login_pass = row_obj.login_pass;
        value.cus_care_whatsapp_no = row_obj.cus_care_whatsapp_no;
        value.security_qus_ans = row_obj.security_qus_ans;
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
        value.head_ofc_contact_per = row_obj.head_ofc_contact_per;
        value.head_contact_per_mob = row_obj.head_contact_per_mob;
        value.head_contact_per_email = row_obj.head_contact_per_email;
        value.head_ofc_addr = row_obj.head_ofc_addr;
        value.local_ofc_contact_per = row_obj.local_ofc_contact_per;
        value.local_contact_per_mob = row_obj.local_contact_per_mob;
        value.local_contact_per_email = row_obj.local_contact_per_email;
        value.local_ofc_addr = row_obj.local_ofc_addr;
        value.amc_short_name =row_obj.amc_short_name;
        value.distributor_care_email  = row_obj.distributor_care_email;
        value.distributor_care_no  = row_obj.distributor_care_no;
        value.logo = row_obj.logo;
        value.amc_code = row_obj.amc_code
      }
      return true;
    });

    this.__export.data = this.__export.data.filter((value: amc, key) => {
      if (value.id == row_obj.id) {
        value.amc_code = row_obj.amc_code;
        value.amc_short_name =row_obj.amc_short_name;
        value.login_id = row_obj.login_id;
        value.login_url = row_obj.login_url;
        value.login_pass = row_obj.login_pass;
        value.cus_care_whatsapp_no = row_obj.cus_care_whatsapp_no;
        value.security_qus_ans = row_obj.security_qus_ans;
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
  /**
   * 
   * @param row_obj - The AMC object to be added in the table
   * This function is used to add the AMC row in the table
   * It adds the row object to the __selectAMC data and updates the change subscription.
   * It also updates the __export data with the new row object.
   * @returns void
   */
  addRow(row_obj: amc) {
    this.__selectAMC.data.unshift(row_obj);
    this.__selectAMC._updateChangeSubscription();
  }
  /**
   * This function is used to submit the form
   * It gets the form value and calls the getAmcMst function to get the AMC Master data.
   */
  submit(){
    this.formValue = this.__detalsSummaryForm.value;
    this.getAmcMst();
    this.setColumnsAfterSubmit();
  }

  /**
   *  This function is used to export the AMC data to excel
   *  It calls the API to get the AMC data and sets it to the __export variable.
   *  The __export variable is of type MatTableDataSource which is used to bind the data to the table.
   *  It also sets the exported columns for the table.
   *  The exported columns are filtered to remove the edit, delete and logo columns.
   *  @returns void
   * @param __amcExport - The AMC object to be exported
   */
  tableExport(__amcExport){
   this.__dbIntr.api_call(1,'/amcExport',__amcExport).pipe(map((x: any) => x.data)).subscribe((res: amc[]) =>{
      this.__export = new MatTableDataSource(res);
    })
  }

  /**
   * 
   * @param res - The response data from the API call
   * This function is used to show the columns in the table based on the response data
   */
  showColumns(res){
    const __columnToRemove =  ['edit','delete','logo'];
    this.__columns = [];
      this.__columns = Number(res) == 2 ? amcClmns.Summary  : amcClmns.Details;
      this.__exportedClmns = this.__columns.map(res => {return res['field']}).filter(item => !__columnToRemove.includes(item));
  }

  /**
   * This function is used to toggle the full screen mode of the dialog
   * It removes the panel class 'mat_dialog' and adds the panel class 'full_screen'.
   * It updates the position of the dialog to the top of the screen.
   * It also toggles the visibility of the dialog.
   * @returns void
   */
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  /**
   * This function is used to minimize the dialog
   * It removes the panel class 'mat_dialog' and 'full_screen'.
   * It updates the size of the dialog to 40% width and 47px height.  
   */
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * This function is used to maximize the dialog
   * It removes the panel class 'full_screen' and adds the panel class 'mat_dialog
   */
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  /**
   * This function is used to export the AMC data to PDF
   * It calls the downloadReport function of the RPTService to download the report.
   * It passes the table id, title, file name, orientation, page size and number of columns to the function.
   */
  exportPdf(){
    this.__Rpt.downloadReport('#amcRPT',
    {
      title: 'AMC - '+ new Date().toLocaleDateString()
    },
    'AMC',
    'l',
      this.__detalsSummaryForm.value.options == 1 ? [3500,792] : [],
      this.__exportedClmns.length
    )
  }
  /**
   * This function is used to refresh or advance the filter
   * It resets the form values to default values and sets the is_all checkbox to false.
   */
  refreshOrAdvanceFlt(){
    this.__detalsSummaryForm.patchValue({
      options:'2',
      amc_id: [],
      level:[]
    })
    this.__detalsSummaryForm.get('is_all').setValue(false);
    this.__pageNumber.setValue('10');
    this.sort= new sort();
    this.formValue = this.__detalsSummaryForm.value;
    this.getAmcMst();
  }
  /**
   * 
   * @returns This function is used to get the columns for the table
   * It calls the getColumns function of the utility service to get the columns.
   * The columns are set in the __columns variable.
   * @returns column[] - returns the columns for the table
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }

  /**
   * 
   * @param __el - The AMC object to be deleted from the table
   * This function is used to delete the AMC row from the table
   * It opens the dialog for the delete component and passes the AMC object and its index to the dialog.
   * It also updates the __selectAMC data and __export data after deletion.
   * @returns void
   * @param index 
   */
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'A',
      id: __el.id,
      title: 'Delete '  + __el.amc_name,
      api_name:'/amcDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectAMC.data.splice(index,1);
          this.__selectAMC._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
          this.__export._updateChangeSubscription();
        }
      }

    })
  }
  /**
   * 
   * @param __el - The AMC object to be shown in the scheme
   */
  showCorrospondingScheme(__el){
    console.log(__el);
    // this.__utility.navigatewithqueryparams(
    //   '/main/master/productwisemenu/scheme',
    //   {queryParams:{
    //     product_id:btoa(this.data.product_id)
    //   }}
    // )

  }
  /**
   * 
   * @param ev - The event object from the item click
   * This function is used to refresh or advance the filter when the item is clicked
   * It calls the refreshOrAdvanceFlt function to reset the form values and get the AMC Master data.
   * @returns void
   */
  onItemClick(ev){
    this.refreshOrAdvanceFlt()
  }
  /**
   *  * This function is used to select the item from the dropdown
   *  It calls the getAmcMst function to get the AMC Master data.
   *  It also sets the is_all checkbox to false.
   *  @returns void
   */
  onselectItem(ev){
    this.getAmcMst();
  }
  /**
   * 
   * @param ev - The event object from the sort change
   * This function is used to sort the table data based on the sort order and field
   * It updates the sort object with the sort order and field.
   * It calls the getAmcMst function to get the AMC Master data.
   * @returns void
   */
  customSort(ev){
    this.sort.order = ev.sortOrder;
    this.sort.field = ev.sortField;
    if(ev.sortField){
    this.getAmcMst();
    }
  }
  /**
   * 
   * @param URL - The URL to be opened in a new tab
   * This function is used to open the URL in a new tab
   * It uses the window.open method to open the URL in a new tab.
   * @returns void
   */
  openURL(URL){
    window.open(URL,'_blank')
  }
  /**
   * This function is used to set the columns after the form is submitted
   * It filters the __levels based on the selected levels in the form.
   * It checks if the columns are already present in the __columns array or not.
   */
  setColumnsAfterSubmit(){
    const clm = ['edit', 'delete','logo'];
    const colmn = this.__levels.filter(x => this.__detalsSummaryForm.value.level.map(item => item.id).includes(x.id))
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
    this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
}
}
